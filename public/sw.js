// Service Worker para Itap Impresiones PWA
const CACHE_NAME = 'itap-impresiones-v1.0.0';
const STATIC_CACHE = 'itap-static-v1.0.0';
const DYNAMIC_CACHE = 'itap-dynamic-v1.0.0';

// Recursos críticos para cache inicial
const STATIC_ASSETS = [
  '/',
  '/tienda',
  '/manifest.json',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon.ico',
  '/images/logoblack.png',
  '/images/logowhite.png'
];

// Recursos que se cachean dinámicamente
const DYNAMIC_PATTERNS = [
  /^\/api\//,
  /^\/_next\/static\//,
  /\.(png|jpg|jpeg|svg|webp|gif)$/,
  /\.(css|js)$/
];

// Función para determinar si un request debe cachearse
function shouldCache(request) {
  const url = new URL(request.url);

  // No cachear requests de admin, auth, o API externa
  if (url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/api/auth') ||
      url.hostname !== location.hostname) {
    return false;
  }

  return DYNAMIC_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Función para limpiar caches antiguos
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE];

  return Promise.all(
    cacheNames
      .filter(name => !validCaches.includes(name))
      .map(name => caches.delete(name))
  );
}

// Evento Install - Cache inicial
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      console.log('Service Worker: Caching static assets...');

      try {
        await cache.addAll(STATIC_ASSETS);
        console.log('Service Worker: Static assets cached successfully');
      } catch (error) {
        console.error('Service Worker: Error caching static assets:', error);
      }
    })()
  );

  // Forzar activación inmediata
  self.skipWaiting();
});

// Evento Activate - Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    (async () => {
      await cleanupCaches();
      console.log('Service Worker: Old caches cleaned');

      // Tomar control de todos los clients
      await self.clients.claim();
      console.log('Service Worker: Clients claimed');
    })()
  );
});

// Evento Fetch - Estrategia de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar GET requests
  if (request.method !== 'GET') return;

  // Estrategia Cache First para recursos estáticos
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Estrategia Network First para páginas dinámicas
  if (request.destination === 'document' || shouldCache(request)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Estrategia Stale While Revalidate para otros recursos
  event.respondWith(staleWhileRevalidateStrategy(request));
});

// Estrategia Cache First
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return new Response('Offline - Recurso no disponible', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estrategia Network First
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Página offline básica
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    return new Response('Offline - No hay conexión a internet', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Estrategia Stale While Revalidate
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Si falla la red, devolver cache si existe
    return cachedResponse || new Response('Offline', { status: 503 });
  });

  // Devolver cache inmediatamente si existe, luego actualizar en background
  return cachedResponse || fetchPromise;
}

// Manejar mensajes desde el cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

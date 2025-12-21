/**
 * Sistema de caché para consultas Firebase
 * Reduce las consultas redundantes a Firestore
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class FirebaseCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutos por defecto

  /**
   * Obtiene un valor del caché
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    // Verificar si expiró
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Guarda un valor en el caché
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttl || this.defaultTTL),
    });
  }

  /**
   * Invalida una entrada específica
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida todas las entradas que coincidan con un patrón
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Limpia todo el caché
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtiene estadísticas del caché
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton del caché
export const firebaseCache = new FirebaseCache();

// TTL constants
export const CACHE_TTL = {
  PRODUCTS_LIST: 5 * 60 * 1000,      // 5 minutos para lista de productos
  PRODUCT_DETAIL: 10 * 60 * 1000,    // 10 minutos para detalle de producto
  CATEGORIES: 30 * 60 * 1000,         // 30 minutos para categorías
  USER_DATA: 2 * 60 * 1000,           // 2 minutos para datos de usuario
} as const;

// Cache keys helpers
export const CACHE_KEYS = {
  productsList: () => 'products:list',
  productBySlug: (slug: string) => `products:slug:${slug}`,
  productById: (id: string) => `products:id:${id}`,
  categories: () => 'categories:all',
  userOrders: (userId: string) => `orders:user:${userId}`,
} as const;

/**
 * Wrapper para consultas con caché
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Intentar obtener del caché
  const cached = firebaseCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Ejecutar consulta
  const result = await queryFn();
  
  // Guardar en caché
  firebaseCache.set(key, result, ttl);
  
  return result;
}

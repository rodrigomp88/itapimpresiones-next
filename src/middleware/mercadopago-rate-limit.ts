import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware de rate limiting específico para APIs de Mercado Pago
 * 
 * Protege contra abuso y mantiene límites de requests apropiados
 * para operaciones críticas de pago
 */

// Configuración de límites por operación
const RATE_LIMITS = {
  'create-preference': { requests: 10, window: '1m' },      // 10 requests por minuto
  'webhook': { requests: 100, window: '1m' },               // 100 webhooks por minuto
  'refund': { requests: 5, window: '1m' },                  // 5 reembolsos por minuto
  'payment-status': { requests: 30, window: '1m' },         // 30 consultas por minuto
  'default': { requests: 50, window: '1m' }                 // 50 requests por minuto para otras
};

// Store en memoria para tracking de requests (en producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Obtiene la ventana de tiempo en milisegundos
 */
function getWindowMs(window: string): number {
  const unit = window.slice(-1);
  const value = parseInt(window.slice(0, -1), 10);
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    default: return 60 * 1000; // default 1 minuto
  }
}

/**
 * Genera clave única para el rate limiting
 */
function generateKey(request: NextRequest, operation: string): string {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const apiKey = request.headers.get('x-api-key') || '';
  
  return `${ip}:${apiKey}:${operation}:${userAgent}`;
}

/**
 * Obtiene la configuración de rate limit para una operación
 */
function getRateLimitConfig(operation: string) {
  return RATE_LIMITS[operation as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
}

/**
 * Verifica si una request está dentro del rate limit
 */
function checkRateLimit(key: string, config: typeof RATE_LIMITS.default): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = getWindowMs(config.window);
  
  // Limpiar entradas expiradas
  for (const [storeKey, data] of rateLimitStore.entries()) {
    if (data.resetTime <= now) {
      rateLimitStore.delete(storeKey);
    }
  }
  
  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime <= now) {
    // Primera request o ventana expirada
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: config.requests - 1, resetTime };
  }
  
  if (current.count >= config.requests) {
    // Rate limit excedido
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }
  
  // Incrementar contador
  current.count++;
  rateLimitStore.set(key, current);
  return { allowed: true, remaining: config.requests - current.count, resetTime: current.resetTime };
}

/**
 * Determina el tipo de operación basado en la URL y método
 */
function getOperationType(request: NextRequest): string {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  
  if (pathname.includes('/webhook')) {
    return 'webhook';
  }
  
  if (pathname.includes('/create-preference')) {
    return 'create-preference';
  }
  
  if (pathname.includes('/refund')) {
    return 'refund';
  }
  
  if (pathname.includes('/payment') && method === 'GET') {
    return 'payment-status';
  }
  
  return 'default';
}

/**
 * Headers de rate limiting para incluir en la respuesta
 */
function getRateLimitHeaders(allowed: boolean, remaining: number, resetTime: number) {
  const now = Date.now();
  const resetIn = Math.max(0, Math.floor((resetTime - now) / 1000));
  
  return {
    'X-RateLimit-Limit': remaining.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetIn.toString(),
    'Retry-After': resetIn.toString()
  };
}

/**
 * Middleware principal de rate limiting para Mercado Pago
 */
export function withMercadoPagoRateLimit(request: NextRequest): NextResponse | null {
  const operation = getOperationType(request);
  const config = getRateLimitConfig(operation);
  const key = generateKey(request, operation);
  
  const result = checkRateLimit(key, config);
  
  // Headers básicos de rate limiting
  const headers = getRateLimitHeaders(result.allowed, result.remaining, result.resetTime);
  
  // Si no está permitido, retornar error 429
  if (!result.allowed) {
    console.warn(`[RateLimit] ${operation} blocked for key: ${key}`);
    
    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        operation,
        resetTime: new Date(result.resetTime).toISOString()
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          ...headers
        }
      }
    );
  }
  
  // Si está permitido, crear response con headers
  const response = NextResponse.next();
  
  // Agregar headers de rate limiting
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Log de request permitida (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[RateLimit] ${operation} allowed for ${key} (${result.remaining} remaining)`);
  }
  
  return null; // Continuar con la request
}

/**
 * Utilidades adicionales para rate limiting
 */
export const MercadoPagoRateLimitUtils = {
  /**
   * Limpia el store de rate limiting (útil para testing)
   */
  clearStore() {
    rateLimitStore.clear();
  },
  
  /**
   * Obtiene estadísticas actuales del rate limiting
   */
  getStats() {
    const now = Date.now();
    let activeEntries = 0;
    let totalRequests = 0;
    
    for (const [key, data] of rateLimitStore.entries()) {
      if (data.resetTime > now) {
        activeEntries++;
        totalRequests += data.count;
      }
    }
    
    return {
      activeEntries,
      totalRequests,
      memoryUsage: JSON.stringify([...rateLimitStore.entries()]).length
    };
  },
  
  /**
   * Verifica si una IP está en lista de permitidos (whitelist)
   */
  isWhitelisted(request: NextRequest): boolean {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown';
    const whitelist = process.env.MERCADO_PAGO_WHITELIST_IPS?.split(',') || [];
    
    return whitelist.some(allowedIp => {
      // Soporte para rangos IP básicos
      if (allowedIp.includes('/')) {
        // Implementación básica de CIDR (se puede mejorar)
        return ip.startsWith(allowedIp.split('/')[0]);
      }
      return ip === allowedIp.trim();
    });
  }
};

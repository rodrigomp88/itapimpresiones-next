import { NextResponse } from 'next/server';

// 🛡️ RATE LIMITER SIMPLE EN MEMORIA
// Nota: En producción con múltiples instancias (Serverless), 
// se recomendaría usar Redis (Upstash) para persistencia compartida.

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

/**
 * Valida si una IP ha excedido el límite de peticiones
 */
export async function rateLimit(ip: string, options: RateLimitOptions) {
  const now = Date.now();
  const { limit, windowMs } = options;

  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, remaining: limit - 1 };
  }

  const record = store[ip];

  // Si el tiempo de la ventana ya pasó, resetear
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { success: true, remaining: limit - 1 };
  }

  // Si todavía está en la ventana, incrementar contador
  record.count += 1;

  if (record.count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - record.count };
}

/**
 * Middleware helper para aplicar rate limit en rutas API
 */
export async function applyRateLimit(
  req: Request, 
  limit: number = 10, 
  windowMs: number = 60 * 1000 // 1 minuto por defecto
) {
  // Intentar obtener IP de headers (Vercel/Cloudflare)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

  const result = await rateLimit(ip, { limit, windowMs });

  if (!result.success) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Por favor, intentá más tarde.' },
      { 
        status: 429,
        headers: {
          'Retry-After': (windowMs / 1000).toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0'
        }
      }
    );
  }

  return null; // Todo ok
}

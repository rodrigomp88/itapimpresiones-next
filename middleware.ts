import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  apiLimiter,
  authLimiter,
  orderLimiter,
  contactLimiter,
  adminLimiter
} from './src/utils/rate-limit';
import { logRequest } from './src/utils/logger';

// Middleware principal
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const url = request.url;
  const method = request.method;

  // Obtener IP del cliente
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Obtener User-Agent
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    // Rate limiting basado en la ruta
    if (url.includes('/api/auth/')) {
      // Aplicar rate limiting estricto para autenticación
      return handleRateLimitedRequest(request, authLimiter, 'auth');
    }

    if (url.includes('/api/mercadopago/create-preference') ||
        url.includes('/api/mercadopago/webhook')) {
      // Rate limiting para operaciones de pago/órdenes
      return handleRateLimitedRequest(request, orderLimiter, 'order');
    }

    if (url.includes('/api/contact')) {
      // Rate limiting para formularios de contacto
      return handleRateLimitedRequest(request, contactLimiter, 'contact');
    }

    if (url.includes('/api/admin/')) {
      // Rate limiting para operaciones administrativas
      return handleRateLimitedRequest(request, adminLimiter, 'admin');
    }

    // Rate limiting general para otras APIs
    if (url.includes('/api/')) {
      return handleRateLimitedRequest(request, apiLimiter, 'api');
    }

    // Para rutas no-API, continuar normalmente
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  } finally {
    // Loggear la request (solo en desarrollo o para debugging)
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime;
      logRequest(method, url, 200, duration, userAgent, ip);
    }
  }
}

// Función helper para manejar requests con rate limiting
function handleRateLimitedRequest(
  request: NextRequest,
  limiter: any,
  type: string
): NextResponse {
  // Para Next.js middleware, necesitamos simular el comportamiento de express-rate-limit
  // Por ahora, retornamos la request sin modificar ya que el rate limiting
  // se aplicará en las rutas de API individuales

  // Agregar headers de rate limiting para información del cliente
  const response = NextResponse.next();

  // Headers informativos (no bloqueantes en middleware)
  response.headers.set('X-Rate-Limit-Type', type);

  return response;
}

// Configuración del middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

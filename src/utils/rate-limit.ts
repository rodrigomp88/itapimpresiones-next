import rateLimit from "express-rate-limit";
import { logSecurity } from "./logger";

// Rate limiter para APIs generales
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: 15 * 60, // segundos
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logSecurity(
      "RATE_LIMIT_EXCEEDED",
      {
        ip: req.ip,
        url: req.url,
        userAgent: req.get("User-Agent"),
        method: req.method,
      },
      req.ip
    );

    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter:
        Math.ceil((res.getHeader("Retry-After") as number) / 60) + " minutes",
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks and static assets
    return (
      req.url?.startsWith("/api/health") ||
      req.url?.startsWith("/_next/static") ||
      req.url?.includes("favicon") ||
      req.url?.includes(".png") ||
      req.url?.includes(".jpg") ||
      req.url?.includes(".jpeg") ||
      req.url?.includes(".gif") ||
      req.url?.includes(".svg") ||
      req.url?.includes(".ico")
    );
  },
});

// Rate limiter más estricto para autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos de login por windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity(
      "AUTH_RATE_LIMIT_EXCEEDED",
      {
        ip: req.ip,
        url: req.url,
        userAgent: req.get("User-Agent"),
        method: req.method,
        email: req.body?.email, // Log attempted email if available
      },
      req.ip
    );

    res.status(429).json({
      error: "Too many authentication attempts, please try again later.",
      retryAfter:
        Math.ceil((res.getHeader("Retry-After") as number) / 60) + " minutes",
    });
  },
});

// Rate limiter para creación de órdenes (checkout)
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 órdenes por hora por IP
  message: {
    error: "Order creation limit exceeded. Please try again later.",
    retryAfter: 60 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity(
      "ORDER_RATE_LIMIT_EXCEEDED",
      {
        ip: req.ip,
        url: req.url,
        userAgent: req.get("User-Agent"),
        method: req.method,
      },
      req.ip
    );

    res.status(429).json({
      error: "Order creation limit exceeded. Please try again later.",
      retryAfter:
        Math.ceil((res.getHeader("Retry-After") as number) / 60) + " minutes",
    });
  },
});

// Rate limiter para envío de emails/contacto
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 mensajes de contacto por hora
  message: {
    error: "Contact form submission limit exceeded. Please try again later.",
    retryAfter: 60 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity(
      "CONTACT_RATE_LIMIT_EXCEEDED",
      {
        ip: req.ip,
        url: req.url,
        userAgent: req.get("User-Agent"),
        method: req.method,
      },
      req.ip
    );

    res.status(429).json({
      error: "Contact form submission limit exceeded. Please try again later.",
      retryAfter:
        Math.ceil((res.getHeader("Retry-After") as number) / 60) + " minutes",
    });
  },
});

// Rate limiter para admin operations
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // límite de 50 operaciones admin por windowMs
  message: {
    error: "Admin operation limit exceeded.",
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurity(
      "ADMIN_RATE_LIMIT_EXCEEDED",
      {
        ip: req.ip,
        url: req.url,
        userAgent: req.get("User-Agent"),
        method: req.method,
      },
      req.ip
    );

    res.status(429).json({
      error: "Admin operation limit exceeded.",
      retryAfter:
        Math.ceil((res.getHeader("Retry-After") as number) / 60) + " minutes",
    });
  },
});

// Middleware para logging de rate limits (se puede usar para analytics)
export const rateLimitLogger = (req: { ip?: string; url?: string; method?: string }, res: { json: (data: unknown) => unknown; statusCode: number; getHeader: (name: string) => unknown }, next: () => void) => {
  const originalJson = res.json;
  res.json = function (data: unknown) {
    if (res.statusCode === 429) {
      // Ya se loguea en los handlers individuales
    }
    return originalJson.call(this, data);
  };
  next();
};

// Función helper para crear rate limiters personalizados
export const createRateLimit = (
  windowMs: number,
  max: number,
  message: string,
  eventName: string
) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logSecurity(
        eventName,
        {
          ip: req.ip,
          url: req.url,
          userAgent: req.get("User-Agent"),
          method: req.method,
        },
        req.ip
      );

      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 60000) + " minutes",
      });
    },
  });
};

export default {
  apiLimiter,
  authLimiter,
  orderLimiter,
  contactLimiter,
  adminLimiter,
  rateLimitLogger,
  createRateLimit,
};

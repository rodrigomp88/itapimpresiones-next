// Logger simplificado compatible con Edge Runtime
// Usa console para logging básico

const formatMessage = (level: string, message: string, meta?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
};

export const logger = {
  error: (message: string, meta?: Record<string, unknown>) =>
    console.error(formatMessage("error", message, meta)),
  warn: (message: string, meta?: Record<string, unknown>) =>
    console.warn(formatMessage("warn", message, meta)),
  info: (message: string, meta?: Record<string, unknown>) =>
    console.info(formatMessage("info", message, meta)),
  http: (message: string, meta?: Record<string, unknown>) =>
    console.log(formatMessage("http", message, meta)),
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.debug(formatMessage("debug", message, meta));
    }
  },
  security: (message: string, meta?: Record<string, unknown>) =>
    console.error(formatMessage("security", message, meta)),
  log: (level: string, message: string, meta?: Record<string, unknown>) => {
    console.log(formatMessage(level, message, meta));
  },
};

// Logger específico para requests HTTP (simplificado)
export const httpLogger = {
  log: (level: string, message: string, meta?: Record<string, unknown>) => {
    console.log(formatMessage(level, message, meta));
  },
};

// Función helper para logging de requests
export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  responseTime: number,
  userAgent?: string,
  ip?: string
) => {
  const level = statusCode >= 400 ? "warn" : "http";

  httpLogger.log(level, "HTTP Request", {
    method,
    url,
    statusCode,
    responseTime: `${responseTime}ms`,
    userAgent,
    ip,
    timestamp: new Date().toISOString(),
  });
};

// Función helper para logging de errores
export const logError = (
  error: Error,
  context?: Record<string, unknown>,
  userId?: string
) => {
  logger.error("Application Error", {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
    userId,
    timestamp: new Date().toISOString(),
  });
};

// Función helper para logging de seguridad
export const logSecurity = (
  event: string,
  details: Record<string, unknown>,
  ip?: string,
  userId?: string
) => {
  logger.log("security", `SECURITY: ${event}`, {
    details,
    ip,
    userId,
    timestamp: new Date().toISOString(),
  });
};

// Función helper para logging de performance
export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, unknown>
) => {
  logger.info("Performance Metric", {
    operation,
    duration: `${duration}ms`,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

// Función simplificada para inicializar logs (deshabilitada para compatibilidad con Edge Runtime)
export const initializeLogs = () => {
  // Deshabilitado para evitar problemas con Edge Runtime
  // Los logs se manejan solo a través de console
};

export default logger;

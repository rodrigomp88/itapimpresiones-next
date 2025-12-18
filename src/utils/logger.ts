import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Niveles de logging personalizados
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    security: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
    security: 'red bold',
  },
};

// Aplicar colores
winston.addColors(customLevels.colors);

// Formato personalizado para logs
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    // Agregar metadata si existe
    if (Object.keys(meta).length > 0) {
      logMessage += ` | ${JSON.stringify(meta, null, 2)}`;
    }

    return logMessage;
  })
);

// Transport para archivo de errores
const errorFileRotate = new DailyRotateFile({
  filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

// Transport para archivo general
const combinedFileRotate = new DailyRotateFile({
  filename: path.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
});

// Transport para archivo de seguridad
const securityFileRotate = new DailyRotateFile({
  filename: path.join(process.cwd(), 'logs', 'security-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'security',
  maxSize: '20m',
  maxFiles: '90d',
  zippedArchive: true,
});

// Transport para consola (solo en desarrollo)
const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
});

// Crear logger principal
export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    errorFileRotate,
    combinedFileRotate,
    securityFileRotate,
    ...(process.env.NODE_ENV !== 'production' ? [consoleTransport] : []),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
    }),
  ],
});

// Logger específico para requests HTTP
export const httpLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'http-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d',
      zippedArchive: true,
    }),
  ],
});

// Función helper para logging de requests
export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  responseTime: number,
  userAgent?: string,
  ip?: string
) => {
  const level = statusCode >= 400 ? 'warn' : 'http';

  httpLogger.log(level, 'HTTP Request', {
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
  context?: Record<string, any>,
  userId?: string
) => {
  logger.error('Application Error', {
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
  details: Record<string, any>,
  ip?: string,
  userId?: string
) => {
  logger.log('security', `SECURITY: ${event}`, {
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
  metadata?: Record<string, any>
) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

// Función para inicializar directorio de logs
export const initializeLogs = () => {
  const fs = require('fs');
  const logsDir = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    logger.info('Logs directory created', { path: logsDir });
  }
};

// Inicializar logs al importar
initializeLogs();

export default logger;

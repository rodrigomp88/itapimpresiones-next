import crypto from 'crypto';

/**
 * Utilidades de seguridad para Mercado Pago
 * Incluye validación de signatures, manejo seguro de tokens y logging estructurado
 */

export interface MercadoPagoWebhookData {
  action: string;
  data: {
    id: string;
  };
}

export interface MercadoPagoSignature {
  signature: string;
  timestamp: string;
}

/**
 * Valida la signature de un webhook de Mercado Pago
 * 
 * @param payload - El cuerpo completo de la notificación
 * @param signature - La signature enviada en el header
 * @param accessToken - Token de acceso de Mercado Pago
 * @returns true si la signature es válida, false en caso contrario
 */
export function validateMercadoPagoSignature(
  payload: string,
  signature: string,
  accessToken: string
): boolean {
  try {
    // Mercado Pago usa el access token como clave para validar la signature
    const hmac = crypto.createHmac('sha256', accessToken);
    hmac.update(payload);
    const computedSignature = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error validando signature:', error);
    return false;
  }
}

/**
 * Valida si el timestamp de la webhook es reciente (no más de 5 minutos)
 * 
 * @param timestamp - Timestamp de la webhook
 * @returns true si es reciente, false si es muy antigua
 */
export function isWebhookTimestampValid(timestamp: string): boolean {
  try {
    const webhookTime = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 5 * 60; // 5 minutos en segundos
    
    return (now - webhookTime) <= maxAge;
  } catch (error) {
    console.error('Error validando timestamp:', error);
    return false;
  }
}

/**
 * Categoriza errores de Mercado Pago para mejor manejo
 */
export enum MercadoPagoErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface CategorizedError {
  type: MercadoPagoErrorType;
  message: string;
  originalError: any;
  retryable: boolean;
  timestamp: Date;
}

/**
 * Categoriza un error según su tipo y origen
 */
export function categorizeMercadoPagoError(error: any): CategorizedError {
  const timestamp = new Date();
  
  // Error de autenticación
  if (error.code === 'PA_UNAUTHORIZED_RESULT_FROM_POLICIES' || 
      error.message?.includes('UNAUTHORIZED') ||
      error.message?.includes('authentication')) {
    return {
      type: MercadoPagoErrorType.AUTHENTICATION_ERROR,
      message: 'Error de autenticación con Mercado Pago',
      originalError: error,
      retryable: false,
      timestamp
    };
  }
  
  // Error de validación
  if (error.code?.startsWith('invalid_') || 
      error.message?.includes('validation') ||
      error.message?.includes('required')) {
    return {
      type: MercadoPagoErrorType.VALIDATION_ERROR,
      message: 'Error de validación en los datos enviados',
      originalError: error,
      retryable: false,
      timestamp
    };
  }
  
  // Error de rate limiting
  if (error.code === '429' || 
      error.message?.includes('rate limit') ||
      error.message?.includes('too many requests')) {
    return {
      type: MercadoPagoErrorType.RATE_LIMIT_ERROR,
      message: 'Límite de requests excedido',
      originalError: error,
      retryable: true,
      timestamp
    };
  }
  
  // Error de red/conexión
  if (error.code?.startsWith('NETWORK') || 
      error.message?.includes('network') ||
      error.message?.includes('timeout') ||
      !error.response) {
    return {
      type: MercadoPagoErrorType.NETWORK_ERROR,
      message: 'Error de red o conexión',
      originalError: error,
      retryable: true,
      timestamp
    };
  }
  
  // Error de lógica de negocio
  if (error.code?.startsWith('business_') || 
      error.message?.includes('business logic')) {
    return {
      type: MercadoPagoErrorType.BUSINESS_LOGIC_ERROR,
      message: 'Error en la lógica de negocio',
      originalError: error,
      retryable: false,
      timestamp
    };
  }
  
  // Error de servicio externo
  if (error.code >= 500) {
    return {
      type: MercadoPagoErrorType.EXTERNAL_SERVICE_ERROR,
      message: 'Error del servicio externo (Mercado Pago)',
      originalError: error,
      retryable: true,
      timestamp
    };
  }
  
  // Error desconocido
  return {
    type: MercadoPagoErrorType.UNKNOWN_ERROR,
    message: 'Error desconocido en Mercado Pago',
    originalError: error,
    retryable: false,
    timestamp
  };
}

/**
 * Estructura para logging de transacciones
 */
export interface MercadoPagoTransactionLog {
  operation: string;
  paymentId?: string;
  orderId?: string;
  userId?: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  errorType?: MercadoPagoErrorType;
  responseTime?: number;
  metadata?: Record<string, any>;
}

/**
 * Logger estructurado para transacciones de Mercado Pago
 */
export class MercadoPagoLogger {
  private logs: MercadoPagoTransactionLog[] = [];
  
  logSuccess(operation: string, metadata: Partial<MercadoPagoTransactionLog> = {}) {
    const log: MercadoPagoTransactionLog = {
      operation,
      timestamp: new Date(),
      status: 'success',
      ...metadata
    };
    
    this.logs.push(log);
    console.log(`[MercadoPago SUCCESS] ${operation}`, log);
  }
  
  logError(operation: string, error: CategorizedError, metadata: Partial<MercadoPagoTransactionLog> = {}) {
    const log: MercadoPagoTransactionLog = {
      operation,
      timestamp: new Date(),
      status: 'error',
      errorType: error.type,
      ...metadata
    };
    
    this.logs.push(log);
    console.error(`[MercadoPago ERROR] ${operation}`, {
      ...log,
      error: error.message,
      originalError: error.originalError
    });
  }
  
  logWarning(operation: string, message: string, metadata: Partial<MercadoPagoTransactionLog> = {}) {
    const log: MercadoPagoTransactionLog = {
      operation,
      timestamp: new Date(),
      status: 'warning',
      metadata: { message, ...metadata }
    };
    
    this.logs.push(log);
    console.warn(`[MercadoPago WARNING] ${operation}`, log);
  }
  
  getLogs(): MercadoPagoTransactionLog[] {
    return [...this.logs];
  }
  
  getRecentLogs(minutes: number = 60): MercadoPagoTransactionLog[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.logs.filter(log => log.timestamp > cutoff);
  }
}

// Instancia global del logger
export const mercadoPagoLogger = new MercadoPagoLogger();

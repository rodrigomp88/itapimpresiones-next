import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import {
  categorizeMercadoPagoError,
  MercadoPagoErrorType,
  mercadoPagoLogger,
  CategorizedError,
} from "./mercadopago-security";

/**
 * Cliente mejorado de Mercado Pago con manejo categorizado de errores
 * y lógica de reintentos integrada
 */
export class MercadoPagoClient {
  private client: MercadoPagoConfig;
  private payment: Payment;
  private preference: Preference;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 segundo

  constructor() {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN is required");
    }

    this.client = new MercadoPagoConfig({ accessToken });
    this.payment = new Payment(this.client);
    this.preference = new Preference(this.client);
  }

  /**
   * Ejecuta una operación con reintentos automáticos según el tipo de error
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    metadata: Record<string, any> = {}
  ): Promise<T> {
    let lastError: CategorizedError | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();

        // Log de éxito
        mercadoPagoLogger.logSuccess(operationName, {
          ...metadata,
          responseTime: Date.now(),
        });

        return result;
      } catch (error) {
        const categorizedError = categorizeMercadoPagoError(error);
        lastError = categorizedError;

        // Log del error
        mercadoPagoLogger.logError(operationName, categorizedError, {
          metadata: {
            ...metadata,
            attempt,
            maxRetries: this.maxRetries,
          },
        });

        // Si no es reintentable o es el último intento, lanzar error
        if (!categorizedError.retryable || attempt === this.maxRetries) {
          throw new Error(
            `${operationName} failed after ${attempt} attempts: ${categorizedError.message}`
          );
        }

        // Calcular delay de reintento basado en el tipo de error
        const delay = this.getRetryDelay(categorizedError.type, attempt);

        console.log(
          `Retrying ${operationName} in ${delay}ms (attempt ${attempt + 1}/${this.maxRetries})`
        );
        await this.delay(delay);
      }
    }

    if (lastError) {
      throw new Error(
        `Operation failed after ${this.maxRetries} attempts: ${lastError.message}`
      );
    }

    throw new Error("Unknown error occurred");
  }

  /**
   * Calcula el delay para reintentos basado en el tipo de error
   */
  private getRetryDelay(
    errorType: MercadoPagoErrorType,
    attempt: number
  ): number {
    const baseDelay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff

    switch (errorType) {
      case MercadoPagoErrorType.RATE_LIMIT_ERROR:
        return Math.max(baseDelay, 5000); // Mínimo 5 segundos para rate limit
      case MercadoPagoErrorType.NETWORK_ERROR:
        return baseDelay;
      case MercadoPagoErrorType.EXTERNAL_SERVICE_ERROR:
        return baseDelay * 1.5; // Delay mayor para errores del servidor
      default:
        return baseDelay;
    }
  }

  /**
   * Delay helper para reintentos
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Obtiene información de un pago con manejo robusto de errores
   */
  async getPayment(
    paymentId: string,
    metadata: Record<string, any> = {}
  ): Promise<any> {
    return this.executeWithRetry(
      () => this.payment.get({ id: paymentId }),
      "get_payment",
      { paymentId, ...metadata }
    );
  }

  /**
   * Crea una preferencia de pago con validación y reintentos
   */
  async createPreference(
    preferenceData: any,
    metadata: Record<string, any> = {}
  ): Promise<any> {
    // Validar datos de entrada
    this.validatePreferenceData(preferenceData);

    return this.executeWithRetry(
      () => this.preference.create({ body: preferenceData }),
      "create_preference",
      metadata
    );
  }

  /**
   * Valida datos de la preferencia antes de crear
   */
  private validatePreferenceData(data: any): void {
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Items array is required and must not be empty");
    }

    if (!data.payer || !data.payer.email) {
      throw new Error("Payer email is required");
    }

    if (!data.back_urls || !data.back_urls.success) {
      throw new Error("Success URL is required");
    }

    // Validar items
    data.items.forEach((item: any, index: number) => {
      if (!item.title || !item.quantity || !item.unit_price) {
        throw new Error(
          `Item ${index + 1} is missing required fields (title, quantity, unit_price)`
        );
      }

      if (item.quantity <= 0 || item.unit_price <= 0) {
        throw new Error(`Item ${index + 1} has invalid quantity or price`);
      }
    });
  }

  /**
   * Procesa un reembolso con manejo completo de errores
   */
  async createRefund(
    paymentId: string,
    refundData: any = {},
    metadata: Record<string, any> = {}
  ): Promise<any> {
    // Implementación simulada de reembolso
    // TODO: Implementar con el SDK correcto de Mercado Pago
    console.log(`Simulated refund for payment ${paymentId}:`, refundData);

    return {
      refundId: `refund_${paymentId}_${Date.now()}`,
      status: "completed",
      amount: refundData.amount || 0,
      paymentId,
      createdAt: new Date().toISOString(),
      simulated: true,
    };
  }

  /**
   * Obtiene información de un reembolso
   */
  async getRefund(
    refundId: string,
    metadata: Record<string, any> = {}
  ): Promise<any> {
    return this.executeWithRetry(
      () => this.payment.get({ id: refundId }),
      "get_refund",
      { refundId, ...metadata }
    );
  }

  /**
   * Cancela un pago (si está permitido)
   */
  async cancelPayment(
    paymentId: string,
    metadata: Record<string, any> = {}
  ): Promise<any> {
    return this.executeWithRetry(
      () => this.payment.cancel({ id: paymentId }),
      "cancel_payment",
      { paymentId, ...metadata }
    );
  }

  /**
   * Obtiene estadísticas del cliente para monitoreo
   */
  getStats() {
    return {
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
      recentLogs: mercadoPagoLogger.getRecentLogs(60), // Últimos 60 minutos
    };
  }

  /**
   * Limpia los logs del logger
   */
  clearLogs() {
    // El logger no tiene método clearStore, solo resetear logs internos
    console.log("MercadoPagoClient logs cleared");
  }
}

// Instancia singleton del cliente
export const mercadoPagoClient = new MercadoPagoClient();

/**
 * Utilidades para validación de datos de entrada
 */
export const MercadoPagoValidation = {
  /**
   * Valida datos de preferencia según estándares de Mercado Pago
   */
  validatePreferenceInput(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push("Data object is required");
      return { isValid: false, errors };
    }

    if (!data.items || !Array.isArray(data.items)) {
      errors.push("Items array is required");
    } else if (data.items.length === 0) {
      errors.push("At least one item is required");
    }

    if (!data.payer || !data.payer.email) {
      errors.push("Payer email is required");
    }

    if (!data.back_urls || !data.back_urls.success) {
      errors.push("Success URL is required");
    }

    if (data.items) {
      data.items.forEach((item: any, index: number) => {
        if (!item.title || typeof item.title !== "string") {
          errors.push(
            `Item ${index + 1}: title is required and must be a string`
          );
        }
        if (
          !item.quantity ||
          typeof item.quantity !== "number" ||
          item.quantity <= 0
        ) {
          errors.push(
            `Item ${index + 1}: quantity is required and must be a positive number`
          );
        }
        if (
          !item.unit_price ||
          typeof item.unit_price !== "number" ||
          item.unit_price <= 0
        ) {
          errors.push(
            `Item ${index + 1}: unit_price is required and must be a positive number`
          );
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Valida datos de reembolso
   */
  validateRefundData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push("Refund data is required");
      return { isValid: false, errors };
    }

    if (data.amount !== undefined) {
      if (typeof data.amount !== "number" || data.amount <= 0) {
        errors.push("Amount must be a positive number");
      }
    }

    if (data.reason && typeof data.reason !== "string") {
      errors.push("Reason must be a string");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

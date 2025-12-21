/**
 * Tipos para el sistema de cupones de descuento
 */

export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;           // Código del cupón (ej: "VERANO20")
  type: CouponType;       // Tipo: porcentaje o monto fijo
  value: number;          // Valor del descuento (20 para 20% o 500 para $500)
  minPurchase?: number;   // Compra mínima requerida
  maxDiscount?: number;   // Descuento máximo (para porcentajes)
  usageLimit?: number;    // Límite de usos totales
  usageCount: number;     // Veces que se ha usado
  userLimit?: number;     // Límite de usos por usuario
  validFrom: Date;        // Fecha de inicio
  validUntil: Date;       // Fecha de expiración
  isActive: boolean;      // Si está activo
  categories?: string[];  // Categorías aplicables (vacío = todas)
  description?: string;   // Descripción del cupón
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discount?: number;
  message: string;
}

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  discount: number;      // Monto descontado calculado
}

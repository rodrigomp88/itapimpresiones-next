import type { Coupon, CouponAppliesTo, CouponType } from './types';

export type CouponValidationResult = {
  valid: boolean;
  reason?: 'EXPIRED' | 'NOT_STARTED' | 'MAX_USES' | 'MIN_PURCHASE' | 'CATEGORY_MISMATCH' | 'TECHNIQUE_MISMATCH' | 'FIRST_PURCHASE_ONLY' | 'INVALID';
  discount: number;
};

const REASON_MESSAGES: Record<string, string> = {
  EXPIRED: 'El cupón ha expirado',
  NOT_STARTED: 'El cupón aún no está activo',
  MAX_USES: 'El cupón alcanzó el máximo de usos',
  MIN_PURCHASE: 'No alcanza el monto mínimo requerido',
  CATEGORY_MISMATCH: 'El cupón no aplica a esta categoría',
  TECHNIQUE_MISMATCH: 'El cupón no aplica a esta técnica',
  FIRST_PURCHASE_ONLY: 'El cupón es solo para primera compra',
  INVALID: 'Cupón inválido',
};

export function getCouponReasonMessage(reason: string): string {
  return REASON_MESSAGES[reason] || reason;
}

export function getCouponStatus(coupon: Coupon): 'active' | 'paused' | 'expired' | 'used_up' {
  if (coupon.status === 'paused') return 'paused';
  const now = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);
  if (now < start) return 'paused';
  if (now > end) return 'expired';
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return 'used_up';
  return 'active';
}

export function calculateDiscount(
  type: CouponType,
  value: number,
  orderTotal: number,
): number {
  switch (type) {
    case 'percentage':
      return Math.round(orderTotal * (value / 100));
    case 'fixed':
      return Math.min(value, orderTotal);
    case 'free_shipping':
      return 0;
    default:
      return 0;
  }
}

export function validateCoupon(
  coupon: Coupon,
  orderTotal: number,
  options: {
    productType?: 'apparel' | 'bags';
    technique?: string;
    isFirstPurchase?: boolean;
    clientPurchaseCount?: number;
  } = {},
): CouponValidationResult {
  const status = getCouponStatus(coupon);
  if (status === 'expired') return { valid: false, reason: 'EXPIRED', discount: 0 };
  if (status === 'used_up') return { valid: false, reason: 'MAX_USES', discount: 0 };

  const now = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);
  if (now < start) return { valid: false, reason: 'NOT_STARTED', discount: 0 };
  if (now > end) return { valid: false, reason: 'EXPIRED', discount: 0 };
  if (status === 'paused') return { valid: false, reason: 'INVALID', discount: 0 };

  if (coupon.minPurchaseAmount > 0 && orderTotal < coupon.minPurchaseAmount) {
    return { valid: false, reason: 'MIN_PURCHASE', discount: 0 };
  }

  if (coupon.appliesTo !== 'all' && options.productType) {
    const match = couponAppliesToMatch(coupon.appliesTo, options.productType);
    if (!match) return { valid: false, reason: 'CATEGORY_MISMATCH', discount: 0 };
  }

  if (coupon.techniques && coupon.techniques.length > 0 && options.technique) {
    if (!coupon.techniques.includes(options.technique)) {
      return { valid: false, reason: 'TECHNIQUE_MISMATCH', discount: 0 };
    }
  }

  if (coupon.firstPurchaseOnly && options.clientPurchaseCount !== undefined && options.clientPurchaseCount > 0) {
    return { valid: false, reason: 'FIRST_PURCHASE_ONLY', discount: 0 };
  }

  const discount = calculateDiscount(coupon.type, coupon.value, orderTotal);
  return { valid: true, discount };
}

function couponAppliesToMatch(appliesTo: CouponAppliesTo, productType: 'apparel' | 'bags'): boolean {
  if (appliesTo === 'all') return true;
  if (appliesTo === 'bags') return productType === 'bags';
  if (appliesTo === 'apparel') return productType === 'apparel';
  if (appliesTo === 'cap') return productType === 'apparel';
  return true;
}

export function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

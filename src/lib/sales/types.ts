import { z } from "zod";

// Productos: tipos canónicos viven en ./product-types (portado de la app)
export * from "./product-types";
import { ACTIVE_PRODUCT_STATUSES } from "./product-types";

export function isProductSellable(estado?: string): boolean {
  return (ACTIVE_PRODUCT_STATUSES as readonly string[]).includes(
    estado ?? "a_pedidos"
  );
}

// ─── Presupuesto público (catálogo → app) ───────────────────────
const publicBudgetRequestSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(2, "Nombre requerido"),
  clientPhone: z.string().min(8, "Teléfono requerido"),
  clientEmail: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        productType: z.enum(["apparel", "bags"]),
        quantity: z.number().int().positive(),
        selectedSize: z.string().optional(),
        selectedColor: z.string().optional(),
        technique: z.string().optional(),
        unitPrice: z.number().min(0).optional(),
        notes: z.string().optional(),
        design: z
          .object({
            areas: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                side: z.enum(["front", "back"]),
                widthCm: z.number().optional(),
                heightCm: z.number().optional(),
                imageDataUrl: z.string().optional(),
                fileName: z.string().optional(),
                notes: z.string().optional(),
              })
            ),
            generalNotes: z.string().optional(),
            approvedAt: z.string(),
          })
          .optional(),
      })
    )
    .min(1, "Agregá al menos un producto"),
  totalEstimated: z.number().min(0).optional(),
  notes: z.string().optional(),
  paymentMethod: z
    .enum(["mercadopago", "transferencia", "efectivo"])
    .optional(),
  discountCode: z.string().optional(),
  discountAmount: z.number().min(0).optional(),
  status: z
    .enum(["pending", "reviewed", "quoted", "accepted", "rejected"])
    .default("pending"),
  createdAt: z.string().datetime(),
  reviewedAt: z.string().datetime().optional(),
  quotedAt: z.string().datetime().optional(),
  quotedBudgetId: z.string().optional(),
  quotedTotal: z.number().optional(),
  reviewedBy: z.string().optional(),
});
export type PublicBudgetRequest = z.infer<typeof publicBudgetRequestSchema>;

// ─── Cupones ────────────────────────────────────────────────────
export const COUPON_TYPES = ["percentage", "fixed", "free_shipping"] as const;
export type CouponType = (typeof COUPON_TYPES)[number];

export const COUPON_TYPE_LABELS: Record<CouponType, string> = {
  percentage: "Porcentaje",
  fixed: "Monto fijo",
  free_shipping: "Envío gratis",
};

const COUPON_STATUS = ["active", "paused", "expired", "used_up"] as const;

export const COUPON_APPLIES_TO = ["all", "apparel", "bags", "cap"] as const;
export type CouponAppliesTo = (typeof COUPON_APPLIES_TO)[number];

export const COUPON_APPLIES_TO_LABELS: Record<CouponAppliesTo, string> = {
  all: "Todos",
  apparel: "Indumentaria",
  bags: "Bolsas",
  cap: "Gorras",
};

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .transform((s) => s.toUpperCase().replace(/\s+/g, "")),
  type: z.enum(COUPON_TYPES),
  value: z.coerce.number().min(0, "Debe ser mayor a 0"),
  status: z.enum(COUPON_STATUS).default("active"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().min(1, "Fecha de fin requerida"),
  maxUses: z.coerce.number().int().min(1).nullable().default(null),
  minPurchaseAmount: z.coerce.number().min(0).default(0),
  appliesTo: z.enum(COUPON_APPLIES_TO).default("all"),
  techniques: z.array(z.string()).nullable().default(null),
  firstPurchaseOnly: z.boolean().default(false),
  isAutomatic: z.boolean().default(false),
  description: z.string().default(""),
});
export type CouponEntry = z.infer<typeof couponSchema>;

export type Coupon = CouponEntry & {
  id: string;
  usedCount: number;
  createdAt: string;
  createdBy?: string;
};

const couponRedemptionSchema = z.object({
  couponId: z.string(),
  couponCode: z.string(),
  budgetId: z.string().nullable().default(null),
  clientName: z.string(),
  clientId: z.string().nullable().default(null),
  discountAmount: z.number().min(0),
  orderTotal: z.number().min(0),
  source: z.enum(["budget", "catalog"]).default("budget"),
});
export type CouponRedemptionEntry = z.infer<typeof couponRedemptionSchema>;

export type CouponRedemption = CouponRedemptionEntry & {
  id: string;
  redeemedAt: string;
};

// ─── Ofertas / Promociones ──────────────────────────────────────
export const OFFER_DISCOUNT_TYPES = ["percentage", "fixed"] as const;
export const OFFER_STATUS = ["active", "paused", "expired"] as const;

export const offerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre es requerido"),
  discountType: z.enum(OFFER_DISCOUNT_TYPES),
  discountValue: z.coerce.number().min(0, "Debe ser mayor a 0"),
  productIds: z.array(z.string()).default([]),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().min(1, "Fecha de fin requerida"),
  status: z.enum(OFFER_STATUS).default("active"),
});
export type OfferEntry = z.infer<typeof offerSchema>;

export type Offer = OfferEntry & {
  id: string;
  createdAt: string;
  createdBy?: string;
};

import { ShippingAddress } from "../redux/slice/checkoutSlice";

// Nueva interfaz para las imágenes
export interface ProductImage {
  url: string;
  color: string;
}

export type StockType = "physical" | "made-to-order" | "service";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: ProductImage[]; // Array de objetos
  pause: boolean;
  unity: number;
  size: string;
  category: string;
  description: string;
  createdAt: string;
  stock: number; // Cantidad disponible (solo para productos físicos)
  stockType: StockType; // Tipo de gestión de stock
  depositPercentage?: number; // Porcentaje de seña (ej: 50 para 50%)
  color?: string; // Opcional/Legacy (ya no lo usaremos activamente)
  bagType?: "troquel" | "manija";
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  role: "user" | "admin";
}

export interface SlideData {
  id?: string;
  image: string;
  heading: string;
  desc: string;
  ctaLink?: string;
  ctaText?: string;
  createdAt?: string | { toDate?: () => Date };
}

export type Banner = SlideData;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  cartQuantity: number;
  imageURL: string;
}

export type PaymentStatus =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "expired";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface PaymentDetails {
  status: string;
  status_detail?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  transaction_amount?: number;
  date_approved?: string;
  date_created?: string;
  installments?: number;
  cardholder?: {
    name?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
}

export interface RefundDetails {
  refundId: string;
  amount: number;
  date_created: string;
  reason?: string;
  status: string;
}

export interface Order {
  id: string;
  userID: string;
  userEmail: string;
  orderAmount: number;
  depositAmount?: number; // Monto de la seña pagada
  remainingAmount?: number; // Monto restante por pagar
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt?: string;
  lastUpdatedBy?: "cliente" | "tienda";
  hasUnreadAdminMessage?: boolean;
  hasUnreadClientMessage?: boolean;
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  preferenceId?: string;
  paymentDetails?: PaymentDetails;
  refundDetails?: RefundDetails;
}

export interface Message {
  id: string;
  text: string;
  sender: "usuario" | "tienda";
  timestamp: string | { seconds: number; nanoseconds: number };
}

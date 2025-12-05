import { ShippingAddress } from "../redux/slice/checkoutSlice";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  pause: boolean;
  unity: number;
  size: string;
  category: string;
  description: string;
  createdAt: string;
  color?: string;
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
  createdAt?: any;
}

export type Banner = SlideData;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  cartQuantity: number;
  imageURL: string;
}

export interface Order {
  id: string;
  userID: string;
  userEmail: string;
  orderAmount: number;
  orderStatus: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  lastUpdatedBy?: "cliente" | "tienda";
  hasUnreadAdminMessage?: boolean;
  hasUnreadClientMessage?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: "usuario" | "tienda";
  timestamp: string | { seconds: number; nanoseconds: number };
}

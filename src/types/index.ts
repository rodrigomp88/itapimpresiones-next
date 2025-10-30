import { ShippingAddress } from "../redux/slice/checkoutSlice";

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  pause: boolean;
  unity: number;
  size: string;
  category: string;
  brand: string;
  description: string;
  createdAt: string;
  desc: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}

export interface SlideData {
  image: string;
  heading: string;
  desc: string;
}

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

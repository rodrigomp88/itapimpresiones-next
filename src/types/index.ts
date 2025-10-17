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

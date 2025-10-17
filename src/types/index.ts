export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  brand: string;
  category: string;
  unity?: number;
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

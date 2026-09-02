"use client";

import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/landing.css";

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
}

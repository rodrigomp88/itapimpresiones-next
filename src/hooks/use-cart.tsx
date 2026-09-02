'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { PublicProduct } from '@/lib/public-products';

export interface CartItem {
  product: PublicProduct;
  quantity: number;
  technique: string;
  size?: string;
  color?: string;
  dtfAncho?: number;
  dtfAlto?: number;
  cantidadColores?: number;
  viniloColores?: number;
  sublimacionZona?: 'frente' | 'dorso' | 'ambas';
  bordadoPuntos?: number;
  transferAncho?: number;
  transferAlto?: number;
  design?: {
    areas: Array<{
      id: string;
      name: string;
      side: 'front' | 'back';
      widthCm?: number;
      heightCm?: number;
      imageDataUrl?: string;
      fileName?: string;
      notes?: string;
    }>;
    generalNotes?: string;
    approvedAt: string;
  };
  unitPrice: number;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, 'unitPrice' | 'totalPrice'> & { unitPrice: number; totalPrice: number }) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'itap-cart:v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            await Promise.resolve(); // yield to avoid sync setState
            if (!cancelled) setItems(parsed);
          }
        }
      } catch {
        // ignore corrupted storage
      }
      if (!cancelled) setHydrated(true);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota exceeded
    }
  }, [items, hydrated]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const addItem = useCallback((
    item: Omit<CartItem, 'unitPrice' | 'totalPrice'> & { unitPrice: number; totalPrice: number }
  ) => {
    setItems(prev => [...prev, item]);
    setIsOpen(true); // Open cart drawer when adding
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity, totalPrice: item.unitPrice * quantity } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = {
    items, itemCount, total,
    addItem, removeItem, updateQuantity, clearCart,
    isOpen, setIsOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
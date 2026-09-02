'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

/**
 * Boton flotante del pedido con contador de items.
 * Visible solo cuando hay productos agregados.
 */
export function CartButton() {
  const { itemCount, setIsOpen, isOpen } = useCart();

  if (itemCount === 0 || isOpen) return null;

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="fixed bottom-24 sm:bottom-6 left-4 z-40 inline-flex items-center gap-2 h-12 pl-3 pr-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all font-semibold text-sm"
      aria-label={`Ver pedido, ${itemCount} producto${itemCount !== 1 ? 's' : ''}`}
    >
      <span className="relative inline-flex">
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {/* El contador se estampa en cada cambio: momento focal del catálogo */}
        <span
          key={itemCount}
          className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-tertiary text-white text-xs font-bold flex items-center justify-center tabular-nums animate-stamp-in"
        >
          {itemCount}
        </span>
      </span>
      Ver pedido
    </button>
  );
}

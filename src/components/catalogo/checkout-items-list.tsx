'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/hooks/use-cart';
import { formatPriceARS } from '@/lib/formatters';

interface CheckoutItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
}

const formatPrice = (value: number) => formatPriceARS(value);

export function CheckoutItemsList({ items, onUpdateQuantity, onRemoveItem }: CheckoutItemsListProps) {
  return (
    <div className="space-y-2 border-b pb-3">
      {items.map((item, index) => (
        <div key={item.product.id} className="flex flex-col gap-2 p-3 bg-muted/30">
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative w-12 h-12 bg-background flex-shrink-0">
              {item.product.imagenUrl ? (
                <Image src={item.product.imagenUrl} alt="" fill sizes="48px" className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">Sin img</div>
              )}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="font-medium text-sm leading-tight">{item.product.type === 'apparel' ? item.product.producto : item.product.material}</p>
              <p className="text-xs text-muted-foreground">{item.technique}</p>
              {item.design && <p className="text-xs text-secondary dark:text-secondary">Diseño aprobado · {item.design.areas.length} área{item.design.areas.length !== 1 ? 's' : ''}</p>}
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.unitPrice)} x {item.quantity} = <span className="font-semibold text-foreground">{formatPrice(item.totalPrice)}</span>
              </p>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onRemoveItem(index)} aria-label="Eliminar">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onUpdateQuantity(index, item.quantity - 1)} aria-label="Quitar una unidad">
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onUpdateQuantity(index, item.quantity + 1)} aria-label="Agregar una unidad">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPriceARS } from '@/lib/formatters';
import type { PublicProduct } from '@/lib/public-products';

interface CartDrawerProps {
  onGoToCheckout: () => void;
}

function itemName(p: PublicProduct): string {
  return p.type === 'apparel' ? p.producto : p.nombreDisplay || p.material;
}

/**
 * Drawer lateral del pedido: items editables + total + acceso al checkout.
 * Se abre automaticamente al agregar un producto.
 */
export function CartDrawer({ onGoToCheckout }: CartDrawerProps) {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-[92vw] sm:w-[400px] flex flex-col p-0">
        <SheetHeader className="px-4 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <ShoppingCart className="h-5 w-5 text-primary" aria-hidden="true" />
            Tu pedido
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">({itemCount})</span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">Productos agregados a tu pedido</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center">
              <Package className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
            </div>
            <p className="font-medium text-foreground">Tu pedido está vacío</p>
            <p className="text-sm text-muted-foreground">Agregá productos desde el catálogo.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="flex gap-3 bg-card p-3">
                  <div className="relative w-16 h-16 bg-muted overflow-hidden flex-shrink-0">
                    {item.product.imagenUrl ? (
                      <Image src={item.product.imagenUrl} alt="" fill sizes="64px" className="object-cover" unoptimized />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-muted-foreground">
                        <Package className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{itemName(item.product)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPriceARS(item.unitPrice)} /u{item.color ? ` · ${item.color}` : ''}
                    </p>
                    {item.design && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-secondary dark:text-secondary">
                        {item.design.areas.some(area => area.imageDataUrl) && <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />}
                        <span>{item.design.areas.length} área{item.design.areas.length !== 1 ? 's' : ''} de diseño aprobada{item.design.areas.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-muted/40 p-0.5">
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full inline-flex items-center justify-center hover:bg-background transition-colors"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          aria-label="Quitar una unidad"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full inline-flex items-center justify-center hover:bg-background transition-colors"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          aria-label="Agregar una unidad"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="text-sm font-bold tabular-nums">{formatPriceARS(item.totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="self-start text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Quitar ${itemName(item.product)} del pedido`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer con total + checkout */}
            <div className="px-4 py-4 space-y-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold tabular-nums">{formatPriceARS(total)}</span>
              </div>
              <Button
                size="lg"
                className="w-full gap-2 h-12 font-semibold"
                onClick={() => { setIsOpen(false); onGoToCheckout(); }}
              >
                Ir a pagar
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

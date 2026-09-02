'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageSquare, ChevronLeft } from 'lucide-react';
import { formatPriceARS } from '@/lib/formatters';

const formatPrice = (value: number) => formatPriceARS(value);

interface CheckoutSuccessProps {
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  orderNumber: string;
  items: Array<{ product: { type: string; producto?: string; material?: string }; quantity: number; unitPrice: number; totalPrice: number }>;
  finalTotal: number;
}

export function CheckoutSuccess({ open, onBack, onClose, orderNumber, items, finalTotal }: CheckoutSuccessProps) {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `¡Pedido enviado! Presupuesto: #${orderNumber}\n` +
    items.map(i => `${i.product.type === 'apparel' ? i.product.producto : i.product.material} x ${i.quantity}`).join('\n') +
    `\nTotal: ${formatPrice(finalTotal)}`
  )}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[94vh] overflow-x-hidden overflow-y-auto shadow-dialog dark:shadow-dialog-dark">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Confirmación</span>
          </DialogTitle>
          <DialogDescription>Tu pedido fue enviado correctamente</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1 text-center">
          <div className="w-16 h-16 bg-secondary/20 dark:bg-foreground/30 flex items-center justify-center mx-auto animate-stamp-in">
            <CheckCircle2 className="h-9 w-9 text-secondary" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-lg">¡Pedido enviado!</p>
            <p className="text-sm text-muted-foreground mt-1">Presupuesto: <span className="inline-block font-mono font-semibold text-foreground animate-stamp-in [animation-delay:150ms]">#{orderNumber}</span></p>
          </div>

          <div className="bg-muted/30 p-3 space-y-2 text-left">
            {items.map((item) => (
              <div key={item.product.producto || item.product.material} className="flex flex-col gap-0.5 p-2 bg-background/50">
                <p className="text-sm font-medium leading-tight break-words">{item.product.type === 'apparel' ? item.product.producto : item.product.material}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.quantity} u. × {formatPrice(item.unitPrice)}</span>
                  <span className="font-semibold text-foreground">{formatPrice(item.totalPrice)}</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t pt-2 text-sm">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Te contactaremos por WhatsApp para confirmar disponibilidad y coordinar el pago.
          </p>

          <div className="space-y-2 pt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-12 font-semibold">
                <MessageSquare className="h-5 w-5" aria-hidden="true" /> Enviar por WhatsApp
              </Button>
            </a>
            <div className="flex justify-center gap-4 text-sm">
              <button type="button" className="text-muted-foreground underline underline-offset-2 hover:text-foreground" onClick={() => { window.location.href = '/catalogo'; }}>
                Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCompare, X, Trash2, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PublicProduct } from '@/lib/public-products';
import type { BrandingSettings } from '@/hooks/use-settings';
import { formatPriceARS } from '@/lib/formatters';

interface CatalogCompareDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  compareProducts: PublicProduct[];
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  branding: BrandingSettings;
}

export function CatalogCompareDialog({
  open, onOpenChange, compareProducts, removeFromCompare, clearCompare, branding,
}: CatalogCompareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[85vh] overflow-y-auto shadow-dialog dark:shadow-dialog-dark">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5.5 w-5.5 text-primary" aria-hidden="true" />
              <span className="font-semibold">Comparador</span>
              <Badge variant="secondary" className="gap-1 px-2.5 py-1 text-xs font-medium rounded-full">
                {compareProducts.length}/3
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => onOpenChange(false)}
              aria-label="Cerrar comparador"
            >
              <X className="h-4.5 w-4.5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {compareProducts.map((product) => (
             <div key={product.id} className="p-4 mb-4 bg-card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base truncate pr-4">{product.type === 'apparel' ? product.producto : (product.nombreDisplay || product.material)}</h4>
                  <p className="text-xs text-muted-foreground">{product.code}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => removeFromCompare(product.id)}
                  aria-label={`Quitar ${product.type === 'apparel' ? product.producto : product.material} del comparador`}
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <div><span className="text-muted-foreground">Tipo: </span><span className="font-medium text-foreground">{product.visualType === 'cap' ? 'Gorra' : product.type === 'apparel' ? 'Indumentaria' : 'Bolsa'}</span></div>
                <div><span className="text-muted-foreground">Técnica: </span><span className="font-medium text-foreground">{product.tipoImpresion?.length ? product.tipoImpresion.join(', ') : '-'}</span></div>
                <div><span className="text-muted-foreground">Precio base: </span><span className="font-medium text-primary">{formatPriceARS(product.precioLista)}/u</span></div>
              </div>
            </div>
          ))}
          {compareProducts.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p>Agregá productos al comparador desde las tarjetas</p>
            </div>
          )}
          {compareProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button variant="outline" onClick={clearCompare} className="rounded-full">
                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" /> Limpiar todo
              </Button>
              {branding.whatsappNumber && (
                <Button
                  className="flex-1 gap-2 rounded-full"
                  onClick={() => {
                    const lines = compareProducts
                      .map(p => `• ${p.type === 'apparel' ? p.producto : (p.nombreDisplay || p.material)} (${p.code})`)
                      .join('\n');
                    const msg = `Hola! Quiero consultar por estos productos:\n${lines}`;
                    window.open(`https://wa.me/${branding.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                  }}
                  aria-label="Consultar los productos comparados por WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Consultar estos {compareProducts.length} producto{compareProducts.length !== 1 ? 's' : ''} por WhatsApp
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ShoppingCart, Plus, Minus, Trash2, Send, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { submitPublicBudgetRequest } from '@/lib/public-products';
import type { PublicProduct } from '@/lib/public-products';
import type { BrandingSettings } from '@/hooks/use-settings';
import { formatCurrency } from '@/lib/formatters';

interface BudgetItem {
  product: PublicProduct;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  notes?: string;
}

interface PublicBudgetBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: PublicProduct[];
  branding: BrandingSettings;
  initialProduct?: PublicProduct | null;
}

export function PublicBudgetBuilder({ open, onOpenChange, products, branding, initialProduct }: PublicBudgetBuilderProps) {
  const [step, setStep] = useState<'items' | 'contact' | 'sent'>('items');
  const [items, setItems] = useState<BudgetItem[]>(() =>
    initialProduct ? [{ product: initialProduct, quantity: 1 }] : []
  );
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products.filter(p => !items.some(i => i.product.id === p.id));
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      !items.some(i => i.product.id === p.id) &&
      (p.producto.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.material.toLowerCase().includes(q))
    );
  }, [products, items, searchQuery]);

  const addItem = (product: PublicProduct) => {
    setItems(prev => [...prev, { product, quantity: 1 }]);
    setSearchQuery('');
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalEstimated = useMemo(() =>
    items.reduce((sum, item) => sum + (item.product.precioLista * item.quantity), 0),
    [items]
  );

  const handleSubmit = async () => {
    if (!clientName || !clientPhone || items.length === 0) return;
    setSubmitting(true);
    try {
      const requestId = await submitPublicBudgetRequest({
        clientName,
        clientPhone,
        clientEmail: clientEmail || undefined,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.producto,
          productType: item.product.type,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          technique: item.product.tipoImpresion?.[0],
          unitPrice: item.product.precioLista,
          notes: item.notes,
        })),
        totalEstimated,
        notes: notes || undefined,
      });
      if (requestId) {
        setStep('sent');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep('items');
    setItems([]);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNotes('');
    setSearchQuery('');
    onOpenChange(false);
  };

  const whatsappUrl = branding.whatsappNumber
    ? `https://wa.me/${branding.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Armé un presupuesto online con ${items.length} productos. Quiero confirmar los precios y formas de pago.`)}`
    : null;

  return (
    <Dialog open={open} onOpenChange={(v) => v ? onOpenChange(v) : resetAndClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {step === 'items' && 'Armá tu presupuesto'}
            {step === 'contact' && 'Tus datos'}
            {step === 'sent' && '¡Enviado!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'items' && 'Agregá productos y cantidades, luego envialo para recibir tu cotización.'}
            {step === 'contact' && 'Completá tus datos para que te podamos contactar.'}
            {step === 'sent' && 'Tu solicitud fue enviada correctamente.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'items' && (
          <div className="space-y-4">
            {/* Search / add products */}
            {items.length < 5 && (
              <div className="relative">
                <Input
                  placeholder="Buscar producto para agregar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
                {searchQuery && filteredProducts.length > 0 && (
                  <div className="absolute z-10 top-full mt-1 w-full bg-popover shadow-lg max-h-48 overflow-y-auto">
                    {filteredProducts.slice(0, 8).map(product => (
                      <button
                        key={product.id}
                        onClick={() => addItem(product)}
                        className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="font-medium">{product.producto}</span>
                          <span className="text-muted-foreground ml-2">{product.code}</span>
                        </div>
                        <span className="text-primary font-medium">{formatCurrency(product.precioLista)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected items */}
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.producto}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.code} · {formatCurrency(item.product.precioLista)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuantity(index, -1)} aria-label="Reducir cantidad">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => updateQuantity(index, 1)} aria-label="Aumentar cantidad">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-medium w-20 text-right">
                    {formatCurrency(item.product.precioLista * item.quantity)}
                  </span>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => removeItem(index)} aria-label="Eliminar">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Buscá y agregá productos para armar tu presupuesto</p>
              </div>
            )}

            {items.length > 0 && (
              <div className="pt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{items.length} producto{items.length > 1 ? 's' : ''} · Total estimado:</span>
                <span className="font-bold text-lg text-primary">{formatCurrency(totalEstimated)}</span>
              </div>
            )}

            <Button
              className="w-full"
              disabled={items.length === 0}
              onClick={() => setStep('contact')}
            >
              Continuar
            </Button>
          </div>
        )}

        {step === 'contact' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tu nombre *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="pl-9"
                  autoComplete="name"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="WhatsApp / Teléfono *"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="pl-9"
                  autoComplete="tel"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Email (opcional)"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="email"
                  type="email"
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  placeholder="Algún detalle adicional? (opcional)"
                  aria-label="Notas adicionales"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background resize-none min-h-[60px]"
                  rows={2}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/30 p-3 space-y-1">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate">{item.product.producto} ×{item.quantity}</span>
                  <span>{formatCurrency(item.product.precioLista * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-1 flex justify-between font-bold">
                <span>Total estimado</span>
                <span className="text-primary">{formatCurrency(totalEstimated)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('items')} className="flex-1">
                Volver
              </Button>
              <Button
                className="flex-1 gap-2"
                disabled={!clientName || !clientPhone || submitting}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" />
                {submitting ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </div>
          </div>
        )}

        {step === 'sent' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary/20 dark:bg-foreground/30 flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>
            <div>
              <p className="font-medium">Tu solicitud fue enviada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Te contactaremos pronto con la cotización detallada.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <span>💬</span> WhatsApp
                  </Button>
                </a>
              )}
              <Button onClick={resetAndClose}>Cerrar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

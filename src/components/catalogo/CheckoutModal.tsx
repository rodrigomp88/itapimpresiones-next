'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, ChevronLeft, CreditCard, Wallet, Coins, Ticket } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { submitPublicBudgetRequest } from '@/lib/public-products';
import type { Coupon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { formatPriceARS } from '@/lib/formatters';
import { CheckoutSuccess } from './checkout-success';
import { CheckoutItemsList } from './checkout-items-list';
import { CheckoutDiscountCode } from './checkout-discount-code';

type PaymentMethod = 'mercadopago' | 'transferencia' | 'efectivo';
type PaymentMethodValue = string;

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode; discount?: number }[] = [
  { id: 'mercadopago', label: 'MercadoPago', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'transferencia', label: 'Transferencia', icon: <Wallet className="h-4 w-4" /> },
  { id: 'efectivo', label: 'Efectivo -5%', icon: <Coins className="h-4 w-4" />, discount: 5 },
];

const formatPrice = (value: number) => formatPriceARS(value);

export function CheckoutModal({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; onSuccess?: (requestId: string) => void }) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>('mercadopago');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [submittedItems, setSubmittedItems] = useState<typeof items>([]);
  const [submittedFinalTotal, setSubmittedFinalTotal] = useState(0);

  const selectedPayment = useMemo(() => PAYMENT_METHODS.find(p => p.id === paymentMethod), [paymentMethod]);
  const paymentDiscount = useMemo(() => selectedPayment?.discount ? Math.round(total * (selectedPayment.discount / 100)) : 0, [total, selectedPayment]);
  const finalTotal = useMemo(() => Math.max(0, total - paymentDiscount - couponDiscount), [total, paymentDiscount, couponDiscount]);

  const handleSubmit = async () => {
    if (!name || !phone || items.length === 0) {
      toast({ title: 'Faltan datos', description: 'Completá nombre y WhatsApp', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const id = await submitPublicBudgetRequest({
        clientName: name, clientPhone: phone, clientEmail: email || undefined,
        items: items.map(item => ({
          productId: item.product.id, productName: item.product.type === 'apparel' ? item.product.producto : item.product.material,
          productType: item.product.type, quantity: item.quantity, selectedSize: item.size, selectedColor: item.color,
          technique: item.technique, unitPrice: item.unitPrice, notes: item.dtfAncho ? `DTF: ${item.dtfAncho}x${item.dtfAlto}cm` : item.design?.generalNotes, design: item.design,
        })),
        totalEstimated: finalTotal, notes: comments || undefined,
        paymentMethod: paymentMethod as PaymentMethod, discountCode: appliedCoupon?.code || undefined, discountAmount: paymentDiscount + couponDiscount,
      });
      if (id) {
        setRequestId(id);
        setOrderNumber(`WEB-${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
        setSubmittedItems([...items]);
        setSubmittedFinalTotal(finalTotal);
        setStep('success');
        clearCart();
        onSuccess?.(id);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const msg = error instanceof Error ? error.message : 'No se pudo enviar el pedido. Verificá tu conexión y reintentalo.';
      setSubmitError(msg);
      toast({ title: 'Error al enviar', description: msg, variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const resetAndClose = () => {
    setStep('checkout'); setRequestId(null); setName(''); setPhone(''); setEmail(''); setComments('');
    setCouponDiscount(0); setAppliedCoupon(null); setPaymentMethod('mercadopago');
    setSubmittedItems([]); setSubmittedFinalTotal(0); onOpenChange(false);
  };

  if (step === 'success' && requestId) {
    return <CheckoutSuccess open={open} onBack={() => setStep('checkout')} onClose={resetAndClose} orderNumber={orderNumber} items={submittedItems} finalTotal={submittedFinalTotal} />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[94vh] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Cerrar">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Tu pedido ({items.length})</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <CheckoutItemsList items={items} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} />

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Medio de pago</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-1">
              {PAYMENT_METHODS.map(method => {
                const rowPrice = method.discount ? Math.round(total * (1 - method.discount / 100)) : total;
                const active = paymentMethod === method.id;
                return (
                  <button key={method.id} type="button" role="radio" aria-checked={active} onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${active ? 'bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/40'}`}>
                    <span className={`h-4 w-4 border-2 flex-shrink-0 flex items-center justify-center ${active ? 'border-primary' : 'border-muted-foreground/40'}`} aria-hidden="true">
                      {active && <span className="h-2 w-2 bg-primary" />}
                    </span>
                    <span className={`flex-1 text-sm font-medium ${method.icon ? 'inline-flex items-center gap-1.5' : ''}`}>{method.icon}{method.label}</span>
                    {method.discount ? <span className="text-xs font-semibold text-secondary">-{method.discount}%</span> : null}
                    <span className="text-sm font-bold tabular-nums">{formatPrice(rowPrice)}</span>
                  </button>
                );
              })}
            </RadioGroup>
          </div>

          <CheckoutDiscountCode total={total} onApply={(coupon, d) => { setAppliedCoupon(coupon); setCouponDiscount(d); }} onRemove={() => { setAppliedCoupon(null); setCouponDiscount(0); }} />

          <div className="space-y-1 pt-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
            {paymentDiscount > 0 && <div className="flex justify-between text-sm text-secondary"><span>Descuento ({selectedPayment?.discount}%)</span><span>-{formatPrice(paymentDiscount)}</span></div>}
            {couponDiscount > 0 && appliedCoupon && <div className="flex justify-between text-sm text-secondary"><span className="flex items-center gap-1"><Ticket className="h-3 w-3" /> Cupón {appliedCoupon.code}</span><span>-{formatPrice(couponDiscount)}</span></div>}
            <div className="flex justify-between text-lg font-bold pt-2"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
          </div>

          <div className="space-y-2 pt-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Tus datos</Label>
            <div className="space-y-1">
              <Input placeholder="Nombre *" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required />
              <Input placeholder="WhatsApp *" value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel" required />
              <Input placeholder="Email (opcional)" value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" />
              <Textarea placeholder="Comentarios (opcional)" value={comments} onChange={e => setComments(e.target.value)} rows={2} className="min-h-[60px]" />
            </div>
          </div>

          {/* Info de envío y pago */}
          <div className="bg-muted/40 rounded-card p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground text-sm">¿Cómo funciona?</p>
            <p>1. Enviamos tu presupuesto por WhatsApp para confirmar disponibilidad.</p>
            <p>2. Coordinamos forma de pago (transferencia, efectivo con 5% dto, o MercadoPago).</p>
            <p>3. Producción: 3-5 días hábiles después de aprobado el diseño y confirmado el pago.</p>
            <p>4. Envío a todo el país o retiro en local.</p>
          </div>

          {/* Error display */}
          {submitError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-card p-3 text-sm text-destructive">
              <p className="font-medium">{submitError}</p>
              <p className="text-xs mt-1 opacity-80">Tus datos se conservan. Podés reintentar sin completar todo de nuevo.</p>
            </div>
          )}

          <Button className="w-full py-3 text-lg" disabled={items.length === 0 || !name || !phone || submitting} onClick={handleSubmit}>
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enviando...</> : submitError ? `Reintentar — ${formatPrice(finalTotal)}` : `Enviar pedido — ${formatPrice(finalTotal)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

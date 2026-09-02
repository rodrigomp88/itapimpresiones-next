'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Ticket, XCircle, Trash2 } from 'lucide-react';
import { useCoupons } from '@/hooks/use-coupons';
import { validateCoupon, getCouponReasonMessage } from '@/lib/coupon-logic';
import type { Coupon } from '@/lib/types';
import { formatPriceARS } from '@/lib/formatters';

interface CheckoutDiscountCodeProps {
  total: number;
  onApply: (coupon: Coupon, discount: number) => void;
  onRemove: () => void;
}

export function CheckoutDiscountCode({ total, onApply, onRemove }: CheckoutDiscountCodeProps) {
  const { coupons } = useCoupons();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const handleApply = () => {
    if (!discountCode.trim()) return;
    setCouponError('');
    const normalizedCode = discountCode.trim().toUpperCase();
    const found = coupons.find((c) => c.code === normalizedCode);
    if (!found) { setCouponError('Cupón no encontrado'); return; }
    const result = validateCoupon(found, total);
    if (!result.valid) { setCouponError(getCouponReasonMessage(result.reason || 'INVALID')); return; }
    setAppliedCoupon(found);
    setCouponDiscount(result.discount);
    setDiscountCode('');
    setCouponError('');
    onApply(found, result.discount);
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError('');
    onRemove();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleApply(); }
  };

  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Cupón de descuento</Label>
      {appliedCoupon ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/10 dark:bg-foreground/20 border border-secondary/30 dark:border-secondary/30">
          <CheckCircle2 className="h-4 w-4 text-secondary dark:text-secondary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs">{appliedCoupon.code}</span>
              <span className="text-xs text-secondary dark:text-secondary">
                {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% OFF` :
                 appliedCoupon.type === 'free_shipping' ? 'Envío gratis' :
                 `${formatPriceARS(appliedCoupon.value)} OFF`}
              </span>
            </div>
            <span className="text-xs text-secondary dark:text-secondary">-{formatPriceARS(couponDiscount)}</span>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleRemove} aria-label="Quitar cupón">
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="CÓDIGO" value={discountCode}
                onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setCouponError(''); }}
                onKeyDown={handleKeyDown} className="flex-1 pl-8 font-mono uppercase" />
            </div>
            <Button variant="outline" size="sm" onClick={handleApply} disabled={!discountCode.trim()}>Aplicar</Button>
          </div>
          {couponError && (
            <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
              <XCircle className="h-3.5 w-3.5 shrink-0" />{couponError}
            </div>
          )}
        </>
      )}
    </div>
  );
}

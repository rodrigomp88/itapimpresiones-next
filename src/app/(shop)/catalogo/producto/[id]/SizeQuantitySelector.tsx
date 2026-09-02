'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Minus, Plus, Info } from 'lucide-react';
import { formatTalleLabel, TECHNIQUE_INFO } from '@/lib/catalog-helpers';

interface SizeQuantitySelectorProps {
  multiSize: boolean;
  sizes: Array<{ talle: string }>;
  sizeQty: Record<string, number>;
  handleSizeQty: (size: string, value: number) => void;
  presets: number[];
  totalQty: number;
  handleQuantityPreset: (value: number) => void;
  qty: number;
  setQty: (value: number | ((prev: number) => number)) => void;
  minQty: number;
  activeTechnique: string;
  isBag: boolean;
  isCap: boolean;
}

export function SizeQuantitySelector({
  multiSize, sizes, sizeQty, handleSizeQty, presets, totalQty, handleQuantityPreset,
  qty, setQty, minQty, activeTechnique, isBag, isCap,
}: SizeQuantitySelectorProps) {
  if (multiSize) {
    return (
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <p className="text-sm font-medium text-muted-foreground">Talles y cantidades</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground cursor-help"><Info className="h-3 w-3" aria-hidden="true" /></span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              <p>Las medidas indicadas son orientativas. Puede haber variaciones de ±2 a 3 cm entre lotes por diferencias en el corte y confección.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {sizes.map((s) => {
            const sizeVal = sizeQty[s.talle] || 0;
            return (
              <div key={s.talle} className="flex items-center justify-between border px-2 py-1.5 bg-muted/30">
                <span className="text-sm font-medium min-w-0 flex-1 truncate">{formatTalleLabel(s)}</span>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10 sm:h-8 sm:w-8" disabled={sizeVal <= 0}
                    onClick={() => handleSizeQty(s.talle, sizeVal - 1)} aria-label={`Reducir talle ${s.talle}`}>
                    <Minus className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                  </Button>
                  <Input type="number" inputMode="numeric" min={0} value={sizeVal || ''} onChange={(e) => handleSizeQty(s.talle, Number(e.target.value) || 0)}
                    className="h-10 w-12 sm:h-8 text-center text-sm [appearance-none] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" aria-label={`Cantidad talle ${s.talle}`} />
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10 sm:h-8 sm:w-8"
                    onClick={() => handleSizeQty(s.talle, sizeVal + 1)} aria-label={`Aumentar talle ${s.talle}`}>
                    <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Total: <span className="font-semibold text-foreground">{totalQty}</span> unidades</p>
        {presets.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-2" aria-label="Atajos de cantidad">
            <span className="text-xs text-muted-foreground">Atajos:</span>
            {presets.map(p => (
              <Button key={p} type="button" variant={totalQty === p ? 'default' : 'outline'} size="sm"
                className="h-8 px-3 text-xs rounded-full" onClick={() => handleQuantityPreset(p)}>
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <p className="text-sm font-medium text-muted-foreground">Cantidad</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground cursor-help"><Info className="h-3 w-3" aria-hidden="true" /></span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            <p>Mínimo <strong>{minQty} unidades</strong> para {TECHNIQUE_INFO[activeTechnique]?.label || activeTechnique} en {isBag ? 'bolsas' : isCap ? 'gorras' : 'indumentaria'}.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-muted/40 p-1" role="group" aria-label="Cantidad">
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10 sm:h-9 sm:w-9 rounded-full"
            onClick={() => setQty(q => Math.max(minQty, q - 1))} disabled={qty <= minQty} aria-label="Quitar una unidad">
            <Minus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="w-10 text-center font-semibold tabular-nums text-lg" aria-live="polite">{qty}</span>
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10 sm:h-9 sm:w-9 rounded-full"
            onClick={() => setQty(q => Math.min(9999, q + 1))} aria-label="Agregar una unidad">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map(p => (
            <Button key={p} type="button" variant={qty === p ? 'default' : 'outline'} size="sm"
              className="h-8 px-3 text-xs rounded-full" onClick={() => setQty(p)}>
              {p}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

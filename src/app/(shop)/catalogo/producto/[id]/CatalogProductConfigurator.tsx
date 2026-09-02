'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Tag as TagIcon, Info, Package,
  Trash2, Plus as PlusIcon, Check, Shirt, RotateCcw, ShoppingCart, MessageSquare, FileImage,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import type { PublicProduct } from '@/lib/public-products';
import type { BrandingSettings } from '@/hooks/use-settings';
import type { CatalogCustomZone } from '@/components/catalogo/CatalogGarmentVisualizer';

import { colorDotClass, colorHexResolved, sortColorsForDisplay } from '@/lib/color-map';
import { formatPriceARS } from '@/lib/formatters';
import { SizeQuantitySelector } from './SizeQuantitySelector';
import { TechniqueSelector } from './TechniqueSelector';
import { AreaSelector } from './AreaSelector';

interface PriceResult {
  unitPrice: number;
  totalPrice: number;
  discountApplied: number;
  stampDims?: Record<string, string>;
}

interface AvailableZone {
  id: string;
  name: string;
}

export interface CatalogProductConfiguratorProps {
  product: PublicProduct;
  branding: BrandingSettings;
  isBag: boolean;
  isCap: boolean;
  name: string;
  activeTechnique: string;
  handleTechniqueChange: (technique: string) => void;
  tecnicas: string[];
  minQty: number;
  totalQty: number;
  qty: number;
  setQty: (value: number | ((prev: number) => number)) => void;
  sizeQty: Record<string, number>;
  handleSizeQty: (size: string, value: number) => void;
  handleQuantityPreset: (value: number) => void;
  presets: number[];
  sizeSummary?: string;
  unitPrice: number;
  total: number;
  priceResult: PriceResult | null;
  selectedColor?: string;
  setSelectedColor: (color: string | undefined) => void;
  colorsExpanded: boolean;
  setColorsExpanded: (expanded: boolean) => void;
  selectedAreas: string[];
  selectedAreasSet: Set<string>;
  toggleArea: (id: string) => void;
  setSelectedAreas: (areas: string[]) => void;
  availableZones: AvailableZone[];
  hasPrintAreaSection: boolean;
  customZones: CatalogCustomZone[];
  removeCustomZone: (id: string) => void;
  setShowZoneDialog: (open: boolean) => void;
  packPremium: boolean;
  setPackPremium: (value: boolean) => void;
  handleAddToCart: () => void;
  addedToCart: boolean;
  handleOpenDesign: () => void;
  designAreasCount: number;
}

const STEPS = [
  { id: 'style', label: 'Color y técnica', shortLabel: 'Estilo' },
  { id: 'quantity', label: 'Talles y cantidades', shortLabel: 'Cantidad' },
  { id: 'areas', label: 'Áreas y diseño', shortLabel: 'Áreas' },
] as const;

type StepId = typeof STEPS[number]['id'];

function StepIndicator({ currentStep, completedSteps }: { currentStep: StepId; completedSteps: Set<StepId> }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Pasos de configuración">
      {STEPS.map((step, i) => {
        const isCurrent = step.id === currentStep;
        const isComplete = completedSteps.has(step.id);
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isCurrent ? 'bg-primary text-primary-foreground' :
              isComplete ? 'bg-primary/10 text-primary' :
              'bg-muted text-muted-foreground'
            }`}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
                {isComplete ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.shortLabel}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-4 h-px ${isComplete ? 'bg-primary' : 'bg-border'}`} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CatalogProductConfigurator(props: CatalogProductConfiguratorProps) {
  const {
    product, branding, isBag, isCap, name,
    activeTechnique, handleTechniqueChange, tecnicas, minQty, totalQty,
    qty, setQty, sizeQty, handleSizeQty, handleQuantityPreset, presets, sizeSummary,
    unitPrice, total, priceResult, selectedColor, setSelectedColor,
    colorsExpanded, setColorsExpanded, selectedAreas, selectedAreasSet, toggleArea, setSelectedAreas,
    availableZones, hasPrintAreaSection, customZones, removeCustomZone, setShowZoneDialog,
    packPremium, setPackPremium, handleAddToCart, addedToCart, handleOpenDesign, designAreasCount,
  } = props;

  const [currentStep, setCurrentStep] = useState<StepId>('style');
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  const markComplete = (step: StepId) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    const idx = STEPS.findIndex(s => s.id === step);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1].id);
  };

  const canCompleteStyle = !!selectedColor && !!activeTechnique;
  const canCompleteQuantity = totalQty >= minQty;

  const toggleStep = (step: StepId) => {
    if (currentStep === step) return;
    setCurrentStep(step);
  };

  return (
    <div className="space-y-4">
      {/* Título + badge */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-2">
          <Badge variant="secondary" className="gap-1 px-2.5 py-1 text-xs font-medium rounded-full">
            <TagIcon className="h-3 w-3" aria-hidden="true" />
            {isBag ? 'Bolsa ecológica' : isCap ? 'Gorra' : 'Indumentaria'}
          </Badge>
          <span className="text-muted-foreground font-medium">{product.code}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">{name}</h1>
      </div>

      {/* Resumen de precio — siempre visible */}
      <div className="bg-card p-4 shadow-card dark:shadow-card-dark">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Precio por unidad</p>
            <p className="text-3xl font-bold text-primary leading-tight">{formatPriceARS(unitPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">{formatPriceARS(total)}</p>
          </div>
        </div>
        {priceResult && priceResult.discountApplied > 0 && (
          <p className="text-xs text-secondary dark:text-secondary mt-1.5">✓ Descuento {(priceResult.discountApplied * 100).toFixed(0)}% por volumen aplicado</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{totalQty} u. × {formatPriceARS(unitPrice)}</p>

        {/* Chips de selección */}
        {(activeTechnique || selectedColor || selectedAreas.length > 0 || sizeSummary || totalQty > 0) && (
          <div className="mt-3 pt-3">
            <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Tu selección</p>
            <div className="flex flex-wrap gap-1.5" aria-label="Resumen de selección">
              {sizeSummary ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {sizeSummary}
                </span>
              ) : totalQty > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {totalQty} u.
                </span>
              )}
              {activeTechnique && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {activeTechnique}
                </span>
              )}
              {selectedColor && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  <span className={`h-2 w-2 rounded-full border border-black/10 ${colorDotClass(selectedColor)}`} aria-hidden="true" />
                  {selectedColor}
                </span>
              )}
              {selectedAreas.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {selectedAreas.flatMap(id => {
                    const z = availableZones.find(zone => zone.id === id);
                    return z ? [z.name] : [];
                  }).join(' + ')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

      {/* Step 1: Color y Técnica */}
      <div className="border rounded-card overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
          onClick={() => toggleStep('style')}
          aria-expanded={currentStep === 'style'}
        >
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              completedSteps.has('style') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {completedSteps.has('style') ? <Check className="h-3.5 w-3.5" /> : '1'}
            </span>
            <span className="font-medium text-sm">Color y técnica</span>
            {selectedColor && activeTechnique && (
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {selectedColor} · {activeTechnique}
              </span>
            )}
          </div>
          {currentStep === 'style' ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {currentStep === 'style' && (
          <div className="px-4 pb-4 space-y-5 border-t">
            {/* Color */}
            {product.colors.length > 0 && (
              <div className="pt-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <p className="text-sm font-medium text-muted-foreground">Color</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground cursor-help"><Info className="h-3 w-3" aria-hidden="true" /></span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">Seleccioná el color de la prenda. Puede variar según disponibilidad.</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {sortColorsForDisplay(product.colors).slice(0, colorsExpanded ? product.colors.length : 5).map(c => {
                    const active = selectedColor === c;
                    return (
                      <button key={c} type="button" onClick={() => setSelectedColor(active ? undefined : c)} aria-pressed={active}
                        title={c} aria-label={`Color ${c}`}
                        className={`h-11 w-11 rounded-full border border-black/10 transition-[color,background-color,border-color,box-shadow] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? 'ring-2 ring-ring ring-offset-2' : 'hover:ring-2 hover:ring-ring/40 hover:ring-offset-1'}`}
                        style={{ backgroundColor: colorHexResolved(c) }}
                      />
                    );
                  })}
                  {!colorsExpanded && product.colors.length > 5 && (
                    <button type="button" onClick={() => setColorsExpanded(true)}
                      title={sortColorsForDisplay(product.colors).slice(5).join(', ')}
                      aria-label={`Mostrar ${product.colors.length - 5} colores más`}
                      className="h-11 w-11 rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground transition-colors active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 hover:bg-muted-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      +{product.colors.length - 5}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Técnica */}
            <TechniqueSelector
              tecnicas={tecnicas}
              activeTechnique={activeTechnique}
              onTechniqueChange={handleTechniqueChange}
            />

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!canCompleteStyle}
              onClick={() => markComplete('style')}
            >
              Continuar a cantidades
            </Button>
          </div>
        )}
      </div>

      {/* Step 2: Talles y Cantidades */}
      <div className="border rounded-card overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
          onClick={() => toggleStep('quantity')}
          aria-expanded={currentStep === 'quantity'}
        >
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              completedSteps.has('quantity') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {completedSteps.has('quantity') ? <Check className="h-3.5 w-3.5" /> : '2'}
            </span>
            <span className="font-medium text-sm">Talles y cantidades</span>
            {sizeSummary && (
              <span className="text-xs text-muted-foreground hidden sm:inline">{sizeSummary}</span>
            )}
          </div>
          {currentStep === 'quantity' ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {currentStep === 'quantity' && (
          <div className="px-4 pb-4 space-y-4 border-t">
            <div className="pt-3">
              <SizeQuantitySelector
                multiSize={product.sizes.length > 1}
                sizes={product.sizes}
                sizeQty={sizeQty}
                handleSizeQty={handleSizeQty}
                presets={presets}
                totalQty={totalQty}
                handleQuantityPreset={handleQuantityPreset}
                qty={qty}
                setQty={setQty}
                minQty={minQty}
                activeTechnique={activeTechnique}
                isBag={isBag}
                isCap={isCap}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!canCompleteQuantity}
              onClick={() => markComplete('quantity')}
            >
              Continuar a áreas
            </Button>
          </div>
        )}
      </div>

      {/* Step 3: Áreas y Diseño */}
      <div className="border rounded-card overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
          onClick={() => toggleStep('areas')}
          aria-expanded={currentStep === 'areas'}
        >
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              completedSteps.has('areas') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {completedSteps.has('areas') ? <Check className="h-3.5 w-3.5" /> : '3'}
            </span>
            <span className="font-medium text-sm">Áreas y diseño</span>
            {selectedAreas.length > 0 && (
              <span className="text-xs text-muted-foreground hidden sm:inline">{selectedAreas.length} área{selectedAreas.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          {currentStep === 'areas' ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {currentStep === 'areas' && (
          <div className="px-4 pb-4 space-y-4 border-t">
            <div className="pt-3">
              <AreaSelector
                availableZones={availableZones}
                selectedAreasSet={selectedAreasSet}
                isBag={isBag}
                toggleArea={toggleArea}
                setSelectedAreas={setSelectedAreas}
              />
              {hasPrintAreaSection && (
                <div className="mt-3">
                  {customZones.length > 0 && (
                    <div className="space-y-1.5 mb-2">
                      {customZones.map(zone => (
                        <div key={zone.id} className="flex items-center justify-between border px-3 py-2 bg-muted/30">
                          <div className="flex items-center gap-2">
                            <span className="text-xs" aria-hidden="true">{zone.side === 'front' ? <Shirt className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}</span>
                            <span className="text-sm font-medium">{zone.name}</span>
                            <span className="text-xs text-muted-foreground">{zone.widthCm}×{zone.heightCm}cm</span>
                          </div>
                          <Button type="button" variant="ghost" size="icon" className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => removeCustomZone(zone.id)} aria-label={`Eliminar zona ${zone.name}`}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {!isBag && (
                    <Button type="button" variant="outline" size="sm" className="w-full gap-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => setShowZoneDialog(true)}>
                      <PlusIcon className="h-4 w-4" aria-hidden="true" /> Agregar zona personalizada
                    </Button>
                  )}
                  {(selectedAreas.length > 0 || customZones.length > 0) && (
                    <p className="text-xs text-muted-foreground mt-1">Arrastrá las zonas personalizadas sobre la prenda para ubicarlas.</p>
                  )}
                </div>
              )}
            </div>

            {/* Packaging */}
            {!isBag && (
              <div className="flex items-center justify-between border p-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">Packaging {packPremium ? 'Premium' : 'ECO'}</p>
                    <p className="text-xs text-muted-foreground">
                      {packPremium ? 'Bolsa de regalo + etiqueta' : 'Incluido sin costo adicional'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {packPremium && (
                    <span className="text-xs font-medium text-secondary dark:text-secondary">Incluido</span>
                  )}
                  <Switch checked={packPremium} onCheckedChange={setPackPremium} aria-label="Cambiar packaging" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Acciones — siempre visibles */}
      <div className="space-y-2 pt-2">
        <Button className="w-full gap-2 h-12 font-semibold active:scale-[0.98] transition-transform motion-reduce:transition-none motion-reduce:active:scale-100"
          onClick={handleAddToCart} disabled={!priceResult || totalQty < minQty}
          aria-label={`Agregar ${name} al pedido por ${formatPriceARS(total)}`}>
          {addedToCart ? (
            <><Check className="h-5 w-5" aria-hidden="true" /> Agregado</>
          ) : (
            <><ShoppingCart className="h-5 w-5" aria-hidden="true" /> Agregar al pedido — {formatPriceARS(total)}</>
          )}
        </Button>

        {branding.whatsappNumber ? (
          <Button type="button" variant="ghost" className="w-full gap-2 h-11 text-secondary hover:text-secondary hover:bg-secondary/10"
            onClick={() => {
              const msg = branding.whatsappMessage.replace('{productName}', name);
              window.open(`https://wa.me/${branding.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            aria-label={`Consultar ${name} por WhatsApp`}>
            <MessageSquare className="h-4.5 w-4.5" aria-hidden="true" /> Consultar por WhatsApp
          </Button>
        ) : (
          <Button type="button" variant="ghost" className="w-full gap-2 h-11 text-primary hover:text-primary hover:bg-primary/10"
            onClick={handleOpenDesign} disabled={!priceResult || designAreasCount === 0}
            aria-label={`Crear diseño para ${name}`}>
            <FileImage className="h-4.5 w-4.5" aria-hidden="true" /> Creá tu diseño
          </Button>
        )}

        {totalQty > 0 && totalQty < minQty && (
          <p className="text-xs text-accent dark:text-accent text-center">Necesitás {minQty} unidades mínimas. Actualmente tenés {totalQty}.</p>
        )}
      </div>
    </div>
  );
}

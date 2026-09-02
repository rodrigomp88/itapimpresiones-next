'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, FileImage, Upload } from 'lucide-react';
import { CatalogGarmentVisualizer, type CatalogCustomZone } from '@/components/catalogo/CatalogGarmentVisualizer';
import type { PublicProduct } from '@/lib/public-products';

interface DesignArea {
  id: string;
  name: string;
  side: 'front' | 'back';
  dimensions?: string;
}

interface CatalogDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: PublicProduct;
  selectedColor?: string;
  designStep: 'upload' | 'review' | 'notes';
  setDesignStep: (step: 'upload' | 'review' | 'notes') => void;
  designAreas: DesignArea[];
  designNotes: string;
  setDesignNotes: (v: string) => void;
  designApproved: boolean;
  setDesignApproved: (v: boolean) => void;
  uploadingDesign: boolean;
  artwork: Record<string, { imageDataUrl: string; fileName: string }>;
  handleArtworkChange: (areaId: string, file: File | undefined) => void;
  visualSelectedAreas: string[];
  customZones: CatalogCustomZone[];
  stampDims?: Record<string, string>;
  sizeSummary?: string;
  handleCustomZoneMove: (id: string, xPercent: number, yPercent: number) => void;
  handleApproveDesign: () => void;
  allAreasHaveArtwork: boolean;
}

export function CatalogDesignDialog({
  open,
  onOpenChange,
  product,
  selectedColor,
  designStep,
  setDesignStep,
  designAreas,
  designNotes,
  setDesignNotes,
  designApproved,
  setDesignApproved,
  uploadingDesign,
  artwork,
  handleArtworkChange,
  visualSelectedAreas,
  customZones,
  stampDims,
  sizeSummary,
  handleCustomZoneMove,
  handleApproveDesign,
  allAreasHaveArtwork,
}: CatalogDesignDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileImage className="h-5 w-5 text-primary" /> Creá tu diseño</DialogTitle>
        </DialogHeader>
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Pasos del diseño">
          {(['upload', 'review', 'notes'] as const).map((step, i) => {
            const labels = { upload: 'Subir archivos', review: 'Revisar muestra', notes: 'Anotaciones y enviar' };
            const isCurrent = designStep === step;
            const stepIdx = ['upload', 'review', 'notes'].indexOf(step);
            const currentIdx = ['upload', 'review', 'notes'].indexOf(designStep);
            const isDone = stepIdx < currentIdx;
            return (
              <span key={step} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40" aria-hidden="true">→</span>}
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${isCurrent ? 'bg-primary text-primary-foreground' : isDone ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {isDone ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={isCurrent ? 'text-foreground' : ''}>{labels[step]}</span>
              </span>
            );
          })}
        </div>

        {designStep === 'upload' && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
            <div className="space-y-4">
              <div className="bg-muted/20 p-3">
                <CatalogGarmentVisualizer
                  product={product}
                  color={selectedColor}
                  selectedAreas={visualSelectedAreas}
                  customZones={customZones}
                  stampDims={stampDims}
                  sizeSummary={sizeSummary}
                  artwork={Object.entries(artwork).map(([id, value]) => ({ id, imageDataUrl: value.imageDataUrl }))}
                  onCustomZoneMove={handleCustomZoneMove}
                />
              </div>
              <p className="text-xs text-muted-foreground">Vista orientativa. La muestra final puede variar según la técnica y el archivo original.</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Archivos por área</p>
                <p className="text-xs text-muted-foreground mt-1">Subí una imagen para ver cómo quedaría sobre la prenda.</p>
              </div>
              {designAreas.map(area => (
                <div key={area.id} className="p-3 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{area.name}</p>
                      <p className="text-xs text-muted-foreground">{area.side === 'front' ? 'Frente' : 'Dorso'}{area.dimensions ? ` · ${area.dimensions}` : ''}</p>
                    </div>
                    {artwork[area.id] && <Check className="h-4 w-4 text-secondary shrink-0" aria-label="Archivo cargado" />}
                  </div>
                  <label className="flex items-center justify-center gap-2 border border-dashed border-primary/40 bg-primary/5 px-3 py-3 text-sm font-medium text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                    <Upload className="h-4 w-4" />
                    {artwork[area.id] ? 'Cambiar archivo' : 'Subir diseño'}
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={event => handleArtworkChange(area.id, event.target.files?.[0])} />
                  </label>
                  {artwork[area.id] && <p className="text-xs text-muted-foreground truncate">{artwork[area.id].fileName}</p>}
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button className="flex-1" disabled={!allAreasHaveArtwork} onClick={() => setDesignStep('review')}>
                  Siguiente: Revisar
                </Button>
              </div>
            </div>
          </div>
        )}

        {designStep === 'review' && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
            <div className="space-y-4">
              <div className="bg-muted/20 p-3">
                <CatalogGarmentVisualizer
                  product={product}
                  color={selectedColor}
                  selectedAreas={visualSelectedAreas}
                  customZones={customZones}
                  stampDims={stampDims}
                  sizeSummary={sizeSummary}
                  artwork={Object.entries(artwork).map(([id, value]) => ({ id, imageDataUrl: value.imageDataUrl }))}
                  onCustomZoneMove={handleCustomZoneMove}
                />
              </div>
              <p className="text-xs text-muted-foreground">Revisá cómo queda tu diseño sobre la prenda. Si necesitás cambios, volvé al paso anterior.</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Resumen de áreas</p>
                <p className="text-xs text-muted-foreground mt-1">Verificá que todos los archivos estén correctos.</p>
              </div>
              {designAreas.map(area => (
                <div key={area.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    <div>
                      <p className="font-medium text-sm">{area.name}</p>
                      <p className="text-xs text-muted-foreground">{artwork[area.id]?.fileName}</p>
                    </div>
                  </div>
                  <span className="text-xs text-secondary font-medium">Cargado</span>
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setDesignStep('upload')}>
                  ← Volver
                </Button>
                <Button className="flex-1" onClick={() => setDesignStep('notes')}>
                  Siguiente: Enviar
                </Button>
              </div>
            </div>
          </div>
        )}

        {designStep === 'notes' && (
          <div className="max-w-lg mx-auto space-y-4">
            <p className="text-sm font-semibold">Anotaciones y recomendaciones</p>
            <p className="text-xs text-muted-foreground">Agregá indicaciones para el taller: colores, cambios, ubicación, etc.</p>
            <textarea value={designNotes} onChange={event => { setDesignNotes(event.target.value); setDesignApproved(false); }}
              aria-label="Anotaciones y recomendaciones para el taller"
              placeholder="Ej: Quiero los colores más vivos, el logo un poco más a la izquierda..." className="min-h-32 w-full bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <label className="flex items-start gap-3 bg-muted/20 p-3 cursor-pointer">
              <input type="checkbox" checked={designApproved} onChange={event => setDesignApproved(event.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
              <span className="text-sm">Confirmo esta muestra visual como referencia del diseño.</span>
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDesignStep('review')}>
                ← Volver
              </Button>
              <Button className="flex-1 gap-2" disabled={!designApproved || uploadingDesign} onClick={handleApproveDesign}>
                <Check className="h-4 w-4" /> {uploadingDesign ? 'Guardando...' : 'Aprobar y agregar al pedido'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GarmentDiagram } from '@/components/apparel/garment-diagrams';
import { ToteBagDiagram, KidneyBagDiagram } from '@/components/apparel/diagrams';
import { stampingZones, apparelZoneStyles, smallZones } from '@/components/apparel/stamping-zones';
import { getVisualType, type VisualType } from '@/components/apparel/visual-config';
import { colorToHex } from '@/lib/color-map';
import type { PublicProduct } from '@/lib/public-products';

export interface CatalogCustomZone {
  id: string;
  name: string;
  side: 'front' | 'back';
  widthCm: number;
  heightCm: number;
  xPercent?: number;
  yPercent?: number;
}

export interface CatalogDesignArtwork {
  id: string;
  imageDataUrl?: string;
}

interface CatalogGarmentVisualizerProps {
  product: PublicProduct;
  /** Selected color name — tints the garment silhouette. */
  color?: string;
  /** Active predefined zone ids (stamps). */
  selectedAreas: string[];
  /** Custom zones with position (draggable if onCustomZoneMove given). */
  customZones: CatalogCustomZone[];
  /** Optional dimension labels per predefined zone id ("10.5x12cm"). */
  stampDims?: Record<string, string>;
  /** Summary chip text, e.g. "M(3u) · L(2u)". */
  sizeSummary?: string;
  onCustomZoneMove?: (id: string, xPercent: number, yPercent: number) => void;
  artwork?: CatalogDesignArtwork[];
  className?: string;
}

export function CatalogGarmentVisualizer({
  product,
  color,
  selectedAreas,
  customZones,
  stampDims,
  sizeSummary,
  onCustomZoneMove,
  artwork = [],
  className,
}: CatalogGarmentVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ id: string; startX: number; startY: number; startPctX: number; startPctY: number } | null>(null);

  const isBag = product.type === 'bags';
  const visualType: VisualType = useMemo(() => {
    const vt = product.visualType as VisualType | undefined;
    if (vt) return vt;
    return getVisualType(product.producto || '');
  }, [product.visualType, product.producto]);

  const fillHex = colorToHex(color);
  const selectedAreasSet = useMemo(() => new Set(selectedAreas), [selectedAreas]);
  const artworkMap = useMemo(() => new Map(artwork.map(a => [a.id, a])), [artwork]);
  const isZoneEnabled = useCallback((id: string) => {
    if (!product.validZones || product.validZones.length === 0) return true;
    return product.validZones.includes(id);
  }, [product.validZones]);

  const hasBackStamps = selectedAreas.some(id => stampingZones.find(z => z.id === id)?.side === 'back')
    || customZones.some(z => z.side === 'back');
  const isCap = visualType === 'cap';
  const showBack = isCap ? selectedAreas.includes('gorraPosterior') : (!isBag && hasBackStamps);
  const showSide = isCap && selectedAreas.includes('gorraLateral');

  const handlePointerDown = useCallback((e: React.PointerEvent, zoneId: string) => {
    if (!onCustomZoneMove) return;
    const zone = customZones.find(z => z.id === zoneId);
    if (!zone) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = {
      id: zoneId,
      startX: e.clientX,
      startY: e.clientY,
      startPctX: zone.xPercent ?? 50,
      startPctY: zone.yPercent ?? 50,
    };
  }, [onCustomZoneMove, customZones]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = draggingRef.current;
    if (!drag || !onCustomZoneMove) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const deltaPctX = ((e.clientX - drag.startX) / rect.width) * 100;
    const deltaPctY = ((e.clientY - drag.startY) / rect.height) * 100;
    const newX = Math.max(5, Math.min(95, drag.startPctX + deltaPctX));
    const newY = Math.max(5, Math.min(95, drag.startPctY + deltaPctY));
    onCustomZoneMove(drag.id, Math.round(newX), Math.round(newY));
  }, [onCustomZoneMove]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  const renderSide = (side: 'front' | 'back' | 'side') => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <h4 className="text-sm font-semibold text-muted-foreground">{side === 'front' ? (isBag ? 'Bolsa' : 'Frente') : side === 'side' ? 'Lateral' : 'Dorso'}</h4>
        {sizeSummary && side === 'front' && (
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
            {sizeSummary}
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full max-w-sm bg-muted/20 p-4"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isBag ? (
            product.tipoManija?.toLowerCase().includes('riñ')
              ? <KidneyBagDiagram fillColor={fillHex} />
              : <ToteBagDiagram fillColor={fillHex} />
          ) : (
            <GarmentDiagram type={visualType} side={side} fillColor={fillHex} />
          )}
        </div>

        {/* Predefined active zones */}
        {!isBag && stampingZones.map(zone => { const matchesSide = side === 'side' ? zone.id === 'gorraLateral' : zone.side === side; if (!matchesSide) return null;
          if (!selectedAreasSet.has(zone.id)) return null;
          if (!isZoneEnabled(zone.id)) return null;
          const style = apparelZoneStyles[zone.id]?.styles;
          if (!style) return null;
          const dims = stampDims?.[zone.id];
          const image = artworkMap.get(zone.id)?.imageDataUrl;
          const isSmall = smallZones.includes(zone.id);
          return (
            <div key={zone.id} className="absolute flex items-center justify-center bg-primary/30 transition-all duration-300" style={style}>
              {image && <Image src={image} alt="" fill unoptimized className="absolute inset-1 !h-[calc(100%-0.5rem)] !w-[calc(100%-0.5rem)] object-contain pointer-events-none" sizes="200px" />}
              <div className="text-center text-primary p-1 rounded bg-background/50 backdrop-blur-sm max-w-full overflow-hidden">
                <p className={cn('font-bold leading-tight truncate', isSmall ? 'text-[10px]' : 'text-xs')}>{zone.name}</p>
                {dims && <p className={cn('font-mono font-semibold opacity-90 leading-tight truncate', isSmall ? 'text-[9px]' : 'text-[10px]')}>{dims}</p>}
              </div>
            </div>
          );
        })}

        {/* Bags: simple front print area when technique selected */}
        {isBag && side === 'front' && selectedAreas.length > 0 && (
          <div className="absolute flex items-center justify-center bg-primary/30 transition-all duration-300 rounded" style={{ top: '40%', left: '30%', width: '40%', height: '40%' }}>
            {artwork.find(item => item.id === 'frente')?.imageDataUrl && <Image src={artwork.find(item => item.id === 'frente')!.imageDataUrl!} alt="" fill unoptimized className="absolute inset-1 !h-[calc(100%-0.5rem)] !w-[calc(100%-0.5rem)] object-contain pointer-events-none" sizes="200px" />}
            <div className="text-center text-primary p-1 rounded bg-background/50 backdrop-blur-sm">
              <p className="text-xs font-bold leading-tight">Estampa</p>
            </div>
          </div>
        )}

        {/* Custom zones (draggable) */}
        {customZones.map(zone => { if (!(isBag ? side === 'front' : zone.side === side)) return null; return (
          <DraggableZone
            key={zone.id}
            zone={zone}
            draggable={!!onCustomZoneMove}
            onPointerDown={handlePointerDown}
            imageDataUrl={artwork.find(item => item.id === zone.id)?.imageDataUrl}
          />
        );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn('grid w-full mx-auto gap-6', showBack ? (showSide ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2') : 'grid-cols-1', className)}>
      {renderSide('front')}
      {showSide && renderSide('side')}
      {showBack && renderSide('back')}
    </div>
  );
}

function DraggableZone({
  zone,
  draggable,
  onPointerDown,
  imageDataUrl,
}: {
  zone: CatalogCustomZone;
  draggable: boolean;
  onPointerDown: (e: React.PointerEvent, zoneId: string) => void;
  imageDataUrl?: string;
}) {
  return (
    <div
      className={cn(
        'absolute flex items-center justify-center bg-primary/40 border-2 border-primary/60 rounded',
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      )}
      style={{
        left: `${zone.xPercent ?? 50}%`,
        top: `${zone.yPercent ?? 50}%`,
        width: `${Math.max(8, zone.widthCm * 2)}%`,
        height: `${Math.max(6, zone.heightCm * 2)}%`,
        minWidth: '60px',
        minHeight: '40px',
        transform: 'translate(-50%, -50%)',
      }}
      onPointerDown={(e) => onPointerDown(e, zone.id)}
    >
      {imageDataUrl && <Image src={imageDataUrl} alt="" fill unoptimized className="absolute inset-1 !h-[calc(100%-0.5rem)] !w-[calc(100%-0.5rem)] object-contain pointer-events-none" sizes="200px" />}
      <div className="text-center text-primary p-1 pointer-events-none select-none">
        <p className="text-xs font-bold leading-tight truncate">{zone.name}</p>
        <p className="text-[10px] font-mono font-semibold opacity-90 leading-tight">{zone.widthCm}x{zone.heightCm}cm</p>
      </div>
    </div>
  );
}

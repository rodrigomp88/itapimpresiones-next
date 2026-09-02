'use client';

import { useMemo } from 'react';
import { calculateCatalogPrice } from '@/lib/catalog-pricing';
import type { PublicProduct } from '@/lib/public-products';
import type { SettingsValues } from '@/lib/config-schema';
import type { CatalogCustomZone } from '@/components/catalogo/CatalogGarmentVisualizer';
import type { StampingMeasure } from '@/lib/apparel-measures';

export interface PriceResultData {
  unitPrice: number;
  totalPrice: number;
  discountApplied: number;
  stampDims: Record<string, string>;
}

interface UseCatalogPriceOptions {
  color?: string;
  pack: 'PREMIUM' | 'ECO';
  selectedAreas: string[];
  customZones?: CatalogCustomZone[];
  measures: StampingMeasure[];
}

export function useCatalogPrice(
  product: PublicProduct,
  technique: string,
  totalQty: number,
  settings: SettingsValues,
  options: UseCatalogPriceOptions,
): PriceResultData | null {
  return useMemo(() => {
    const result = calculateCatalogPrice(product, technique, totalQty, settings, {
      color: options.color,
      pack: options.pack,
      selectedAreas: options.selectedAreas,
      customZones: options.customZones,
      measures: options.measures,
    });
    if (!result) return null;
    const r = result as Record<string, unknown>;
    const stampDims: Record<string, string> = {};
    for (const s of (r.stamps as Array<Record<string, unknown>> || [])) {
      if (s?.id && s?.width && s?.height) {
        stampDims[s.id as string] = `${Number(s.width).toFixed(0)}x${Number(s.height).toFixed(0)}cm`;
      }
    }
    return {
      unitPrice: (r.finalPrice as number) ?? 0,
      totalPrice: ((r.totalFinal as number) ?? ((r.finalPrice as number) ?? 0) * totalQty),
      discountApplied: (r.discountApplied as number) ?? 0,
      stampDims,
    };
  }, [product, technique, totalQty, settings, options.color, options.pack, options.selectedAreas, options.customZones, options.measures]);
}

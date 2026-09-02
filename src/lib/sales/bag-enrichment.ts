import { getUnifiedBags, type UnifiedBag } from './bag-products';
import type { SettingsValues } from './config-schema';

type FreightLookupFn = (proveedor: string, categoria?: 'bolsas' | 'indumentaria') => number;

/**
 * Enrich raw Firestore bag docs with provider and freight info,
 * then pass through getUnifiedBags() for full conversion.
 */
export function getMergedBags(
  settings: SettingsValues,
  firebaseBags: any[] | undefined,
  bagsLoading: boolean,
  isLoaded: boolean,
  getFleteByProveedor: FreightLookupFn
): UnifiedBag[] {
  if (!isLoaded || bagsLoading || !firebaseBags?.length) {
    return getUnifiedBags(settings);
  }

  const enriched = firebaseBags.map((b) => {
    const proveedor = b.proveedor || (b.code?.includes('-LOC-') ? 'Eco Rodeo' : 'Corbag');
    const flete = getFleteByProveedor(proveedor, 'bolsas');
    return { ...b, proveedor, costoFleteBulto: flete || b.costoFlete || b.costoFleteBulto || 0 };
  });

  const unified = getUnifiedBags(settings, enriched);

  // Prioridad de entrada: locales primero, luego por código
  return [...unified].sort((a, b) => {
    if (a.origen !== b.origen) return a.origen === 'LOCAL' ? -1 : 1;
    return (a.code || '').localeCompare(b.code || '');
  });
}

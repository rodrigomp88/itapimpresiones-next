/**
 * Shared catalog helpers: minimum quantities per technique, preset quantities,
 * and technique descriptions. Used by the public product page.
 */
import type { SettingsValues } from './config-schema';

export const TECHNIQUE_INFO: Record<string, { label: string; description: string }> = {
  'DTF': { label: 'DTF (Direct to Film)', description: 'Impresión digital sobre film transfer. Colores vibrantes, ideal para diseños complejos y fotos. Se plancha sobre la prenda.' },
  'Serigrafía': { label: 'Serigrafía', description: 'Técnica tradicional con tintas y pantallas. Ideal para grandes cantidades y colores planos. Alta durabilidad.' },
  'Sublimación': { label: 'Sublimación', description: 'Tinta que se fusiona con la tela por calor. Colores permanentes, ideal para poliéster y prendas claras.' },
  'Sin Impresión': { label: 'Sin Impresión', description: 'Prenda sin estampado, solo para revender o uso propio.' },
};

export function getMinQuantity(
  productType: 'apparel' | 'bags',
  technique: string,
  settings: Pick<SettingsValues, 'minimosCantidad'> | null | undefined,
): number {
  const minMap = settings?.minimosCantidad;
  if (!minMap) return 1;
  const group = productType === 'bags' ? minMap.bolsas : minMap.indumentaria;
  if (!group) return 1;
  const key = technique
    .toLowerCase()
    .normalize('NFD')
    .split('')
    .filter(ch => ch.charCodeAt(0) < 0x0300 || ch.charCodeAt(0) > 0x036f)
    .join('')
    .replace(/\s+/g, '');
  if (key === 'serigrafia') return group.serigrafia ?? 1;
  if (key === 'dtf') return group.dtf ?? 1;
  if (key === 'sublimado' || key === 'sublimacion') return group.sublimado ?? 1;
  if (key === 'sinimpresion') return group.sinImpresion ?? 1;
  return 1;
}

export function getPresets(
  productType: 'apparel' | 'bags',
  settings: Pick<SettingsValues, 'descuentosPrenda'> | null | undefined,
): number[] {
  void settings;
  return productType === 'bags' ? [200, 500, 1000] : [];
}

type TalleSize = { talle: string; ancho_cm?: number; largo_cm?: number; hombro_cm?: number; manga_cm?: number };

export function formatTalleLabel(size: TalleSize): string {
  const { talle, ancho_cm, largo_cm } = size;
  if (!ancho_cm && !largo_cm) return talle;
  const parts: string[] = [];
  if (ancho_cm) parts.push(String(ancho_cm));
  if (largo_cm) parts.push(String(largo_cm));
  return `${talle} (${parts.join('x')}cm)`;
}

/**
 * PUBLIC CALCULATOR — Cotizador público para el catálogo
 * Delegates to calculateCatalogPrice (same formula as internal budget system).
 * Keeps backward-compatible types for catalog consumers.
 */

import type { PublicProduct } from './public-products';
import { calculateCatalogPrice } from './catalog-pricing';
import { settingsSchema } from './config-schema';
import type { SettingsValues } from './config-schema';

export type PublicSettings = {
  dolar?: number;
  nafta?: number;
  costoMetroLinealDTF?: number;
  anchoUtilDTF?: number;
  largoRolloDTF?: number;
  mermaDTF?: number;
  costoFijoSerigrafiaPrenda?: number;
  coloresIncluidosSerigrafiaPrenda?: number;
  factorDobleFazSerigrafiaPrenda?: number;
  costoBaseSerigrafiaBolsa?: number;
  costoColorAdicionalSerigrafiaBolsa?: number;
  costoViniloPorCm2?: number;
  costoFijoVinilo?: number;
  costoSublimacionPorCm2?: number;
  costoFijoSublimacion?: number;
  costoBordadoBase?: number;
  costoBordadoPorPunto?: number;
  costoTransferPorCm2?: number;
  costoFijoTransfer?: number;
  costoAplicacionDTFExterna?: number;
  margenContadoPrenda?: number;
  margenContadoBolsa?: number;
  comisionVendedorPrenda?: number;
  comisionVendedorBolsa?: number;
  iibb?: number;
  publicidad?: number;
  descuentoCompetitivo?: number;
  descuentosPrenda?: { quantity: number; discount: number }[];
  descuentosBolsa?: { quantity: number; discount: number }[];
  minimosCantidad?: {
    indumentaria: { serigrafia: number; dtf: number; sublimado: number; sinImpresion: number };
    bolsas: { serigrafia: number; dtf: number; sublimado: number; sinImpresion: number };
  };
  costoPackPremium?: number;
  costoPackECO?: number;
  valorHoraPrenda?: number;
  prendasPorHora?: number;
  valorHoraBolsa?: number;
  unidadesPorHoraBolsa?: number;
  [key: string]: any;
};

export type CalculatorInput = {
  product: PublicProduct;
  technique: string;
  size?: string;
  color?: string;
  quantity: number;
  quantityBySize?: Record<string, number>;
  pack?: 'ECO' | 'PREMIUM';
  selectedAreas?: string[];
  customZones?: Array<{ id: string; name: string; side: 'front' | 'back'; widthCm: number; heightCm: number; xPercent?: number; yPercent?: number }>;
  measures?: import('./apparel-measures').StampingMeasure[];
  // DTF
  dtfAncho?: number;
  dtfAlto?: number;
  // Serigrafía
  cantidadColores?: number;
  dobleFaz?: boolean;
  // Vinilo
  viniloColores?: number;
  // Sublimación
  sublimacionZona?: 'frente' | 'dorso' | 'ambas';
  // Bordado
  bordadoPuntos?: number;
  // Transfer
  transferAncho?: number;
  transferAlto?: number;
};

export type CalculatorResult = {
  unitPrice: number;
  totalPrice: number;
  baseCost: number;
  techniqueCost: number;
  totalQuantity: number;
  discountApplied: number;
  breakdown: {
    material: number;
    technique: number;
    pack: number;
    overhead: number;
    margin: number;
  };
};

export function publicCalculatePrice(
  input: CalculatorInput,
  settings: SettingsValues | Record<string, any>
): CalculatorResult | null {
  const { product, technique, quantity, pack } = input;
  if (!product || quantity < 1) return null;

  let parsedSettings: SettingsValues;
  if (settings && 'margenContadoPrenda' in settings) {
    parsedSettings = settings as SettingsValues;
  } else {
    const result = settingsSchema.safeParse(settings);
    if (!result.success) return null;
    parsedSettings = result.data;
  }

  const priceResult = calculateCatalogPrice(product, technique, quantity, parsedSettings, {
    color: input.color,
    pack: pack || 'ECO',
    selectedAreas: input.selectedAreas,
    customZones: input.customZones,
    cantidadColores: input.cantidadColores,
    dtfAncho: input.dtfAncho,
    dtfAlto: input.dtfAlto,
    dobleFaz: input.dobleFaz,
    viniloColores: input.viniloColores,
    sublimacionZona: input.sublimacionZona,
    bordadoPuntos: input.bordadoPuntos,
    transferAncho: input.transferAncho,
    transferAlto: input.transferAlto,
    measures: input.measures,
  });

  if (!priceResult) return null;

  const r = priceResult as Record<string, any>;
  const unitPrice: number = r.unitPrice ?? r.finalPrice ?? 0;
  const baseCost: number = r.baseCost ?? r.costs?.base ?? 0;
  const techniqueCost: number = r.techniqueCost ?? r.costs?.impresion ?? 0;

  return {
    unitPrice,
    totalPrice: unitPrice * quantity,
    baseCost,
    techniqueCost,
    totalQuantity: quantity,
    discountApplied: r.discountApplied ?? 0,
    breakdown: {
      material: baseCost,
      technique: techniqueCost,
      pack: 0,
      overhead: 0,
      margin: 0,
    },
  };
}

export function getAvailableTechniques(product: PublicProduct): string[] {
  const supported = new Set(['DTF', 'DTF textil', 'Serigrafía', 'Serigrafia', 'Sin Impresión']);
  const configured = product.tipoImpresion?.filter(technique => supported.has(technique)) || [];
  return configured.length > 0 ? [...new Set(configured.map(technique => technique === 'DTF textil' ? 'DTF' : technique === 'Serigrafia' ? 'Serigrafía' : technique))] : ['DTF', 'Serigrafía', 'Sin Impresión'];
}



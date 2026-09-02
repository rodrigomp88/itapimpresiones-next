/**
 * CATALOG PRICING ADAPTERS
 * ========================
 * Converts PublicProduct (catalog API type) to internal types used by
 * calculateApparelPrice and calculateBagPrice, so the catalog can compute
 * prices with the exact same formula as the internal budget system.
 */

import type { PublicProduct } from './public-products';
import type { SettingsValues } from './config-schema';
import type { ApparelProduct, ProductStatus } from './types';
import type { UnifiedBag, BagProduct } from './bag-products';
import { calculateUnifiedBag } from './bag-products';
import type { ApparelFormValues, CustomStampZone } from './apparel-pricer-logic';
import { calculateApparelPrice } from './apparel-pricer-logic';
import type { BagFormValues } from './bag-pricer-logic';
import { calculateBagPrice } from './bag-pricer-logic';
import { apparelMeasures as staticMeasures } from './apparel-measures';
import type { VisualType } from './apparel-measures';

// ── Adapters ────────────────────────────────────────────────────────────────

/**
 * Converts a PublicProduct (apparel) to the internal ApparelProduct type
 * expected by calculateApparelPrice.
 */
export function adaptPublicProductToApparel(product: PublicProduct): ApparelProduct {
  return {
    code: product.code,
    producto: product.producto || product.nombreDisplay || product.material || '',
    proveedor: product.proveedor || '',
    costoLista: product.costoLista,
    costoFleteBulto: product.costoFleteBulto ?? 0,
    unidadesPorBulto: product.unidBulto ?? 1,
    sizes: product.sizes || [],
    colors: product.colors || [],
    estado: (product.estado as ProductStatus) || 'activo',
    validZones: product.validZones,
    visualType: product.visualType as ApparelProduct['visualType'],
    imagenUrl: product.imagenUrl,
    composicion: product.composicion,
    caracteristicas_tela: product.caracteristicas_tela,
    uso_recomendado: product.uso_recomendado,
    cuidado: product.cuidado,
    medidas_nota: product.medidas_nota,
    familia_cuidados: product.familia_cuidados,
    esCore: product.esCore,
  };
}

/**
 * Converts a PublicProduct (bag) to a UnifiedBag by computing costoFinal
 * and logisticaUnitaria using the SAME formula as calculateUnifiedBag
 * in bag-products.ts.
 */
export function adaptPublicProductToBag(
  product: PublicProduct,
  settings: SettingsValues,
): UnifiedBag {
  // Build the minimal BagProduct shape that calculateUnifiedBag expects
  const isLocal = product.origen === 'LOCAL' || !product.origen;

  const bagProductInput: Omit<BagProduct, 'code' | 'moneda' | 'origen'> = {
    material: product.material || '',
    medidas: product.medida || '',
    manija: (product as Record<string, unknown>).manija as string || '',
    tipoManija: (product.tipoManija as 'TIRAS' | 'RIÑON') || 'TIRAS',
    colors: product.colors || [],
    gramaje: (product as Record<string, unknown>).gramaje as number || 80,
    precioLista: product.precioLista || product.costoLista,
    unidBulto: product.unidBulto ?? 1,
    proveedor: product.proveedor || undefined,
    costoFleteBulto: product.costoFleteBulto ?? undefined,
  };

  const origen: 'LOCAL' | 'TRANSPORTE' = isLocal ? 'LOCAL' : 'TRANSPORTE';
  return calculateUnifiedBag(bagProductInput, settings, origen);
}

// ── Main pricing function ───────────────────────────────────────────────────

export interface CatalogPriceOptions {
  color?: string;
  pack?: 'ECO' | 'PREMIUM';
  modalidadPago?: 'Contado' | 'MercadoLibre';
  selectedAreas?: string[];
  customZones?: Array<{
    id: string;
    name: string;
    side: 'front' | 'back';
    widthCm: number;
    heightCm: number;
    xPercent?: number;
    yPercent?: number;
  }>;
  cantidadColores?: number;
  dtfAncho?: number;
  dtfAlto?: number;
  dobleFaz?: boolean;
  coloresIncluidosSerigrafiaPrenda?: number;
  factorDobleFazSerigrafiaPrenda?: number;
  viniloColores?: number;
  sublimacionZona?: 'frente' | 'dorso' | 'ambas';
  bordadoPuntos?: number;
  transferAncho?: number;
  transferAlto?: number;
  /** Stamping measures (from Firestore config) — falls back to static defaults. */
  measures?: import('./apparel-measures').StampingMeasure[];
}

/**
 * Calculates the catalog price for any product using the exact same formula
 * as the internal budget calculators.
 *
 * @returns The pricing result object, or null if the input is invalid.
 */
export function calculateCatalogPrice(
  product: PublicProduct,
  technique: string,
  quantity: number,
  settings: SettingsValues,
  options?: CatalogPriceOptions,
) {
  if (quantity < 1) return null;

  if (product.type === 'apparel') {
    return calculateApparelCatalogPrice(product, technique, quantity, settings, options);
  }
  if (product.type === 'bags') {
    return calculateBagCatalogPrice(product, technique, quantity, settings, options);
  }
  return null;
}

// ── Internal helpers ────────────────────────────────────────────────────────

function calculateApparelCatalogPrice(
  product: PublicProduct,
  technique: string,
  quantity: number,
  settings: SettingsValues,
  options?: CatalogPriceOptions,
) {
  const apparelProduct = adaptPublicProductToApparel(product);

  const firstSize = product.sizes?.[0]?.talle || 'M';

  const stamps: ApparelFormValues['stamps'] = {
    fullFront: false,
    fullBack: false,
    centroPecho: false,
    pechoIzqLogo: false,
    mangaCorta: false,
    backCollar: false,
    gorraFrente: false,
    gorraLateral: false,
    gorraPosterior: false,
  };

  if (options?.selectedAreas) {
    for (const area of options.selectedAreas) {
      if (area in stamps) {
        (stamps as Record<string, boolean>)[area] = true;
      }
    }
  }

  const customZones: CustomStampZone[] = (options?.customZones || []).map(z => ({
    id: z.id,
    name: z.name,
    side: z.side,
    widthCm: z.widthCm,
    heightCm: z.heightCm,
    xPercent: z.xPercent ?? 50,
    yPercent: z.yPercent ?? 50,
  }));

  const formValues: ApparelFormValues = {
    productId: product.id,
    talle: firstSize,
    color: options?.color || product.colors?.[0] || '',
    quantity,
    pack: options?.pack || 'ECO',
    tipoImpresion: technique as ApparelFormValues['tipoImpresion'],
    visualType: product.visualType as VisualType | undefined,
    modalidadPago: options?.modalidadPago || 'Contado',
    stamps,
    customZones,
    quantityBySize: { [firstSize]: quantity },
    dobleFaz: options?.dobleFaz,
    coloresIncluidosSerigrafiaPrenda: options?.coloresIncluidosSerigrafiaPrenda,
    factorDobleFazSerigrafiaPrenda: options?.factorDobleFazSerigrafiaPrenda,
    viniloColores: options?.viniloColores,
    sublimacionZona: options?.sublimacionZona,
    bordadoPuntos: options?.bordadoPuntos,
    transferAncho: options?.transferAncho,
    transferAlto: options?.transferAlto,
  };

  return calculateApparelPrice(formValues, apparelProduct, settings, null, options?.measures || staticMeasures);
}

function calculateBagCatalogPrice(
  product: PublicProduct,
  technique: string,
  quantity: number,
  settings: SettingsValues,
  options?: CatalogPriceOptions,
) {
  const unifiedBag = adaptPublicProductToBag(product, settings);

  const formValues: BagFormValues = {
    origen: product.proveedor || (product.origen === 'LOCAL' || !product.origen ? 'LOCAL' : 'TRANSPORTE'),
    tipoManija: (product.tipoManija as 'TIRAS' | 'RIÑON') || 'TIRAS',
    medida: product.medida || '',
    color: options?.color || product.colors?.[0] || '',
    modalidadPago: options?.modalidadPago === 'MercadoLibre' ? 'MERCADOLIBRE' : 'CONTADO',
    tipoImpresion: technique as BagFormValues['tipoImpresion'],
    cantidadColores: options?.cantidadColores || 1,
    dtfAncho: options?.dtfAncho || 20,
    dtfAlto: options?.dtfAlto || 25,
    dobleFaz: options?.dobleFaz || false,
    viniloColores: options?.viniloColores,
    sublimacionZona: options?.sublimacionZona,
    quantity,
  };

  return calculateBagPrice(formValues, unifiedBag, settings, null);
}

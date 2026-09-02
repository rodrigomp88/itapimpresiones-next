export type VisualType =
  | 'tshirt'
  | 'cap'
  | 'hoodie-rn'
  | 'hoodie-hood'
  | 'jacket-hood'
  | 'jacket-nohood'
  | 'polo'
  | 'tank-top'
  | 'long-sleeve'
  | 'pants';

export type ZoneId =
  | 'fullFront'
  | 'fullBack'
  | 'centroPecho'
  | 'pechoIzqLogo'
  | 'mangaCorta'
  | 'backCollar'
  | 'gorraFrente'
  | 'gorraLateral'
  | 'gorraPosterior';

export type ZoneSide = 'front' | 'back';

export type SizeCategoryId =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | '2XL'
  | '3XL'
  | '4XL'
  | '4'
  | '6'
  | '8'
  | '10'
  | '12'
  | '14'
  | '16'
  | 'ADUL'
  | '3niños'
  | '18';

export type SizeCategory = {
  id: SizeCategoryId;
  name: string;
  order: number;
  bodyWidthCm?: number;
  bodyLengthCm?: number;
};

export type Zone = {
  id: ZoneId;
  name: string;
  side: ZoneSide;
  defaultWidthRatio: number;
  defaultHeightRatio: number;
  isActive: boolean;
};

export type VisualTypeConfig = {
  id: VisualType;
  name: string;
  isActive: boolean;
  zoneRatios: Partial<Record<ZoneId, { wr: number; hr: number }>>;
};

export type StampingMeasure = {
  talle: SizeCategoryId;
  zoneId: ZoneId;
  visualType: VisualType;
  width: number;
  height: number;
  area: number;
  productCode?: string;
};

// Backward-compatible alias
export type ApparelMeasure = StampingMeasure;

// ---------------------------------------------------------------------------
// DEFAULT config values - used when Firestore config not yet loaded
// ---------------------------------------------------------------------------

export const DEFAULT_SIZE_CATEGORIES: SizeCategory[] = [
  { id: 'XS', name: 'XS', order: 1, bodyWidthCm: 35, bodyLengthCm: 55 },
  { id: 'S', name: 'S', order: 2, bodyWidthCm: 40, bodyLengthCm: 60 },
  { id: 'M', name: 'M', order: 3, bodyWidthCm: 45, bodyLengthCm: 65 },
  { id: 'L', name: 'L', order: 4, bodyWidthCm: 50, bodyLengthCm: 70 },
  { id: 'XL', name: 'XL', order: 5, bodyWidthCm: 55, bodyLengthCm: 75 },
  { id: '2XL', name: '2XL', order: 6, bodyWidthCm: 60, bodyLengthCm: 80 },
  { id: '3XL', name: '3XL', order: 7, bodyWidthCm: 65, bodyLengthCm: 85 },
  { id: '4XL', name: '4XL', order: 8, bodyWidthCm: 70, bodyLengthCm: 90 },
  { id: '4', name: '4', order: 9, bodyWidthCm: 35, bodyLengthCm: 50 },
  { id: '6', name: '6', order: 10, bodyWidthCm: 38, bodyLengthCm: 55 },
  { id: '8', name: '8', order: 11, bodyWidthCm: 40, bodyLengthCm: 58 },
  { id: '10', name: '10', order: 12, bodyWidthCm: 42, bodyLengthCm: 60 },
  { id: '12', name: '12', order: 13, bodyWidthCm: 44, bodyLengthCm: 62 },
  { id: '14', name: '14', order: 14, bodyWidthCm: 46, bodyLengthCm: 64 },
  { id: '16', name: '16', order: 15, bodyWidthCm: 48, bodyLengthCm: 66 },
  { id: 'ADUL', name: 'Adul', order: 16, bodyWidthCm: 50, bodyLengthCm: 70 },
  { id: '3niños', name: '3niños', order: 17, bodyWidthCm: 30, bodyLengthCm: 45 },
  { id: '18', name: '18', order: 18, bodyWidthCm: 55, bodyLengthCm: 75 },
];

export const DEFAULT_ZONES: Zone[] = [
  { id: 'fullFront', name: 'Full Front', side: 'front', defaultWidthRatio: 0.53, defaultHeightRatio: 0.53, isActive: true },
  { id: 'fullBack', name: 'Full Back', side: 'back', defaultWidthRatio: 0.53, defaultHeightRatio: 0.53, isActive: true },
  { id: 'centroPecho', name: 'Centro Pecho', side: 'front', defaultWidthRatio: 0.53, defaultHeightRatio: 0.31, isActive: true },
  { id: 'pechoIzqLogo', name: 'Pecho Izq / Logo', side: 'front', defaultWidthRatio: 0.20, defaultHeightRatio: 0.20, isActive: true },
  { id: 'mangaCorta', name: 'Manga Corta', side: 'front', defaultWidthRatio: 0.17, defaultHeightRatio: 0.19, isActive: true },
  { id: 'backCollar', name: 'Back Collar / Cuello atrás', side: 'back', defaultWidthRatio: 0.12, defaultHeightRatio: 0.12, isActive: true },
  { id: 'gorraFrente', name: 'Frente Gorra', side: 'front', defaultWidthRatio: 0.20, defaultHeightRatio: 0.071, isActive: true },
  { id: 'gorraLateral', name: 'Lateral Gorra', side: 'front', defaultWidthRatio: 0.20, defaultHeightRatio: 0.043, isActive: true },
  { id: 'gorraPosterior', name: 'Posterior Gorra', side: 'back', defaultWidthRatio: 0.20, defaultHeightRatio: 0.043, isActive: true },
];

export const DEFAULT_VISUAL_TYPES: VisualTypeConfig[] = [
  { id: 'tshirt', name: 'Remera', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.53, hr: 0.53 },
    'fullBack': { wr: 0.53, hr: 0.53 },
    'centroPecho': { wr: 0.53, hr: 0.31 },
    'pechoIzqLogo': { wr: 0.20, hr: 0.20 },
    'mangaCorta': { wr: 0.17, hr: 0.19 },
    'backCollar': { wr: 0.12, hr: 0.12 },
  }},
  { id: 'cap', name: 'Gorra', isActive: true, zoneRatios: {
    'gorraFrente': { wr: 0.20, hr: 0.071 },
    'gorraLateral': { wr: 0.20, hr: 0.043 },
    'gorraPosterior': { wr: 0.20, hr: 0.043 },
  }},
  { id: 'hoodie-rn', name: 'Buzo sin Capucha', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.50, hr: 0.48 },
    'fullBack': { wr: 0.50, hr: 0.48 },
    'centroPecho': { wr: 0.50, hr: 0.29 },
    'pechoIzqLogo': { wr: 0.19, hr: 0.19 },
    'mangaCorta': { wr: 0.16, hr: 0.18 },
    'backCollar': { wr: 0.11, hr: 0.11 },
  }},
  { id: 'hoodie-hood', name: 'Buzo con Capucha', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.48, hr: 0.45 },
    'fullBack': { wr: 0.48, hr: 0.45 },
    'centroPecho': { wr: 0.48, hr: 0.27 },
    'pechoIzqLogo': { wr: 0.18, hr: 0.18 },
    'mangaCorta': { wr: 0.15, hr: 0.17 },
    'backCollar': { wr: 0.10, hr: 0.10 },
  }},
  { id: 'jacket-hood', name: 'Campera con Capucha', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.45, hr: 0.42 },
    'fullBack': { wr: 0.45, hr: 0.42 },
    'centroPecho': { wr: 0.45, hr: 0.26 },
    'pechoIzqLogo': { wr: 0.17, hr: 0.17 },
    'mangaCorta': { wr: 0.14, hr: 0.16 },
    'backCollar': { wr: 0.10, hr: 0.10 },
  }},
  { id: 'jacket-nohood', name: 'Campera sin Capucha', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.46, hr: 0.43 },
    'fullBack': { wr: 0.46, hr: 0.43 },
    'centroPecho': { wr: 0.46, hr: 0.27 },
    'pechoIzqLogo': { wr: 0.17, hr: 0.17 },
    'mangaCorta': { wr: 0.14, hr: 0.16 },
    'backCollar': { wr: 0.10, hr: 0.10 },
  }},
  { id: 'polo', name: 'Chomba/Polo', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.48, hr: 0.48 },
    'fullBack': { wr: 0.48, hr: 0.48 },
    'centroPecho': { wr: 0.48, hr: 0.28 },
    'pechoIzqLogo': { wr: 0.18, hr: 0.18 },
    'mangaCorta': { wr: 0.15, hr: 0.17 },
    'backCollar': { wr: 0.10, hr: 0.10 },
  }},
  { id: 'tank-top', name: 'Musculosa/Tank', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.55, hr: 0.40 },
    'fullBack': { wr: 0.55, hr: 0.40 },
    'centroPecho': { wr: 0.55, hr: 0.24 },
    'pechoIzqLogo': { wr: 0.20, hr: 0.20 },
    'backCollar': { wr: 0.12, hr: 0.12 },
  }},
  { id: 'long-sleeve', name: 'Manga Larga', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.53, hr: 0.53 },
    'fullBack': { wr: 0.53, hr: 0.53 },
    'centroPecho': { wr: 0.53, hr: 0.31 },
    'pechoIzqLogo': { wr: 0.20, hr: 0.20 },
    'mangaCorta': { wr: 0.17, hr: 0.19 },
    'backCollar': { wr: 0.12, hr: 0.12 },
  }},
  { id: 'pants', name: 'Pantalón', isActive: true, zoneRatios: {
    'fullFront': { wr: 0.60, hr: 0.30 },
    'fullBack': { wr: 0.60, hr: 0.30 },
    'centroPecho': { wr: 0.55, hr: 0.25 },
    'pechoIzqLogo': { wr: 0.20, hr: 0.15 },
    'backCollar': { wr: 0.12, hr: 0.12 },
  }},
];

// Backward-compatible default measures array - computed from default config ratios.
// Used as fallback when no Firestore measures are provided.
export const apparelMeasures: StampingMeasure[] = buildMeasuresFromConfig({
  sizeCategories: DEFAULT_SIZE_CATEGORIES,
  zones: DEFAULT_ZONES,
  visualTypes: DEFAULT_VISUAL_TYPES,
});

/**
 * Builds the full StampingMeasure matrix from a stamping config
 * (sizeCategories + zones + visualTypes), matching the logic used by
 * useStampingMeasures. Shared between the internal cotizador and the
 * public catalog so both price with the same dimensions.
 */
export function buildMeasuresFromConfig(config: {
  sizeCategories: SizeCategory[];
  zones: Zone[];
  visualTypes: VisualTypeConfig[];
}): StampingMeasure[] {
  const { sizeCategories, zones, visualTypes } = config;
  return visualTypes.reduce<StampingMeasure[]>((acc, vt) => {
    if (!vt.isActive) return acc;
    zones.forEach(zone => {
      if (!zone.isActive) return;
      sizeCategories.forEach(sc => {
        const ratios = vt.zoneRatios[zone.id];
        if (!ratios) return;
        const ancho = sc.bodyWidthCm || 50;
        const largo = sc.bodyLengthCm || 60;
        const width = Math.round(ancho * ratios.wr * 10) / 10;
        const height = Math.round(largo * ratios.hr * 10) / 10;
        const area = Math.round(width * height * 100) / 100;
        acc.push({
          talle: sc.id,
          zoneId: zone.id,
          visualType: vt.id,
          width,
          height,
          area,
        });
      });
    });
    return acc;
  }, []);
}

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getSizeCategory(id: SizeCategoryId | string): SizeCategory {
  return DEFAULT_SIZE_CATEGORIES.find(sc => sc.id === id) || { id: 'M' as SizeCategoryId, name: 'M', order: 3 };
}

export function getZone(id: ZoneId | string): Zone {
  return DEFAULT_ZONES.find(z => z.id === id) || { id: 'fullFront', name: 'Full Front', side: 'front', defaultWidthRatio: 0.53, defaultHeightRatio: 0.53, isActive: true };
}

export function getVisualTypeConfig(id: VisualType | string): VisualTypeConfig {
  return DEFAULT_VISUAL_TYPES.find(vt => vt.id === id) || { id: 'tshirt', name: 'Remera', isActive: true, zoneRatios: {} };
}

export function calculateMeasureFromRatios(
  visualType: VisualType,
  zoneId: ZoneId,
  sizeCategory: SizeCategory,
): { width: number; height: number; area: number } | null {
  const visualTypes = getVisualTypeConfig(visualType);
  if (!visualTypes) return null;

  const ratios = visualTypes.zoneRatios[zoneId];
  if (!ratios) return null;

  const ancho = sizeCategory.bodyWidthCm || 50;
  const largo = sizeCategory.bodyLengthCm || 60;

  const width = Math.round(ancho * ratios.wr * 10) / 10;
  const height = Math.round(largo * ratios.hr * 10) / 10;
  const area = Math.round(width * height * 100) / 100;

  return { width, height, area };
}

export function findMeasure(
  measures: StampingMeasure[],
  visualType: VisualType,
  zoneId: ZoneId,
  talle: SizeCategoryId,
  productCode?: string,
): StampingMeasure | undefined {
  if (productCode) {
    const specific = measures.find(
      (m) =>
        m.productCode === productCode &&
        m.visualType === visualType &&
        m.zoneId === zoneId &&
        m.talle === talle,
    );
    if (specific) return specific;
  }
  const generic = measures.find(
    (m) =>
      !m.productCode &&
      m.visualType === visualType &&
      m.zoneId === zoneId &&
      m.talle === talle,
  );
  if (generic) return generic;

  // Fallback: compute from ratios
  const computed = calculateMeasureFromRatios(visualType, zoneId, getSizeCategory(talle));
  if (computed) {
    return {
      talle,
      zoneId,
      visualType,
      width: computed.width,
      height: computed.height,
      area: computed.area,
    };
  }

  return undefined;
}

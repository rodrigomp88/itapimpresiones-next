import type { SettingsValues } from "./config-schema";
import type { BagProduct } from './types';
export type { BagProduct };

export const bolsaProductsLocal: Omit<BagProduct, 'origen' | 'moneda' | 'code'>[] = [
    { material: 'Friselina', medidas: '20 x 30', manija: '42cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 143.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '20 x 40', manija: '42cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 183.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '30 x 30', manija: '42cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 206.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '30 x 40', manija: '42cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 240.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '35 x 40', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 259.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '45 x 40', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 296.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '50 x 40', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 315.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '60 x 40', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 354.00, unidBulto: 1 },
    { material: 'Friselina', medidas: '60 x 50', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 676.00, unidBulto: 1 },
];

export const bolsaProductsImportado: Omit<BagProduct, 'origen' | 'moneda' | 'code'>[] = [
    // TIRAS
    { material: 'Friselina', medidas: '30x30', manija: '42cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.17, unidBulto: 1000 },
    { material: 'Friselina', medidas: '30x35', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.18, unidBulto: 1000 },
    { material: 'Friselina', medidas: '30x45', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.22, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x30x10', manija: '42cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.20, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x35x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.22, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x40x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.23, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x45x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.25, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x50x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.27, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x55x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.29, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x60x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.31, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x65x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.33, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x70x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.35, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x75x10', manija: '50cm', tipoManija: 'TIRAS', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.38, unidBulto: 1000 },
    // RIÑON
    { material: 'Friselina', medidas: '25x17.5', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.08, unidBulto: 1500 },
    { material: 'Friselina', medidas: 'AUTO', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.08, unidBulto: 1500 },
    { material: 'Friselina', medidas: '30x20', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.11, unidBulto: 1200 },
    { material: 'Friselina', medidas: '30x25', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.12, unidBulto: 1200 },
    { material: 'Friselina', medidas: '30x30', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.13, unidBulto: 1000 },
    { material: 'Friselina', medidas: '30x35', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.14, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x17.5x10', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.12, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x20x10', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.13, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x25x10', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.14, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x30x10', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.16, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x35x10', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.18, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x40x10', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.20, unidBulto: 1000 },
    { material: 'Friselina', medidas: '40x45x10', manija: 'RIÑON', tipoManija: 'RIÑON', colors: ['Blanco', 'Beige', 'Negro'], gramaje: 80, precioLista: 0.22, unidBulto: 1000 },
];

// Separate business logic from static data
export function calculateUnifiedBag(product: Omit<BagProduct, 'code' | 'moneda' | 'origen'>, settings: SettingsValues, origen: 'LOCAL' | 'TRANSPORTE'): UnifiedBag {
    const ivaCompras = 1; // as per doc C5, this is a factor not a percentage.
    const mermaFactor = settings.mermaBolsa ?? 1.03;

    // Determine moneda from origen
    const moneda: 'ARS' | 'USD' = origen === 'LOCAL' ? 'ARS' : 'USD';

    let precioBaseArs: number;

    if (moneda === 'USD') {
        precioBaseArs = product.precioLista * settings.dolar * ivaCompras;
    } else {
        precioBaseArs = product.precioLista;
    }

    const costoFinal = precioBaseArs * mermaFactor;
    
    // Transporte por proveedor (dinámico) y logística local
    const isLocal = origen === 'LOCAL';
    const providerName = product.proveedor || (isLocal ? 'Eco Rodeo' : 'Corbag');
    const providerFreightTotal = product.costoFleteBulto ?? PROVIDER_FREIGHT[providerName] ?? 0;
    const fleteProveedorUnit = providerFreightTotal > 0 ? providerFreightTotal / (product.unidBulto || 1) : 0;

    const costoTotalLogisticaLocalMensual = ((settings.kmRecorridoLocal * settings.viajesAlMes) / settings.consumoAuto) * settings.nafta * (1 + settings.amortizacionAuto);
    const logisticaLocalUnitaria = settings.produccionEstimadaBolsas > 0 ? costoTotalLogisticaLocalMensual / settings.produccionEstimadaBolsas : 0;

    const logisticaUnitaria = fleteProveedorUnit + logisticaLocalUnitaria;
    const proveedorActual = providerName;
    const costoFleteBulto = providerFreightTotal;
    
    return {
        code: generateCode(product, origen),
        origen,
        material: product.material,
        medida: product.medidas,
        manija: product.manija,
        tipoManija: product.tipoManija,
        colors: product.colors,
        gramaje: product.gramaje,
        precioLista: product.precioLista,
        moneda,
        unidBulto: product.unidBulto,
        costoFinal,
        logisticaUnitaria,
        proveedor: proveedorActual,
        costoFleteBulto: costoFleteBulto,
        estado: product.estado,
    };
}

export const bolsaProducts: BagProduct[] = [
    ...bolsaProductsLocal.map(p => ({ ...p, origen: 'LOCAL' as const, moneda: 'ARS' as const, code: generateCode(p, 'LOCAL'), esCore: true })),
    ...bolsaProductsImportado.map(p => ({ ...p, origen: 'TRANSPORTE' as const, moneda: 'USD' as const, code: generateCode(p, 'TRANSPORTE'), esCore: true })),
];

export function getUnifiedBags(settings: SettingsValues, customProducts?: any[]): UnifiedBag[] {
    // Usar productos personalizados si se proporcionan, sino los locales
    const productsToUse = customProducts && customProducts.length > 0 
        ? customProducts.map((p: any) => ({
            code: p.code || '',
            origen: p.origen || 'LOCAL',
            material: p.material || '',
            medidas: p.medida || p.medidas || '',
            manija: p.manija || '',
            tipoManija: p.tipoManija || 'TIRAS',
            colors: p.colors || p.colores || [],
            gramaje: p.gramaje || 80,
            precioLista: p.precioLista || p.costoLista || 0,
            moneda: p.moneda || 'ARS',
            unidBulto: p.unidBulto || 1,
            proveedor: p.proveedor || '',
            costoFleteBulto: p.costoFleteBulto ?? (p.costoFlete || 0),
        }))
        : bolsaProducts;

    return productsToUse.map((p: any) => calculateUnifiedBag(p, settings, p.origen));
}

export type UnifiedBag = {
    code: string;
    origen: 'LOCAL' | 'TRANSPORTE';
    material: string;
    medida: string;
    manija: string;
    tipoManija: 'TIRAS' | 'RIÑON';
    colors: string[];
    gramaje: number;
    precioLista: number;
    moneda: 'ARS' | 'USD';
    unidBulto: number;
    costoFinal: number;
    logisticaUnitaria: number;
    proveedor?: string;
    costoFleteBulto?: number;
    estado?: string;
}

function generateCode(product: Omit<BagProduct, 'code' | 'moneda' | 'origen' | 'color' | 'colors'>, origen: 'LOCAL' | 'TRANSPORTE'): string {
    const type = 'BOL';
    const origin = origen === 'LOCAL' ? 'LOC' : 'IMP';
    const measure = product.medidas.replace(/\s/g, '').toUpperCase().replace(/X/g, 'x');
    const handle = product.tipoManija === 'TIRAS' ? 'TIR' : 'RIN';
    return `${type}-${origin}-${measure}-${handle}`;
}

const PROVIDER_FREIGHT: Record<string, number> = {
  'Eco Rodeo': 0,
  'Corbag': 68000,
  'GEIN TEXTIL': 0,
  'DANITEX': 20000,
};
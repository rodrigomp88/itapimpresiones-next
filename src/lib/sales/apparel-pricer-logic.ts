// src/lib/apparel-pricer-logic.ts
import type { SettingsValues } from './config-schema';
import type { ApparelProduct } from './types';
import type { ApparelMeasure, VisualType, ZoneId, SizeCategoryId } from './apparel-measures';
import { apparelMeasures as staticMeasures, findMeasure } from './apparel-measures';
import { stampingZones } from '@/components/apparel/stamping-zones';

// Cap stamp dimensions are FIXED (not calculated from body ratios)
export const CAP_ZONE_DIMENSIONS: Record<string, { width: number; height: number }> = {
    gorraFrente: { width: 10, height: 5 },
    gorraLateral: { width: 10, height: 3 },
    gorraPosterior: { width: 10, height: 3 },
};

export function getStampDimensions(
    visualType: VisualType,
    zoneId: ZoneId,
    measures: ApparelMeasure[],
    talle: SizeCategoryId,
    productCode?: string,
): { width: number; height: number; area: number } {
    if (visualType === 'cap' && CAP_ZONE_DIMENSIONS[zoneId]) {
        const dim = CAP_ZONE_DIMENSIONS[zoneId];
        return { width: dim.width, height: dim.height, area: dim.width * dim.height };
    }
    const found = findMeasure(measures, visualType, zoneId, talle, productCode);
    if (found) return { width: found.width, height: found.height, area: found.area };
    return { width: 0, height: 0, area: 0 };
}

export type CustomStampZone = {
    id: string;
    name: string;
    side: 'front' | 'back';
    widthCm: number;
    heightCm: number;
    xPercent: number;
    yPercent: number;
};

export type ApparelFormValues = {
    productId: string;
    talle: string;
    color: string;
    quantity: number;
    pack: 'ECO' | 'PREMIUM';
    tipoImpresion: 'DTF' | 'Serigrafía' | 'Vinilo' | 'Sublimación' | 'Bordado' | 'Transfer' | 'Sin Impresión';
    visualType?: VisualType;
    modalidadPago: 'Contado' | 'MercadoLibre';
    stamps: {
        fullFront: boolean;
        fullBack: boolean;
        centroPecho: boolean;
        pechoIzqLogo: boolean;
        mangaCorta: boolean;
        backCollar: boolean;
        gorraFrente: boolean;
        gorraLateral: boolean;
        gorraPosterior: boolean;
    };
    customZones: CustomStampZone[];
    quantityBySize: Record<string, number>;
    dobleFaz?: boolean;
    coloresIncluidosSerigrafiaPrenda?: number;
    factorDobleFazSerigrafiaPrenda?: number;
    viniloColores?: number;
    sublimacionZona?: 'frente' | 'dorso' | 'ambas';
    bordadoPuntos?: number;
    transferAncho?: number;
    transferAlto?: number;
};

/**
 * Calculates the price from the total cost, applying margin and commercial rates.
 * This is the core pricing formula.
 * @param totalCost - The complete cost of one unit.
 * @param margin - The desired profit margin (e.g., 0.4 for 40%).
 * @param commercialCostsRate - The sum of all commercial cost rates (e.g., IIBB + Ads).
 * @returns The final calculated price for the customer.
 */
const calculatePriceFromCost = (totalCost: number, margin: number, commercialCostsRate: number) => {
    const priceWithMargin = totalCost * (1 + margin);
    // The final price must cover the price with margin AND the commercial costs that are calculated ON the final price.
    // So, Price = PriceWithMargin + Price * CommercialRate
    // Price - Price * CommercialRate = PriceWithMargin
    // Price * (1 - CommercialRate) = PriceWithMargin
    // Price = PriceWithMargin / (1 - CommercialRate)
    const divisor = 1 - commercialCostsRate;
    if (divisor <= 0) {
        // Failsafe to prevent division by zero or negative results if commercial rates exceed 100%.
        return priceWithMargin * 2; 
    }
    return priceWithMargin / divisor;
};

/**
 * Rounds a price to the nearest hundred for price lists (so volume discounts are visible).
 * @param price - The price to round.
 * @returns The rounded price.
 */
const roundPrice = (price: number) => {
    return Math.ceil(price / 100) * 100;
}

export function isSmallSerigraphyArea(width: number, height: number): boolean {
    return Math.round(width) <= 10 && Math.round(height) <= 10;
}

export function calculateApparelPrice(
    values: ApparelFormValues,
    product: ApparelProduct | undefined,
    settings: SettingsValues,
    validationMessage: string | null,
    measures: ApparelMeasure[] = staticMeasures
) {
    // --- 0. INITIAL VALIDATION ---
    if (!product || !values.talle || values.quantity < 1 || validationMessage) return null;

    const { talle, pack, tipoImpresion, stamps, modalidadPago, customZones, quantity } = values;

    // Determine the applicable tier for discounts
    const applicableTier = settings.descuentosPrendaHabilitados
      ? (settings.descuentosPrenda || []).filter(d => quantity >= d.quantity).pop()
      : null;
    const discountRate = applicableTier ? applicableTier.discount : 0;
    
    // The seller commission is a fixed percentage defined in the settings, reduced by volume discounts
    const commissionReduction = applicableTier?.commissionReduction ?? 0;
    const actualSellerCommissionRate = Math.max(0, settings.comisionVendedorPrenda - commissionReduction);

    const visualType = (product.visualType as VisualType) || 'tshirt';
    const isCap = visualType === 'cap';
    const standardSizes = ['XS', 'S', 'M', 'L', 'XL'];
    const largeSizes = ['2XL', '3XL', '4XL'];
    const kidSizes = ['4', '6', '8', '10', '12', '14', '16'];

    // --- 1. COST CALCULATION ---
    const dtfMetroLinealConTransporte = settings.costoMetroLinealDTF;
    const dtfAreaMetro = settings.anchoUtilDTF * settings.largoRolloDTF;
    const dtfCostoRealCm2 = dtfAreaMetro > 0 ? (dtfMetroLinealConTransporte / dtfAreaMetro) * settings.mermaDTF : 0;
    const packCost = pack === 'PREMIUM' ? settings.costoPackPremium : settings.costoPackECO;
    const costoFijoUnitario = settings.produccionEstimadaPrendas > 0 ? (settings.alquiler + settings.energia + settings.internet + settings.monotributo + settings.celular) / settings.produccionEstimadaPrendas : 0;
    const costoGestion = settings.valorHoraPrenda / settings.prendasPorHora;
    const costosFijosGestion = costoFijoUnitario + costoGestion;

    const costoTotalLogisticaLocalMensual = ((settings.kmRecorridoLocal * settings.viajesAlMes) / settings.consumoAuto) * settings.nafta * (1 + settings.amortizacionAuto);
    const logisticaLocalUnitaria = settings.produccionEstimadaPrendas > 0 ? costoTotalLogisticaLocalMensual / settings.produccionEstimadaPrendas : 0;
    const fleteProveedor = (product.costoFleteBulto ?? 0) > 0 && (product.unidadesPorBulto ?? 0) > 0 ? (product.costoFleteBulto ?? 0) / (product.unidadesPorBulto ?? 1) : 0;
    const logisticaUnitaria = fleteProveedor + logisticaLocalUnitaria;
    
    const getStampMaterialCostForSize = (size: string) => {
        const hasPredefinedStamps = stampingZones.some(zone => stamps[zone.id as keyof typeof stamps]);
        const hasStamps = hasPredefinedStamps || (customZones && customZones.length > 0);

        if (!hasStamps || tipoImpresion === 'Sin Impresión') return 0;

        if (tipoImpresion === 'DTF') {
            const predefinedStampsCost = stampingZones.reduce((acc, zone) => {
                if (!stamps[zone.id as keyof typeof stamps]) return acc;
                const dim = getStampDimensions(visualType, zone.id as ZoneId, measures, size as SizeCategoryId, product?.code);
                return acc + (dim.area * dtfCostoRealCm2);
            }, 0);

            const customStampCost = (customZones || []).reduce((sum, z) => sum + (z.widthCm * z.heightCm * dtfCostoRealCm2), 0);

            return predefinedStampsCost + customStampCost;
        }
        if (tipoImpresion === 'Serigrafía') {
            const baseCost = settings.costoFijoSerigrafiaPrenda;
            const selectedAreas = stampingZones.reduce<{ width: number; height: number }[]>((acc, zone) => {
                if (!stamps[zone.id as keyof typeof stamps]) return acc;
                const dim = getStampDimensions(visualType, zone.id as ZoneId, measures, size as SizeCategoryId, product?.code);
                acc.push({ width: dim.width || 20, height: dim.height || 20 });
                return acc;
            }, []);
            const customAreas = (customZones || []).map(zone => ({ width: zone.widthCm, height: zone.heightCm }));
            const areas = [...selectedAreas, ...customAreas];
            const largeAreas = areas.filter(area => !isSmallSerigraphyArea(area.width, area.height)).length;
            const smallAreas = areas.length - largeAreas;
            const exceedsBaseLimit = largeAreas > 1 || smallAreas > 1;
            return exceedsBaseLimit
                ? baseCost * (settings.factorDobleFazSerigrafiaPrenda ?? 2)
                : baseCost;
        }
        if (tipoImpresion === 'Vinilo') {
            const predefinedStampsCost = stampingZones.reduce((acc, zone) => {
                if (!stamps[zone.id as keyof typeof stamps]) return acc;
                const dim = getStampDimensions(visualType, zone.id as ZoneId, measures, size as SizeCategoryId, product?.code);
                return acc + (dim.area * settings.costoViniloPorCm2);
            }, 0);
            const customStampCost = (customZones || []).reduce((sum, z) => sum + (z.widthCm * z.heightCm * settings.costoViniloPorCm2), 0);
            const colores = values.viniloColores || 1;
            return (predefinedStampsCost + customStampCost) * colores + settings.costoFijoVinilo;
        }
        if (tipoImpresion === 'Sublimación') {
            const predefinedStampsCost = stampingZones.reduce((acc, zone) => {
                if (!stamps[zone.id as keyof typeof stamps]) return acc;
                const dim = getStampDimensions(visualType, zone.id as ZoneId, measures, size as SizeCategoryId, product?.code);
                return acc + (dim.area * settings.costoSublimacionPorCm2);
            }, 0);
            const customStampCost = (customZones || []).reduce((sum, z) => sum + (z.widthCm * z.heightCm * settings.costoSublimacionPorCm2), 0);
            return predefinedStampsCost + customStampCost + settings.costoFijoSublimacion;
        }
        if (tipoImpresion === 'Bordado') {
            const puntos = values.bordadoPuntos || 5000;
            return settings.costoBordadoBase + (puntos * settings.costoBordadoPorPunto);
        }
        if (tipoImpresion === 'Transfer') {
            const ancho = values.transferAncho || 20;
            const alto = values.transferAlto || 20;
            const predefinedStampsCost = stampingZones.reduce((acc, zone) => {
                if (!stamps[zone.id as keyof typeof stamps]) return acc;
                const dim = getStampDimensions(visualType, zone.id as ZoneId, measures, size as SizeCategoryId, product?.code);
                return acc + (dim.area * settings.costoTransferPorCm2);
            }, 0);
            const customStampCost = (customZones || []).reduce((sum, z) => sum + (z.widthCm * z.heightCm * settings.costoTransferPorCm2), 0);
            return predefinedStampsCost + customStampCost + (ancho * alto * settings.costoTransferPorCm2) + settings.costoFijoTransfer;
        }
        return 0;
    };
    
    let totalCostoAplicacionDTF = 0;
    if (tipoImpresion === 'DTF') {
        const costoUnitarioAplicacion = settings.usaAplicacionDTFExterna
            ? settings.costoAplicacionDTFExterna
            : (settings.valorHoraPrenda / settings.prendasPorHora) +
                (settings.produccionEstimadaPrendas > 0 && settings.vidaUtilPlanchaMeses > 0
                    ? settings.costoPlancha / (settings.vidaUtilPlanchaMeses * settings.produccionEstimadaPrendas)
                    : 0) +
                settings.costoEnergiaAplicacion;

        const smallStamps = ['mangaCorta', 'backCollar'];
        const smallStampFactor = settings.factorAplicacionDTFChica ?? 0.5;
        
        for (const stampId in stamps) {
            if (stamps[stampId as keyof typeof stamps]) {
                if (!smallStamps.includes(stampId)) {
                     totalCostoAplicacionDTF += costoUnitarioAplicacion;
                } else {
                    totalCostoAplicacionDTF += costoUnitarioAplicacion * smallStampFactor;
                }
            }
        }
        // Each custom zone counts as a "large" stamp for application cost
        totalCostoAplicacionDTF += (customZones || []).length * costoUnitarioAplicacion;
    }
    // Vinilo: costo de aplicación por plancha/corte
    if (tipoImpresion === 'Vinilo') {
        const numStamps = stampingZones.filter(z => stamps[z.id as keyof typeof stamps]).length + (customZones || []).length;
        totalCostoAplicacionDTF = numStamps * 200; // Costo fijo de corte/transferencia por estampado
    }
    // Sublimación: costo de plancha de sublimación
    if (tipoImpresion === 'Sublimación') {
        const numStamps = stampingZones.filter(z => stamps[z.id as keyof typeof stamps]).length + (customZones || []).length;
        totalCostoAplicacionDTF = numStamps * 300; // Costo de plancha por estampado
    }
    // Bordado: mano de obra de bordado
    if (tipoImpresion === 'Bordado') {
        const puntos = values.bordadoPuntos || 5000;
        const minutos = settings.puntosPorMinuto > 0 ? puntos / settings.puntosPorMinuto : 0;
        totalCostoAplicacionDTF = minutos * (settings.valorHoraPrenda / 60); // Costo por minuto de bordado
    }
    // Transfer: costo de prensado
    if (tipoImpresion === 'Transfer') {
        const numStamps = stampingZones.filter(z => stamps[z.id as keyof typeof stamps]).length + (customZones || []).length;
        totalCostoAplicacionDTF = numStamps * 250; // Costo de prensado por estampado
    }

    // --- 2. PRE-CALCULATE BASE PRICES & CATEGORY PRICES ---
    const pricesBySize = product.sizes.reduce((acc, size) => {
        const talle = size.talle;
        const materialCostForSize = product.costoLista;
        const stampCostForSize = getStampMaterialCostForSize(talle);
        
        const totalCostForSize = materialCostForSize + logisticaUnitaria + stampCostForSize + packCost + costosFijosGestion + totalCostoAplicacionDTF;
        
        const totalCommercialRateContado = settings.iibb + settings.publicidad + actualSellerCommissionRate;
        const totalCommercialRateTarjeta = totalCommercialRateContado + settings.recargoTarjeta;
        
        acc[talle] = {
            totalCost: totalCostForSize,
            contado: calculatePriceFromCost(totalCostForSize, settings.margenContadoPrenda, totalCommercialRateContado),
            mercadoLibre: calculatePriceFromCost(totalCostForSize, settings.margenContadoPrenda, totalCommercialRateTarjeta),
        };
        return acc;
    }, {} as Record<string, { totalCost: number; contado: number; mercadoLibre: number; }>);

    const suggestedPrices: { cap?: any; standard?: any; large?: any; kids?: any; } = {};
    const competitivePrices: { cap?: any; standard?: any; large?: any; kids?: any; } = {};

    if (isCap) {
        const capTalle = product.sizes[0]?.talle || 'ADUL';
        const capPrices = pricesBySize[capTalle];
        const suggested = { contado: roundPrice(capPrices.contado), mercadoLibre: roundPrice(capPrices.mercadoLibre) };
        suggestedPrices.cap = suggested;
        competitivePrices.cap = { contado: Math.max(suggested.contado - settings.descuentoCompetitivo, 1000), mercadoLibre: Math.max(suggested.mercadoLibre - settings.descuentoCompetitivo, 1000) };
    } else {
        const productKidSizes = product.sizes.filter(s => kidSizes.includes(s.talle));
        if (productKidSizes.length > 0) {
            const maxContado = Math.max(...productKidSizes.map(s => pricesBySize[s.talle].contado));
            const maxML = Math.max(...productKidSizes.map(s => pricesBySize[s.talle].mercadoLibre));
            const suggested = { contado: roundPrice(maxContado), mercadoLibre: roundPrice(maxML) };
            suggestedPrices.kids = suggested;
            competitivePrices.kids = { contado: Math.max(suggested.contado - settings.descuentoCompetitivo, 1000), mercadoLibre: Math.max(suggested.mercadoLibre - settings.descuentoCompetitivo, 1000) };
        }

        const standardProductSizes = product.sizes.filter(s => standardSizes.includes(s.talle));
        if (standardProductSizes.length > 0) {
            const maxContado = Math.max(...standardProductSizes.map(s => pricesBySize[s.talle].contado));
            const maxML = Math.max(...standardProductSizes.map(s => pricesBySize[s.talle].mercadoLibre));
            const suggested = { contado: roundPrice(maxContado), mercadoLibre: roundPrice(maxML) };
            suggestedPrices.standard = suggested;
            competitivePrices.standard = { contado: Math.max(suggested.contado - settings.descuentoCompetitivo, 1000), mercadoLibre: Math.max(suggested.mercadoLibre - settings.descuentoCompetitivo, 1000) };
        }
        const largeProductSizes = product.sizes.filter(s => largeSizes.includes(s.talle));
        if (largeProductSizes.length > 0) {
            const maxContado = Math.max(...largeProductSizes.map(s => pricesBySize[s.talle].contado));
            const maxML = Math.max(...largeProductSizes.map(s => pricesBySize[s.talle].mercadoLibre));
            const suggested = { contado: roundPrice(maxContado), mercadoLibre: roundPrice(maxML) };
            suggestedPrices.large = suggested;
            competitivePrices.large = { contado: Math.max(suggested.contado - settings.descuentoCompetitivo, 1000), mercadoLibre: Math.max(suggested.mercadoLibre - settings.descuentoCompetitivo, 1000) };
        }
    }

    // --- 3. DETERMINE UNIFORM CATEGORY PRICE ---
    if (!pricesBySize[talle]) {
        return null;
    }

    const priceByPayment = modalidadPago === 'Contado' ? 'contado' : 'mercadoLibre';
    const isLargeSize = largeSizes.includes(talle);
    const isKidSize = kidSizes.includes(talle);

    let basePrice: number;
    if (isCap) {
        basePrice = suggestedPrices.cap?.[priceByPayment] ?? 0;
    } else if (isKidSize) {
        basePrice = suggestedPrices.kids?.[priceByPayment] ?? 0;
    } else if (isLargeSize) {
        basePrice = suggestedPrices.large?.[priceByPayment] ?? 0;
    } else {
        basePrice = suggestedPrices.standard?.[priceByPayment] ?? 0;
    }
    if (basePrice === 0) {
        basePrice = pricesBySize[talle][priceByPayment];
    }
    
    let finalPrice = Math.round(basePrice * (1 - discountRate));

    // --- 4. SAFEGUARD: ENFORCE MINIMUM PROFIT MARGIN ---
    const totalCost = pricesBySize[talle].totalCost;
    const minMargin = settings.gananciaMinimaPrenda;
    const totalCommercialRate = settings.iibb + settings.publicidad + actualSellerCommissionRate + (modalidadPago === 'MercadoLibre' ? settings.recargoTarjeta : 0);

    // This is the absolute minimum price required to achieve the minimum margin after ALL costs.
    // Derived from: FinalPrice = (TotalCost) / (1 - MinMargin - TotalCommercialRate)
    const minPriceDivisor = 1 - minMargin - totalCommercialRate;
    const minimumPrice = minPriceDivisor > 0 ? totalCost / minPriceDivisor : Infinity;
    
    // --- 5. FINAL PROFIT & COMMISSION CALCULATION ---
    let marginAlert: { severity: 'warning' | 'critical', message: string } | null = null;

    // Round all prices to nearest 10 for consistency
    if (finalPrice < minimumPrice) {
        const severity = minimumPrice > totalCost ? 'warning' : 'critical';
        marginAlert = {
            severity,
            message: severity === 'critical'
                ? `¡PÉRDIDA! El precio de $${(finalPrice).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} está por debajo del costo total. Se ajustó forzosamente.`
                : `El precio se ajustó a $${(Math.ceil(minimumPrice / 10) * 10).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} para cumplir el margen mínimo del ${(minMargin * 100).toFixed(0)}%.`,
        };
        finalPrice = Math.ceil(minimumPrice / 10) * 10;
    }

    finalPrice = Math.ceil(finalPrice / 10) * 10;

    const comisionVendedor = finalPrice * actualSellerCommissionRate;
    const otherCommercialCosts = finalPrice * (settings.iibb + settings.publicidad);
    const cardFee = modalidadPago === 'MercadoLibre' ? finalPrice * settings.recargoTarjeta : 0;
    const unitNetProfit = finalPrice - totalCost - otherCommercialCosts - comisionVendedor - cardFee;

    // --- 6. ASSEMBLE RETURN OBJECT ---
    const dobleFazFactor = (tipoImpresion === 'Serigrafía') ? (settings.factorDobleFazSerigrafiaPrenda ?? 2) : 1;
    const activeStamps = stampingZones.map(zone => {
        if (!stamps[zone.id as keyof typeof stamps]) return null;
        const dim = getStampDimensions(visualType, zone.id as ZoneId, measures, talle as SizeCategoryId, product?.code);
        const { area, width, height } = dim;
        let cost = 0;
        if (tipoImpresion === 'DTF') cost = area * dtfCostoRealCm2;
        else if (tipoImpresion === 'Serigrafía') cost = settings.costoFijoSerigrafiaPrenda * dobleFazFactor;
        else if (tipoImpresion === 'Vinilo') cost = area * settings.costoViniloPorCm2 * (values.viniloColores || 1);
        else if (tipoImpresion === 'Sublimación') cost = area * settings.costoSublimacionPorCm2;
        else if (tipoImpresion === 'Bordado') cost = (values.bordadoPuntos || 5000) * settings.costoBordadoPorPunto;
        else if (tipoImpresion === 'Transfer') cost = area * settings.costoTransferPorCm2;
        return { id: zone.id, name: zone.name, width, height, area, cost };
    }).filter(s => s !== null) as { id: string, name: string, width: number, height: number, area: number, cost: number}[];

    for (const zone of (customZones || [])) {
        const area = zone.widthCm * zone.heightCm;
        let cost = 0;
        if (tipoImpresion === 'DTF') cost = area * dtfCostoRealCm2;
        else if (tipoImpresion === 'Serigrafía') cost = settings.costoFijoSerigrafiaPrenda * dobleFazFactor;
        else if (tipoImpresion === 'Vinilo') cost = area * settings.costoViniloPorCm2 * (values.viniloColores || 1);
        else if (tipoImpresion === 'Sublimación') cost = area * settings.costoSublimacionPorCm2;
        else if (tipoImpresion === 'Bordado') cost = (values.bordadoPuntos || 5000) * settings.costoBordadoPorPunto;
        else if (tipoImpresion === 'Transfer') cost = area * settings.costoTransferPorCm2;
        activeStamps.push({
            id: zone.id,
            name: `${zone.name} (${zone.side === 'back' ? 'Dorso' : 'Frente'})`,
            width: zone.widthCm,
            height: zone.heightCm,
            area,
            cost,
        });
    }

    const isKidsProduct = product.sizes.some(s => kidSizes.includes(s.talle));

    return {
        calculatorType: 'APPAREL' as const,
        isCap,
        isKidsProduct,
        stamps: activeStamps,
        costs: {
            material: pricesBySize[talle].totalCost - (logisticaUnitaria + getStampMaterialCostForSize(talle) + packCost + costosFijosGestion + totalCostoAplicacionDTF),
            logistica: logisticaUnitaria,
            estampados: getStampMaterialCostForSize(talle),
            pack: packCost,
            fijosGestion: costosFijosGestion,
            aplicacionDTF: totalCostoAplicacionDTF,
            total: totalCost,
        },
        calculatedPrices: {
            contado: pricesBySize[talle].contado,
            mercadoLibre: pricesBySize[talle].mercadoLibre,
        },
        pricesBySize,
        suggestedPrices,
        competitivePrices,
        comision: comisionVendedor,
        comisionRate: actualSellerCommissionRate,
        basePrice,
        finalPrice,
        totalFinal: finalPrice * quantity,
        discountApplied: discountRate > 0 ? discountRate : 0,
        profit: {
            unit: unitNetProfit,
            total: unitNetProfit * quantity,
        },
        marginAlert,
    };
}

export function getApparelDescription(values: ApparelFormValues, product: ApparelProduct | undefined): string {
    if (!product) return '';

    const { talle, pack, tipoImpresion, stamps, customZones, modalidadPago, color } = values;

    const predefinedStampsDesc = stampingZones
        .reduce<string[]>((acc, z) => { if (stamps[z.id as keyof typeof stamps]) acc.push(z.name); return acc; }, [])
        .join(', ');

    const customStampDesc = (customZones || [])
        .map(z => `${z.name} (${z.side === 'back' ? 'Dorso' : 'Frente'}) ${z.widthCm}x${z.heightCm}cm`)
        .join(', ');

    const allStampsDesc = [predefinedStampsDesc, customStampDesc].filter(Boolean).join(', ');
        
    const colorDesc = color.startsWith('Color:') ? color : `Color: ${color}`;
    const talleDesc = talle ? `Talle: ${talle}` : 'Talle: —';

    const descriptionParts = [
        `${product.producto} - ${talleDesc} - ${colorDesc}`,
        `Pago: ${modalidadPago}`,
        pack !== 'ECO' ? `Pack: ${pack}` : '',
        tipoImpresion !== 'Sin Impresión' ? `Impresión: ${tipoImpresion}` : 'Sin Impresión',
        allStampsDesc ? `Estampados: ${allStampsDesc}` : '',
        tipoImpresion === 'Vinilo' ? `Vinilo: ${values.viniloColores || 1} color(es)` : '',
        tipoImpresion === 'Sublimación' ? `Sublimación: ${values.sublimacionZona || 'frente'}` : '',
        tipoImpresion === 'Bordado' ? `Bordado: ${(values.bordadoPuntos || 5000).toLocaleString()} puntos` : '',
        tipoImpresion === 'Transfer' ? `Transfer: ${values.transferAncho || 20}x${values.transferAlto || 20}cm` : '',
    ];

    return descriptionParts.filter(Boolean).join(' - ');
}

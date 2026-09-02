// src/lib/bag-pricer-logic.ts
import type { SettingsValues } from './config-schema';
import type { UnifiedBag } from './bag-products';

export type BagFormValues = {
    // Ahora acepta nombres de proveedores (string) además de LOCAL/TRANSPORTE
    origen: string;
    tipoManija: 'TIRAS' | 'RIÑON';
    medida: string;
    color: string;
    modalidadPago: 'CONTADO' | 'MERCADOLIBRE';
    tipoImpresion: 'Sin Impresión' | 'Serigrafía' | 'DTF' | 'Vinilo' | 'Sublimación';
    cantidadColores: number;
    dtfAncho: number;
    dtfAlto: number;
    dobleFaz: boolean;
    quantity: number;
    viniloColores?: number;
    sublimacionZona?: 'frente' | 'dorso' | 'ambas';
};

// Lógica de cálculo de precios basada en el modelo de Excel.
// El precio se calcula "inflando" el costo para cubrir el margen Y los gastos comerciales.
const calculatePrice = (totalCost: number, margin: number, commercialCostsRate: number) => {
    // 1. Aplicar el margen de ganancia sobre el costo.
    const priceWithMargin = totalCost * (1 + margin);
    // 2. Aplicar los costos comerciales (IIBB, Publicidad, etc.) sobre el precio con ganancia.
    // Esto es equivalente a: Precio Final = (Costo * (1+Margen)) / DIVISOR
    const divisor = 1 - commercialCostsRate;
    if (divisor <= 0) {
        // Failsafe para evitar división por cero o resultados negativos.
        return priceWithMargin * 2; 
    }
    return priceWithMargin / divisor;
};


export function calculateBagPrice(
    values: BagFormValues,
    selectedBag: UnifiedBag | undefined,
    settings: SettingsValues,
    validationMessage: string | null
) {
    if (!selectedBag || validationMessage || values.quantity < 1) return null;

    const { tipoImpresion, cantidadColores, dtfAncho, dtfAlto, dobleFaz, modalidadPago, quantity } = values;

    // Determine applicable tier for discounts and commission reduction
    const applicableTier = settings.descuentosBolsaHabilitados
      ? (settings.descuentosBolsa || []).filter(d => quantity >= d.quantity).pop()
      : null;
    let discountRate = 0;
    let commissionReduction = 0;
    if (applicableTier) {
        discountRate = applicableTier.discount;
        commissionReduction = applicableTier.commissionReduction;
    }

    // Calculate final commission rate for this transaction
    const baseSellerCommissionRate = settings.comisionVendedorBolsa;
    const actualSellerCommissionRate = Math.max(0, baseSellerCommissionRate - commissionReduction);


    // --- COSTOS ---
    const costoBaseBolsa = selectedBag.costoFinal;
    
    // Transporte desde el proveedor (logística externa) por unidad
    const transporteProveedor = (selectedBag.costoFleteBulto ?? 0) > 0 && (selectedBag.unidBulto ?? 0) > 0
      ? (selectedBag.costoFleteBulto ?? 0) / (selectedBag.unidBulto ?? 1)
      : 0;
    
    // Logística interna (transporte local de la empresa)
    const costoTotalLogisticaLocalMensual = ((settings.kmRecorridoLocal * settings.viajesAlMes) / settings.consumoAuto) * settings.nafta * (1 + settings.amortizacionAuto);
    const logisticaLocalUnitaria = settings.produccionEstimadaBolsas > 0 ? costoTotalLogisticaLocalMensual / settings.produccionEstimadaBolsas : 0;
    
    // Logística total (transporte proveedor + logística local)
    const costoLogisticaTotal = transporteProveedor + logisticaLocalUnitaria;
    
    const costoFijoUnitario = (settings.alquiler + settings.energia + settings.internet + settings.celular + settings.monotributo) / settings.produccionEstimadaBolsas;
    const costoGestion = settings.valorHoraBolsa / settings.unidadesPorHoraBolsa;
    const costosFijosGestion = costoFijoUnitario + costoGestion;

    let costoImpresion = 0;
    let costoColoresAdicionales = 0;

    if (tipoImpresion === 'Serigrafía') {
        costoImpresion = settings.costoBaseSerigrafiaBolsa;
        if (cantidadColores > 1) {
            costoColoresAdicionales = (cantidadColores - 1) * settings.costoColorAdicionalSerigrafiaBolsa;
        }
    } else if (tipoImpresion === 'DTF') {
        const dtfMetroLinealCost = settings.costoMetroLinealDTF;
        const dtfAreaMetro = settings.anchoUtilDTF * settings.largoRolloDTF;
        const costoRealCm2 = dtfAreaMetro > 0 ? (dtfMetroLinealCost / dtfAreaMetro) * settings.mermaDTF : 0;
        const areaDTF = dtfAncho * dtfAlto;
        costoImpresion = areaDTF * costoRealCm2;
    } else if (tipoImpresion === 'Vinilo') {
        const viniloColores = values.viniloColores || 1;
        // Estimación: área promedio de impresión en bolsa ~30x25cm
        const areaEstimada = 30 * 25;
        costoImpresion = areaEstimada * settings.costoViniloPorCm2 * viniloColores + settings.costoFijoVinilo;
    } else if (tipoImpresion === 'Sublimación') {
        // Estimación: área promedio de impresión en bolsa ~30x25cm
        const areaEstimada = 30 * 25;
        costoImpresion = areaEstimada * settings.costoSublimacionPorCm2 + settings.costoFijoSublimacion;
    }
    
    const costoDobleFaz = dobleFaz
      ? (settings.costoDobleFazSerigrafiaBolsa > 0
          ? settings.costoDobleFazSerigrafiaBolsa
          : (costoImpresion + costoColoresAdicionales))
      : 0;
    const costoTotalImpresion = costoImpresion + costoColoresAdicionales + costoDobleFaz;
    
    const costoTotalUnitario = costoBaseBolsa + costoLogisticaTotal + costosFijosGestion + costoTotalImpresion;
    
    const margen = settings.margenContadoBolsa;
    const cardFeeRate = modalidadPago === 'MERCADOLIBRE' ? settings.recargoTarjeta : 0;
    
    const totalCommercialRate = settings.iibb + settings.publicidad + actualSellerCommissionRate + cardFeeRate;
    const basePrice = Math.ceil(calculatePrice(costoTotalUnitario, margen, totalCommercialRate) / 10) * 10;

    let finalPrice = basePrice * (1 - discountRate);

    // --- SAFEGUARD: ENFORCE MINIMUM PROFIT MARGIN ---
    const minMargin = settings.gananciaMinimaBolsa;
    const minPriceDivisor = 1 - minMargin - totalCommercialRate;
    const minimumPrice = minPriceDivisor > 0 ? costoTotalUnitario / minPriceDivisor : Infinity;

    let marginAlert: { severity: 'warning' | 'critical', message: string } | null = null;

    if (finalPrice < minimumPrice) {
        const severity = minimumPrice > costoTotalUnitario ? 'warning' : 'critical';
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
    const currentMlFee = modalidadPago === 'MERCADOLIBRE' ? finalPrice * cardFeeRate : 0;
    const otherCommercialCosts = finalPrice * (settings.iibb + settings.publicidad);
    const unitNetProfit = finalPrice - costoTotalUnitario - otherCommercialCosts - comisionVendedor - currentMlFee;

    const totalNetProfit = unitNetProfit * quantity;

    return {
        calculatorType: 'BAG' as const,
        bagDetails: selectedBag,
        costs: {
            base: Math.ceil(costoBaseBolsa),
            logistica: Math.ceil(costoLogisticaTotal),
            fijosGestion: Math.ceil(costosFijosGestion),
            impresion: Math.ceil(costoImpresion),
            coloresAdicionales: Math.ceil(costoColoresAdicionales),
            dobleFaz: Math.ceil(costoDobleFaz),
            total: Math.ceil(costoTotalUnitario),
        },
        basePrice,
        finalPrice,
        totalFinal: finalPrice * quantity,
        commission: {
            rate: actualSellerCommissionRate,
            amount: Math.round(comisionVendedor),
        },
        discountApplied: discountRate > 0 ? discountRate : 0,
        profit: {
            unit: Math.round(unitNetProfit),
            total: Math.round(totalNetProfit),
        },
        marginAlert,
    };
}


export function getBagDescription(values: BagFormValues, bagDetails?: UnifiedBag): string {
    if (!bagDetails) return '';

    const { medida, modalidadPago, tipoImpresion, cantidadColores, dtfAncho, dtfAlto, dobleFaz, color } = values;

    let impressionDesc = `Impresión: ${tipoImpresion}`;
    if (tipoImpresion === 'Serigrafía') impressionDesc += ` ${cantidadColores} color(es)`;
    if (tipoImpresion === 'DTF') impressionDesc += ` ${dtfAncho}x${dtfAlto}cm`;
    if (tipoImpresion === 'Vinilo') impressionDesc += ` ${values.viniloColores || 1} color(es)`;
    if (tipoImpresion === 'Sublimación') impressionDesc += ` ${values.sublimacionZona || 'frente'}`;
    if (dobleFaz) impressionDesc += ' (Doble Faz)';

    // Make description clearer for bags with gussets
    // Nota: Ahora origen puede ser el nombre del proveedor
    const dimensionParts = medida.split(/x/i);
    let dimensionString = medida;
    if (dimensionParts.length > 2) {
        dimensionString = `${dimensionParts[0]}x${dimensionParts[1]}cm con fuelle de ${dimensionParts[2]}cm`;
    } else {
        dimensionString = `${medida}cm`;
    }

    const colorDesc = color.startsWith('Color:') ? color : `Color: ${color}`;

    const descriptionParts = [
        `Bolsa de ${bagDetails.material} ${dimensionString} manija ${bagDetails.tipoManija.toLowerCase()} (${bagDetails.gramaje}gr)`,
        colorDesc,
        tipoImpresion !== 'Sin Impresión' ? impressionDesc : 'Sin Impresión',
        `Pago: ${modalidadPago}`
    ];
    
    return descriptionParts.filter(Boolean).join(' - ');
}

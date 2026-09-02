// src/lib/unified-pricer-logic.ts
/**
 * UNIFIED PRICING CALCULATOR
 * ===========================
 * 
 * Módulo central que centraliza todos los cálculos de precios en la aplicación.
 * 
 * ARQUITECTURA:
 * - Mantiene la lógica específica en archivos separados:
 *   * apparel-pricer-logic.ts → Calculadora de indumentaria
 *   * bag-pricer-logic.ts → Calculadora de bolsas
 * - Proporciona una interfaz unificada para acceder a cualquier calculadora
 * - Los componentes importan desde este archivo, no desde los específicos
 * 
 * VENTAJAS:
 * ✓ Fácil agregar nuevos tipos de productos (gorros, otros)
 * ✓ Código limpio en componentes con una sola interfaz
 * ✓ Lógica de cálculo sin cambios, solo reorganizada
 * ✓ Mantenibilidad centralizada
 * 
 * CÓMO USARLO:
 * 
 *   // Para calcular precio de indumentaria:
     *   const result = calculateUnifiedPrice('APPAREL', values, product, settings);
 *   
 *   // Para calcular precio de bolsas:
 *   const result = calculateUnifiedPrice('BAG', values, bag, settings);
 *   
 *   // Para obtener descripción:
 *   const desc = getUnifiedDescription('APPAREL', values, product);
 */

import { calculateApparelPrice, type ApparelFormValues, getApparelDescription } from './apparel-pricer-logic';
import { calculateBagPrice, type BagFormValues, getBagDescription } from './bag-pricer-logic';
import type { SettingsValues } from './config-schema';
import type { ApparelProduct } from './types';
import type { UnifiedBag } from './bag-products';
import type { ApparelMeasure } from './apparel-measures';

export type CalculatorType = 'APPAREL' | 'BAG';

/**
 * Unified pricing calculation function
 * Delegates to the appropriate calculator based on product type
 */
export function calculateUnifiedPrice(
    type: CalculatorType,
    values: ApparelFormValues | BagFormValues,
    product: ApparelProduct | UnifiedBag | undefined,
    settings: SettingsValues,
    validationMessage?: string | null,
    measures?: ApparelMeasure[]
) {
    switch (type) {
        case 'APPAREL':
            return calculateApparelPrice(
                values as ApparelFormValues,
                product as ApparelProduct | undefined,
                settings,
                validationMessage || null,
                measures
            );
        case 'BAG':
            return calculateBagPrice(
                values as BagFormValues,
                product as UnifiedBag | undefined,
                settings,
                validationMessage || null
            );
        default:
            throw new Error(`Unknown calculator type: ${String(type)}`);
    }
}

/**
 * Unified description generator
 * Creates a readable description based on product type and values
 */
export function getUnifiedDescription(
    type: CalculatorType,
    values: ApparelFormValues | BagFormValues,
    product: ApparelProduct | UnifiedBag | undefined
): string {
    switch (type) {
        case 'APPAREL':
            return getApparelDescription(values as ApparelFormValues, product as ApparelProduct | undefined);
        case 'BAG':
            return getBagDescription(values as BagFormValues, product as UnifiedBag | undefined);
        default: {
            const exhaustive: never = type;
            return exhaustive;
        }
    }
}

// Re-export types and functions for convenience
export type { ApparelFormValues, CustomStampZone } from './apparel-pricer-logic';
export type { BagFormValues } from './bag-pricer-logic';
export { calculateApparelPrice, getApparelDescription } from './apparel-pricer-logic';
export { calculateBagPrice, getBagDescription } from './bag-pricer-logic';

// Return types for type-safe access in wrappers
export type ApparelCalculationResult = ReturnType<typeof calculateApparelPrice>;
export type BagCalculationResult = ReturnType<typeof calculateBagPrice>;

import type { PublicProduct } from '@/lib/public-products';

export interface FichaRow {
  label: string;
  value: string | undefined;
}

export function useProductSpecs(product: PublicProduct): FichaRow[] {
  return [
    { label: 'Marca', value: product.marca },
    { label: 'Género', value: product.genero },
    { label: 'Modelo', value: product.modelo },
    { label: 'Material', value: product.composicion },
    { label: 'Peso del material', value: product.pesoMaterial },
    { label: 'Composición', value: product.composicion },
    { label: 'Medidas', value: product.medidas_nota },
    { label: 'Cierre', value: product.cierre },
    { label: 'Refuerzos', value: product.refuerzos },
    { label: 'Sublimación', value: product.sublimable === true ? 'Apta' : undefined },
    { label: 'Uso recomendado', value: product.uso_recomendado },
    { label: 'Características', value: product.caracteristicas_tela },
    { label: 'Cuidados', value: product.cuidado },
  ].filter(r => r.value);
}
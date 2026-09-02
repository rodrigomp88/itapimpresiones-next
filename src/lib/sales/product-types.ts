// ===== Product Types (canonical source) =====

// Size with optional measurements
export type ProductSize = {
  talle: string;
  ancho_cm?: number;
  largo_cm?: number;
  hombro_cm?: number;
  manga_cm?: number;
};

// Product status options
// Solo a_pedidos y en_stock son vendibles (activos); el resto desactiva el producto.
export const PRODUCT_STATUSES = ['a_pedidos', 'en_stock', 'sin_stock', 'descontinuado'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  a_pedidos: 'A Pedidos',
  en_stock: 'En Stock',
  sin_stock: 'Sin Stock',
  descontinuado: 'Descontinuado',
};

export const ACTIVE_PRODUCT_STATUSES: readonly ProductStatus[] = ['a_pedidos', 'en_stock'];

export function isProductSellable(estado?: string): boolean {
  return ACTIVE_PRODUCT_STATUSES.includes((estado ?? 'a_pedidos') as ProductStatus);
}

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  a_pedidos: 'bg-primary/20 text-primary border-primary/40 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  en_stock: 'bg-secondary/20 text-secondary border-secondary/40 dark:bg-secondary/20 dark:text-secondary dark:border-secondary/30',
  sin_stock: 'bg-accent/20 text-accent border-accent/40 dark:bg-accent/20 dark:text-accent dark:border-accent/30',
  descontinuado: 'bg-tertiary/20 text-tertiary border-tertiary/40 dark:bg-tertiary/20 dark:text-tertiary dark:border-tertiary/30',
};

export type ApparelProduct = {
  code: string;
  producto: string;
  proveedor: string;
  costoLista: number;
  costoFleteBulto: number;
  unidadesPorBulto: number;
  sizes: ProductSize[];
  colors: string[];
  estado: ProductStatus;
  validZones?: string[];
  visualType?: 'tshirt' | 'cap' | 'hoodie-rn' | 'hoodie-hood' | 'jacket-hood' | 'jacket-nohood' | 'polo' | 'tank-top' | 'long-sleeve';
  imagenUrl?: string;
  // Optional fields for external use (web, catalogs)
  composicion?: string;
  caracteristicas_tela?: string;
  uso_recomendado?: string;
  cuidado?: string;
  medidas_nota?: string;
  familia_cuidados?: string;
  // Printing techniques
  tipoImpresion?: string[];
  tecnicasDisponibles?: string[];
  // Core flag for filtering in selectors
  esCore?: boolean;
};

// Helper to extract talle strings from ProductSize array
export function getTalleStrings(sizes: ProductSize[]): string[] {
  return sizes.map(s => s.talle);
}

export type BagProduct = {
  code: string;
  origen: 'LOCAL' | 'TRANSPORTE';
  material: string;
  medidas: string;
  manija: string;
  tipoManija: 'TIRAS' | 'RIÑON';
  colors: string[];
  gramaje: number;
  precioLista: number;
  moneda: 'ARS' | 'USD';
  unidBulto: number;
  proveedor?: string;
  costoFleteBulto?: number;
  estado?: ProductStatus;
  // Core flag for filtering in selectors
  esCore?: boolean;
};

export type ApparelProductDoc = ApparelProduct & {
  id?: string;
  category?: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
  updatedBy?: string;
};

export type BagProductDoc = BagProduct & {
  id?: string;
  category?: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
  updatedBy?: string;
};

export type ProductDoc =
  | (ApparelProduct & {
      id?: string;
      type: 'apparel';
      category?: string;
      createdAt?: any;
      updatedAt?: any;
      createdBy?: string;
      updatedBy?: string;
    })
  | (BagProduct & {
      id?: string;
      type: 'bags';
      category?: string;
      createdAt?: any;
      updatedAt?: any;
      createdBy?: string;
      updatedBy?: string;
    });

export type Product = ApparelProductDoc | BagProductDoc | ProductDoc;

export function isApparelProduct(p: ProductDoc): p is Extract<ProductDoc, { type: 'apparel' }> {
  return p.type === 'apparel';
}

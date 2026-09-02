'use client';

import { motion } from 'framer-motion';
import { PackageOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductList } from './ProductList';
import type { PublicProduct } from '@/lib/public-products';

interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ProductListSectionProps {
  initialProducts: PublicProduct[];
  filteredProducts: PublicProduct[];
  displayedProducts: PublicProduct[];
  hasMore: boolean;
  viewMode: 'grid' | 'list';
  loadMore: () => void;
  lastElementRef: React.RefObject<HTMLDivElement | null>;
  onInquire: (product: PublicProduct) => void;
  onAddToCompare: (product: PublicProduct) => void;
  onViewDetail: (product: PublicProduct) => void;
  activeChips?: ActiveChip[];
  onClearAllFilters?: () => void;
  fullWidth?: boolean;
  /** Precios "Desde" calculados por id de producto */
  desdePrices?: Record<string, number>;
  /** Cantidad mínima por producto */
  minQtys?: Record<string, number>;
}

export function ProductListSection({
  initialProducts,
  filteredProducts,
  displayedProducts,
  hasMore,
  viewMode,
  loadMore,
  lastElementRef,
  onInquire,
  onAddToCompare,
  onViewDetail,
  activeChips = [],
  onClearAllFilters,
  fullWidth = false,
  desdePrices = {},
  minQtys = {},
}: ProductListSectionProps) {
  // Empty state - early return
  if (filteredProducts.length === 0) {
    const hayFiltros = initialProducts.length > 0;
    return (
      <motion.section
        className={fullWidth ? 'lg:col-span-4' : 'lg:col-span-3'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <PackageOpen className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No encontramos productos</h2>
          <p className="text-muted-foreground mb-6 max-w-xs">
            {hayFiltros
              ? 'Ningún producto coincide con los filtros aplicados. Probá quitando alguno.'
              : 'Aún no hay productos publicados en el catálogo. Volvé pronto para ver las novedades.'}
          </p>
          {hayFiltros && onClearAllFilters && (
            <Button variant="outline" className="rounded-full" onClick={onClearAllFilters}>
              <X className="h-4 w-4 mr-2" aria-hidden="true" /> Limpiar filtros
            </Button>
          )}
        </div>
      </motion.section>
    );
  }

  // Has products - render list
  return (
    <motion.section
      className={fullWidth ? 'lg:col-span-4' : 'lg:col-span-3'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-4">
        {/* Filtros activos */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map(chip => (
              <button
                key={chip.key}
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 text-primary px-3 py-1 text-xs font-medium hover:bg-primary/10 transition-colors"
                onClick={chip.onRemove}
                aria-label={`Quitar filtro ${chip.label}`}
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
            {onClearAllFilters && (
              <button
                type="button"
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground ml-1"
                onClick={onClearAllFilters}
              >
                Limpiar todo
              </button>
            )}
          </div>
        )}

        {/* Contador */}
        <span className="text-muted-foreground text-sm">
          {displayedProducts.length < filteredProducts.length
            ? `Mostrando ${displayedProducts.length} de ${filteredProducts.length} productos`
            : `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`
          }
        </span>

        <ProductList
          products={filteredProducts}
          displayedProducts={displayedProducts}
          hasMore={hasMore}
          viewMode={viewMode}
          loadMore={loadMore}
          lastElementRef={lastElementRef}
          onInquire={onInquire}
          onAddToCompare={onAddToCompare}
          onViewDetail={onViewDetail}
          desdePrices={desdePrices}
          minQtys={minQtys}
        />
      </div>
    </motion.section>
  );
}
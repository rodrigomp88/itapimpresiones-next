'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MessageCircle, Eye } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { PublicProduct } from '@/lib/public-products';
import { formatPriceARS } from '@/lib/formatters';

interface ProductListProps {
  products: PublicProduct[];
  displayedProducts: PublicProduct[];
  hasMore: boolean;
  viewMode: 'grid' | 'list';
  loadMore: () => void;
  lastElementRef: React.RefObject<HTMLDivElement | null>;
  onInquire: (product: PublicProduct) => void;
  onAddToCompare: (product: PublicProduct) => void;
  desdePrices?: Record<string, number>;
  minQtys?: Record<string, number>;
  onViewDetail: (product: PublicProduct) => void;
}

export function ProductList({
  products,
  displayedProducts,
  hasMore,
  viewMode,
  loadMore,
  lastElementRef,
  onInquire,
  onAddToCompare,
  onViewDetail,
  desdePrices = {},
  minQtys = {},
}: ProductListProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <AnimatePresence mode="popLayout">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.35) }}
              >
                <ProductCard
                  product={product}
                  desdePrice={desdePrices[product.id]}
                  minQty={minQtys[product.id]}
                  onAddToCompare={onAddToCompare}
                  onViewDetail={onViewDetail}
                />
              </motion.div>
            ))}
            {hasMore && (
              <motion.div
                ref={lastElementRef}
                key="load-more"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full"
              >
                <div className="h-4" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.25) }}
                className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                <div className="w-full sm:w-32 h-32 sm:h-auto aspect-square bg-muted overflow-hidden flex-shrink-0">
                  {product.imagenUrl ? (
                    <Image
                      src={product.imagenUrl}
                      alt={product.producto || product.material}
                      fill
                      sizes="128px"
                      className="w-full h-full object-cover !absolute inset-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{product.type === 'apparel' ? product.producto : (product.nombreDisplay || product.material)}</h3>
                  <p className="text-sm text-muted-foreground">{product.code}</p>
                  {!!product.tipoImpresion?.length && (
                    <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full inline-block mt-1">
                      {product.tipoImpresion.join(' · ')}
                    </span>
                  )}
                  <p className="text-primary font-bold text-lg mt-1">{formatPriceARS(product.precioLista)}/u</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
<button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 h-11 px-4 bg-background text-foreground hover:bg-muted transition-colors text-sm font-medium"
                    onClick={() => onInquire(product)}
                    aria-label={`Consultar ${product.type === 'apparel' ? product.producto : product.material} por WhatsApp`}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> Consultar
                  </button>
<button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 h-11 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                    onClick={() => onViewDetail(product)}
                    aria-label={`Ver detalles de ${product.type === 'apparel' ? product.producto : product.material}`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" /> Ver detalles
                  </button>
                </div>
              </motion.div>
            ))}
            {hasMore && (
              <motion.div
                ref={lastElementRef}
                key="load-more-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-4" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {hasMore && (
        <div className="text-center mt-10 pt-6">
<button
            type="button"
            onClick={loadMore}
            disabled={!hasMore}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-background text-foreground hover:bg-muted transition-colors min-w-[200px] font-medium"
          >
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
            Cargar más productos
          </button>
          <p className="label-sm text-muted-foreground mt-3">
            Mostrando {displayedProducts.length} de {products.length} productos
          </p>
        </div>
      )}
    </div>
  );
}
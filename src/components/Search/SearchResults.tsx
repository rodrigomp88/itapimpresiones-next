"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import ProductItem from "../Product/ProductItem";
import { ProductGridSkeleton } from "../SkeletonComponents";

interface SearchResultsProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  searchQuery: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  loading,
  error,
  totalCount,
  searchQuery,
  onLoadMore,
  hasMore = false,
  className = "",
}) => {
  const [sortBy, setSortBy] = useState('relevance');

  const sortOptions = [
    { value: 'relevance', label: 'Más relevante' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'rating', label: 'Mejor calificados' },
    { value: 'newest', label: 'Más recientes' },
  ];

  if (loading && products.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-400">
            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>
              error
            </span>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Error en la búsqueda
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 text-zinc-400">
            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>
              search_off
            </span>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {searchQuery 
              ? `No encontramos productos para "${searchQuery}"`
              : "No hay productos que coincidan con tus filtros"
            }
          </p>
          <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <p>💡 Intenta:</p>
            <ul className="space-y-1 ml-4">
              <li>• Verificar la ortografía</li>
              <li>• Usar palabras más generales</li>
              <li>• Revisar los filtros aplicados</li>
              <li>• Explorar nuestras categorías</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Resultados de búsqueda
          </h2>
          {searchQuery && (
            <span className="text-zinc-600 dark:text-zinc-400">
              para "{searchQuery}"
            </span>
          )}
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            ({totalCount} productos)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de ordenamiento */}
          <div className="relative">
            <button
              onClick={() => setSortBy(sortBy === 'relevance' ? 'price_asc' : 'relevance')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
              <span className="material-symbols-outlined !text-lg">sort</span>
              <span>
                {sortOptions.find(option => option.value === sortBy)?.label || 'Ordenar'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductItem {...product} />
          </motion.div>
        ))}
      </div>

      {/* Loading skeleton para load more */}
      {loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductGridSkeleton count={4} />
        </div>
      )}

      {/* Botón cargar más */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-zinc-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span>Cargando...</span>
              </div>
            ) : (
              "Cargar más productos"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

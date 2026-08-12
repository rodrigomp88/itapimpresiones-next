"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSearch, { SearchFilters as SearchFiltersType } from "@/hooks/useSearch";
import SearchBar from "@/components/Search/SearchBar";
import SearchFilters from "@/components/Search/SearchFilters";
import SearchResultsSimple from "@/components/Search/SearchResultsSimple";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion, AnimatePresence } from "framer-motion";
import { HiFilter } from "react-icons/hi";
import { Suspense } from "react";

const SearchPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // Estados locales para UI
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Hook de búsqueda
  const search = useSearch();

  // Actualizar query cuando cambian los parámetros URL
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
      search.setSearchQuery(urlQuery);
    }
  }, [searchParams, searchQuery, search]);

  // Sincronizar filtros desde URL (si es necesario)
  useEffect(() => {
    const category = searchParams.get("category");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");

    const filters: SearchFiltersType = {};
    if (category) filters.category = category;
    if (priceMin) filters.priceMin = parseFloat(priceMin);
    if (priceMax) filters.priceMax = parseFloat(priceMax);

    if (Object.keys(filters).length > 0) {
      search.setFilters(filters);
    }
  }, [searchParams, search]);

  // Manejar envío de búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search.setSearchQuery(query);

    // Actualizar URL sin recargar página
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    router.push(`/buscar?${newParams.toString()}`);
  };

  // Manejar cambios en filtros
  const handleFiltersChange = (filters: SearchFiltersType) => {
    search.setFilters(filters);

    // Actualizar URL
    const newParams = new URLSearchParams(searchParams);

    // Limpiar filtros previos
    newParams.delete("category");
    newParams.delete("priceMin");
    newParams.delete("priceMax");

    // Agregar nuevos filtros
    if (filters.category) newParams.set("category", filters.category);
    if (filters.priceMin !== undefined)
      newParams.set("priceMin", filters.priceMin.toString());
    if (filters.priceMax !== undefined)
      newParams.set("priceMax", filters.priceMax.toString());

    router.replace(`/buscar?${newParams.toString()}`);
  };

  // Manejar selección de sugerencia
  const handleSelectSuggestion = (suggestion: string) => {
    handleSearch(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 pb-4 mb-6">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary"
          >
            Inicio
          </Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            /
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
            Búsqueda
          </span>
          {searchQuery && (
            <>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                /
              </span>
              <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
                {searchQuery}
              </span>
            </>
          )}
        </div>

        {/* Header con búsqueda */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Buscar Productos
          </h1>

          {/* Barra de búsqueda */}
          <div className="max-w-3xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              onSelectSuggestion={handleSelectSuggestion}
              placeholder="Buscar productos, categorías, marcas..."
              className="mb-4"
            />
          </div>

          {/* Botón filtros móvil */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                <HiFilter className="w-4 h-4" />
                <span>Filtros</span>
                {Object.keys(search.filters).length > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {Object.keys(search.filters).length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de filtros - Desktop siempre visible, móvil condicional */}
          <div
            className={`${isMobile ? "block" : "block"} ${isMobile && !showFilters ? "hidden" : ""}`}
          >
            <div className="sticky top-24">
              <SearchFilters
                filters={search.filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Resultados de búsqueda */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${searchQuery}-${JSON.stringify(search.filters)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SearchResultsSimple
                  products={search.products}
                  loading={search.loading}
                  error={search.error}
                  totalCount={search.totalCount}
                  searchQuery={searchQuery}
                  onLoadMore={search.loadMore}
                  hasMore={search.hasMore}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Overlay móvil para cerrar filtros */}
        {isMobile && showFilters && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
      </div>
    </div>
  );
};

const SearchPage: React.FC = () => (
  <Suspense>
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;

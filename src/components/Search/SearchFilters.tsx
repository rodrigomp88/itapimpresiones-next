"use client";

import { useState, useEffect } from "react";
import { HiFilter, HiX, HiStar, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { SearchFilters as SearchFiltersType } from "@/hooks/useSearch";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  className?: string;
}

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
  content: React.ReactNode;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  className = "",
}) => {
  const [sections, setSections] = useState<FilterSection[]>([
    {
      id: "category",
      title: "Categoría",
      isOpen: true,
      content: <CategoryFilter filters={filters} onFiltersChange={onFiltersChange} />,
    },
    {
      id: "price",
      title: "Precio",
      isOpen: true,
      content: <PriceFilter filters={filters} onFiltersChange={onFiltersChange} />,
    },
    {
      id: "rating",
      title: "Calificación",
      isOpen: true,
      content: <RatingFilter filters={filters} onFiltersChange={onFiltersChange} />,
    },
    {
      id: "availability",
      title: "Disponibilidad",
      isOpen: false,
      content: <AvailabilityFilter filters={filters} onFiltersChange={onFiltersChange} />,
    },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key as keyof SearchFiltersType] !== undefined && filters[key as keyof SearchFiltersType] !== ""
  );

  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HiFilter className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Filtros
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Filtros activos */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Filtros activos:
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md text-xs">
                  {filters.category}
                  <button
                    onClick={() => onFiltersChange({ ...filters, category: undefined })}
                    className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.priceMin !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md text-xs">
                  Desde ${filters.priceMin.toLocaleString()}
                  <button
                    onClick={() => onFiltersChange({ ...filters, priceMin: undefined })}
                    className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.priceMax !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md text-xs">
                  Hasta ${filters.priceMax.toLocaleString()}
                  <button
                    onClick={() => onFiltersChange({ ...filters, priceMax: undefined })}
                    className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.rating !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md text-xs">
                  {filters.rating}+ estrellas
                  <button
                    onClick={() => onFiltersChange({ ...filters, rating: undefined })}
                    className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.inStock && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md text-xs">
                  En stock
                  <button
                    onClick={() => onFiltersChange({ ...filters, inStock: false })}
                    className="hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secciones de filtros */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-zinc-200 dark:border-zinc-700 pb-4 last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {section.title}
              </h4>
              {section.isOpen ? (
                <HiChevronUp className="w-4 h-4 text-zinc-500" />
              ) : (
                <HiChevronDown className="w-4 h-4 text-zinc-500" />
              )}
            </button>
            <AnimatePresence>
              {section.isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3"
                >
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componentes de filtros específicos
const CategoryFilter: React.FC<{
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}> = ({ filters, onFiltersChange }) => {
  const categories = ["Remeras", "Bolsas", "Gorras", "Buzos", "Accesorios"];

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <label key={category} className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="category"
            checked={filters.category === category}
            onChange={() =>
              onFiltersChange({
                ...filters,
                category: filters.category === category ? undefined : category,
              })
            }
            className="w-4 h-4 text-blue-600 border-zinc-300 focus:ring-blue-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {category}
          </span>
        </label>
      ))}
    </div>
  );
};

const PriceFilter: React.FC<{
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}> = ({ filters, onFiltersChange }) => {
  const [minPrice, setMinPrice] = useState(filters.priceMin?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.priceMax?.toString() || "");

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({ ...filters, priceMin: numValue });
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({ ...filters, priceMax: numValue });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Mínimo
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            placeholder="$0"
            className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Máximo
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            placeholder="Sin límite"
            className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Rangos predefinidos */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Rangos populares:
        </div>
        {[
          { label: "Hasta $1.000", min: 0, max: 1000 },
          { label: "$1.000 - $5.000", min: 1000, max: 5000 },
          { label: "$5.000 - $10.000", min: 5000, max: 10000 },
          { label: "Más de $10.000", min: 10000, max: undefined },
        ].map((range) => (
          <button
            key={range.label}
            onClick={() => onFiltersChange({ 
              ...filters, 
              priceMin: range.min, 
              priceMax: range.max 
            })}
            className="block w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const RatingFilter: React.FC<{
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}> = ({ filters, onFiltersChange }) => {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="space-y-2">
      {ratings.map((rating) => (
        <label key={rating} className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="rating"
            checked={filters.rating === rating}
            onChange={() =>
              onFiltersChange({
                ...filters,
                rating: filters.rating === rating ? undefined : rating,
              })
            }
            className="w-4 h-4 text-blue-600 border-zinc-300 focus:ring-blue-500"
          />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? "text-yellow-400 fill-current"
                    : "text-zinc-300 dark:text-zinc-600"
                }`}
              />
            ))}
            <span className="text-sm text-zinc-700 dark:text-zinc-300 ml-1">
              {rating}+ estrellas
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

const AvailabilityFilter: React.FC<{
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}> = ({ filters, onFiltersChange }) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStock || false}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              inStock: e.target.checked || undefined,
            })
          }
          className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          Solo productos en stock
        </span>
      </label>
    </div>
  );
};

export default SearchFilters;

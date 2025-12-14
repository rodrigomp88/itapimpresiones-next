"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  customizable: boolean | null;
  priceRange: [number, number];
  sortBy: string;
}

export const useFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    customizable: null,
    priceRange: [0, 10000],
    sortBy: "relevance",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Función para actualizar filtros
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      customizable: null,
      priceRange: [0, 10000],
      sortBy: "relevance",
    });
  };

  // Función para aplicar filtros
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category || "")
      );
    }

    // Filtrar por tallas
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.size) return false;
        const productSizes = Array.isArray(product.size) ? product.size : [product.size];
        return filters.sizes.some(size => productSizes.includes(size));
      });
    }

    // Filtrar por colores
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.color) return false;
        const productColors = Array.isArray(product.color) ? product.color : [product.color];
        return filters.colors.some(color => productColors.includes(color));
      });
    }

    // Filtrar por personalización
    if (filters.customizable !== null) {
      filtered = filtered.filter(product => product.pause === filters.customizable);
    }

    // Filtrar por rango de precios
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price?.toString() || "0");
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Ordenar productos
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price?.toString() || "0");
          const priceB = parseFloat(b.price?.toString() || "0");
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price?.toString() || "0");
          const priceB = parseFloat(b.price?.toString() || "0");
          return priceB - priceA;
        });
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || "").getTime();
          const dateB = new Date(b.createdAt || "").getTime();
          return dateB - dateA;
        });
        break;
      default:
        // Relevancia - mantener orden original
        break;
    }

    return filtered;
  }, [products, filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredProducts,
    showFilters,
    setShowFilters,
  };
};

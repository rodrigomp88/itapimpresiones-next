"use client";

import { useMemo } from "react";

// ⚡ UTILIDADES DE RENDIMIENTO

/**
 * Hook para búsqueda con debounce
 */
export const useDebouncedSearch = (query: string, delay: number = 300) => {
  return useMemo(() => {
    const timeoutId = setTimeout(() => {
      return query;
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);
};

/**
 * Función memoizada para filtrar productos
 */
export const useMemoizedProductFilter = (
  products: any[],
  searchQuery: string,
  selectedColor: string,
  selectedBagType: string,
  category: string
) => {
  return useMemo(() => {
    let filtered = products;

    // Filtrado por color
    if (selectedColor !== "Todos") {
      filtered = filtered.filter((p) => {
        if (!p.images || p.images.length === 0) return false;
        return p.images.some((img: any) => {
          if (typeof img === "string") return false;
          return img.color === selectedColor;
        });
      });
    }

    // Filtrado por tipo de bolsa
    if (selectedBagType !== "Todos" && category === "Bolsas") {
      filtered = filtered.filter(
        (p) => p.bagType === selectedBagType.toLowerCase()
      );
    }

    // Búsqueda por texto
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, searchQuery, selectedColor, selectedBagType, category]);
};

/**
 * Memoización para ordenamiento
 */
export const useMemoizedSort = (products: any[], sortBy: string) => {
  return useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popular":
      default:
        return sorted;
    }
  }, [products, sortBy]);
};

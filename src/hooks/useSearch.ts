"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Product } from "@/types";

export interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
}

export interface SearchResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
}

export interface SearchState extends SearchResult {
  searchQuery: string;
  filters: SearchFilters;
  sortBy: "relevance" | "price_asc" | "price_desc" | "rating" | "newest";
}

export const useSearch = () => {
  const [state, setState] = useState<SearchState>({
    products: [],
    loading: false,
    error: null,
    hasMore: true,
    totalCount: 0,
    searchQuery: "",
    filters: {},
    sortBy: "relevance",
  });

  // Cache para resultados de búsqueda
  const [searchCache, setSearchCache] = useState<Map<string, Product[]>>(
    new Map()
  );

  // Función para generar clave de cache
  const getCacheKey = useCallback(
    (queryText: string, filters: SearchFilters, sortBy: string) => {
      return `${queryText}_${JSON.stringify(filters)}_${sortBy}`;
    },
    []
  );

  // Función de búsqueda principal
  const searchProducts = useCallback(
    async (
      searchQuery: string,
      filters: SearchFilters = {},
      sortBy: string = "relevance",
      loadMore: boolean = false
    ) => {
      const cacheKey = getCacheKey(searchQuery, filters, sortBy);

      // Verificar cache si no es loadMore
      if (!loadMore && searchCache.has(cacheKey)) {
        const cachedResults = searchCache.get(cacheKey)!;
        setState((prev) => ({
          ...prev,
          products: cachedResults,
          loading: false,
          error: null,
        }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Construir query base
        let q = query(collection(db, "products"));

        // Filtros de texto
        if (searchQuery.trim()) {
          q = query(
            q,
            where("name", ">=", searchQuery),
            where("name", "<=", searchQuery + "\uf8ff")
          );
        }

        // Aplicar filtros
        if (filters.category) {
          q = query(q, where("category", "==", filters.category));
        }

        if (filters.priceMin !== undefined) {
          q = query(q, where("price", ">=", filters.priceMin));
        }

        if (filters.priceMax !== undefined) {
          q = query(q, where("price", "<=", filters.priceMax));
        }

        if (filters.rating !== undefined) {
          q = query(q, where("averageRating", ">=", filters.rating));
        }

        if (filters.inStock) {
          q = query(q, where("pause", "==", false));
        }

        // Aplicar ordenamiento
        switch (sortBy) {
          case "price_asc":
            q = query(q, orderBy("price", "asc"));
            break;
          case "price_desc":
            q = query(q, orderBy("price", "desc"));
            break;
          case "rating":
            q = query(q, orderBy("averageRating", "desc"));
            break;
          case "newest":
            q = query(q, orderBy("createdAt", "desc"));
            break;
          default:
            q = query(q, orderBy("name", "asc"));
        }

        // Límite inicial
        q = query(q, limit(20));

        const querySnapshot = await getDocs(q);
        const products: Product[] = [];

        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });

        // Actualizar cache
        if (!loadMore) {
          setSearchCache((prev) => new Map(prev.set(cacheKey, products)));
        }

        setState((prev) => ({
          ...prev,
          products: loadMore ? [...prev.products, ...products] : products,
          loading: false,
          error: null,
          hasMore: products.length === 20, // Si hay 20, probablemente hay más
          totalCount: products.length,
        }));
      } catch (error) {
        console.error("Error searching products:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Error al buscar productos. Intenta de nuevo.",
          products: [],
        }));
      }
    },
    [searchCache, getCacheKey]
  );

  // Función para autocompletado
  const getSuggestions = useCallback(
    async (searchTerm: string): Promise<string[]> => {
      if (searchTerm.length < 2) return [];

      try {
        const searchQueryObj = query(
          collection(db, "products"),
          where("name", ">=", searchTerm),
          where("name", "<=", searchTerm + "\uf8ff"),
          limit(5)
        );

        const querySnapshot = await getDocs(searchQueryObj);
        const suggestions: string[] = [];

        querySnapshot.forEach((doc) => {
          const product = doc.data() as Product;
          if (product.name && !suggestions.includes(product.name)) {
            suggestions.push(product.name);
          }
        });

        return suggestions;
      } catch (error) {
        console.error("Error getting suggestions:", error);
        return [];
      }
    },
    []
  );

  // Funciones para actualizar estado
  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setFilters = useCallback((filters: SearchFilters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const setSortBy = useCallback((sortBy: SearchState["sortBy"]) => {
    setState((prev) => ({ ...prev, sortBy }));
  }, []);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      searchProducts(state.searchQuery, state.filters, state.sortBy, true);
    }
  }, [
    state.hasMore,
    state.loading,
    state.searchQuery,
    state.filters,
    state.sortBy,
    searchProducts,
  ]);

  // Auto-búsqueda cuando cambian query, filtros o sort
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(state.searchQuery, state.filters, state.sortBy);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [state.searchQuery, state.filters, state.sortBy, searchProducts]);

  // Memoizar valores para performance
  const memoizedValue = useMemo(
    () => ({
      ...state,
      setSearchQuery,
      setFilters,
      setSortBy,
      loadMore,
      getSuggestions,
    }),
    [state, setSearchQuery, setFilters, setSortBy, loadMore, getSuggestions]
  );

  return memoizedValue;
};

export default useSearch;

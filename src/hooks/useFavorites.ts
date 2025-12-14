"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/utils/security";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Cargar favoritos del localStorage al inicializar
  useEffect(() => {
    const storedFavorites = safeLocalStorageGet("favorites");
    setFavorites(storedFavorites);
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    const success = safeLocalStorageSet("favorites", favorites);
    if (!success) {
      console.warn("No se pudieron guardar los favoritos en localStorage");
    }
  }, [favorites]);

  // Validar ID del producto antes de agregar
  const addToFavorites = useCallback((productId: string) => {
    // Validar que el ID sea un string válido
    if (!productId || typeof productId !== 'string' || productId.length > 255) {
      console.warn("ID de producto inválido:", productId);
      return;
    }

    setFavorites(prev => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    if (!productId || typeof productId !== 'string') {
      console.warn("ID de producto inválido para toggle:", productId);
      return;
    }

    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};

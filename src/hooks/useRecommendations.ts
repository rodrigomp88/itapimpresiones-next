"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Product } from "@/types";

export interface RecommendationType {
  type: 'related' | 'upselling' | 'bought_together' | 'viewed_together';
  reason: string;
  score: number;
}

export interface RecommendedProduct extends Product {
  recommendation?: RecommendationType;
}

export const useRecommendations = (currentProduct?: Product) => {
  const [relatedProducts, setRelatedProducts] = useState<RecommendedProduct[]>([]);
  const [upsellingProducts, setUpsellingProducts] = useState<RecommendedProduct[]>([]);
  const [boughtTogetherProducts, setBoughtTogetherProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener productos de la misma categoría
  const getRelatedProducts = useCallback(async () => {
    if (!currentProduct?.category) return;

    try {
      const q = query(
        collection(db, "products"),
        where("category", "==", currentProduct.category),
        where("pause", "==", false),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      const querySnapshot = await getDocs(q);
      const products: RecommendedProduct[] = [];
      
      querySnapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() } as Product;
        
        // Excluir el producto actual
        if (product.id !== currentProduct.id) {
          products.push({
            ...product,
            recommendation: {
              type: 'related',
              reason: `Más productos de ${currentProduct.category}`,
              score: 0.8,
            }
          });
        }
      });

      setRelatedProducts(products);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  }, [currentProduct]);

  // Función para obtener productos de upselling (precio similar o mayor)
  const getUpsellingProducts = useCallback(async () => {
    if (!currentProduct?.price) return;

    try {
      const minPrice = currentProduct.price * 1.1; // 10% más caro
      const maxPrice = currentProduct.price * 2; // Hasta el doble

      const q = query(
        collection(db, "products"),
        where("price", ">=", minPrice),
        where("price", "<=", maxPrice),
        where("pause", "==", false),
        orderBy("price", "asc"),
        limit(4)
      );

      const querySnapshot = await getDocs(q);
      const products: RecommendedProduct[] = [];
      
      querySnapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() } as Product;
        
        // Excluir el producto actual
        if (product.id !== currentProduct.id) {
          products.push({
            ...product,
            recommendation: {
              type: 'upselling',
              reason: product.price > currentProduct.price 
                ? "Versión premium disponible"
                : "Alternativa similar",
              score: 0.6,
            }
          });
        }
      });

      setUpsellingProducts(products);
    } catch (err) {
      console.error("Error fetching upselling products:", err);
    }
  }, [currentProduct]);

  // Función para obtener productos frecuentemente comprados juntos
  const getBoughtTogetherProducts = useCallback(async () => {
    if (!currentProduct?.id) return;

    try {
      // Esta es una implementación simplificada
      // En un escenario real, necesitarías una tabla de órdenes y análisis de co-ocurrencia
      const q = query(
        collection(db, "products"),
        where("category", "==", currentProduct.category),
        where("pause", "==", false),
        orderBy("averageRating", "desc"),
        limit(4)
      );

      const querySnapshot = await getDocs(q);
      const products: RecommendedProduct[] = [];
      
      querySnapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() } as Product;
        
        // Excluir el producto actual y productos ya recomendados
        if (product.id !== currentProduct.id && 
            !relatedProducts.find(p => p.id === product.id) &&
            !upsellingProducts.find(p => p.id === product.id)) {
          products.push({
            ...product,
            recommendation: {
              type: 'bought_together',
              reason: "Otros clientes también compraron",
              score: 0.7,
            }
          });
        }
      });

      setBoughtTogetherProducts(products);
    } catch (err) {
      console.error("Error fetching bought together products:", err);
    }
  }, [currentProduct, relatedProducts, upsellingProducts]);

  // Función para obtener recomendaciones generales para homepage
  const getGeneralRecommendations = useCallback(async (limit_count: number = 8) => {
    try {
      const q = query(
        collection(db, "products"),
        where("pause", "==", false),
        orderBy("averageRating", "desc"),
        limit(limit_count)
      );

      const querySnapshot = await getDocs(q);
      const products: RecommendedProduct[] = [];
      
      querySnapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() } as Product;
        products.push({
          ...product,
          recommendation: {
            type: 'related',
            reason: "Productos destacados",
            score: 0.5,
          }
        });
      });

      return products;
    } catch (err) {
      console.error("Error fetching general recommendations:", err);
      return [];
    }
  }, []);

  // Función para obtener productos por categoría
  const getProductsByCategory = useCallback(async (category: string, limit_count: number = 6) => {
    try {
      const q = query(
        collection(db, "products"),
        where("category", "==", category),
        where("pause", "==", false),
        orderBy("createdAt", "desc"),
        limit(limit_count)
      );

      const querySnapshot = await getDocs(q);
      const products: RecommendedProduct[] = [];
      
      querySnapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() } as Product;
        products.push({
          ...product,
          recommendation: {
            type: 'related',
            reason: `Más productos de ${category}`,
            score: 0.9,
          }
        });
      });

      return products;
    } catch (err) {
      console.error("Error fetching products by category:", err);
      return [];
    }
  }, []);

  // Cargar recomendaciones cuando cambia el producto actual
  useEffect(() => {
    if (currentProduct) {
      setLoading(true);
      setError(null);

      // Cargar todas las recomendaciones en paralelo
      Promise.all([
        getRelatedProducts(),
        getUpsellingProducts(),
        getBoughtTogetherProducts(),
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [currentProduct, getRelatedProducts, getUpsellingProducts, getBoughtTogetherProducts]);

  // Memoizar todos los productos recomendados
  const allRecommendations = useMemo(() => {
    return [
      ...relatedProducts,
      ...upsellingProducts,
      ...boughtTogetherProducts,
    ];
  }, [relatedProducts, upsellingProducts, boughtTogetherProducts]);

  return {
    // Estados
    relatedProducts,
    upsellingProducts,
    boughtTogetherProducts,
    allRecommendations,
    loading,
    error,

    // Funciones
    getGeneralRecommendations,
    getProductsByCategory,
    refreshRecommendations: () => {
      if (currentProduct) {
        setLoading(true);
        Promise.all([
          getRelatedProducts(),
          getUpsellingProducts(),
          getBoughtTogetherProducts(),
        ]).finally(() => {
          setLoading(false);
        });
      }
    },
  };
};

export default useRecommendations;

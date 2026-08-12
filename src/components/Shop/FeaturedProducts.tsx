"use client";

import React, { useEffect, useState } from "react";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Product, ProductImage } from "@/types";
import ProductItem from "../Product/ProductItem";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  ProductGridSkeleton,
  ProductHorizontalSkeleton,
} from "../SkeletonComponents";

// Helper para obtener la URL de imagen
const getImageUrl = (img: string | ProductImage): string => {
  if (typeof img === "string") return img;
  return img?.url || "";
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch 4 most recent products
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const fetched: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetched);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Loading state con Skeleton Components profesional
  if (loading) {
    return isMobile ? (
      <ProductHorizontalSkeleton count={4} />
    ) : (
      <ProductGridSkeleton count={4} />
    );
  }

  return isMobile ? (
    // LAYOUT MÓVIL: scroll horizontal
    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 snap-x">
      {products.map((product) => (
        <div
          key={product.id}
          className="min-w-[240px] bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-center"
        >
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl flex justify-center">
            <img
              alt={product.name}
              className="h-32 object-contain mix-blend-multiply dark:mix-blend-normal"
              src={getImageUrl(product.images?.[0])}
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
              {product.name}
            </h3>
            <p className="text-xs text-muted-light dark:text-muted-dark line-clamp-2 mb-3">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                ${product.price.toLocaleString("es-AR")}
              </span>
              <button
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                onClick={() => {
                  console.log("Agregar al carrito:", product.name);
                }}
              >
                <span className="material-icons-outlined text-sm">add</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    // LAYOUT DESKTOP: grid normal
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
};

export default FeaturedProducts;

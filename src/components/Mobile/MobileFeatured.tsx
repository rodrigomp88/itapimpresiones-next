"use client";

import React, { useEffect, useState } from "react";
import { Product, ProductImage } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

// Helper para obtener la URL limpia
const getImageUrl = (img: ProductImage): string => {
  return img?.url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
};

// Fallback image URL - Optimized placeholder
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23F3F4F6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.35em' fill='%239B9BA4' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

const MobileFeatured = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Dynamic imports to avoid HMR issues
        const { collection, query, limit, getDocs, orderBy } = await import("firebase/firestore");
        const { db } = await import("@/firebase/config");

        // Fetch 3 productos destacados
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const fetched: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetched);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Fallback con productos por defecto del HTML
        setProducts([
          {
            id: "1",
            name: "Gorra Trucker",
            slug: "gorra-trucker",
            price: 17000,
            description: "Gorra trucker sublimada a colores, impresa en DTF.",
            images: [
              {
                url: "/images/carousel0.png",
                color: "Todos"
              }
            ],
            pause: false,
            unity: 1,
            size: "Única",
            category: "gorras",
            createdAt: new Date().toISOString(),
            stock: 100,
            stockType: "physical" as const,
          },
          {
            id: "2", 
            name: "Remeras Premium",
            slug: "remeras-premium",
            price: 18000,
            description: "Remeras de algodón con su logo a elección.",
            images: [
              {
                url: "/images/carousel1.png",
                color: "Todos"
              }
            ],
            pause: false,
            unity: 1,
            size: "Única",
            category: "remeras",
            createdAt: new Date().toISOString(),
            stock: 100,
            stockType: "physical" as const,
          },
          {
            id: "3",
            name: "Bolsa Eco 40x40", 
            slug: "bolsa-eco-40x40",
            price: 700,
            description: "Bolsa ecológica reutilizable con estampado.",
            images: [
              {
                url: "/images/carousel2.png",
                color: "Todos"
              }
            ],
            pause: false,
            unity: 1,
            size: "40x40",
            category: "bolsas",
            createdAt: new Date().toISOString(),
            stock: 100,
            stockType: "physical" as const,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Novedades Destacadas</h2>
          <span className="text-sm text-primary font-medium">Ver todo</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 snap-x">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="min-w-[240px] h-[320px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse snap-center" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Novedades Destacadas</h2>
        <Link href="/tienda" className="text-sm text-primary font-medium hover:underline">
          Ver todo
        </Link>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 snap-x">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            className="min-w-[240px] bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm snap-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl flex justify-center">
              <img 
                alt={product.name}
                className="h-32 object-contain mix-blend-multiply dark:mix-blend-normal"
                src={getImageUrl(product.images[0])}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
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
                <motion.button 
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    // TODO: Implementar agregar al carrito
                    console.log("Agregar al carrito:", product.name);
                  }}
                >
                  <span className="material-icons-outlined text-sm">add</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MobileFeatured;

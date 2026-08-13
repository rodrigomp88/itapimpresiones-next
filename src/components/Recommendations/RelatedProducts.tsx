"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import useRecommendations, {
  RecommendedProduct,
} from "@/hooks/useRecommendations";
import { ProductGridSkeleton } from "../SkeletonComponents";
import { HiPlus, HiStar, HiShoppingCart } from "react-icons/hi";

interface RelatedProductsProps {
  currentProduct: Product;
  title?: string;
  maxProducts?: number;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
  title = "Productos Relacionados",
  maxProducts = 6,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<
    "related" | "upselling" | "bought_together"
  >("related");
  const {
    relatedProducts,
    upsellingProducts,
    boughtTogetherProducts,
    loading,
  } = useRecommendations(currentProduct);

  // Combinar y limitar productos según la pestaña activa
  const getCurrentProducts = (): RecommendedProduct[] => {
    let products: RecommendedProduct[] = [];

    switch (activeTab) {
      case "related":
        products = relatedProducts;
        break;
      case "upselling":
        products = upsellingProducts;
        break;
      case "bought_together":
        products = boughtTogetherProducts;
        break;
    }

    return products.slice(0, maxProducts);
  };

  const currentProducts = getCurrentProducts();

  // Configuración de pestañas
  const tabs = [
    {
      id: "related" as const,
      label: "Relacionados",
      products: relatedProducts,
      description: "De la misma categoría",
    },
    {
      id: "upselling" as const,
      label: "Alternativas",
      products: upsellingProducts,
      description: "Productos similares",
    },
    {
      id: "bought_together" as const,
      label: "También compraron",
      products: boughtTogetherProducts,
      description: "Comprados frecuentemente juntos",
    },
  ];

  // Obtener título dinámico basado en la pestaña activa
  const getDynamicTitle = () => {
    const activeTabData = tabs.find((tab) => tab.id === activeTab);
    return activeTabData ? `${title} - ${activeTabData.label}` : title;
  };

  // Helper para obtener imagen del producto
  const getProductImage = (product: RecommendedProduct) => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === "string" ? firstImage : firstImage.url;
    }
    return "/placeholder.png";
  };

  // Helper para obtener rating del producto
  const getProductRating = (product: RecommendedProduct): number => {
    const productWithRating = product as RecommendedProduct & { averageRating?: number };
    return productWithRating.averageRating || 0;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-zinc-900 rounded-xl p-6 ${className}`}>
        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-96"></div>
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (currentProducts.length === 0) {
    return null; // No mostrar nada si no hay productos
  }

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {getDynamicTitle()}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </p>
          </div>

          {/* Badge con contador */}
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            {currentProducts.length} productos
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.products.length === 0}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : tab.products.length > 0
                    ? "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{tab.label}</span>
                {tab.products.length > 0 && (
                  <span className="bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 text-xs px-2 py-0.5 rounded-full">
                    {tab.products.length}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product, index) => {
            const rating = getProductRating(product);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/producto/${product.slug}`} className="block">
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Recommendation Badge */}
                      {product.recommendation && (
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.recommendation.type === "related"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                : product.recommendation.type === "upselling"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                  : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                            }`}
                          >
                            {product.recommendation.type === "related" &&
                              "Relacionado"}
                            {product.recommendation.type === "upselling" &&
                              "Alternativa"}
                            {product.recommendation.type ===
                              "bought_together" && "Popular"}
                          </span>
                        </div>
                      )}

                      {/* Quick Add Button */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Implementar agregar al carrito
                          }}
                          className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <HiShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h4>

                      {/* Rating */}
                      {rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <HiStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-zinc-300 dark:text-zinc-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            ({rating.toFixed(1)})
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-zinc-900 dark:text-white">
                            ${product.price.toLocaleString("es-AR")}
                          </span>
                          {product.recommendation?.score && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              Match:{" "}
                              {Math.round(product.recommendation.score * 100)}%
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/producto/${product.slug}`;
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <HiPlus className="w-4 h-4" />
                          Ver
                        </button>
                      </div>

                      {/* Recommendation Reason */}
                      {product.recommendation?.reason && (
                        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                            💡 {product.recommendation.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        {currentProducts.length >= maxProducts && (
          <div className="mt-6 text-center">
            <Link
              href={`/tienda?category=${currentProduct.category}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <span>
                Ver todos los{" "}
                {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}
              </span>
              <HiPlus className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;

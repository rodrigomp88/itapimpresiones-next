"use client";

import { Product, ProductImage } from "@/types";
import { useState, useMemo, useTransition } from "react";
import {
  FaPauseCircle,
  FaPlayCircle,
  FaTrashAlt,
  FaPencilAlt,
  FaSearch,
  FaBox,
  FaTag,
  FaDollarSign,
} from "react-icons/fa";
import {
  deleteProductAction,
  togglePauseProductAction,
} from "@/app/admin/products/actions";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { motion, AnimatePresence } from "framer-motion";

// Helper para obtener URL segura (maneja compatibilidad antigua vs nueva)
const getImageUrl = (images: any[]): string => {
  if (!images || images.length === 0) return "/placeholder.png";
  const firstImage = images[0];
  if (typeof firstImage === "string") return firstImage; // Legacy
  return (firstImage as ProductImage).url || "/placeholder.png"; // New structure
};

const AdminProductsClient: React.FC<{ initialProducts: Product[] }> = ({
  initialProducts,
}) => {
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");

  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map((p) => p.category));
    return ["Todas", ...Array.from(cats)];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let products = initialProducts;

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "Todas") {
      products = products.filter((p) => p.category === categoryFilter);
    }

    return products;
  }, [search, categoryFilter, initialProducts]);

  const handleDelete = (productId: string, productSlug: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      startTransition(async () => {
        const result = await deleteProductAction(productId, productSlug);
        if (result.success) {
          NotiflixSuccess("Producto eliminado.");
        } else {
          NotiflixFailure(result.error || "Error al eliminar.");
        }
      });
    }
  };

  const handleTogglePause = (productId: string, currentState: boolean) => {
    startTransition(async () => {
      await togglePauseProductAction(productId, currentState);
      NotiflixSuccess(`Producto ${currentState ? "reanudado" : "pausado"}.`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Productos
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Gestiona el catálogo de productos y colores
          </p>
        </div>
        <AddProduct />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Mostrando {filteredProducts.length} de {initialProducts.length}{" "}
        productos
      </p>

      {/* Products Grid */}
      <motion.div layout className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0 relative group">
                  <img
                    src={getImageUrl(product.images)}
                    alt={product.name}
                    className="w-32 h-32 object-contain rounded-lg bg-zinc-100 dark:bg-zinc-900"
                  />
                  {/* Badge de cantidad de imágenes */}
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {product.images?.length || 0} img
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <FaTag className="text-zinc-400 text-sm" />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        product.pause
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      }`}
                    >
                      {product.pause ? "Pausado" : "Activo"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-violet-500" />
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                      ${product.price.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        handleTogglePause(product.id, product.pause)
                      }
                      disabled={isPending}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50"
                      title={product.pause ? "Reanudar" : "Pausar"}
                    >
                      {product.pause ? (
                        <FaPlayCircle className="text-green-500" />
                      ) : (
                        <FaPauseCircle className="text-yellow-500" />
                      )}
                      <span className="text-sm hidden sm:inline">
                        {product.pause ? "Reanudar" : "Pausar"}
                      </span>
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 transition-colors"
                    >
                      <FaPencilAlt />
                      <span className="text-sm hidden sm:inline">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.slug)}
                      disabled={isPending}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <FaTrashAlt />
                      <span className="text-sm hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <FaBox className="mx-auto text-6xl text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">
            No se encontraron productos
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default AdminProductsClient;

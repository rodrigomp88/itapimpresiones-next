"use client";

import { Product } from "@/src/types";
import { useState, useMemo, useTransition } from "react";
import {
  FaPauseCircle,
  FaPlayCircle,
  FaTrashAlt,
  FaPencilAlt,
} from "react-icons/fa";
import {
  deleteProductAction,
  togglePauseProductAction,
} from "@/src/app/admin/products/actions";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

const AdminProductsClient: React.FC<{ initialProducts: Product[] }> = ({
  initialProducts,
}) => {
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    if (!search) return initialProducts;
    return initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, initialProducts]);

  const handleDelete = (productId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      startTransition(async () => {
        const result = await deleteProductAction(productId);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        <AddProduct />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-md bg-gray-100"
                  />
                  <span className="font-medium">{product.name}</span>
                </td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">
                  ${product.price.toLocaleString("es-AR")}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.pause
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.pause ? "Pausado" : "Activo"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleTogglePause(product.id, product.pause)
                      }
                      disabled={isPending}
                      className="btn-icon"
                    >
                      {product.pause ? (
                        <FaPlayCircle className="text-green-500" />
                      ) : (
                        <FaPauseCircle className="text-yellow-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="btn-icon"
                    >
                      <FaPencilAlt className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={isPending}
                      className="btn-icon"
                    >
                      <FaTrashAlt className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingProduct && (
          <EditProduct
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductsClient;

"use client";

import { ChangeEvent, useState, useTransition } from "react";
import { editProductAction } from "@/src/app/admin/products/actions";
import { Product } from "@/src/types";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";
import { FaTrash } from "react-icons/fa";

interface EditProductProps {
  product: Product;
  onClose: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onClose }) => {
  const [isPending, startTransition] = useTransition();

  const [existingImages, setExistingImages] = useState<string[]>(
    product.images || []
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDeleteExisting = (url: string) => {
    setExistingImages((prev) => prev.filter((imgUrl) => imgUrl !== url));
    setImagesToDelete((prev) => [...prev, url]);
  };

  const handleDeleteNew = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (formData: FormData) => {
    imagesToDelete.forEach((url) => formData.append("imagesToDelete", url));
    existingImages.forEach((url) => formData.append("existingImages", url));
    newImages.forEach((file) => formData.append("newImages", file));

    startTransition(async () => {
      const result = await editProductAction(product.id, formData);
      if (result.success) {
        NotiflixSuccess("Producto actualizado.");
        onClose();
      } else {
        NotiflixFailure(result.error || "Error al actualizar.");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
        <form key={product.id} action={handleSubmit}>
          <div className="space-y-4">
            <label htmlFor="name">Nombre del Producto</label>
            <input
              name="name"
              defaultValue={product.name}
              className="input"
              required
            />
            <label htmlFor="price">Precio</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product.price}
              className="input"
              required
            />
            <label htmlFor="category">Categoría</label>
            <input
              name="category"
              defaultValue={product.category}
              className="input"
              required
            />
            <label htmlFor="desc">Descripción</label>
            <textarea
              name="desc"
              defaultValue={product.desc}
              className="input"
              required
            />
            <label htmlFor="unity">Mínimo de Unidades</label>
            <input
              name="unity"
              type="number"
              defaultValue={product.unity}
              className="input"
              required
            />
            <label htmlFor="size">Tamaño/Medidas</label>
            <input name="size" defaultValue={product.size} className="input" />
            <label htmlFor="brand">Marca</label>
            <input
              name="brand"
              defaultValue={product.brand}
              className="input"
            />
            <div>
              <label>Imágenes Actuales</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {existingImages.map((url) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt="Imagen existente"
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteExisting(url)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label>Añadir Nuevas Imágenes</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="btn"
                onChange={handleNewImageChange}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((src, index) => (
                  <div key={src} className="relative">
                    <img
                      src={src}
                      alt="Previsualización"
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteNew(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary"
            >
              {isPending ? "Actualizando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

"use client";

import { useState, useRef, useTransition } from "react";
import { addProductAction } from "@/src/app/admin/products/actions";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";

const AddProduct = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(newPreviews);
    }
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await addProductAction(formData);
      if (result.success) {
        NotiflixSuccess("Producto añadido con éxito.");
        closeModal();
      } else {
        NotiflixFailure(result.error || "Error al añadir el producto.");
      }
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    formRef.current?.reset();
    setPreviewImages([]);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">
        Añadir Producto
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 w-full max-w-lg max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Añadir Nuevo Producto</h2>
            <form ref={formRef} action={handleSubmit}>
              <div className="space-y-4">
                <label htmlFor="name">Nombre del Producto</label>
                <input
                  name="name"
                  placeholder="Nombre del Producto"
                  className="input"
                  required
                />
                <label htmlFor="price">Precio</label>
                <input
                  name="price"
                  type="number"
                  placeholder="Precio"
                  className="input"
                  required
                />
                <label htmlFor="category">Categoría</label>
                <input
                  name="category"
                  placeholder="Categoría"
                  className="input"
                  required
                />
                <label htmlFor="brand">Marca</label>
                <input name="brand" placeholder="Marca" className="input" />
                <label htmlFor="desc">Descripción</label>
                <textarea
                  name="desc"
                  placeholder="Descripción"
                  className="input"
                  required
                />
                <label htmlFor="unity">Mínimo de Unidades</label>
                <input
                  name="unity"
                  type="number"
                  placeholder="Mínimo de unidades"
                  className="input"
                  required
                />
                <label htmlFor="size">Tamaño/Medidas</label>
                <input
                  name="size"
                  placeholder="Tamaño/Medidas"
                  className="input"
                />
              </div>
              <div className="p-4 space-x-2">
                <label htmlFor="images">Imágenes</label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="btn"
                  onChange={handleImageChange}
                />
                <div className="mt-2 flex gap-2">
                  {previewImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary"
                >
                  {isPending ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;

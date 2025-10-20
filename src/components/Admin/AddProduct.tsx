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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Añadir Nuevo Producto</h2>
            <form ref={formRef} action={handleSubmit}>
              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Nombre del Producto"
                  className="input"
                  required
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Precio"
                  className="input"
                  required
                />
                <div>
                  <label htmlFor="images">Imágenes</label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="input"
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
                <input
                  name="category"
                  placeholder="Categoría"
                  className="input"
                  required
                />
                <input name="brand" placeholder="Marca" className="input" />
                <textarea
                  name="desc"
                  placeholder="Descripción"
                  className="input"
                  required
                />
                <input
                  name="unity"
                  type="number"
                  placeholder="Mínimo de unidades"
                  className="input"
                  required
                />
                <input
                  name="size"
                  placeholder="Tamaño/Medidas"
                  className="input"
                />
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

"use client";

import { useState, useRef, useTransition, FormEvent } from "react";
import { addProductAction } from "@/app/admin/products/actions";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const AddProduct = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(newFiles);

      previewImages.forEach((url) => URL.revokeObjectURL(url));
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages(newPreviews);
    }
  };

  const uploadImagesFromClient = async (
    productId: string
  ): Promise<string[]> => {
    const uploadPromises = imageFiles.map(async (file) => {
      const filePath = `products/${productId}/${uuidv4()}-${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const initialResult = await addProductAction(formData);

        if (!initialResult.success || !initialResult.productId) {
          throw new Error(
            initialResult.error || "Falló la creación inicial del producto."
          );
        }

        if (imageFiles.length > 0) {
          const imageUrls = await uploadImagesFromClient(
            initialResult.productId
          );

          const finalFormData = new FormData();
          finalFormData.append("imageUrls", JSON.stringify(imageUrls));

          const finalResult = await addProductAction(
            finalFormData,
            initialResult.productId
          );
          if (!finalResult.success) {
            throw new Error(
              finalResult.error || "Falló la actualización de imágenes."
            );
          }
        }

        NotiflixSuccess("Producto añadido con éxito.");
        closeModal();
      } catch (error: any) {
        NotiflixFailure(error.message || "Error al añadir el producto.");
      }
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    formRef.current?.reset();
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImages([]);
    setImageFiles([]);
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
            <form ref={formRef} onSubmit={handleSubmit}>
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
                <label htmlFor="description">Descripción</label>
                <textarea
                  name="description"
                  id="description"
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

                <label htmlFor="color">Color</label>
                <select name="color" className="input">
                  <option value="">Seleccionar Color</option>
                  <option value="Todos">Todos</option>
                  <option value="Blanco">Blanco</option>
                  <option value="Negro">Negro</option>
                  <option value="Rojo">Rojo</option>
                  <option value="Azul">Azul</option>
                  <option value="Verde">Verde</option>
                  <option value="Amarillo">Amarillo</option>
                </select>

                <label htmlFor="bagType">Tipo de Bolsa (Solo para Bolsas)</label>
                <select name="bagType" className="input">
                  <option value="">N/A</option>
                  <option value="troquel">Troquel</option>
                  <option value="manija">Manija</option>
                </select>
              </div>
              <div className="p-4 space-y-2">
                <label htmlFor="images">Imágenes</label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="btn"
                  onChange={handleImageChange}
                />
                <div className="mt-2 flex flex-wrap gap-2">
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
                  onClick={closeModal}
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

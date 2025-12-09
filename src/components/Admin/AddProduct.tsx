"use client";

import { useState, useRef, useTransition, FormEvent, ChangeEvent } from "react";
import { addProductAction } from "@/app/admin/products/actions";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FaTrash, FaImage } from "react-icons/fa";

interface ImagePreview {
  file: File;
  previewUrl: string;
  color: string;
}

const COLORS = [
  "Todos",
  "Blanco",
  "Negro",
  "Rojo",
  "Azul",
  "Verde",
  "Amarillo",
  "Rosa",
  "Violeta",
];

const AddProduct = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        color: "Todos",
      }));
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = "";
  };

  const handleColorChange = (index: number, newColor: string) => {
    setSelectedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, color: newColor } : img))
    );
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].previewUrl);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImagesFromClient = async (productId: string) => {
    const uploadPromises = selectedImages.map(async (item) => {
      const filePath = `products/${productId}/${uuidv4()}-${item.file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, item.file);
      const downloadURL = await getDownloadURL(storageRef);
      return { url: downloadURL, color: item.color };
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

        if (selectedImages.length > 0) {
          const uploadedImagesData = await uploadImagesFromClient(
            initialResult.productId
          );
          const finalFormData = new FormData();
          finalFormData.append(
            "imagesData",
            JSON.stringify(uploadedImagesData)
          );
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
    selectedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setSelectedImages([]);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">
        Añadir Producto
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 w-full max-w-lg max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Añadir Nuevo Producto</h2>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label className="block text-sm font-medium">Nombre</label>
                <input name="name" className="input" required />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Precio</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Mínimo Unidades
                    </label>
                    <input
                      name="unity"
                      type="number"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <label className="block text-sm font-medium">Categoría</label>
                <input name="category" className="input" required />
                <label className="block text-sm font-medium">Descripción</label>
                <textarea
                  name="description"
                  className="input min-h-[100px]"
                  required
                />
                <label className="block text-sm font-medium">Tamaño</label>
                <input name="size" className="input" />

                <label className="block text-sm font-medium">
                  Tipo de Bolsa
                </label>
                <select name="bagType" className="input">
                  <option value="">N/A</option>
                  <option value="troquel">Troquel</option>
                  <option value="manija">Manija</option>
                </select>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaImage /> Imágenes y Colores
                  </h3>
                  <div className="relative mb-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="btn btn-secondary w-full text-center py-2 border-dashed border-2">
                      + Seleccionar Imágenes
                    </div>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedImages.map((img, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 p-2 rounded border border-zinc-200"
                      >
                        <img
                          src={img.previewUrl}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <label className="text-xs text-zinc-500 mb-1 block">
                            Color:
                          </label>
                          <select
                            value={img.color}
                            onChange={(e) =>
                              handleColorChange(i, e.target.value)
                            }
                            className="w-full text-sm p-1 rounded border"
                          >
                            {COLORS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="text-red-500 p-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
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
                  {isPending ? "Guardando..." : "Guardar"}
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

"use client";

import { ChangeEvent, useState, useTransition, FormEvent } from "react";
import { editProductAction } from "@/app/admin/products/actions";
import { Product, ProductImage } from "@/types";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";
import Image from "next/image";
import { FaTrash, FaPlus } from "react-icons/fa";
import { productSchema, ProductFormData } from "@/lib/validationSchemas";

interface EditProductProps {
  product: Product;
  onClose: () => void;
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

const EditProduct: React.FC<EditProductProps> = ({ product, onClose }) => {
  const [isPending, startTransition] = useTransition();
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});

  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    product.images.map((img: string | ProductImage) =>
      typeof img === "string" ? { url: img, color: "Todos" } : img
    )
  );

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<
    { file: File; preview: string; color: string }[]
  >([]);

  const handleDeleteExisting = (index: number) => {
    const img = existingImages[index];
    setImagesToDelete((prev) => [...prev, img.url]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingColorChange = (index: number, color: string) => {
    setExistingImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, color } : img))
    );
  };

  const handleNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      color: "Todos",
    }));
    setNewImages((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const handleNewColorChange = (index: number, color: string) => {
    setNewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, color } : img))
    );
  };

  const handleDeleteNew = (index: number) => {
    setNewImages((prev) => {
      const items = [...prev];
      URL.revokeObjectURL(items[index].preview);
      items.splice(index, 1);
      return items;
    });
  };

  const handleSubmitAction = (formData: FormData) => {
    imagesToDelete.forEach((url) => formData.append("imagesToDelete", url));
    formData.append("existingImagesData", JSON.stringify(existingImages));
    newImages.forEach((item) => {
      formData.append("newImagesFiles", item.file);
      formData.append("newImagesColors", item.color);
    });

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

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Extraer valores para validación
    const formValues = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      unity: parseInt(formData.get("unity") as string),
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      size: (formData.get("size") as string) || undefined,
      bagType: (formData.get("bagType") as string) || undefined,
    };

    // Validar con ZOD
    const validationResult = productSchema.safeParse(formValues);
    if (!validationResult.success) {
      const errors: Partial<Record<keyof ProductFormData, string>> = {};
      validationResult.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ProductFormData;
        errors[field] = err.message;
      });
      setValidationErrors(errors);
      return;
    }

    // Limpiar errores
    setValidationErrors({});

    // Proceder con el submit
    handleSubmitAction(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
        <form key={product.id} onSubmit={handleSubmitForm}>
          <div className="space-y-4">
            <label className="text-sm font-semibold">Nombre</label>
            <input
              name="name"
              defaultValue={product.name}
              className="input"
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.name}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Precio</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product.price}
                  className="input"
                  required
                />
                {validationErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.price}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold">Unidades Min.</label>
                <input
                  name="unity"
                  type="number"
                  defaultValue={product.unity}
                  className="input"
                  required
                />
                {validationErrors.unity && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.unity}
                  </p>
                )}
              </div>
            </div>

            <label className="text-sm font-semibold">Categoría</label>
            <input
              name="category"
              defaultValue={product.category}
              className="input"
              required
            />
            {validationErrors.category && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.category}
              </p>
            )}
            <label className="text-sm font-semibold">Descripción</label>
            <textarea
              name="description"
              defaultValue={product.description}
              className="input min-h-[100px]"
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.description}
              </p>
            )}
            <label className="text-sm font-semibold">Tamaño</label>
            <input name="size" defaultValue={product.size} className="input" />

            <label className="text-sm font-semibold">Tipo Bolsa</label>
            <select
              name="bagType"
              defaultValue={product.bagType || ""}
              className="input"
            >
              <option value="">N/A</option>
              <option value="troquel">Troquel</option>
              <option value="manija">Manija</option>
            </select>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold mb-2">Imágenes Actuales</h3>
              <div className="space-y-2">
                {existingImages.map((img, index) => (
                  <div
                    key={`exist-${index}`}
                    className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded"
                  >
                    <Image
                      src={img.url}
                      alt="img"
                      width={48}
                      height={48}
                      unoptimized
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <select
                        value={img.color}
                        onChange={(e) =>
                          handleExistingColorChange(index, e.target.value)
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
                      onClick={() => handleDeleteExisting(index)}
                      className="text-red-500 p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Añadir Nuevas Imágenes</h3>
              <div className="relative mb-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleNewImageChange}
                />
                <div className="btn btn-secondary w-full text-center flex items-center justify-center gap-2">
                  <FaPlus /> Seleccionar Archivos
                </div>
              </div>
              <div className="space-y-2">
                {newImages.map((img, index) => (
                  <div
                    key={`new-${index}`}
                    className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200"
                  >
                    <Image
                      src={img.preview}
                      alt="preview"
                      width={48}
                      height={48}
                      unoptimized
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <select
                        value={img.color}
                        onChange={(e) =>
                          handleNewColorChange(index, e.target.value)
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
                      onClick={() => handleDeleteNew(index)}
                      className="text-red-500 p-1"
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

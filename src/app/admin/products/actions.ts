"use server";

import { adminDb, adminStorage } from "@/firebase/admin";
import { revalidatePath } from "next/cache";
import { createSlug } from "@/lib/utils";
import { ProductImage } from "@/types";

export async function addProductAction(formData: FormData, productId?: string) {
  // Caso 2: Actualización de imágenes tras la creación
  if (productId) {
    try {
      if (!adminDb) return { success: false, error: "Admin no init" };

      const imagesDataJSON = formData.get("imagesData") as string;
      const images: ProductImage[] = imagesDataJSON
        ? JSON.parse(imagesDataJSON)
        : [];

      const docRef = adminDb.collection("products").doc(productId);
      await docRef.update({ images: images });

      revalidatePath("/admin/products");
      return { success: true };
    } catch (error) {
      console.error("Error updating product with images:", error);
      return { success: false, error: "No se pudieron guardar las imágenes." };
    }
  }

  // Caso 1: Creación inicial del producto
  const name = formData.get("name") as string;

  const newProductData = {
    name: name,
    slug: createSlug(name),
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    unity: Number(formData.get("unity")),
    size: formData.get("size") as string,
    // color: ... <-- ELIMINADO
    bagType: formData.get("bagType") as "troquel" | "manija" | undefined,
    pause: false,
    createdAt: new Date(),
    images: [],
  };

  try {
    if (!adminDb)
      return { success: false, error: "Firebase Admin no inicializado." };

    const docRef = await adminDb.collection("products").add(newProductData);
    return { success: true, productId: docRef.id };
  } catch (error) {
    console.error("Error adding product text data:", error);
    return { success: false, error: "No se pudo crear el producto." };
  }
}

async function deleteImages(imageUrls: string[]) {
  if (!adminStorage) return;

  const bucket = adminStorage.bucket();
  for (const url of imageUrls) {
    if (!url || !url.includes("storage.googleapis.com")) continue;
    try {
      const pathPart = url.split("/o/")[1];
      if (!pathPart) continue;
      const decodedPath = decodeURIComponent(pathPart.split("?")[0]);
      const file = bucket.file(decodedPath);
      await file.delete();
    } catch (error: any) {
      console.error(`Failed to delete image at ${url}:`, error.message);
    }
  }
}

export async function editProductAction(productId: string, formData: FormData) {
  const name = formData.get("name") as string;

  const updatedData = {
    name: name,
    slug: createSlug(name),
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    unity: Number(formData.get("unity")),
    size: formData.get("size") as string,
    // color: ... <-- ELIMINADO
    bagType: formData.get("bagType") as "troquel" | "manija" | undefined,
  };

  const imagesToDelete = formData.getAll("imagesToDelete") as string[];
  if (imagesToDelete.length > 0) {
    await deleteImages(imagesToDelete);
  }

  const existingImagesJSON = formData.get("existingImagesData") as string;
  const existingImages: ProductImage[] = existingImagesJSON
    ? JSON.parse(existingImagesJSON)
    : [];

  const newFiles = formData.getAll("newImagesFiles") as File[];
  const newColors = formData.getAll("newImagesColors") as string[];

  const newUploadedImages: ProductImage[] = [];

  if (adminStorage && newFiles.length > 0) {
    const bucket = adminStorage.bucket();
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const color = newColors[i] || "Todos";

      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = `products/${productId}/${Date.now()}_${file.name}`;
        const storageFile = bucket.file(filePath);
        await storageFile.save(buffer, {
          metadata: { contentType: file.type },
        });
        await storageFile.makePublic();

        newUploadedImages.push({
          url: storageFile.publicUrl(),
          color: color,
        });
      }
    }
  }

  const finalImages = [...existingImages, ...newUploadedImages];

  try {
    if (!adminDb)
      return { success: false, error: "Firebase Admin no inicializado." };
    await adminDb
      .collection("products")
      .doc(productId)
      .update({
        ...updatedData,
        images: finalImages,
      });
  } catch (error) {
    console.error("Error editing product:", error);
    return { success: false, error: "No se pudo editar el producto." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/producto/${updatedData.slug}`);
  revalidatePath("/tienda");
  return { success: true };
}

export async function deleteProductAction(
  productId: string,
  productSlug: string
) {
  try {
    if (!adminDb) return { success: false, error: "Admin no init" };
    await adminDb.collection("products").doc(productId).delete();
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el producto." };
  }
  revalidatePath("/admin/products");
  revalidatePath("/tienda");
  return { success: true };
}

export async function togglePauseProductAction(
  productId: string,
  currentState: boolean
) {
  try {
    if (!adminDb) return { success: false, error: "Admin no init" };
    await adminDb
      .collection("products")
      .doc(productId)
      .update({ pause: !currentState });
  } catch (error) {
    return { success: false, error: "No se pudo cambiar el estado." };
  }
  revalidatePath("/admin/products");
  return { success: true };
}

"use server";

import { adminDb, adminStorage } from "@/firebase/admin";
import { revalidatePath } from "next/cache";
import { createSlug } from "@/lib/utils";

export async function addProductAction(formData: FormData, productId?: string) {
  if (productId) {
    try {
      if (!adminDb) return { success: false, error: "Firebase Admin no inicializado." };

      const imageUrls = JSON.parse(formData.get("imageUrls") as string);
      const docRef = adminDb.collection("products").doc(productId);
      await docRef.update({ images: imageUrls });

      revalidatePath("/admin/products");
      return { success: true };
    } catch (error) {
      console.error("Error updating product with images:", error);
      return { success: false, error: "No se pudieron guardar las imágenes." };
    }
  }

  const name = formData.get("name") as string;

  const newProductData = {
    name: name,
    slug: createSlug(name),
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    unity: Number(formData.get("unity")),
    size: formData.get("size") as string,
    pause: false,
    createdAt: new Date(),
    images: [],
  };

  try {
    if (!adminDb) return { success: false, error: "Firebase Admin no inicializado." };

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
    if (!url.startsWith(`https://storage.googleapis.com/${bucket.name}/`)) {
      console.warn(`URL no válida o externa, no se puede eliminar: ${url}`);
      continue;
    }
    try {
      const filePath = url
        .replace(`https://storage.googleapis.com/${bucket.name}/`, "")
        .split("?")[0];
      const file = bucket.file(decodeURIComponent(filePath));
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
  };

  const imagesToDelete = formData.getAll("imagesToDelete") as string[];
  const newImages = formData.getAll("newImages") as File[];
  let existingImages = formData.getAll("existingImages") as string[];

  async function uploadImages(
    images: File[],
    prodId: string
  ): Promise<string[]> {
    if (!adminStorage) return [];

    const imageUrls: string[] = [];
    const bucket = adminStorage.bucket();
    for (const image of images) {
      if (image.size === 0) continue;
      const buffer = Buffer.from(await image.arrayBuffer());
      const filePath = `products/${prodId}/${Date.now()}_${image.name}`;
      const file = bucket.file(filePath);
      await file.save(buffer, { metadata: { contentType: image.type } });
      await file.makePublic();
      imageUrls.push(file.publicUrl());
    }
    return imageUrls;
  }

  try {
    if (!adminDb || !adminStorage) {
      return { success: false, error: "Firebase Admin no inicializado." };
    }

    if (imagesToDelete.length > 0) {
      await deleteImages(imagesToDelete);
    }
    const newImageUrls = await uploadImages(newImages, productId);
    const finalImageUrls = [...existingImages, ...newImageUrls];
    const productRef = adminDb.collection("products").doc(productId);
    await productRef.update({
      ...updatedData,
      images: finalImageUrls,
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
    if (!adminDb) return { success: false, error: "Firebase Admin no inicializado." };

    await adminDb.collection("products").doc(productId).delete();
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el producto." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/producto/${productSlug}`);
  revalidatePath("/tienda");
  return { success: true };
}

export async function togglePauseProductAction(
  productId: string,
  currentState: boolean
) {
  try {
    if (!adminDb) return { success: false, error: "Firebase Admin no inicializado." };

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

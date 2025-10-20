"use server";

import { adminDb, adminStorage } from "@/src/firebase/admin";
import { revalidatePath } from "next/cache";

async function uploadImages(
  images: File[],
  productId: string
): Promise<string[]> {
  const imageUrls: string[] = [];
  const bucket = adminStorage.bucket();

  for (const image of images) {
    if (image.size === 0) continue;

    const buffer = Buffer.from(await image.arrayBuffer());
    const filePath = `products/${productId}/${Date.now()}_${image.name}`;
    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: { contentType: image.type },
    });

    await file.makePublic();

    imageUrls.push(file.publicUrl());
  }
  return imageUrls;
}

async function deleteImages(imageUrls: string[]) {
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
      console.log(`Successfully deleted ${filePath}`);
    } catch (error: any) {
      console.error(`Failed to delete image at ${url}:`, error.message);
    }
  }
}

export async function addProductAction(formData: FormData) {
  const newProductData = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    brand: formData.get("brand") as string,
    desc: formData.get("desc") as string,
    unity: Number(formData.get("unity")),
    size: formData.get("size") as string,
    pause: false,
    createdAt: new Date(),
  };

  const images = formData.getAll("images") as File[];

  try {
    const docRef = await adminDb.collection("products").add(newProductData);

    const imageUrls = await uploadImages(images, docRef.id);

    await docRef.update({ images: imageUrls });
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "No se pudo añadir el producto." };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function editProductAction(productId: string, formData: FormData) {
  const updatedData = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    brand: formData.get("brand") as string,
    desc: formData.get("desc") as string,
    unity: Number(formData.get("unity")),
    size: formData.get("size") as string,
  };

  const imagesToDelete = formData.getAll("imagesToDelete") as string[];
  const newImages = formData.getAll("newImages") as File[];
  let existingImages = formData.getAll("existingImages") as string[];

  try {
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
  revalidatePath(`/product-details/${productId}`);
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  try {
    await adminDb.collection("products").doc(productId).delete();
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "No se pudo eliminar el producto." };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function togglePauseProductAction(
  productId: string,
  currentState: boolean
) {
  try {
    const productRef = adminDb.collection("products").doc(productId);
    await productRef.update({ pause: !currentState });
  } catch (error) {
    console.error("Error toggling pause state:", error);
    return { success: false, error: "No se pudo cambiar el estado." };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

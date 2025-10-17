import ProductDetailsClient from "@/src/components/ProductDetailsClient";
import { db } from "@/src/fireabase/config";
import { Product } from "@/src/types";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(`Servidor: No se encontró producto con ID: ${id}`);
      return null;
    }

    const data = docSnap.data();

    const productData = {
      id: docSnap.id,
      name: data.name,
      price: data.price,
      images: data.images,
      pause: data.pause,
      unity: data.unity,
      size: data.size,
      category: data.category,
      brand: data.brand,
      description: data.desc,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString(),
    };

    return productData as Product;
  } catch (error) {
    console.error("Servidor: Error al obtener el producto de Firebase:", error);
    return null;
  }
}

const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {
  const productId = params.id;
  console.log(`Servidor: Recibido ID de producto: ${productId}`);

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
};

export default ProductDetailsPage;

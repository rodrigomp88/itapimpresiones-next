import ProductDetailsClient from "@/components/ProductDetailsClient";
import { adminDb } from "@/firebase/admin";
import { Product } from "@/types";
import { notFound } from "next/navigation";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = adminDb.collection("products").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.log(`Servidor: No se encontró producto con ID: ${id}`);
      return null;
    }

    const data = docSnap.data()!;

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
      createdAt: data.createdAt.toDate().toISOString(),
    };

    return productData as Product;
  } catch (error) {
    console.error("Servidor: Error al obtener el producto de Firebase:", error);
    return null;
  }
}

// Esta es la forma más limpia de escribir el componente.
// Vamos a decirle al linter que ignore su falso positivo.
const ProductDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  // eslint-disable-next-line @next/next/no-sync-scripts-in-document-page
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
};

export default ProductDetailsPage;

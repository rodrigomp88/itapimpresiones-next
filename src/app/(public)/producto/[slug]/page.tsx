import ProductDetailsClient from "@/components/ProductDetailsClient";
import { adminDb } from "@/firebase/admin";
import { Product } from "@/types";
import { notFound } from "next/navigation";

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const productsRef = adminDb.collection("products");

    const q = productsRef.where("slug", "==", slug).limit(1);

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.log(`Servidor: No se encontró producto con slug: ${slug}`);
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    const productData = {
      id: docSnap.id,
      name: data.name,
      slug: data.slug,
      price: data.price,
      images: data.images,
      pause: data.pause,
      unity: data.unity,
      size: data.size,
      category: data.category,
      description: data.description,
      createdAt: data.createdAt.toDate().toISOString(),
    };

    return productData as Product;
  } catch (error) {
    console.error("Servidor: Error al obtener el producto por slug:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const productsRef = adminDb.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      console.log(
        "No se encontraron productos para generar páginas estáticas."
      );
      return [];
    }

    const paths = snapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));

    return paths.filter((p) => p.slug);
  } catch (error) {
    console.error("Error al generar las rutas estáticas de productos:", error);
    return [];
  }
}

const ProductDetailsPage = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
};

export default ProductDetailsPage;

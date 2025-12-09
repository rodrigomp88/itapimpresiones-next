import ProductDetailsClient from "@/components/ProductDetailsClient";
import { db } from "@/firebase/config";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { Product } from "@/types";
import { notFound } from "next/navigation";

// Definimos el tipo de las props para Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null; // Validación extra

  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

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
      images: data.images || [],
      pause: data.pause,
      unity: data.unity,
      size: data.size,
      category: data.category,
      color: data.color || "Todos",
      bagType: data.bagType,
      description: data.description || data.desc,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString(),
    };

    return productData as Product;
  } catch (error) {
    console.error("Servidor: Error al obtener el producto por slug:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
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

// CORRECCIÓN AQUÍ: params es ahora una Promesa
const ProductDetailsPage = async ({ params }: PageProps) => {
  // 1. Esperamos a que se resuelva la promesa de params
  const { slug } = await params;

  // 2. Ahora slug tiene el valor correcto (ej: "gorra") y no undefined
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
};

export default ProductDetailsPage;

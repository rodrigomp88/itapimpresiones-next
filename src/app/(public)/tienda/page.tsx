import { Product, ProductImage } from "@/types";
import { db } from "@/firebase/config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import ShopClient from "@/components/ShopClient";

async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const productsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Normalización de imágenes: asegurar que siempre sean array de objetos
      let safeImages: (ProductImage | string)[] = [];
      if (Array.isArray(data.images)) {
        safeImages = data.images.map((img: any) => {
          // Si es string, conviértelo al nuevo formato
          if (typeof img === "string") {
            return { url: img, color: "Todos" };
          }
          // Si ya es objeto, úsalo
          return img;
        });
      }

      return {
        id: doc.id,
        name: data.name,
        slug: data.slug || "",
        price: data.price,
        images: safeImages, // Usamos las imágenes normalizadas
        pause: data.pause,
        unity: data.unity,
        size: data.size,
        category: data.category,
        color: data.color, // Color general (legacy)
        bagType: data.bagType,
        description: data.desc || data.description, // Manejo de variantes de nombre
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      } as Product;
    });

    return productsData;
  } catch (error) {
    console.error("Error al obtener los productos en el servidor:", error);
    return [];
  }
}

const ShopPage = async () => {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
};

export default ShopPage;

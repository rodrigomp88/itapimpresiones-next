import { Product, ProductImage } from "@/types";
import { db } from "@/firebase/config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import ShopClient from "@/components/ShopClient";
import { cachedQuery, CACHE_KEYS, CACHE_TTL } from "@/lib/firebase-cache";

// ISR: Revalidar cada hora (3600 segundos)
export const revalidate = 3600;

async function getProducts(): Promise<Product[]> {
  return cachedQuery(
    CACHE_KEYS.productsList(),
    async () => {
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
            images: safeImages,
            pause: data.pause,
            unity: data.unity,
            size: data.size,
            category: data.category,
            color: data.color,
            bagType: data.bagType,
            description: data.desc || data.description,
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
    },
    CACHE_TTL.PRODUCTS_LIST
  );
}

const ShopPage = async () => {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
};

export default ShopPage;

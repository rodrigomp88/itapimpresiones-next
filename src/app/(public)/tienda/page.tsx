import { Product } from "@/types";
import { adminDb } from "@/firebase/admin";
import ShopClient from "@/components/ShopClient";

async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = adminDb.collection("products");

    const q = productsRef.orderBy("createdAt", "desc");

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return [];
    }

    const productsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        slug: data.slug || "",
        price: data.price,
        images: data.images,
        pause: data.pause,
        unity: data.unity,
        size: data.size,
        category: data.category,
        description: data.desc,
        createdAt: data.createdAt.toDate().toISOString(),
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

import { Product } from "@/types";
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

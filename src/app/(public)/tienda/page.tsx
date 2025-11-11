import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Product } from "@/types";
import { db } from "@/firebase/config";
import ShopClient from "@/components/ShopClient";

async function getProducts(): Promise<Product[]> {
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const productsData = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      images: data.images,
      pause: data.pause,
      unity: data.unity,
      size: data.size,
      category: data.category,
      brand: data.brand,
      desc: data.desc,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Product;
  });

  return productsData;
}

const ShopPage = async () => {
  const products = await getProducts();
  return <ShopClient initialProducts={products} />;
};

export default ShopPage;

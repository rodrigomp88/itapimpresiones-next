import AdminProductsClient from "@/components/Admin/AdminProductsClient";
import { db } from "@/firebase/config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Product;
  });
}

const AdminProductsPage = async () => {
  const products = await getProducts();

  return <AdminProductsClient initialProducts={products} />;
};

export default AdminProductsPage;

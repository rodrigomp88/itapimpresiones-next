import AdminProductsClient from "@/src/components/Admin/AdminProductsClient";
import { adminDb } from "@/src/firebase/admin";
import { Product } from "@/src/types";

async function getProducts(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection("products")
    .orderBy("createdAt", "desc")
    .get();
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

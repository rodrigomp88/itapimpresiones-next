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

    // Normalización de datos al vuelo por seguridad
    let images = data.images || [];

    // Si encontramos imágenes antiguas (array de strings), las convertimos
    // para que la interfaz no se rompa
    if (
      Array.isArray(images) &&
      images.length > 0 &&
      typeof images[0] === "string"
    ) {
      images = images.map((url: string) => ({ url, color: "Todos" }));
    }

    return {
      id: doc.id,
      ...data,
      images: images,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString(),
    } as Product;
  });
}

const AdminProductsPage = async () => {
  const products = await getProducts();
  return <AdminProductsClient initialProducts={products} />;
};

export default AdminProductsPage;

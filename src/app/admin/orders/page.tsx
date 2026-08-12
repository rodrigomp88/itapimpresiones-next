import { adminDb } from "@/firebase/admin";
import { Order } from "@/types";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

async function getAllOrders(): Promise<Order[]> {
  if (!adminDb) return [];

  const ordersRef = adminDb.collection("orders").orderBy("createdAt", "desc");
  const snapshot = await ordersRef.get();
  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    const items = data.orderItems || data.cartItems || [];

    // Convertir todos los campos Timestamp a strings serializables
    const serializeTimestamp = (timestamp: { toDate?: () => Date } | string | undefined) => {
      if (timestamp && typeof timestamp === "object" && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toISOString();
      }
      return timestamp;
    };

    return {
      id: doc.id,
      ...data,
      orderItems: items,
      createdAt: serializeTimestamp(data.createdAt),
      updatedAt: serializeTimestamp(data.updatedAt),
    } as Order;
  });
}

const AdminOrdersPage = async () => {
  const orders = await getAllOrders();

  return <OrdersClient initialOrders={orders} />;
};

export default AdminOrdersPage;

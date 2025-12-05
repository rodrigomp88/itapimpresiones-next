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

    return {
      id: doc.id,
      ...data,
      orderItems: items,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Order;
  });
}

const AdminOrdersPage = async () => {
  const orders = await getAllOrders();

  return <OrdersClient initialOrders={orders} />;
};

export default AdminOrdersPage;

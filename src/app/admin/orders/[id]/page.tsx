import AdminOrderDetailsClient from "@/components/Admin/AdminOrderDetailsClient";
import { adminDb } from "@/firebase/admin";
import { Order, Message } from "@/types";
import { notFound } from "next/navigation";

async function getOrderAndMessages(
  orderId: string
): Promise<{ order: Order | null; messages: Message[] }> {
  if (!adminDb) return { order: null, messages: [] };

  const orderRef = adminDb.collection("orders").doc(orderId);
  const messagesRef = orderRef
    .collection("messages")
    .orderBy("timestamp", "asc");

  const [orderSnap, messagesSnap] = await Promise.all([
    orderRef.get(),
    messagesRef.get(),
  ]);

  if (!orderSnap.exists) {
    return { order: null, messages: [] };
  }

  const orderData = orderSnap.data()!;

  const items = orderData.orderItems || orderData.cartItems || [];

  const order = {
    id: orderSnap.id,
    ...orderData,
    orderItems: items,
    createdAt: orderData.createdAt.toDate().toISOString(),
  } as Order;

  const messages = messagesSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate().toISOString(),
    } as Message;
  });

  return { order, messages };
}

const AdminOrderDetailsPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  console.log(`[Admin Server] Fetching order details for ID: ${params.id}`);

  const { order, messages } = await getOrderAndMessages(params.id);

  if (!order) {
    console.log(`[Admin Server] Order with ID: ${params.id} not found.`);
    notFound();
  }

  return (
    <AdminOrderDetailsClient initialOrder={order} initialMessages={messages} />
  );
};

export default AdminOrderDetailsPage;

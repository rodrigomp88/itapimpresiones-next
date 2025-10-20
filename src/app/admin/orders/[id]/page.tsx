import AdminOrderDetailsClient from "@/src/components/Admin/AdminOrderDetailsClient";
import { adminDb } from "@/src/firebase/admin";
import { Order, Message } from "@/src/types";
import { notFound } from "next/navigation";

async function getOrderAndMessages(
  orderId: string
): Promise<{ order: Order | null; messages: Message[] }> {
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
  const order = {
    id: orderSnap.id,
    ...orderData,
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
  const { order, messages } = await getOrderAndMessages(params.id);

  if (!order) {
    notFound();
  }

  return (
    <AdminOrderDetailsClient initialOrder={order} initialMessages={messages} />
  );
};

export default AdminOrderDetailsPage;

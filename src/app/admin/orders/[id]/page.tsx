import AdminOrderDetailsClient from "@/components/Admin/AdminOrderDetailsClient";
import { adminDb } from "@/firebase/admin";
import { Order, Message } from "@/types";
import { notFound } from "next/navigation";

// Definir el tipo para params como promesa
interface PageProps {
  params: Promise<{ id: string }>;
}

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

  // Convertir todos los campos Timestamp a strings serializables
  const serializeTimestamp = (timestamp: { toDate?: () => Date } | string | undefined) => {
    if (timestamp && typeof timestamp === "object" && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toISOString();
    }
    return timestamp;
  };

  const order = {
    id: orderSnap.id,
    ...orderData,
    orderItems: items,
    createdAt: serializeTimestamp(orderData.createdAt),
    updatedAt: serializeTimestamp(orderData.updatedAt),
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

// Actualizar el componente para recibir params como promesa
const AdminOrderDetailsPage = async ({ params }: PageProps) => {
  // Esperar a que se resuelva la promesa
  const { id } = await params;

  const { order, messages } = await getOrderAndMessages(id);

  if (!order) {
    notFound();
  }

  return (
    <AdminOrderDetailsClient initialOrder={order} initialMessages={messages} />
  );
};

export default AdminOrderDetailsPage;

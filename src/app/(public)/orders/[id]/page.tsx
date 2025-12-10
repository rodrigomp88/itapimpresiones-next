import OrderDetailsClient from "@/components/OrderDetailsClient";
import { adminDb } from "@/firebase/admin";
import { authOptions } from "@/lib/authOptions";
import { Order } from "@/types";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

// Definir el tipo para params como promesa
interface PageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(orderId: string): Promise<Order | null> {
  try {
    if (!adminDb) return null;

    const docRef = adminDb.collection("orders").doc(orderId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data();
    if (!data) return null;

    const items = data.orderItems || data.cartItems || [];

    return {
      id: docSnap.id,
      ...data,
      orderItems: items,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Order;
  } catch (error) {
    console.error("Servidor (Cliente): Error al obtener la orden:", error);
    return null;
  }
}

// Actualizar el componente para recibir params como promesa
const OrderDetailsPage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Esperar a que se resuelva la promesa
  const { id: orderId } = await params;

  const order = await getOrder(orderId);

  if (!order || order.userID !== session.user.id) {
    notFound();
  }

  return <OrderDetailsClient order={order} />;
};

export default OrderDetailsPage;

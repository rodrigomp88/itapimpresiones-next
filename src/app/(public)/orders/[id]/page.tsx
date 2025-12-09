import OrderDetailsClient from "@/components/OrderDetailsClient";
import { adminDb } from "@/firebase/admin";
import { authOptions } from "@/lib/authOptions";
import { Order } from "@/types";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

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

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const orderId = params.id;
  const order = await getOrder(orderId);

  if (!order || order.userID !== session.user.id) {
    notFound();
  }

  return <OrderDetailsClient order={order} />;
};

export default OrderDetailsPage;

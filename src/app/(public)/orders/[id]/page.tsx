// src/app/(public)/orders/[id]/page.tsx

import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import OrderDetailsClient from "@/src/components/OrderDetailsClient";
import { adminDb } from "@/src/firebase/admin";
import { Order } from "@/src/types";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

// --- FUNCIÓN 'GETORDER' USANDO EL ADMIN SDK ---
async function getOrder(orderId: string): Promise<Order | null> {
  try {
    // Usamos adminDb para tener acceso privilegiado en el servidor
    const docRef = adminDb.collection("orders").doc(orderId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.log(`Servidor: No se encontró la orden con ID: ${orderId}`);
      return null;
    }

    const data = docSnap.data();
    if (!data) return null; // Comprobación extra por si el documento está vacío

    return {
      id: docSnap.id,
      ...data,
      // Los Timestamps del Admin SDK también necesitan conversión
      createdAt: data.createdAt.toDate().toISOString(),
    } as Order;
  } catch (error) {
    console.error("Servidor: Error al obtener la orden:", error);
    return null;
  }
}

// --- COMPONENTE DE PÁGINA 'ASYNC' CORREGIDO ---
const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Solución para Error 1: Extraemos el ID a una variable
  const orderId = params.id;

  // Solución para Error 2: La función 'getOrder' ahora usa el Admin SDK
  const order = await getOrder(orderId);

  // --- CONTROL DE SEGURIDAD CRÍTICO (HECHO EN EL SERVIDOR) ---
  // 1. Si la orden no existe (URL inválida)...
  // 2. O si el ID del usuario de la sesión NO coincide con el dueño de la orden...
  // ...entonces mostramos una página 404 para que el usuario no sepa que la orden existe.
  if (!order || order.userID !== session.user.id) {
    notFound();
  }

  // Si todo está bien, pasamos la orden al componente de cliente
  return <OrderDetailsClient order={order} />;
};

export default OrderDetailsPage;

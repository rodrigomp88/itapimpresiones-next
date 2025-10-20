"use server";

import { adminDb } from "@/src/firebase/admin";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string
) {
  try {
    const orderRef = adminDb.collection("orders").doc(orderId);
    await orderRef.update({ orderStatus: newStatus });

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "No se pudo actualizar el estado." };
  }
}

export async function sendAdminMessageAction(orderId: string, text: string) {
  if (!text.trim())
    return { success: false, error: "El mensaje no puede estar vacío." };
  try {
    const messagesRef = adminDb
      .collection("orders")
      .doc(orderId)
      .collection("messages");
    await messagesRef.add({
      text,
      sender: "tienda",
      timestamp: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending admin message:", error);
    return { success: false, error: "No se pudo enviar el mensaje." };
  }
}

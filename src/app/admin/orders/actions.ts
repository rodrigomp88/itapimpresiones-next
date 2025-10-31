"use server";

import { adminDb } from "@/src/firebase/admin";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";

async function deleteChatSubcollection(orderId: string) {
  const messagesRef = adminDb
    .collection("orders")
    .doc(orderId)
    .collection("messages");
  const snapshot = await messagesRef.get();

  if (snapshot.empty) {
    return;
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`Chat for order ${orderId} has been deleted.`);
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string
) {
  try {
    const orderRef = adminDb.collection("orders").doc(orderId);
    await orderRef.update({
      orderStatus: newStatus,
      lastUpdatedBy: "tienda",
      hasUnreadClientMessage: true,
    });

    if (newStatus === "Completada" || newStatus === "Cancelada") {
      await deleteChatSubcollection(orderId);
    }

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
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    const currentStatus = orderSnap.data()?.orderStatus;
    if (currentStatus === "Completada" || currentStatus === "Cancelada") {
      return {
        success: false,
        error: "No se puede chatear en una orden finalizada.",
      };
    }

    const messagesRef = orderRef.collection("messages");
    await messagesRef.add({
      text,
      sender: "tienda",
      timestamp: Timestamp.now(),
    });

    await orderRef.update({
      lastUpdatedBy: "tienda",
      hasUnreadClientMessage: true,
    });

    await adminDb.collection("orders").doc(orderId).update({
      lastUpdatedBy: "tienda",
      hasUnreadClientMessage: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending admin message:", error);
    return { success: false, error: "No se pudo enviar el mensaje." };
  }
}

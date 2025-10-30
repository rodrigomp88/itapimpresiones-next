"use server";

import { adminDb } from "@/src/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

export async function sendUserMessageAction(
  orderId: string,
  text: string,
  userId: string
) {
  if (!text.trim()) {
    return { success: false, error: "El mensaje no puede estar vacío." };
  }
  try {
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists || orderSnap.data()?.userID !== userId) {
      throw new Error("Permiso denegado.");
    }

    const messagesRef = orderRef.collection("messages");
    await messagesRef.add({
      text,
      sender: "usuario",
      timestamp: Timestamp.now(),
    });

    await orderRef.update({
      lastUpdatedBy: "cliente",
      hasUnreadAdminMessage: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending user message:", error);
    return { success: false, error: "No se pudo enviar el mensaje." };
  }
}

export async function markOrderAsReadAction(
  orderId: string,
  role: "admin" | "client"
) {
  try {
    const orderRef = adminDb.collection("orders").doc(orderId);
    if (role === "admin") {
      await orderRef.update({ hasUnreadAdminMessage: false });
    } else {
      await orderRef.update({ hasUnreadClientMessage: false });
    }
    return { success: true };
  } catch (error) {
    console.error("Error marking order as read:", error);
    return { success: false, error: "No se pudo marcar como leído." };
  }
}

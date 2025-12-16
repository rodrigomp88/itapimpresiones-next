"use server";

import { adminDb } from "@/firebase/admin";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";

async function deleteChatSubcollection(orderId: string) {
  if (!adminDb) return;

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
    if (!adminDb) return { success: false, error: "Firebase Admin no inicializado." };

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return { success: false, error: "Orden no encontrada." };
    }

    const currentData = orderSnap.data();
    const previousStatus = currentData?.orderStatus;

    // Solo actualizar si el estado realmente cambió
    if (previousStatus === newStatus) {
      return { success: true };
    }

    // Actualizar la orden
    await orderRef.update({
      orderStatus: newStatus,
      lastUpdatedBy: "tienda",
      hasUnreadClientMessage: true,
      updatedAt: Timestamp.now(),
    });

    // Registrar el cambio en el historial
    await orderRef.collection("statusHistory").add({
      previousStatus: previousStatus || "unknown",
      newStatus: newStatus,
      changedBy: "admin",
      changedAt: Timestamp.now(),
      orderId: orderId,
    });

    // Actualizar stock automáticamente cuando la orden pasa a processing
    await updateStockOnOrderStatusChange(orderId, newStatus);

    if (newStatus === "delivered" || newStatus === "cancelled" || newStatus === "refunded") {
      await deleteChatSubcollection(orderId);
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "No se pudo actualizar el estado." };
  }
}

export async function updateStockOnOrderStatusChange(orderId: string, newStatus: string) {
  try {
    if (!adminDb) return;

    // Solo actualizar stock cuando la orden se confirma (procesamiento inicia)
    if (newStatus !== "processing") return;

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) return;

    const orderData = orderSnap.data();
    const orderItems = orderData?.orderItems || [];

    // Procesar cada item de la orden
    for (const item of orderItems) {
      try {
        const productRef = adminDb.collection("products").doc(item.id);
        const productSnap = await productRef.get();

        if (productSnap.exists) {
          const productData = productSnap.data();
          const stockType = productData?.stockType || "physical"; // Default a physical si no está definido

          // Solo actualizar stock para productos físicos
          if (stockType === "physical") {
            const currentStock = productData?.stock || 0;
            const newStock = Math.max(0, currentStock - item.cartQuantity);

            await productRef.update({
              stock: newStock,
              updatedAt: Timestamp.now(),
            });

            console.log(`Stock updated for product ${item.id}: ${currentStock} -> ${newStock}`);
          }
        }
      } catch (error) {
        console.error(`Error updating stock for product ${item.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error updating stock on order status change:", error);
  }
}

export async function sendAdminMessageAction(orderId: string, text: string) {
  if (!text.trim())
    return { success: false, error: "El mensaje no puede estar vacío." };
  try {
    if (!adminDb) return { success: false, error: "Firebase Admin no inicializado." };

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    const currentStatus = orderSnap.data()?.orderStatus;
    if (currentStatus === "delivered" || currentStatus === "cancelled" || currentStatus === "refunded") {
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

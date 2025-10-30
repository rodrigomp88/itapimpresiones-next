// Importar los módulos necesarios
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineString } from "firebase-functions/params"; // Importar para leer secretos
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

// --- LECTURA DE LA VARIABLE DE ENTORNO (SINTAXIS V2) ---
// Definimos el parámetro que esperamos. Coincide con el nombre del secreto.
const adminUID = defineString("ADMIN_UID");

export const onNewOrderCreated = onDocumentCreated(
  "orders/{orderId}",
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.log("No data associated with the event");
      return;
    }

    const orderData = snap.data();
    const clientName = orderData.shippingAddress.name;
    const orderAmount = orderData.orderAmount;

    // Usamos el valor del parámetro definido arriba
    const targetUID = adminUID.value();
    if (!targetUID) {
      logger.error("ADMIN_UID secret is not available.");
      return;
    }

    try {
      const tokenRef = db.collection("fcmTokens").doc(targetUID);
      const tokenDoc = await tokenRef.get();

      if (!tokenDoc.exists) {
        logger.log("Admin FCM token not found for UID:", targetUID);
        return;
      }

      const fcmToken = tokenDoc.data()?.token;
      if (!fcmToken) {
        logger.log("Token field is empty for admin:", targetUID);
        return;
      }

      const payload = {
        notification: {
          title: "¡Nueva Orden Recibida! 🛍️",
          body: `${clientName} ha realizado un pedido de $${orderAmount.toLocaleString(
            "es-AR"
          )}.`,
          sound: "default",
        },
        webpush: {
          fcmOptions: {
            link: "https://itapimpresiones.vercel.app/admin/orders",
          },
        },
      };

      await messaging.send({
        token: fcmToken,
        notification: payload.notification,
        webpush: payload.webpush,
      });

      logger.log("Push notification sent successfully to admin:", targetUID);
    } catch (error) {
      logger.error("Error sending push notification:", error);
    }
  }
);

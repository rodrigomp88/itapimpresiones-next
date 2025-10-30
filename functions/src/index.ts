import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();
// Este secreto ahora puede ser una lista separada por comas, o simplemente lo quitamos
// y nos basamos en la colección 'admins'. Por simplicidad, nos basaremos
// en la colección 'admins' que ya usas para tus reglas de seguridad.
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

    try {
      // 1. Obtener los UIDs de TODOS los administradores
      const adminsSnapshot = await db.collection("admins").get();
      const adminUIDs = adminsSnapshot.docs.map((doc) => doc.id);

      if (adminUIDs.length === 0) {
        logger.log("No admins found in 'admins' collection.");
        return;
      }

      // 2. Obtener los tokens de FCM para esos UIDs
      const tokensSnapshot = await db
        .collection("fcmTokens")
        .where(admin.firestore.FieldPath.documentId(), "in", adminUIDs)
        .get();

      const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

      if (tokens.length === 0) {
        logger.log("No FCM tokens found for any admins.");
        return;
      }

      logger.log(
        `Found ${tokens.length} admin tokens to send notification to.`
      );

      // 3. Preparar y enviar la notificación a TODOS los tokens
      const payload = {
        notification: {
          title: "¡Nueva Orden Recibida! 🛍️",
          body: `${clientName} ha realizado un pedido de $${orderAmount.toLocaleString(
            "es-AR"
          )}.`,
        },
        webpush: {
          fcmOptions: {
            link: "https://itapimpresiones.vercel.app/admin/orders",
          },
        },
      };

      // Usamos 'sendToDevice' que acepta un array de tokens
      await messaging.sendToDevice(tokens, payload);

      logger.log("Push notification sent successfully to all admin devices.");
    } catch (error) {
      logger.error("Error sending push notification:", error);
    }
  }
);

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

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
      const adminsSnapshot = await db.collection("admins").get();
      const adminUIDs = adminsSnapshot.docs.map((doc) => doc.id);

      if (adminUIDs.length === 0) {
        logger.log("No admins found in 'admins' collection.");
        return;
      }

      // --- INICIO DE LA MODIFICACIÓN ---
      const allTokens: string[] = [];

      // Creamos un array de promesas. Cada promesa buscará los tokens de un admin.
      const tokenPromises = adminUIDs.map((uid) =>
        db.collection("fcmTokens").doc(uid).collection("tokens").get()
      );

      // Ejecutamos todas las búsquedas de tokens en paralelo para mayor eficiencia.
      const results = await Promise.all(tokenPromises);

      // Recorremos los resultados de cada búsqueda.
      results.forEach((snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            // El ID de cada documento en la subcolección 'tokens' es el propio token.
            allTokens.push(doc.id);
          });
        }
      });
      // --- FIN DE LA MODIFICACIÓN ---

      if (allTokens.length === 0) {
        logger.log("No FCM tokens found for any admins.");
        return;
      }

      logger.log(
        `Found ${allTokens.length} admin tokens to send notification to.`
      );

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

      // No se necesitan cambios aquí, 'sendToDevice' ya acepta un array de tokens.
      await messaging.sendToDevice(allTokens, payload);

      logger.log("Push notification sent successfully to all admin devices.");
    } catch (error) {
      logger.error("Error sending push notification:", error);
    }
  }
);

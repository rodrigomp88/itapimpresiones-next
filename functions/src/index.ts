import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Inicializar Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// Sintaxis v2 correcta para el disparador de Firestore
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

    // Acceso correcto a la variable de entorno de Firebase
    const adminUID = functions.config().config.admin_uid;
    if (!adminUID) {
      logger.error(
        "'firebase functions:config:set config.admin_uid=\"YOUR_UID\"'"
      );
      return;
    }

    try {
      const tokenRef = db.collection("fcmTokens").doc(adminUID);
      const tokenDoc = await tokenRef.get();

      if (!tokenDoc.exists) {
        logger.log("Admin FCM token not found for UID:", adminUID);
        return;
      }

      const fcmToken = tokenDoc.data()?.token;
      if (!fcmToken) {
        logger.log("Token field is empty for admin:", adminUID);
        return;
      }

      const payload = {
        notification: {
          title: "¡Nueva Orden Recibida! 🛍️",
          body: `${clientName} hay pedido de $${orderAmount.toLocaleString(
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

      logger.log("Push notification sent successfully to admin:", adminUID);
    } catch (error) {
      logger.error("Error sending push notification:", error);
    }
  }
);

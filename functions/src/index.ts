import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
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
        logger.log("No admins found.");
        return;
      }

      const allTokens: string[] = [];
      const tokenPromises = adminUIDs.map((uid) =>
        db.collection("fcmTokens").doc(uid).collection("tokens").get()
      );

      const results = await Promise.all(tokenPromises);
      results.forEach((snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach((doc) => allTokens.push(doc.id));
        }
      });

      if (allTokens.length === 0) {
        logger.log("No FCM tokens found.");
        return;
      }

      logger.log(
        `Found ${allTokens.length} tokens. Attempting to send notification.`
      );

      const message = {
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
        tokens: allTokens,
      };

      const response = await messaging.sendEachForMulticast(message);

      logger.log(response.successCount + " messages were sent successfully");

      if (response.failureCount > 0) {
        const tokensToRemove: Promise<any>[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const error = resp.error!;
            const failedToken = allTokens[idx];
            logger.error("Failure sending notification to", failedToken, error);
            if (
              error.code === "messaging/invalid-registration-token" ||
              error.code === "messaging/registration-token-not-registered"
            ) {
              logger.log("Identified invalid token for deletion:", failedToken);
              adminUIDs.forEach((uid) => {
                const tokenRef = db
                  .collection("fcmTokens")
                  .doc(uid)
                  .collection("tokens")
                  .doc(failedToken);
                tokensToRemove.push(tokenRef.delete());
              });
            }
          }
        });

        if (tokensToRemove.length > 0) {
          await Promise.all(tokensToRemove);
          logger.log(
            `${tokensToRemove.length} invalid tokens have been cleaned up.`
          );
        }
      }
    } catch (error) {
      logger.error("Critical error in onNewOrderCreated function:", error);
    }
  }
);

export const onOrderStatusUpdated = onDocumentUpdated(
  "orders/{orderId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    // Si no hay datos o el estado no cambió, no hacemos nada.
    if (
      !beforeData ||
      !afterData ||
      beforeData.orderStatus === afterData.orderStatus
    ) {
      return;
    }

    // Solo enviar notificación si el cambio fue hecho por la tienda.
    if (afterData.lastUpdatedBy !== "tienda") {
      logger.log("Update was not made by the store. No notification sent.");
      return;
    }

    const userId = afterData.userID;
    const newStatus = afterData.orderStatus;
    const orderId = event.params.orderId;

    logger.log(
      `Status changed for order ${orderId} to "${newStatus}". Notifying user ${userId}.`
    );

    try {
      // Buscar los tokens del usuario específico
      const tokensSnapshot = await db
        .collection("fcmTokens")
        .doc(userId)
        .collection("tokens")
        .get();

      if (tokensSnapshot.empty) {
        logger.log(`No FCM tokens found for user ${userId}.`);
        return;
      }

      const tokens = tokensSnapshot.docs.map((doc) => doc.id);

      const payload = {
        notification: {
          title: "Actualización de tu Pedido 📦",
          body: `El estado de tu orden #${orderId.slice(
            0,
            6
          )} ha cambiado a "${newStatus}".`,
        },
        webpush: {
          fcmOptions: {
            link: `https://itapimpresiones.vercel.app/orders/${orderId}`,
          },
        },
      };

      await messaging.sendToDevice(tokens, payload);
      logger.log(`Notification sent successfully to user ${userId}.`);

      // Aquí también puedes añadir la lógica para limpiar tokens inválidos si lo deseas.
    } catch (error) {
      logger.error(
        `Error sending status update notification to user ${userId}:`,
        error
      );
    }
  }
);

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

    if (
      !beforeData ||
      !afterData ||
      beforeData.orderStatus === afterData.orderStatus
    ) {
      return;
    }

    if (afterData.lastUpdatedBy !== "tienda") {
      return;
    }

    const userId = afterData.userID;
    const newStatus = afterData.orderStatus;
    const orderId = event.params.orderId;

    logger.log(
      `Status changed for order ${orderId} to "${newStatus}". Notifying user ${userId}.`
    );

    try {
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

      const message = {
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
        tokens: tokens,
      };

      const response = await messaging.sendEachForMulticast(message);

      logger.log(
        response.successCount +
        ` status update messages were sent successfully to user ${userId}.`
      );

      if (response.failureCount > 0) {
        const tokensToRemove: Promise<any>[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const error = resp.error!;
            if (
              error.code === "messaging/invalid-registration-token" ||
              error.code === "messaging/registration-token-not-registered"
            ) {
              const invalidToken = tokens[idx];
              tokensToRemove.push(
                db
                  .collection("fcmTokens")
                  .doc(userId)
                  .collection("tokens")
                  .doc(invalidToken)
                  .delete()
              );
            }
          }
        });
        await Promise.all(tokensToRemove);
      }
    } catch (error) {
      logger.error(
        `Error sending status update notification to user ${userId}:`,
        error
      );
    }
  }
);

export const onNewChatMessage = onDocumentCreated(
  "orders/{orderId}/messages/{messageId}",
  async (event) => {
    const messageData = event.data?.data();
    const orderId = event.params.orderId;

    if (!messageData) {
      logger.log("No message data found.");
      return;
    }

    try {
      const orderDoc = await db.collection("orders").doc(orderId).get();
      if (!orderDoc.exists) {
        logger.log(`Order ${orderId} not found.`);
        return;
      }
      const orderData = orderDoc.data()!;

      if (messageData.sender === "usuario") {
        const clientName = orderData.shippingAddress.name;
        logger.log(
          `New message from client ${clientName} on order ${orderId}. Notifying admins.`
        );

        const adminsSnapshot = await db.collection("admins").get();
        const adminUIDs = adminsSnapshot.docs.map((doc) => doc.id);
        if (adminUIDs.length === 0) return;

        const allAdminTokens: string[] = [];
        const tokenPromises = adminUIDs.map((uid) =>
          db.collection("fcmTokens").doc(uid).collection("tokens").get()
        );
        const results = await Promise.all(tokenPromises);
        results.forEach((snapshot) => {
          if (!snapshot.empty) {
            snapshot.forEach((doc) => allAdminTokens.push(doc.id));
          }
        });

        if (allAdminTokens.length > 0) {
          const message = {
            notification: {
              title: "Nuevo Mensaje de Cliente 💬",
              body: `${clientName} ha enviado un mensaje en la orden #${orderId.slice(
                0,
                6
              )}.`,
            },
            webpush: {
              fcmOptions: {
                link: `https://itapimpresiones.vercel.app/admin/orders/${orderId}`,
              },
            },
            tokens: allAdminTokens,
          };
          await messaging.sendEachForMulticast(message);
        }
      } else if (messageData.sender === "tienda") {
        const userId = orderData.userID;
        logger.log(
          `New message from store on order ${orderId}. Notifying user ${userId}.`
        );

        const tokensSnapshot = await db
          .collection("fcmTokens")
          .doc(userId)
          .collection("tokens")
          .get();
        if (tokensSnapshot.empty) {
          logger.log(`No FCM tokens found for user ${userId}.`);
          return;
        }

        const userTokens = tokensSnapshot.docs.map((doc) => doc.id);

        if (userTokens.length > 0) {
          const message = {
            notification: {
              title: "Nuevo Mensaje de Itap Impresiones 📬",
              body: `Tienes una nueva respuesta en tu orden #${orderId.slice(
                0,
                6
              )}.`,
            },
            webpush: {
              fcmOptions: {
                link: `https://itapimpresiones.vercel.app/orders/${orderId}`,
              },
            },
            tokens: userTokens,
          };
          await messaging.sendEachForMulticast(message);
        }
      }
    } catch (error) {
      logger.error(
        `Error sending chat notification for order ${orderId}:`,
        error
      );
    }
  }
);
export const onNewContactSubmission = onDocumentCreated(
  "contact_submissions/{submissionId}",
  async (event) => {
    const submissionData = event.data?.data();
    const submissionId = event.params.submissionId;

    if (!submissionData) {
      logger.log("No submission data found.");
      return;
    }

    const { name, formType } = submissionData;
    const formTypeLabel =
      ({
        services: "Servicios",
        bags: "Bolsas",
        apparel: "Indumentaria",
      } as Record<string, string>)[formType] || formType;

    try {
      // 1. Get Admins
      const adminsSnapshot = await db.collection("admins").get();
      const adminUIDs = adminsSnapshot.docs.map((doc) => doc.id);

      if (adminUIDs.length === 0) {
        logger.log("No admins found in 'admins' collection.");
        return;
      }

      // 2. Get Tokens
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
        logger.log("No FCM tokens found for admins.");
        return;
      }

      // 3. Send Notification
      const message = {
        notification: {
          title: "Nueva Cotización Recibida 📝",
          body: `${name} ha solicitado cotización de ${formTypeLabel}.`,
        },
        webpush: {
          fcmOptions: {
            link: "https://itapimpresiones.vercel.app/admin/submissions",
          },
        },
        tokens: allTokens,
      };

      const response = await messaging.sendEachForMulticast(message);
      logger.log(
        `${response.successCount} notifications sent for new submission ${submissionId}`
      );

      // 4. Cleanup Invalid Tokens
      if (response.failureCount > 0) {
        const tokensToRemove: Promise<any>[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const error = resp.error!;
            const failedToken = allTokens[idx];
            if (
              error.code === "messaging/invalid-registration-token" ||
              error.code === "messaging/registration-token-not-registered"
            ) {
              adminUIDs.forEach((uid) => {
                tokensToRemove.push(
                  db
                    .collection("fcmTokens")
                    .doc(uid)
                    .collection("tokens")
                    .doc(failedToken)
                    .delete()
                );
              });
            }
          }
        });
        await Promise.all(tokensToRemove);
      }
    } catch (error) {
      logger.error("Error sending contact submission notification:", error);
    }
  }
);

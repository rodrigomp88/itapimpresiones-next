import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

export const onNewOrderCreated = onDocumentCreated(
  "orders/{orderId}",
  async (event) => {
    const orderData = event.data?.data();
    if (!orderData) return;
    const clientName = orderData.shippingAddress.name;
    const orderAmount = orderData.orderAmount;

    try {
      const adminsSnapshot = await db.collection("admins").get();
      const adminUIDs = adminsSnapshot.docs.map((doc) => doc.id);

      if (adminUIDs.length === 0) {
        console.log("No admins found.");
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
        console.log("No FCM tokens found.");
        return;
      }

      console.log(
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
            link: process.env.FRONTEND_URL || "http://localhost:3000/admin/orders",
          },
        },
        tokens: allTokens,
      };

      const response = await messaging.sendEachForMulticast(message);

      console.log(response.successCount + " messages were sent successfully");

      if (response.failureCount > 0) {
        const tokensToRemove: Promise<any>[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const error = resp.error!;
            const failedToken = allTokens[idx];
            console.error("Failure sending notification to", failedToken, error);
            if (
              error.code === "messaging/invalid-registration-token" ||
              error.code === "messaging/registration-token-not-registered"
            ) {
              console.log("Identified invalid token for deletion:", failedToken);
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
          console.log(
            `${tokensToRemove.length} invalid tokens have been cleaned up.`
          );
        }
      }
    } catch (error) {
      console.error("Critical error in onNewOrderCreated function:", error);
    }
  });

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

    console.log(
      `Status changed for order ${orderId} to "${newStatus}". Notifying user ${userId}.`
    );

    try {
      const tokensSnapshot = await db
        .collection("fcmTokens")
        .doc(userId)
        .collection("tokens")
        .get();

      if (tokensSnapshot.empty) {
        console.log(`No FCM tokens found for user ${userId}.`);
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
            link: `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/${orderId}`,
          },
        },
        tokens: tokens,
      };

      const response = await messaging.sendEachForMulticast(message);

      console.log(
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
      console.error(
        `Error sending status update notification to user ${userId}:`,
        error
      );
    }
  });

export const onNewChatMessage = onDocumentCreated(
  "orders/{orderId}/messages/{messageId}",
  async (event) => {
    const messageData = event.data?.data();
    const orderId = event.params.orderId;

    if (!messageData) return;

    try {
      const orderDoc = await db.collection("orders").doc(orderId).get();
      if (!orderDoc.exists) {
        console.log(`Order ${orderId} not found.`);
        return;
      }
      const orderData = orderDoc.data()!;

      if (messageData.sender === "usuario") {
        const clientName = orderData.shippingAddress.name;
        console.log(
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
                link: `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/orders/${orderId}`,
              },
            },
            tokens: allAdminTokens,
          };
          await messaging.sendEachForMulticast(message);
        }
      } else if (messageData.sender === "tienda") {
        const userId = orderData.userID;
        console.log(
          `New message from store on order ${orderId}. Notifying user ${userId}.`
        );

        const tokensSnapshot = await db
          .collection("fcmTokens")
          .doc(userId)
          .collection("tokens")
          .get();
        if (tokensSnapshot.empty) {
          console.log(`No FCM tokens found for user ${userId}.`);
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
                link: `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/${orderId}`,
              },
            },
            tokens: userTokens,
          };
          await messaging.sendEachForMulticast(message);
        }
      }
    } catch (error) {
      console.error(
        `Error sending chat notification for order ${orderId}:`,
        error
      );
    }
  });
export const onNewContactSubmission = onDocumentCreated(
  "contact_submissions/{submissionId}",
  async (event) => {
    const submissionData = event.data?.data();
    if (!submissionData) return;
    const submissionId = event.params.submissionId;

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
        console.log("No admins found in 'admins' collection.");
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
        console.log("No FCM tokens found for admins.");
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
            link: `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/submissions`,
          },
        },
        tokens: allTokens,
      };

      const response = await messaging.sendEachForMulticast(message);
      console.log(
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
      console.error("Error sending contact submission notification:", error);
    }
  });

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email functions
export const sendOrderConfirmationEmail = onDocumentCreated(
  "orders/{orderId}",
  async (event) => {
    const orderData = event.data?.data();
    if (!orderData) return;
    const orderId = event.params.orderId;
    const clientEmail = orderData.shippingAddress.email;
    const clientName = orderData.shippingAddress.name;
    const orderAmount = orderData.orderAmount;

    const mailOptions = {
      from: `"Itap Impresiones" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: `Confirmación de Pedido #${orderId.slice(0, 6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">¡Gracias por tu pedido, ${clientName}!</h1>
          <p>Tu orden ha sido recibida exitosamente.</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Detalles del Pedido</h3>
            <p><strong>Número de Orden:</strong> ${orderId.slice(0, 6)}</p>
            <p><strong>Total:</strong> $${orderAmount.toLocaleString('es-AR')}</p>
            <p><strong>Estado:</strong> ${orderData.orderStatus}</p>
          </div>
          <p>Te mantendremos informado sobre el progreso de tu pedido por email.</p>
          <p>Si tienes alguna pregunta, puedes responder a este email.</p>
          <br>
          <p>Saludos,<br>Equipo de Itap Impresiones</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${clientEmail}`);
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
    }
  });

export const sendOrderStatusUpdateEmail = onDocumentUpdated(
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

    const orderId = event.params.orderId;
    const clientEmail = afterData.shippingAddress.email;
    const clientName = afterData.shippingAddress.name;
    const newStatus = afterData.orderStatus;

    const mailOptions = {
      from: `"Itap Impresiones" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: `Actualización de tu Pedido #${orderId.slice(0, 6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Actualización de tu Pedido</h1>
          <p>Hola ${clientName},</p>
          <p>Tu pedido ha cambiado de estado.</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Nuevo Estado</h3>
            <p><strong>Número de Orden:</strong> ${orderId.slice(0, 6)}</p>
            <p><strong>Estado Actual:</strong> ${newStatus}</p>
          </div>
          <p>Puedes revisar el detalle completo de tu pedido en: <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/${orderId}">Ver Pedido</a></p>
          <br>
          <p>Saludos,<br>Equipo de Itap Impresiones</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Order status update email sent to ${clientEmail} for order ${orderId}`);
    } catch (error) {
      console.error("Error sending order status update email:", error);
    }
  });

export const sendLowStockEmail = onDocumentUpdated(
  "products/{productId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) return;

    const productId = event.params.productId;
    const productName = afterData.name || "Producto";
    const currentStock = afterData.stock || 0;
    const previousStock = beforeData.stock || 0;

    // Send email if stock drops below 5 and was above 5 before
    if (currentStock <= 5 && previousStock > 5) {
      try {
        const adminsSnapshot = await db.collection("admins").get();
        const adminEmails: string[] = [];

        for (const doc of adminsSnapshot.docs) {
          const adminData = doc.data();
          if (adminData.email) {
            adminEmails.push(adminData.email);
          }
        }

        if (adminEmails.length === 0) {
          console.log("No admin emails found for low stock notification.");
          return;
        }

        const mailOptions = {
          from: `"Sistema Itap Impresiones" <${process.env.EMAIL_USER}>`,
          to: adminEmails.join(","),
          subject: `⚠️ Alerta de Stock Bajo - ${productName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #ff6b6b;">⚠️ Alerta de Stock Bajo</h1>
              <p>El siguiente producto tiene stock bajo:</p>
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3>${productName}</h3>
                <p><strong>ID del Producto:</strong> ${productId}</p>
                <p><strong>Stock Actual:</strong> ${currentStock}</p>
                <p><strong>Stock Anterior:</strong> ${previousStock}</p>
              </div>
              <p>Por favor, revisa el inventario y considera reponer stock.</p>
              <p><a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/products" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Productos</a></p>
              <br>
              <p>Sistema Automático,<br>Itap Impresiones</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Low stock email sent for product ${productName} (${productId})`);
      } catch (error) {
        console.error("Error sending low stock email:", error);
      }
    }
  });

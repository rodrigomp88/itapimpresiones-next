"use server";

import { adminDb, adminMessaging } from "@/firebase/admin";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function saveFCMTokenAction(token: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Usuario no autenticado." };
  }

  if (session.user.email !== process.env.NEXT_PUBLIC_USER_ADMIN) {
    return { success: false, error: "No es un admin." };
  }

  try {
    if (!adminDb) {
      return { success: false, error: "Firebase Admin no inicializado." };
    }

    const tokenRef = adminDb
      .collection("fcmTokens")
      .doc(session.user.id)
      .collection("tokens")
      .doc(token);

    await tokenRef.set({ createdAt: new Date() }, { merge: true });

    console.log("FCM Token saved for admin:", session.user.id);
    return { success: true };
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return { success: false, error: "No se pudo guardar el token." };
  }
}



export async function sendTestNotificationAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Usuario no autenticado." };
  }

  try {
    if (!adminDb) {
      return { success: false, error: "Firebase Admin no inicializado." };
    }

    const tokensSnapshot = await adminDb
      .collection("fcmTokens")
      .doc(session.user.id)
      .collection("tokens")
      .get();

    if (tokensSnapshot.empty) {
      return { success: false, error: "No se encontraron tokens FCM para este usuario." };
    }

    const tokens = tokensSnapshot.docs.map((doc) => doc.id);

    const message = {
      notification: {
        title: "🔔 Notificación de Prueba",
        body: "Si ves esto, ¡las notificaciones funcionan correctamente!",
      },
      tokens: tokens,
    };

    if (!adminMessaging) {
      return { success: false, error: "Firebase Admin Messaging no inicializado." };
    }

    const response = await adminMessaging.sendEachForMulticast(message);

    return {
      success: true,
      count: response.successCount,
      failures: response.failureCount
    };
  } catch (error) {
    console.error("Error sending test notification:", error);
    return { success: false, error: "Error al enviar la notificación." };
  }
}

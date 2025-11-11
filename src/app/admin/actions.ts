"use server";

import { adminDb } from "@/firebase/admin";
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

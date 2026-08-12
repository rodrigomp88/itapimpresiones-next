import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const { userId, token } = await request.json();

    if (!userId || !token) {
      return NextResponse.json(
        { error: "userId y token son requeridos" },
        { status: 400 }
      );
    }

    // Guardar token en la colección de usuarios
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        fcmTokens: arrayUnion(token),
        notificationsEnabled: true,
        lastTokenUpdate: serverTimestamp(),
      },
      { merge: true }
    );

    // También guardar en colección de tokens para envío masivo
    const tokenRef = doc(db, "fcmTokens", token);
    await setDoc(tokenRef, {
      userId,
      token,
      createdAt: serverTimestamp(),
      platform: "web",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error guardando token FCM:", error);
    return NextResponse.json(
      { error: "Error guardando token" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    // Desactivar notificaciones para el usuario
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        notificationsEnabled: false,
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error desactivando notificaciones:", error);
    return NextResponse.json(
      { error: "Error desactivando notificaciones" },
      { status: 500 }
    );
  }
}

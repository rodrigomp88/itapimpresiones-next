import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // <--- Importante: desde lib
import { adminAuth } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    // Asegurarse de que adminAuth esté inicializado
    if (!adminAuth) {
      console.error("Firebase Admin SDK not initialized");
      return NextResponse.json(
        { error: "Server Configuration Error" },
        { status: 500 }
      );
    }

    const firebaseToken = await adminAuth.createCustomToken(session.user.id);

    return NextResponse.json({ firebaseToken });
  } catch (error: any) {
    console.error("Error creating custom token:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

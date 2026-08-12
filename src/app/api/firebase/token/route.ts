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
      return NextResponse.json(
        { firebaseToken: null, error: "Admin SDK not configured" },
        { status: 200 }
      );
    }

    const firebaseToken = await adminAuth.createCustomToken(session.user.id);

    return NextResponse.json({ firebaseToken });
  } catch (error: unknown) {
    console.error("Error creating custom token:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

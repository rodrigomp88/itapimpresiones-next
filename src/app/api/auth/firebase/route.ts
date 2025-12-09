import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // <--- Importación corregida
import { admin } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const firebaseToken = await admin.auth().createCustomToken(session.user.id);
    return NextResponse.json({ firebaseToken });
  } catch (error) {
    console.error("Error creating custom token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

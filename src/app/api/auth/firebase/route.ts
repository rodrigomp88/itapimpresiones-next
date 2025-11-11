import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { admin } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firebaseToken = await admin.auth().createCustomToken(session.user.id);
  return NextResponse.json({ firebaseToken });
}

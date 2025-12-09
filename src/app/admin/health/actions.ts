"use server";

import { adminDb } from "@/firebase/admin";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export interface HealthCheckResult {
  isAdminConfigured: boolean;
  adminEmail: string | null;
  adminUid: string | null;
  isInAdminsCollection: boolean;
  hasFcmToken: boolean;
  adminCount: number;
}

export async function checkSystemHealthAction(): Promise<HealthCheckResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      isAdminConfigured: false,
      adminEmail: null,
      adminUid: null,
      isInAdminsCollection: false,
      hasFcmToken: false,
      adminCount: 0,
    };
  }

  const result: HealthCheckResult = {
    isAdminConfigured: false,
    adminEmail: session.user.email,
    adminUid: session.user.id,
    isInAdminsCollection: false,
    hasFcmToken: false,
    adminCount: 0,
  };

  try {
    if (!adminDb) {
      console.error("AdminDB not initialized");
      return result;
    }

    // 1. Check if current user is the hardcoded admin
    const envAdminEmail = process.env.NEXT_PUBLIC_USER_ADMIN;
    result.isAdminConfigured = session.user.email === envAdminEmail;

    // 2. Check if UID exists in 'admins' collection
    // Note: session.user.id needs to be populated correctly by NextAuth options
    if (session.user.id) {
      const adminDoc = await adminDb
        .collection("admins")
        .doc(session.user.id)
        .get();
      result.isInAdminsCollection = adminDoc.exists;

      // 3. Check if UID has tokens
      const tokensSnapshot = await adminDb
        .collection("fcmTokens")
        .doc(session.user.id)
        .collection("tokens")
        .get();
      result.hasFcmToken = !tokensSnapshot.empty;
    }

    // 4. Count total admins
    const adminsList = await adminDb.collection("admins").get();
    result.adminCount = adminsList.size;
  } catch (error) {
    console.error("Health check failed:", error);
  }

  return result;
}

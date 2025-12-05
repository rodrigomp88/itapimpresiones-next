import admin from "firebase-admin";

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;
let adminMessaging: admin.messaging.Messaging | null = null;

try {
  if (!admin.apps.length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
      });
      console.log("Firebase Admin SDK initialized successfully.");
    } else {
      console.warn(
        "FIREBASE_SERVICE_ACCOUNT_JSON not provided. Admin SDK not initialized."
      );
    }
  }

  if (admin.apps.length) {
    adminAuth = admin.auth();
    adminDb = admin.firestore();
    adminStorage = admin.storage();
    adminMessaging = admin.messaging();
  }
} catch (error: any) {
  console.error("Firebase Admin SDK initialization error:", error.message);
}

export { admin, adminAuth, adminDb, adminStorage, adminMessaging };

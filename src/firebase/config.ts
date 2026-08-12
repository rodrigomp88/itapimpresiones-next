import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";

import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasValidConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (hasValidConfig) {
  console.log("Firebase config loaded:", {
    apiKey: firebaseConfig.apiKey?.substring(0, 10) + "...",
    projectId: firebaseConfig.projectId,
  });
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error: any) {
    console.error("Firebase Auth initialization error:", error.message);
  }

  try {
    if (app) {
      db = getFirestore(app);
    }
  } catch (error: any) {
    console.error("Firebase Firestore initialization error:", error.message);
  }

  try {
    if (app) {
      storage = getStorage(app);
    }
  } catch (error: any) {
    console.error("Firebase Storage initialization error:", error.message);
  }
} else {
  console.warn("Firebase config not found. Firebase services disabled.");
}

export { app, auth, db, storage };
export default app;

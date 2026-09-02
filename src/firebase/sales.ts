// Firebase instance del sistema de gestión (itap-impresiones-app).
// Proyecto: studio-4130674340-85ea0 — catálogo/presupuestos/promos públicas.
// Se usa una instancia named ("sales") para no interferir con la app
// web existente (itap-shop: auth/admin/checkout legacy).

import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import {
  getAuth,
  Auth,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

const SALES_APP_NAME = "sales";

// Config pública del proyecto de la app. Puede sobreescribirse con env vars.
const salesConfig = {
  projectId:
    process.env.NEXT_PUBLIC_SALES_FIREBASE_PROJECTID || "studio-4130674340-85ea0",
  appId:
    process.env.NEXT_PUBLIC_SALES_FIREBASE_APPID ||
    "1:945662080378:web:f58473f9001f3676e192c3",
  apiKey:
    process.env.NEXT_PUBLIC_SALES_FIREBASE_APIKEY ||
    "AIzaSyCZHUIP6rMU-bustb3i0-KYVckoimY4Qjc",
  authDomain:
    process.env.NEXT_PUBLIC_SALES_FIREBASE_AUTHDOMAIN ||
    "studio-4130674340-85ea0.firebaseapp.com",
  storageBucket:
    process.env.NEXT_PUBLIC_SALES_FIREBASE_STORAGEBUCKET ||
    "studio-4130674340-85ea0.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_SALES_FIREBASE_MESSAGINGSENDERID || "945662080378",
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getSalesApp(): FirebaseApp {
  if (_app) return _app;
  const existing = getApps().find((a) => a.name === SALES_APP_NAME);
  _app = existing ?? initializeApp(salesConfig, SALES_APP_NAME);
  return _app;
}

export function getSalesDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getSalesApp());
  return _db;
}

export function getSalesAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getSalesApp());
  return _auth;
}

// signInAnonymously lazy: se dispara solo una vez y se comparte la promise.
let signInPromise: Promise<unknown> | null = null;

export function ensureSalesAuth(): Promise<unknown> {
  const auth = getSalesAuth();
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          unsub();
          resolve(user);
        } else if (!signInPromise) {
          signInPromise = signInAnonymously(auth)
            .then((cred) => {
              unsub();
              resolve(cred.user);
            })
            .catch(reject);
        }
      },
      reject
    );
    // Si ya hay sesión la promise resolve arriba; sino arrancás anonymous.
    if (!auth.currentUser && !signInPromise) {
      signInPromise = signInAnonymously(auth)
        .then((cred) => {
          unsub();
          resolve(cred.user);
        })
        .catch(reject);
    }
  });
}

export default getSalesApp;

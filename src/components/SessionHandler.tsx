"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

const SessionHandler = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const syncFirebaseAuth = async () => {
      // Solo sincronizar si hay sesión de NextAuth y
      // el usuario de Firebase no coincide o no existe
      if (session?.user?.id && auth.currentUser?.uid !== session.user.id) {
        try {
          // 1. Obtener token personalizado
          const response = await fetch("/api/auth/firebase-token", {
            method: "POST",
          });

          if (!response.ok) throw new Error("Failed to fetch custom token");

          const data = await response.json();

          // 2. Iniciar sesión en Firebase (Cliente)
          const userCredential = await signInWithCustomToken(
            auth,
            data.firebaseToken
          );
          const firebaseUser = userCredential.user;

          // 3. Sincronizar documento de usuario en Firestore
          // IMPORTANTE: Usamos firebaseUser.uid para asegurar coincidencia con reglas de seguridad
          const userRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userRef);

          if (!docSnap.exists()) {
            await setDoc(
              userRef,
              {
                name:
                  session.user.name || firebaseUser.displayName || "Usuario",
                mail: session.user.email || firebaseUser.email,
                phone: "",
                createdAt: new Date().toISOString(),
                role: "user",
              },
              { merge: true }
            ); // Merge por seguridad
          }
        } catch (error) {
          console.error("Error syncing Firebase auth:", error);
        }
      } else if (!session && auth.currentUser) {
        // Si no hay sesión de NextAuth, cerrar la de Firebase para mantener sincronía
        await auth.signOut();
      }
    };

    syncFirebaseAuth();
  }, [status, session]);

  return null;
};

export default SessionHandler;

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const SessionHandler = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const syncFirebaseAuth = async () => {
      // Dynamic imports to avoid HMR issues
      const { signInWithCustomToken } = await import("firebase/auth");
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const { auth, db } = await import("@/firebase/config");

      if (
        session?.user?.id &&
        (!auth.currentUser || auth.currentUser.uid !== session.user.id)
      ) {
        try {
          // CAMBIO AQUÍ: Nueva ruta
          const response = await fetch("/api/firebase/token", {
            method: "POST",
          });

          if (!response.ok) {
            console.warn("Firebase token unavailable (status:", response.status, ")");
            return;
          }

          const data = await response.json();

          if (!data.firebaseToken) {
            // Admin SDK not configured — skip silently
            return;
          }

          if (data.firebaseToken && auth) {
            await signInWithCustomToken(auth, data.firebaseToken);

            // ... resto del código igual ...
            if (auth.currentUser) {
              const userRef = doc(db, "users", auth.currentUser.uid);
              const docSnap = await getDoc(userRef);
              if (!docSnap.exists()) {
                await setDoc(
                  userRef,
                  {
                    name: session.user.name,
                    mail: session.user.email,
                    phone: "",
                    role: "user",
                  },
                  { merge: true }
                );
              }
            }
          }
        } catch (error) {
          console.error("Error syncing Firebase auth:", error);
        }
      } else if (!session && auth?.currentUser) {
        await auth.signOut();
      }
    };

    syncFirebaseAuth();
  }, [status, session]);

  return null;
};

export default SessionHandler;

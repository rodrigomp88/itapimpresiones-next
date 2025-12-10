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
            const errorText = await response.text();
            console.error("Error fetching token:", response.status, errorText);
            throw new Error("Failed to fetch custom token");
          }

          const data = await response.json();

          if (data.firebaseToken) {
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
      } else if (!session && auth.currentUser) {
        await auth.signOut();
      }
    };

    syncFirebaseAuth();
  }, [status, session]);

  return null;
};

export default SessionHandler;

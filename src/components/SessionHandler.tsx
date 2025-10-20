"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const SessionHandler = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const syncFirebaseAuth = async () => {
      if (session && auth.currentUser?.uid !== session.user.id) {
        try {
          const response = await fetch("/api/auth/firebase", {
            method: "POST",
          });
          const data = await response.json();

          await signInWithCustomToken(auth, data.firebaseToken);

          const userRef = doc(db, "users", session.user.id);
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            await setDoc(userRef, {
              name: session.user.name,
              mail: session.user.email,
              phone: "",
            });
          }
        } catch (error) {
          console.error("Error syncing Firebase auth:", error);
        }
      } else if (!session) {
        auth.signOut();
      }
    };
    syncFirebaseAuth();
  }, [status, session]);

  return null;
};

export default SessionHandler;

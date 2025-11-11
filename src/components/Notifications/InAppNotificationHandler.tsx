"use client";

import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { NotiflixInfo } from "../Notiflix/Notiflix";
import { useSession } from "next-auth/react";
import app from "@/firebase/config";

const InAppNotificationHandler = () => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const messaging = getMessaging(app);

        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("In-app message received: ", payload);

          const title = payload.notification?.title;
          const body = payload.notification?.body;

          if (body) {
            NotiflixInfo(body);
          }
        });

        return () => {
          unsubscribe();
        };
      }
    }
  }, [status]);

  return null;
};

export default InAppNotificationHandler;

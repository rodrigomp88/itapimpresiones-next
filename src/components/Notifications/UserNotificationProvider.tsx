"use client";

import { useEffect } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { saveUserFCMTokenAction } from "@/app/(public)/orders/actions";
import app from "@/firebase/config";

const UserNotificationProvider = () => {
  useEffect(() => {
    const setupMessaging = async () => {
      try {
        if (await isSupported()) {
          const messaging = getMessaging(app);
          const swRegistration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          const permission = await Notification.requestPermission();

          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey:
                "BD3w1xu_n1dGoEQdigybHptkcejOX4Zl0VJP4h9I9_Npb0HVRgjnp57IcCCB0_8KKIW1TGr3em4Jd79LxnfmK7I",
              serviceWorkerRegistration: swRegistration,
            });

            if (currentToken) {
              await saveUserFCMTokenAction(currentToken);
            }
          }
        }
      } catch (error) {
        console.error("Error setting up client messaging.", error);
      }
    };

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      setupMessaging();
    }
  }, []);

  return null;
};

export default UserNotificationProvider;

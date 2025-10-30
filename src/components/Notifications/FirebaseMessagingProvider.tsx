"use client";

import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import app from "@/src/firebase/config";
import { saveFCMTokenAction } from "@/src/app/admin/actions";

const FirebaseMessagingProvider = () => {
  useEffect(() => {
    const setupMessaging = async () => {
      try {
        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          console.log("Notification permission granted.");
          const currentToken = await getToken(messaging, {
            vapidKey: "TU_VAPID_KEY_DE_FIREBASE",
          });

          if (currentToken) {
            console.log("FCM Token:", currentToken);
            // Guarda el token en el servidor
            await saveFCMTokenAction(currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        } else {
          console.log("Unable to get permission to notify.");
        }
      } catch (error) {
        console.error("An error occurred while retrieving token. ", error);
      }
    };
    setupMessaging();
  }, []);

  return null;
};

export default FirebaseMessagingProvider;

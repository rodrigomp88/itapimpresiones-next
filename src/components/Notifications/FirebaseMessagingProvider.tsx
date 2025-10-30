"use client";

import { useEffect } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import app from "@/src/firebase/config";
import { saveFCMTokenAction } from "@/src/app/admin/actions";

const FirebaseMessagingProvider = () => {
  useEffect(() => {
    const setupMessaging = async () => {
      // Primero, verificamos si el navegador soporta Firebase Messaging
      if (await isSupported()) {
        try {
          const messaging = getMessaging(app);

          // Esperamos a que el Service Worker esté completamente listo.
          // Esto es crucial para evitar el error de 'pushManager'.
          const serviceWorkerRegistration = await navigator.serviceWorker.ready;

          const permission = await Notification.requestPermission();

          if (permission === "granted") {
            console.log("Notification permission granted.");
            const currentToken = await getToken(messaging, {
              vapidKey:
                "BD3w1xu_n1dGoEQdigybHptkcejOX4Zl0VJP4h9I9_Npb0HVRgjnp57IcCCB0_8KKIW1TGr3em4Jd79LxnfmK7I",
              serviceWorkerRegistration: serviceWorkerRegistration,
            });

            if (currentToken) {
              console.log("FCM Token:", currentToken);
              await saveFCMTokenAction(currentToken);
            } else {
              console.log("No registration token available.");
            }
          } else {
            console.log("Unable to get permission to notify.");
          }
        } catch (error) {
          console.error("An error occurred while retrieving token. ", error);
        }
      } else {
        console.log("Firebase Messaging is not supported in this browser.");
      }
    };
    setupMessaging();
  }, []);

  return null;
};

export default FirebaseMessagingProvider;

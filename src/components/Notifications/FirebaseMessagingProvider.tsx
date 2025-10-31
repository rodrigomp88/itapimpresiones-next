"use client";

import { useEffect } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "@/src/firebase/config";
import { saveFCMTokenAction } from "@/src/app/admin/actions";

const FirebaseMessagingProvider = () => {
  useEffect(() => {
    const setupMessaging = async () => {
      try {
        const isMessagingSupported = await isSupported();
        if (!isMessagingSupported) {
          console.error(
            "Paso A: Firebase Messaging NO es compatible en este navegador."
          );
          return;
        }
        console.log("Paso A: Firebase Messaging es compatible.");

        console.log("Paso B: Intentando registrar el Service Worker...");
        const swRegistration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        console.log(
          "Paso B: Service Worker registrado con éxito.",
          swRegistration
        );

        const messaging = getMessaging(app);

        console.log("Paso C: Solicitando permiso de notificación...");
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          console.log("Paso C: ¡Permiso concedido!");

          console.log("Paso D: Intentando obtener el token de FCM...");
          const currentToken = await getToken(messaging, {
            vapidKey:
              "BD3w1xu_n1dGoEQdigybHptkcejOX4Zl0VJP4h9I9_Npb0HVRgjnp57IcCCB0_8KKIW1TGr3em4Jd79LxnfmK7I",
            serviceWorkerRegistration: swRegistration,
          });

          if (currentToken) {
            console.log("Paso D: ¡Token obtenido con éxito!", currentToken);
            await saveFCMTokenAction(currentToken);
          } else {
            console.error(
              "Paso D: Fallo al obtener el token. No se generó ninguno."
            );
          }
        } else {
          console.warn(
            "Paso C: El usuario denegó o ignoró el permiso de notificación."
          );
        }
      } catch (error) {
        console.error(
          "Un error ocurrió durante la configuración de mensajería.",
          error
        );
      }
    };

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      setupMessaging();
    }
  }, []);

  return null;
};

export default FirebaseMessagingProvider;

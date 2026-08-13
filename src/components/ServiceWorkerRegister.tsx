"use client";

import { useEffect } from "react";

const ServiceWorkerRegister: React.FC = () => {
  useEffect(() => {
    // Solo registrar en producción y si es soportado
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            }
          );

          // Manejar actualizaciones del service worker
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Nueva versión disponible

                  // Mostrar notificación de actualización (opcional)
                  if (
                    confirm(
                      "Hay una nueva versión disponible. ¿Deseas actualizar?"
                    )
                  ) {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  }
                }
              });
            }
          });

          // Escuchar cambios de controlador (cuando se activa un nuevo SW)
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error registrando Service Worker:", error);
        }
      };

      registerSW();
    }
  }, []);

  return null;
};

export default ServiceWorkerRegister;

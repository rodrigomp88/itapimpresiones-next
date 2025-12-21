"use client";

import { useState, useEffect } from "react";
import {
  requestNotificationPermission,
  saveUserToken,
  getNotificationPermissionStatus,
  onForegroundMessage,
} from "@/lib/notifications";

interface NotificationPromptProps {
  userId?: string;
}

export default function NotificationPrompt({ userId }: NotificationPromptProps) {
  const [status, setStatus] = useState<NotificationPermission | "unsupported" | "loading">("loading");
  const [isRequesting, setIsRequesting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const currentStatus = getNotificationPermissionStatus();
    setStatus(currentStatus);
    
    // Mostrar prompt si aún no se decidió
    if (currentStatus === "default") {
      // Esperar un poco antes de mostrar
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Configurar listener para mensajes en primer plano
    if (currentStatus === "granted") {
      const unsubscribe = onForegroundMessage((payload) => {
        // Mostrar notificación en primer plano
        if (payload.notification) {
          new Notification(payload.notification.title || "Nueva notificación", {
            body: payload.notification.body,
            icon: "/icon-192x192.png",
          });
        }
      });
      return unsubscribe;
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const token = await requestNotificationPermission();
      
      if (token && userId) {
        await saveUserToken(userId, token);
        setStatus("granted");
      } else if (token) {
        setStatus("granted");
      } else {
        setStatus(getNotificationPermissionStatus());
      }
    } catch (error) {
      console.error("Error habilitando notificaciones:", error);
    } finally {
      setIsRequesting(false);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Guardar en localStorage para no mostrar de nuevo
    localStorage.setItem("notification-prompt-dismissed", "true");
  };

  // No mostrar si ya se decidió o no soporta
  if (status === "loading" || status === "unsupported" || status === "granted" || status === "denied") {
    return null;
  }

  // No mostrar si ya se descartó antes
  if (typeof window !== "undefined" && localStorage.getItem("notification-prompt-dismissed")) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xl">🔔</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              ¿Querés recibir notificaciones?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Te avisamos sobre el estado de tus pedidos y ofertas exclusivas.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleEnableNotifications}
                disabled={isRequesting}
                className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isRequesting ? "Activando..." : "Activar"}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Ahora no
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

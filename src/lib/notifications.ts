/**
 * Servicio de Notificaciones Push con Firebase Cloud Messaging
 */

import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";
import { app } from "@/firebase/config";

// VAPID Key para FCM (reemplazar con tu clave real)
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

let messaging: Messaging | null = null;

/**
 * Inicializa el servicio de mensajería (solo en el cliente)
 */
function getMessagingInstance(): Messaging | null {
  if (typeof window === "undefined") return null;

  if (!messaging) {
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.error("Error inicializando FCM:", error);
      return null;
    }
  }
  return messaging;
}

/**
 * Solicita permiso para notificaciones y obtiene el token FCM
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  // Verificar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    console.warn("Este navegador no soporta notificaciones");
    return null;
  }

  // Verificar si ya se denegó
  if (Notification.permission === "denied") {
    console.warn("Notificaciones denegadas por el usuario");
    return null;
  }

  try {
    // Solicitar permiso
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Permiso de notificaciones no concedido");
      return null;
    }

    // Obtener instancia de messaging
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) return null;

    // Registrar service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // Obtener token FCM
    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("Token FCM obtenido:", token.substring(0, 20) + "...");
      return token;
    }

    return null;
  } catch (error) {
    console.error("Error solicitando permisos de notificación:", error);
    return null;
  }
}

/**
 * Suscribe un listener para mensajes en primer plano
 */
export function onForegroundMessage(
  callback: (payload: { notification?: { title?: string; body?: string }; data?: Record<string, unknown> }) => void
): () => void {
  const messagingInstance = getMessagingInstance();
  if (!messagingInstance) return () => {};

  return onMessage(messagingInstance, (payload) => {
    console.log("Mensaje en primer plano recibido:", payload);
    callback(payload);
  });
}

/**
 * Guarda el token FCM del usuario en Firestore
 */
export async function saveUserToken(
  userId: string,
  token: string
): Promise<void> {
  try {
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token }),
    });

    if (!response.ok) {
      throw new Error("Error guardando token");
    }
  } catch (error) {
    console.error("Error guardando token FCM:", error);
  }
}

/**
 * Verifica si las notificaciones están habilitadas
 */
export function areNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  return Notification.permission === "granted";
}

/**
 * Obtiene el estado actual de los permisos
 */
export function getNotificationPermissionStatus():
  NotificationPermission | "unsupported" {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

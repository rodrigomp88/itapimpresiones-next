"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FaBell } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";
import { onAuthStateChanged } from "firebase/auth";
import { Order } from "@/types";
import { auth, db } from "@/firebase/config";

const UserNotificationBell = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Order[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado para saber si Firebase está listo
  const [firebaseReady, setFirebaseReady] = useState(false);

  // 1. Efecto para esperar a que Firebase auth esté listo
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Solo activamos la bandera si hay usuario y coincide con la sesión
      if (user && session?.user?.id && user.uid === session.user.id) {
        setFirebaseReady(true);
      } else {
        setFirebaseReady(false);
        setNotifications([]); // Limpiar si no hay usuario
      }
    });
    return () => unsubscribe();
  }, [session]);

  // 2. Efecto para escuchar notificaciones (Solo si Firebase está listo)
  useEffect(() => {
    if (!firebaseReady || !session?.user?.id) return;

    // CONSULTA SEGURA: Solo se ejecuta si firebaseReady es true
    const q = query(
      collection(db, "orders"),
      where("userID", "==", session.user.id),
      where("hasUnreadClientMessage", "==", true)
    );

    const unsubscribeSnapshot = onSnapshot(
      q,
      (snapshot) => {
        const unreadOrders = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Order)
        );
        setNotifications(unreadOrders);
      },
      (error) => {
        // Manejo silencioso de errores de permisos transitorios
        if (error.code === "permission-denied") {
          console.warn(
            "Permiso denegado temporalmente en notificaciones (sincronizando...)"
          );
        } else {
          console.error("Error en notificaciones:", error);
        }
      }
    );

    return () => unsubscribeSnapshot();
  }, [firebaseReady, session?.user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notificationCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="relative"
      >
        <FaBell className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" />
        {notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-black animate-pulse" />
        )}
      </button>

      {isDropdownOpen && (
        <NotificationDropdown
          notifications={notifications}
          closeDropdown={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default UserNotificationBell;

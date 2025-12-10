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
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  // 1. Obtener UID real de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUid(user.uid);
      } else {
        setFirebaseUid(null);
        setNotifications([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Escuchar notificaciones usando el UID de Firebase
  useEffect(() => {
    if (!firebaseUid) return;

    // La consulta debe coincidir con la regla: resource.data.userID == request.auth.uid
    const q = query(
      collection(db, "orders"),
      where("userID", "==", firebaseUid), // Usamos el UID directo de Firebase
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
        // Ignoramos errores de permisos iniciales mientras se sincroniza
        if (error.code !== "permission-denied") {
          console.error("Error notification listener:", error);
        }
      }
    );

    return () => unsubscribeSnapshot();
  }, [firebaseUid]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificationCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="relative p-1"
      >
        <FaBell className="h-5 w-5 text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border border-white dark:border-black">
            {notificationCount}
          </span>
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

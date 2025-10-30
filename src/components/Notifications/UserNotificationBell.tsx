"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { useSession } from "next-auth/react";
import { Order } from "@/src/types";
import { FaBell } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";

const UserNotificationBell = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Order[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const q = query(
      collection(db, "orders"),
      where("userID", "==", session.user.id),
      where("hasUnreadClientMessage", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unreadOrders = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Order)
      );
      setNotifications(unreadOrders);
    });

    return () => unsubscribe();
  }, [session]);

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
        <FaBell className="h-5 w-5" />
        {notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-black" />
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

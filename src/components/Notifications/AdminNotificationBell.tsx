"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FaBell } from "react-icons/fa";
import AdminNotificationDropdown from "./AdminNotificationDropdown";
import { db } from "@/firebase/config";
import { Order } from "@/types";

const AdminNotificationBell = () => {
  const [notifications, setNotifications] = useState<Order[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("hasUnreadAdminMessage", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unreadOrders = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Order)
      );
      setNotifications(unreadOrders);
    });

    return () => unsubscribe();
  }, []);

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

  if (notificationCount === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="relative"
      >
        <FaBell className="h-5 w-5 text-yellow-40ag" />
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {notificationCount}
        </span>
      </button>

      {isDropdownOpen && (
        <AdminNotificationDropdown
          notifications={notifications}
          closeDropdown={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminNotificationBell;

"use client";

import Link from "next/link";
import { Order } from "@/src/types";
import { markOrderAsReadAction } from "@/src/app/(public)/orders/actions";
import { Timestamp } from "firebase/firestore";

interface NotificationDropdownProps {
  notifications: Order[];
  closeDropdown: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  closeDropdown,
}) => {
  const handleNotificationClick = (orderId: string) => {
    markOrderAsReadAction(orderId, "client");
    closeDropdown();
  };

  const getNotificationText = (order: Order): string => {
    if (order.lastUpdatedBy === "tienda") {
      if (
        order.orderStatus === "Completada" ||
        order.orderStatus === "Cancelada"
      ) {
        return `La orden #${order.id.slice(
          0,
          6
        )} ha sido ${order.orderStatus.toLowerCase()}.`;
      }
      return `Tienes una nueva actualización en la orden #${order.id.slice(
        0,
        6
      )}.`;
    }
    return `Actualización en la orden #${order.id.slice(0, 6)}.`;
  };

  const formatDate = (timestamp: any) => {
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleDateString("es-AR");
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleDateString("es-AR");
    }
    return "";
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-xl z-50">
      <div className="p-3 border-b dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Notificaciones
        </h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((order) => (
            <Link
              href={`/orders/${order.id}`}
              key={order.id}
              onClick={() => handleNotificationClick(order.id)}
              className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0"
            >
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {getNotificationText(order)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(order.createdAt)}
              </p>
            </Link>
          ))
        ) : (
          <p className="p-4 text-sm text-gray-500 text-center">
            No tienes notificaciones nuevas.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

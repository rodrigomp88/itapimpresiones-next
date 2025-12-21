"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, where, Timestamp } from "firebase/firestore";
import { Alert, AlertType, AlertCategory } from "@/lib/alerts";

const alertTypeStyles: Record<AlertType, { bg: string; border: string; icon: string; text: string }> = {
  error: { bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", icon: "🔴", text: "text-red-800 dark:text-red-200" },
  warning: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", icon: "🟡", text: "text-amber-800 dark:text-amber-200" },
  info: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", icon: "🔵", text: "text-blue-800 dark:text-blue-200" },
  success: { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", icon: "🟢", text: "text-green-800 dark:text-green-200" },
};

const categoryIcons: Record<AlertCategory, string> = {
  payment: "💳",
  stock: "📦",
  order: "🛒",
  system: "⚙️",
  security: "🔒",
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<AlertType | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const alertsRef = collection(db, "alerts");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 7); // Últimos 7 días

    const q = query(
      alertsRef,
      where("createdAt", ">=", Timestamp.fromDate(yesterday)),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Alert[];
      setAlerts(alertsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error escuchando alertas:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (alertId: string) => {
    try {
      await updateDoc(doc(db, "alerts", alertId), { isRead: true });
    } catch (error) {
      console.error("Error marcando alerta como leída:", error);
    }
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const errorCount = alerts.filter(a => a.type === "error" && !a.isRead).length;
  const warningCount = alerts.filter(a => a.type === "warning" && !a.isRead).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-32"></div>
          <div className="h-20 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-20 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            🚨 Alertas del Sistema
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>

        {/* Stats rápidos */}
        <div className="flex gap-4 text-xs">
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              🔴 {errorCount} errores
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              🟡 {warningCount} advertencias
            </span>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {(["all", "error", "warning", "info", "success"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === type
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {type === "all" ? "Todas" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            <p className="text-2xl mb-2">✅</p>
            <p>No hay alertas {filter !== "all" ? `de tipo "${filter}"` : ""}</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const styles = alertTypeStyles[alert.type];
            return (
              <div
                key={alert.id}
                className={`p-4 ${!alert.isRead ? styles.bg : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-lg">
                    {categoryIcons[alert.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{styles.icon}</span>
                      <h3 className={`text-sm font-medium ${!alert.isRead ? styles.text : "text-zinc-700 dark:text-zinc-300"}`}>
                        {alert.title}
                      </h3>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatTime(alert.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {alert.message}
                    </p>
                  </div>
                  {!alert.isRead && (
                    <button
                      onClick={() => alert.id && markAsRead(alert.id)}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      title="Marcar como leída"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

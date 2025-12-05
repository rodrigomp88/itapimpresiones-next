"use client";

import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { sendTestNotificationAction } from "./actions";

export default function TestNotificationButton() {
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await sendTestNotificationAction();
      if (res.success) {
        alert(`✅ Enviado: ${res.count} | Fallos: ${res.failures}`);
      } else {
        alert(`❌ Error: ${res.error}`);
      }
    } catch (err) {
      alert("❌ Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTest}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      <FaBell />
      {loading ? "Enviando..." : "Probar Notificación"}
    </button>
  );
}

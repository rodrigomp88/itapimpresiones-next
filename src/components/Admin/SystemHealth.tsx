"use client";

import { useEffect, useState } from "react";
import { checkSystemHealthAction, HealthCheckResult } from "@/app/admin/health/actions";
import { FaCheckCircle, FaExclamationTriangle, FaServer, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

const SystemHealth = () => {
    const [health, setHealth] = useState<HealthCheckResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSystemHealthAction().then((res) => {
            setHealth(res);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="animate-pulse h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />;

    if (!health) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-4">
                <FaServer className="text-violet-500 text-xl" />
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Estado del Sistema</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Permission Check */}
                <div className={`p-4 rounded-lg flex items-start gap-3 border ${health.isInAdminsCollection ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800'}`}>
                    {health.isInAdminsCollection ? (
                        <FaCheckCircle className="text-green-500 mt-1" />
                    ) : (
                        <FaExclamationTriangle className="text-yellow-500 mt-1" />
                    )}
                    <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Permisos de Firestore</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {health.isInAdminsCollection
                                ? "Tu usuario está correctamente registrado en la colección 'admins'."
                                : "⚠️ Tu UID no está en la colección 'admins'. No recibirás notificaciones."}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">UID: {health.adminUid}</p>
                    </div>
                </div>

                {/* Notification Check */}
                <div className={`p-4 rounded-lg flex items-start gap-3 border ${health.hasFcmToken ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'}`}>
                    {health.hasFcmToken ? (
                        <FaCheckCircle className="text-green-500 mt-1" />
                    ) : (
                        <FaExclamationTriangle className="text-red-500 mt-1" />
                    )}
                    <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Dispositivo de Notificaciones</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {health.hasFcmToken
                                ? "Tu navegador está registrado para recibir alertas."
                                : "⚠️ No se encontraron tokens FCM. Activa las notificaciones con la campana."}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemHealth;

"use client";

import { useState } from "react";
import { Order } from "@/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaShoppingBag, FaCalendar, FaUser, FaDollarSign, FaEye } from "react-icons/fa";

interface OrdersClientProps {
    initialOrders: Order[];
}

const OrdersClient: React.FC<OrdersClientProps> = ({ initialOrders }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("Todas");

    const statuses = ["Todas", "Pendiente", "Procesando", "Enviada", "Completada", "Cancelada"];

    const filteredOrders = initialOrders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "Todas" || order.orderStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            Pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
            Procesando: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
            Enviada: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
            Completada: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
            Cancelada: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        };
        return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Órdenes</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Gestiona todas las órdenes de tu tienda
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Buscar por ID, cliente o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Mostrando {filteredOrders.length} de {initialOrders.length} órdenes
            </p>

            {/* Orders Grid */}
            <motion.div layout className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Order Info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <FaShoppingBag className="text-violet-500 text-xl" />
                                        <div>
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-semibold text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
                                            >
                                                #{order.id.slice(0, 8)}
                                            </Link>
                                            <span
                                                className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                            <FaUser className="text-zinc-400" />
                                            <span>{order.shippingAddress.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                            <FaCalendar className="text-zinc-400" />
                                            <span>{new Date(order.createdAt).toLocaleDateString("es-AR")}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                            <FaDollarSign className="text-zinc-400" />
                                            <span className="font-semibold text-zinc-900 dark:text-white">
                                                ${order.orderAmount.toLocaleString("es-AR")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl transition-colors text-sm font-medium"
                                >
                                    <FaEye />
                                    Ver Detalles
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <FaShoppingBag className="mx-auto text-6xl text-zinc-300 dark:text-zinc-600 mb-4" />
                    <p className="text-zinc-500 dark:text-zinc-400">No se encontraron órdenes</p>
                </div>
            )}
        </div>
    );
};

export default OrdersClient;

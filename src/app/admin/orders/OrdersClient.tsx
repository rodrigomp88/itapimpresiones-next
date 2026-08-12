"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaShoppingBag,
  FaCalendar,
  FaUser,
  FaDollarSign,
  FaEye,
  FaCreditCard,
  FaCheckSquare,
  FaSquare,
  FaCheck,
} from "react-icons/fa";

interface OrdersClientProps {
  initialOrders: Order[];
}

const OrdersClient: React.FC<OrdersClientProps> = ({ initialOrders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todas");
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<string>("Todos");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("pending");
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const statuses: (OrderStatus | "Todas")[] = [
    "Todas",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  const filteredOrders = initialOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todas" || order.orderStatus === statusFilter;
    const matchesPaymentStatus =
      paymentStatusFilter === "Todos" ||
      order.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      confirmed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      processing:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      refunded:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  const getPaymentStatusColor = (status?: string) => {
    if (!status)
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";

    const colors: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      cancelled:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      refunded:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      expired: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    );
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      processing: "Procesando",
      shipped: "Enviada",
      delivered: "Entregada",
      cancelled: "Cancelada",
      refunded: "Reembolsada",
    };
    return labels[status] || status;
  };

  const getPaymentStatusLabel = (status?: string) => {
    if (!status) return "No especificado";

    const labels: Record<string, string> = {
      pending: "Pendiente",
      processing: "Procesando",
      approved: "Aprobado",
      rejected: "Rechazado",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
      expired: "Expirado",
    };
    return labels[status] || status;
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const handleBulkStatusChange = async () => {
    if (selectedOrders.length === 0) return;

    setIsProcessingBulk(true);
    try {
      // Procesar cada orden seleccionada
      for (const orderId of selectedOrders) {
        await fetch(`/api/admin/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        });
      }

      // Recargar la página para ver los cambios
      window.location.reload();
    } catch (error) {
      console.error("Error updating bulk orders:", error);
      alert("Error al actualizar las órdenes seleccionadas");
    } finally {
      setIsProcessingBulk(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Órdenes
        </h2>
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

        {/* Payment Status Filter */}
        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
          <option value="Todos">Todos los pagos</option>
          <option value="pending">Pago pendiente</option>
          <option value="approved">Pago aprobado</option>
          <option value="rejected">Pago rechazado</option>
          <option value="cancelled">Pago cancelado</option>
          <option value="refunded">Pago reembolsado</option>
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {selectedOrders.length} órdenes seleccionadas
              </span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
                className="px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-blue-800/50 text-blue-900 dark:text-blue-100"
              >
                <option value="confirmed">Confirmar</option>
                <option value="processing">Procesar</option>
                <option value="shipped">Enviar</option>
                <option value="delivered">Entregar</option>
                <option value="cancelled">Cancelar</option>
              </select>
              <button
                onClick={handleBulkStatusChange}
                disabled={isProcessingBulk}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessingBulk ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Aplicar
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count & Select All */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Mostrando {filteredOrders.length} de {initialOrders.length} órdenes
        </p>
        {filteredOrders.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            {selectedOrders.length === filteredOrders.length ? (
              <>
                <FaCheckSquare />
                Deseleccionar todo
              </>
            ) : (
              <>
                <FaSquare />
                Seleccionar todo
              </>
            )}
          </button>
        )}
      </div>

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
                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

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

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <FaUser className="text-zinc-400" />
                      <span>{order.shippingAddress.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <FaCalendar className="text-zinc-400" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("es-AR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <FaDollarSign className="text-zinc-400" />
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        ${order.orderAmount.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-zinc-400" />
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusLabel(order.paymentStatus)}
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
          <p className="text-zinc-500 dark:text-zinc-400">
            No se encontraron órdenes
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersClient;

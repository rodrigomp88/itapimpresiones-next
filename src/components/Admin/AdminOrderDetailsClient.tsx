"use client";

import { Order, Message } from "@/types";
import { useState, useEffect, useTransition } from "react";
import {
  updateOrderStatusAction,
  sendAdminMessageAction,
} from "@/app/admin/orders/actions";
import { markOrderAsReadAction } from "@/app/(public)/orders/actions";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";

interface AdminOrderDetailsClientProps {
  initialOrder: Order;
  initialMessages: Message[];
}

const AdminOrderDetailsClient: React.FC<AdminOrderDetailsClientProps> = ({
  initialOrder,
  initialMessages,
}) => {
  if (!initialOrder) {
    return <div className="text-center p-8">No se pudo cargar la orden.</div>;
  }

  const [order, setOrder] = useState(initialOrder);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(
    initialOrder.orderStatus
  );
  const [isUpdatingStatus, startStatusTransition] = useTransition();
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (initialOrder.hasUnreadAdminMessage) {
      markOrderAsReadAction(initialOrder.id, "admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = () => {
    if (selectedStatus === order.orderStatus) return;
    startStatusTransition(async () => {
      const result = await updateOrderStatusAction(order.id, selectedStatus);
      if (result.success) {
        setOrder((prev) => ({ ...prev, orderStatus: selectedStatus }));
        NotiflixSuccess("Estado de la orden actualizado.");
      } else {
        NotiflixFailure(result.error || "Error al actualizar el estado.");
      }
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isSendingMessage) return;
    setIsSendingMessage(true);
    const result = await sendAdminMessageAction(order.id, newMessage);
    if (result.success) {
      const sentMessage: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "tienda",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } else {
      NotiflixFailure(result.error || "Error al enviar el mensaje.");
    }
    setIsSendingMessage(false);
  };

  const statusOptions = [
    { value: "pending", label: "Pendiente" },
    { value: "confirmed", label: "Confirmada" },
    { value: "processing", label: "Procesando" },
    { value: "shipped", label: "Enviada" },
    { value: "delivered", label: "Entregada" },
    { value: "cancelled", label: "Cancelada" },
    { value: "refunded", label: "Reembolsada" },
  ];

  const isChatActive =
    order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && order.orderStatus !== "refunded";

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div
        className={
          isChatActive ? "md:col-span-2 space-y-6" : "md:col-span-3 space-y-6"
        }
      >
        <h1 className="text-2xl font-bold">
          Gestionar Orden #{order.id.slice(0, 8)}
        </h1>

        <div className="p-4 bg-white dark:bg-black border dark:border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">
            Información del Cliente
          </h3>
          <p>
            <strong>Nombre:</strong> {order.shippingAddress.name}
          </p>
          <p>
            <strong>Email:</strong> {order.shippingAddress.mail}
          </p>
          <p>
            <strong>Teléfono:</strong> {order.shippingAddress.phone}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-black border dark:border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">
            Información de Pago
          </h3>
          <div className="space-y-3">
            <p>
              <strong>Estado de Pago:</strong>{" "}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                order.paymentStatus === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                order.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                order.paymentStatus === 'cancelled' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {order.paymentStatus === 'approved' ? 'Aprobado' :
                 order.paymentStatus === 'pending' ? 'Pendiente' :
                 order.paymentStatus === 'rejected' ? 'Rechazado' :
                 order.paymentStatus === 'cancelled' ? 'Cancelado' :
                 order.paymentStatus === 'refunded' ? 'Reembolsado' :
                 'No especificado'}
              </span>
            </p>

            {/* Información de seña si existe */}
            {order.depositAmount && (
              <div className="border-t pt-3 space-y-2">
                <h4 className="font-medium text-sm">Sistema de Pagos Parciales</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Seña pagada:</span>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      ${order.depositAmount.toLocaleString("es-AR")}
                    </p>
                  </div>
                  {order.remainingAmount && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Restante:</span>
                      <p className="font-semibold text-orange-600 dark:text-orange-400">
                        ${order.remainingAmount.toLocaleString("es-AR")}
                      </p>
                    </div>
                  )}
                </div>
                {order.remainingAmount && order.remainingAmount > 0 && order.orderStatus === "processing" && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-3 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-orange-800 dark:text-orange-200 text-xs">
                        💰 El cliente debe pagar ${order.remainingAmount.toLocaleString("es-AR")} restante al finalizar el trabajo.
                      </p>
                      <button
                        onClick={() => setSelectedStatus("delivered")}
                        className="ml-3 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Marcar Pagado
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {order.paymentId && (
              <p>
                <strong>ID de Pago:</strong> {order.paymentId}
              </p>
            )}
            {order.paymentDetails && (
              <>
                {order.paymentDetails.payment_method_id && (
                  <p>
                    <strong>Método:</strong> {order.paymentDetails.payment_method_id}
                  </p>
                )}
                {order.paymentDetails.date_approved && (
                  <p>
                    <strong>Fecha de Aprobación:</strong>{" "}
                    {new Date(order.paymentDetails.date_approved).toLocaleString("es-AR")}
                  </p>
                )}
                {order.paymentDetails.transaction_amount && (
                  <p>
                    <strong>Monto:</strong> ${order.paymentDetails.transaction_amount.toLocaleString("es-AR")}
                  </p>
                )}
              </>
            )}
            {order.preferenceId && (
              <p>
                <strong>ID de Preferencia:</strong> {order.preferenceId}
              </p>
            )}
          </div>
        </div>

        {/* Historial de Cambios */}
        <div className="p-4 bg-white dark:bg-black border dark:border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-lg">Historial de Cambios</h3>
          <div className="space-y-3">
            {order.updatedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Última actualización:</span>
                <span className="font-medium">
                  {new Date(order.updatedAt).toLocaleString("es-AR")}
                </span>
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Sistema registra automáticamente todos los cambios de estado para auditoría.
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-black border dark:border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-lg">Gestionar Estado</h3>
          <div className="flex items-center gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Order['orderStatus'])}
              className="select flex-grow"
              disabled={isUpdatingStatus}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusChange}
              disabled={
                isUpdatingStatus || selectedStatus === order.orderStatus
              }
              className="btn btn-primary"
            >
              {isUpdatingStatus ? "Guardando..." : "Guardar"}
            </button>
          </div>
          <p className="text-sm mt-2 text-gray-500">
            Estado actual:{" "}
            <span className="font-bold">{order.orderStatus}</span>
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-black border dark:border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-lg">
            Productos en la Orden ({order.orderItems.length})
          </h3>
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center border-b dark:border-gray-700 last:border-b-0 pb-3 last:pb-0"
              >
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover bg-gray-100 dark:bg-gray-700"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.cartQuantity} x ${item.price.toLocaleString("es-AR")}
                  </p>
                </div>
                <p className="ml-auto font-semibold">
                  ${(item.price * item.cartQuantity).toLocaleString("es-AR")}
                </p>
              </div>
            ))}
            <div className="flex justify-end font-bold text-lg pt-3 border-t dark:border-gray-700">
              Total: ${order.orderAmount.toLocaleString("es-AR")}
            </div>
          </div>
        </div>
      </div>

      {isChatActive && (
        <div className="md:col-span-1 border dark:border-gray-700 rounded-lg flex flex-col h-[80vh] sticky top-24 bg-white dark:bg-black">
          <h2 className="p-4 font-semibold border-b dark:border-gray-700">
            Chat con {order.shippingAddress.name}
          </h2>
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.sender === "tienda" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === "tienda"
                      ? "bg-violet-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t dark:border-gray-700 flex gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Responder..."
              className="input flex-grow"
              disabled={isSendingMessage}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSendingMessage}
            >
              {isSendingMessage ? "..." : "Enviar"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdminOrderDetailsClient;

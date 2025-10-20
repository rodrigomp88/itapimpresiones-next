"use client";

import { Order, Message } from "@/src/types";
import { useState, useEffect, useTransition } from "react";
import {
  updateOrderStatusAction,
  sendAdminMessageAction,
} from "@/src/app/admin/orders/actions";
import { db } from "@/src/firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { NotiflixFailure, NotiflixSuccess } from "../Notiflix/Notiflix";

interface AdminOrderDetailsClientProps {
  initialOrder: Order;
  initialMessages: Message[];
}

const AdminOrderDetailsClient: React.FC<AdminOrderDetailsClientProps> = ({
  initialOrder,
  initialMessages,
}) => {
  const [order, setOrder] = useState(initialOrder);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const q = query(
      collection(db, `orders/${order.id}/messages`),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, [order.id]);

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(order.id, newStatus);
      if (result.success) {
        setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
        NotiflixSuccess("Estado de la orden actualizado.");
      } else {
        NotiflixFailure(result.error || "Error al actualizar.");
      }
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await sendAdminMessageAction(order.id, newMessage);
    if (result.success) {
      setNewMessage("");
    } else {
      NotiflixFailure(result.error || "Error al enviar mensaje.");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">
          Gestionar Orden #{order.id.slice(0, 8)}
        </h1>
        <div className="p-4 border rounded-lg">
          <p>
            <strong>Cliente:</strong> {order.shippingAddress.name}
          </p>
          <p>
            <strong>Email:</strong> {order.shippingAddress.mail}
          </p>
          <p>
            <strong>Teléfono:</strong> {order.shippingAddress.phone}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">
            Estado Actual: {order.orderStatus}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange("Confirmada")}
              disabled={isPending}
              className="btn-sm"
            >
              Confirmar
            </button>
            <button
              onClick={() => handleStatusChange("Pagada")}
              disabled={isPending}
              className="btn-sm"
            >
              Marcar como Pagada
            </button>
            <button
              onClick={() => handleStatusChange("Enviada")}
              disabled={isPending}
              className="btn-sm"
            >
              Marcar como Enviada
            </button>
            <button
              onClick={() => handleStatusChange("Cancelada")}
              disabled={isPending}
              className="btn-sm-danger"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div className="md:col-span-1 border rounded-lg flex flex-col h-[70vh]">
        <h2 className="p-4 font-semibold border-b">
          Chat con {order.shippingAddress.name}
        </h2>
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.sender === "tienda" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === "tienda"
                    ? "bg-violet-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Responder..."
            className="input flex-grow"
          />
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOrderDetailsClient;

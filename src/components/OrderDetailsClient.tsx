"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order, Message } from "@/src/types";
import {
  doc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  sendUserMessageAction,
  markOrderAsReadAction,
} from "@/src/app/(public)/orders/actions";

interface OrderDetailsClientProps {
  order: Order;
}

const OrderDetailsClient: React.FC<OrderDetailsClientProps> = ({
  order: initialOrder,
}) => {
  const { data: session } = useSession();
  const [order, setOrder] = useState(initialOrder);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const orderRef = doc(db, "orders", initialOrder.id);
    const unsubscribeOrder = onSnapshot(orderRef, (doc) => {
      if (doc.exists()) {
        const updatedOrder = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate().toISOString(),
        } as Order;
        setOrder(updatedOrder);

        if (updatedOrder.hasUnreadClientMessage) {
          markOrderAsReadAction(updatedOrder.id, "client");
        }
      }
    });

    const messagesRef = collection(db, `orders/${initialOrder.id}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toISOString(),
      })) as Message[];
      setMessages(msgs);
    });

    return () => {
      unsubscribeOrder();
      unsubscribeMessages();
    };
  }, [initialOrder.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isSending || !session?.user?.id) return;
    setIsSending(true);
    await sendUserMessageAction(order.id, newMessage, session.user.id);
    setNewMessage("");
    setIsSending(false);
  };

  const formatOrderDate = (isoString: string) =>
    new Date(isoString).toLocaleString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatCurrency = (amount: number) =>
    amount.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  const isChatActive =
    order.orderStatus !== "Completada" && order.orderStatus !== "Cancelada";

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl lg:text-3xl font-bold">
            Detalles de la Orden
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ID: #{order.id}
          </p>
        </div>

        <div className="bg-white dark:bg-black/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
              >
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md bg-gray-100 dark:bg-gray-700"
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(item.price)} x {item.cartQuantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.price * item.cartQuantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-black/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Resumen y Envío</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Fecha de Orden:
              </span>{" "}
              <strong>{formatOrderDate(order.createdAt)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estado:</span>{" "}
              <strong className="text-blue-500">{order.orderStatus}</strong>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="font-semibold mb-1">Dirección de Envío:</p>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.mail}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
            <div className="flex justify-between text-xl font-bold pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <span>TOTAL:</span>
              <span>{formatCurrency(order.orderAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {isChatActive && (
        <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col h-[60vh] lg:h-[80vh] lg:sticky lg:top-24">
          <h2 className="p-4 font-semibold border-b border-gray-200 dark:border-gray-700">
            Chat con la tienda
          </h2>
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.sender === "usuario" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === "usuario"
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
            className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="input flex-grow"
              disabled={isSending}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSending}
            >
              {isSending ? "..." : "Enviar"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsClient;

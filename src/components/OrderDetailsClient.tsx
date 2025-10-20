"use client";

import { useState, useEffect } from "react";
import { Order, Message } from "@/src/types";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

interface OrderDetailsClientProps {
  order: Order;
}

const OrderDetailsClient: React.FC<OrderDetailsClientProps> = ({ order }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = collection(db, `orders/${order.id}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp.toDate().toISOString(),
        } as Message;
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [order.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const messagesRef = collection(db, `orders/${order.id}/messages`);
      await addDoc(messagesRef, {
        text: newMessage,
        sender: "usuario",
        timestamp: new Date(),
      });
      setNewMessage("");
    } catch (error) {
      alert("No se pudo enviar el mensaje.");
    }
  };

  return (
    <div className="py-8 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">
          Detalles de la Orden #{order.id.slice(0, 8)}
        </h1>
        <p>Estado: {order.orderStatus}</p>
        <p>Total: ${order.orderAmount.toLocaleString("es-AR")}</p>
      </div>

      <div className="md:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col h-[70vh]">
        <h2 className="p-4 font-semibold border-b">Chat con la tienda</h2>
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.sender === "usuario" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === "usuario"
                    ? "bg-violet-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
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
            placeholder="Escribe un mensaje..."
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

export default OrderDetailsClient;

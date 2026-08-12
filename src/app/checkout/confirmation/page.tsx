"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ShippingAddress } from "@/redux/slice/checkoutSlice";

const OrderConfirmationPage: React.FC = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsFirebaseLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!firebaseUser || isFirebaseLoading) return;

      try {
        setIsLoading(true);

        // Buscar la orden más reciente del usuario
        const ordersQuery = query(
          collection(db, "orders"),
          where("userID", "==", firebaseUser.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const ordersSnapshot = await getDocs(ordersQuery);

        if (!ordersSnapshot.empty) {
          const orderData = ordersSnapshot.docs[0].data() as Order;
          setOrder({
            ...orderData,
            id: ordersSnapshot.docs[0].id,
          });
        } else {
          setError("No se encontró ninguna orden.");
        }
      } catch (error) {
        console.error("Error al obtener la orden:", error);
        setError("Hubo un error al cargar tu orden.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestOrder();
  }, [firebaseUser, isFirebaseLoading]);

  useEffect(() => {
    if (sessionStatus === "loading" || isFirebaseLoading) return;
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
  }, [sessionStatus, isFirebaseLoading, router]);

  const formatDate = (date: Date | string | number) => {
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return new Date(date).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "orden recibida":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "confirmada":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "en preparación":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "enviada":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "entregada":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "cancelada":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  if (sessionStatus === "loading" || isFirebaseLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          Cargando confirmación...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            {error || "Orden no encontrada"}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            No pudimos encontrar la información de tu orden. Si crees que esto
            es un error, por favor contáctanos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Ver Mis Órdenes
            </Link>
            <Link
              href="/tienda"
              className="inline-flex items-center px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-sm font-medium rounded-md text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress as ShippingAddress;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 pb-4">
        <Link
          className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
          href="/"
        >
          Inicio
        </Link>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          /
        </span>
        <Link
          className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
          href="/orders"
        >
          Mis Órdenes
        </Link>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          /
        </span>
        <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
          Confirmación
        </span>
      </div>

      {/* Header de éxito */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Tu orden ha sido procesada exitosamente
        </p>
      </div>

      {/* Información de la orden */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Orden #{order.id.slice(-8).toUpperCase()}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Realizada el {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información de contacto */}
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                Información de Contacto
              </h3>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p>
                  <span className="font-medium">Nombre:</span>{" "}
                  {shippingAddress.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {shippingAddress.mail}
                </p>
                <p>
                  <span className="font-medium">Teléfono:</span>{" "}
                  {shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Dirección de envío */}
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                Dirección de Envío
              </h3>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.province}{" "}
                  {shippingAddress.postalCode}
                </p>
                {shippingAddress.notes && (
                  <p className="mt-2">
                    <span className="font-medium">Notas:</span>{" "}
                    {shippingAddress.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos de la orden */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Productos Solicitados
          </h3>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {order.orderItems.map((item, index) => (
            <div key={index} className="px-6 py-4 flex items-center gap-4">
              <div className="flex-shrink-0 relative w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                {item.imageURL ? (
                  <Image
                    src={item.imageURL}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {item.name}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Cantidad: {item.cartQuantity}
                </p>
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                ${(item.price * item.cartQuantity).toLocaleString("es-AR")}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de costos */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                ${order.orderAmount.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-zinc-200 dark:border-zinc-700 pt-2">
              <span className="text-zinc-900 dark:text-zinc-100">Total</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                ${order.orderAmount.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos pasos */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          ¿Qué sigue?
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Te enviaremos un email de confirmación en breve</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>El estado de tu pedido se actualizará automáticamente</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Te contactaremos si necesitamos información adicional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Podés seguir el estado de tu pedido en "Mis Órdenes"</span>
          </li>
        </ul>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Ver Mis Órdenes
        </Link>
        <Link
          href="/tienda"
          className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-base font-medium rounded-lg text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Seguir Comprando
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

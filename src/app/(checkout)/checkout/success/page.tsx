"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { NotiflixSuccess } from "@/components/Notiflix/Notiflix";

const SuccessPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const orderRef = doc(db, "orders", orderId);
          const orderSnap = await getDoc(orderRef);

          if (orderSnap.exists()) {
            setOrderData(orderSnap.data());
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
      NotiflixSuccess("¡Pago aprobado! Tu orden ha sido confirmada.");
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Procesando tu pago...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            ¡Pago Aprobado!
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Tu orden ha sido confirmada exitosamente. Recibirás un email con los
            detalles de envío.
          </p>

          {orderId && (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Detalles de la Orden
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Número de orden:</span>{" "}
                  {orderId}
                </p>
                {orderData && (
                  <>
                    <p>
                      <span className="font-medium">Total:</span> $
                      {orderData.orderAmount?.toLocaleString("es-AR")}
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span>{" "}
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {orderData.orderStatus || "Confirmada"}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              Ver Mis Órdenes
            </Link>
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-base font-medium rounded-lg text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;

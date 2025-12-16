"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PendingPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // Aquí podrías implementar lógica adicional si es necesario
  }, []);

  return (
    <div className="flex-grow">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Pending Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/20 mb-6">
            <svg
              className="h-8 w-8 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Pago Pendiente
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Tu pago está siendo procesado. Recibirás una confirmación por email
            una vez que se complete la transacción.
          </p>

          {orderId && (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Información de la Orden
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Número de orden:</span> {orderId}
                </p>
                <p>
                  <span className="font-medium">Estado:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Procesando pago
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
              ¿Qué sucede ahora?
            </h3>
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1 text-left">
              <li>• Tu banco está verificando la transacción</li>
              <li>• Esto puede tomar unos minutos</li>
              <li>• Recibirás una notificación cuando se complete</li>
              <li>• No cierres esta página hasta recibir confirmación</li>
            </ul>
          </div>

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

const PendingPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <PendingPageContent />
    </Suspense>
  );
};

export default PendingPage;

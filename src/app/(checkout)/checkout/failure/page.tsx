"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NotiflixFailure } from "@/components/Notiflix/Notiflix";

const FailurePageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    NotiflixFailure("El pago no pudo ser procesado. Por favor intenta nuevamente.");
  }, []);

  return (
    <div className="flex-grow">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Failure Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Pago Rechazado
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            El pago no pudo ser procesado. Esto puede deberse a fondos insuficientes,
            datos incorrectos de la tarjeta, o problemas temporales con el servicio de pago.
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
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Pago rechazado
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
            <h3 className="text-amber-800 dark:text-amber-200 font-medium mb-2">
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 text-left">
              <li>• Verificar que los datos de tu tarjeta sean correctos</li>
              <li>• Asegurarte de tener fondos suficientes</li>
              <li>• Intentar con otra tarjeta o método de pago</li>
              <li>• Contactar a tu banco si el problema persiste</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              Intentar Nuevamente
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-base font-medium rounded-lg text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Revisar Carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FailurePage: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
      <FailurePageContent />
    </Suspense>
  );
};

export default FailurePage;

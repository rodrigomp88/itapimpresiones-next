"use client";

import { GuestOrder } from "@/hooks/useGuestCheckout";
import { HiCreditCard, HiShieldCheck } from "react-icons/hi";

interface PaymentProcessingProps {
  order: GuestOrder | null;
  onPaymentComplete: (paymentData: Record<string, unknown>) => void;
  isProcessing: boolean;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  order,
  onPaymentComplete,
  isProcessing,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/15 rounded-full flex items-center justify-center mb-4">
          <HiCreditCard className="w-8 h-8 text-primary dark:text-primary-light" />
        </div>
        <h2 className="text-2xl font-bold text-prussian-blue dark:text-zinc-100 mb-2">
          Procesar Pago
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Confirma tu pedido y procede al pago
        </p>
      </div>

      {order && (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-prussian-blue dark:text-zinc-100 mb-4">
            Resumen del pedido
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Total del pedido
              </span>
              <span className="font-medium">
                ${order.orderAmount.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Seña a pagar ahora
              </span>
              <span className="font-medium text-primary dark:text-primary-light">
                ${order.depositAmount.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Restante</span>
              <span className="font-medium">
                ${order.remainingAmount.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={() => onPaymentComplete({})}
          disabled={isProcessing}
          className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Procesando pago...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <HiShieldCheck className="w-5 h-5" />
              <span>Continuar con MercadoPago</span>
            </div>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <HiShieldCheck className="w-4 h-4" />
          <span>Pago 100% seguro y protegido</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;

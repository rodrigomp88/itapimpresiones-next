"use client";

import Image from "next/image";
import { CartItem } from "@/types";
import { GuestOrder } from "@/hooks/useGuestCheckout";
import { HiCreditCard } from "react-icons/hi";

interface PaymentSummaryProps {
  cartItems: CartItem[];
  cartTotalAmount: number;
  costs: {
    subtotalAfterDiscount: number;
    depositAmount: number;
    remainingAmount: number;
    shippingCost: number;
    taxAmount: number;
    finalTotal: number;
  };
  currentOrder: GuestOrder | null;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  cartItems,
  cartTotalAmount,
  costs,
  currentOrder,
}) => {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
        Tu Pedido
      </h2>

      {/* Items del carrito */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={
                  typeof item.images[0] === "string"
                    ? item.images[0]
                    : item.images[0]?.url || "/placeholder.png"
                }
                alt={item.name}
                width={64}
                height={64}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Cantidad: {item.cartQuantity}
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatPrice(item.price * item.cartQuantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de costos */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {formatPrice(cartTotalAmount)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Envío</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {costs.shippingCost === 0 ? (
              <span className="text-green-600 dark:text-green-400">
                ¡Gratis!
              </span>
            ) : (
              formatPrice(costs.shippingCost)
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">IVA (21%)</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {formatPrice(costs.taxAmount)}
          </span>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 space-y-2">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-zinc-900 dark:text-zinc-100">
              Total del pedido
            </span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {formatPrice(costs.finalTotal)}
            </span>
          </div>

          {/* Seña (50%) */}
          <div className="flex justify-between text-sm bg-primary/10 dark:bg-primary/10 p-3 rounded">
            <span className="text-primary-dark dark:text-primary-light font-medium">
              Seña requerida (50%)
            </span>
            <span className="text-primary-dark dark:text-primary-light font-bold">
              {formatPrice(costs.depositAmount)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>Restante al finalizar</span>
            <span className="font-medium">
              {formatPrice(costs.remainingAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Información de envío gratis */}
      {cartTotalAmount >= 10000 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
          <p className="text-green-800 dark:text-green-200 text-sm">
            🎉 ¡Envío gratis por compra mayor a $10.000!
          </p>
        </div>
      )}

      {/* Info del sistema de pagos */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <p className="text-amber-800 dark:text-amber-200 text-xs font-medium mb-1">
          💰 Sistema de pagos
        </p>
        <p className="text-amber-700 dark:text-amber-300 text-xs">
          Pagás el 50% ahora para confirmar tu pedido. El resto se paga al
          finalizar el trabajo.
        </p>
      </div>

      {/* Estado del pedido */}
      {currentOrder && (
        <div className="mt-4 p-3 bg-primary/10 dark:bg-primary/10 border border-primary/20 dark:border-primary-dark rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HiCreditCard className="w-4 h-4 text-primary dark:text-primary-light" />
            <span className="text-primary-dark dark:text-primary-light font-medium text-sm">
              Estado del pedido
            </span>
          </div>
          <p className="text-primary-dark dark:text-primary-light text-xs">
            Pedido: {currentOrder.orderStatus} | Pago:{" "}
            {currentOrder.paymentStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;

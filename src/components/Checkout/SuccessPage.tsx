"use client";

import { GuestOrder } from "@/hooks/useGuestCheckout";
import { HiCheckCircle, HiShoppingBag, HiUser } from "react-icons/hi";

interface SuccessPageProps {
  order: GuestOrder | null;
  onContinueShopping: () => void;
  onCreateAccount: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  order,
  onContinueShopping,
  onCreateAccount,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <HiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          ¡Pedido confirmado!
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Tu pedido ha sido procesado exitosamente
        </p>
      </div>

      {order && (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Detalles del pedido
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Número de orden
              </span>
              <span className="font-medium">
                #{order.guestOrderToken?.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Estado</span>
              <span className="font-medium text-green-600 dark:text-green-400 capitalize">
                {order.orderStatus}
              </span>
            </div>
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
                Seña pagada
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                ${order.depositAmount.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          ¿Qué sigue ahora?
        </h4>
        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <li>
            • Recibirás un email de confirmación en {order?.guestUser.email}
          </li>
          <li>• Nos pondremos en contacto para confirmar los detalles</li>
          <li>• Comenzaremos a trabajar en tu pedido</li>
          <li>• Te notificaremos cuando esté listo para el envío</li>
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={onContinueShopping}
          className="w-full flex items-center justify-center rounded-lg h-12 bg-blue-600 text-white text-base font-bold hover:bg-blue-700 transition-all"
        >
          <HiShoppingBag className="w-5 h-5 mr-2" />
          Continuar comprando
        </button>

        <button
          onClick={onCreateAccount}
          className="w-full flex items-center justify-center rounded-lg h-12 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-base font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
        >
          <HiUser className="w-5 h-5 mr-2" />
          Crear cuenta para futuros pedidos
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          ¿Necesitas ayuda? Contactanos por WhatsApp o email
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;

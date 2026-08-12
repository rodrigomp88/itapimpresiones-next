"use client";

import { motion } from "framer-motion";
import { HiUser, HiShoppingCart } from "react-icons/hi";

interface CheckoutOptionsProps {
  onGuestCheckout: () => void;
  onUserCheckout: () => void;
}

const CheckoutOptions: React.FC<CheckoutOptionsProps> = ({
  onGuestCheckout,
  onUserCheckout,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
        ¿Cómo quieres finalizar tu compra?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción Guest Checkout */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 border-2 border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
          onClick={onGuestCheckout}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
              <HiShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Continuar como invitado
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Compra rápida sin registro
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Proceso más rápido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>No necesitas crear cuenta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Opción de crear cuenta después</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800 rounded text-center">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              ✓ Recomendado para primera compra
            </span>
          </div>
        </motion.div>

        {/* Opción User Checkout */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer"
          onClick={onUserCheckout}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
              <HiUser className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Iniciar sesión / Registrarse
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Compra con tu cuenta
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
              <span>Acceso a historial de pedidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
              <span>Datos guardados automáticamente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
              <span>Programas de fidelización</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info adicional */}
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5">
            💡
          </div>
          <div>
            <p className="text-amber-800 dark:text-amber-200 font-medium text-sm mb-1">
              ¿Primera vez comprando aquí?
            </p>
            <p className="text-amber-700 dark:text-amber-300 text-xs">
              Te recomendamos usar "Continuar como invitado" para una
              experiencia más rápida. Podrás crear tu cuenta después de
              completar la compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOptions;

"use client";

import { useState } from "react";
import { GuestUser } from "@/hooks/useGuestCheckout";
import { AppliedCoupon } from "@/types/coupon";
import { PaymentMethod } from "@/types/payment";
import { HiLockClosed } from "react-icons/hi";

interface GuestUserFormProps {
  guestUser: GuestUser;
  onUpdateField: (field: keyof GuestUser, value: string) => void;
  onSubmit: (
    appliedCoupon?: AppliedCoupon,
    paymentMethod?: PaymentMethod
  ) => void;
  isSubmitting: boolean;
}

const GuestUserForm: React.FC<GuestUserFormProps> = ({
  guestUser,
  onUpdateField,
  onSubmit,
  isSubmitting,
}) => {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mercadopago");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(undefined, paymentMethod);
  };

  const handleFieldChange = (field: keyof GuestUser, value: string) => {
    onUpdateField(field, value);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-prussian-blue dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
        Información de contacto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              value={guestUser.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-prussian-blue dark:text-white placeholder-zinc-400"
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              value={guestUser.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-prussian-blue dark:text-white placeholder-zinc-400"
              placeholder="Ej: +54 9 11..."
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Correo electrónico *
          </label>
          <input
            type="email"
            value={guestUser.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-prussian-blue dark:text-white placeholder-zinc-400"
            placeholder="Ej: juan@email.com"
            required
          />
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Dirección completa *
          </label>
          <input
            type="text"
            value={guestUser.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-prussian-blue dark:text-white placeholder-zinc-400"
            placeholder="Ej: Calle Ficticia 123, Piso 4, Depto B"
            required
          />
        </div>

        {/* Ciudad y Código Postal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              value={guestUser.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-prussian-blue dark:text-white placeholder-zinc-400"
              placeholder="Ej: Buenos Aires"
              required
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Código postal *
            </label>
            <input
              type="text"
              value={guestUser.postalCode}
              onChange={(e) => handleFieldChange("postalCode", e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-prussian-blue dark:text-white placeholder-zinc-400"
              placeholder="Ej: 1000"
              required
            />
          </div>
        </div>

        {/* Provincia */}
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Provincia *
          </label>
          <select
            value={guestUser.province}
            onChange={(e) => handleFieldChange("province", e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-prussian-blue dark:text-white"
            required
          >
            <option value="">Seleccionar provincia</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Mendoza">Mendoza</option>
          </select>
        </div>

        {/* Método de pago */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
          <h3 className="text-lg font-medium text-prussian-blue dark:text-zinc-100 mb-4">
            Método de pago
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <input
                type="radio"
                name="paymentMethod"
                value="mercadopago"
                checked={paymentMethod === "mercadopago"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <span className="font-medium text-prussian-blue dark:text-zinc-100">
                  MercadoPago
                </span>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Tarjetas de crédito, débito y transferencia
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <input
                type="radio"
                name="paymentMethod"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <span className="font-medium text-prussian-blue dark:text-zinc-100">
                  Transferencia bancaria
                </span>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Transferencia directa a nuestra cuenta
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <HiLockClosed className="w-5 h-5" />
                <span>Continuar al pago</span>
              </div>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Al continuar, aceptas nuestros términos y condiciones de envío
          </p>
        </div>
      </form>
    </div>
  );
};

export default GuestUserForm;

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiInformationCircle,
  HiTruck,
  HiCreditCard,
  HiTag,
} from "react-icons/hi";

interface PriceBreakdownProps {
  subtotal: number;
  discount?: number;
  couponCode?: string;
  freeShippingThreshold?: number;
  taxRate?: number; // Porcentaje de IVA
  showBreakdown?: boolean;
  onShippingChange?: (shipping: number) => void;
  onApplyCoupon?: (code: string) => void;
  className?: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  discount = 0,
  couponCode = "",
  freeShippingThreshold = 5000,
  taxRate = 21, // 21% IVA Argentina
  showBreakdown = true,
  onShippingChange,
  onApplyCoupon,
  className = "",
}) => {
  const [selectedShipping, setSelectedShipping] = useState<string>("standard");
  const [couponInput, setCouponInput] = useState(couponCode);
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(couponCode);
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(showBreakdown);

  // Opciones de envío disponibles
  const shippingOptions: ShippingOption[] = [
    {
      id: "standard",
      name: "Envío Estándar",
      price: subtotal >= freeShippingThreshold ? 0 : 800,
      estimatedDays: "5-7 días",
      description: "Entrega en días hábiles",
    },
    {
      id: "express",
      name: "Envío Express",
      price: 1500,
      estimatedDays: "2-3 días",
      description: "Entrega rápida",
    },
    {
      id: "same_day",
      name: "Mismo Día",
      price: 2500,
      estimatedDays: "Mismo día",
      description: "Solo CABA y GBA",
    },
  ];

  // Calcular precios
  const calculatedTax = (subtotal - discount) * (taxRate / 100);
  const finalSubtotal = subtotal - discount;
  const finalShipping =
    shippingOptions.find((option) => option.id === selectedShipping)?.price ||
    0;
  const finalTax = calculatedTax;
  const total = finalSubtotal + finalShipping + finalTax;

  // Efectos
  useEffect(() => {
    if (onShippingChange) {
      onShippingChange(finalShipping);
    }
  }, [finalShipping, onShippingChange]);

  // Aplicar cupón
  const handleApplyCoupon = () => {
    if (couponInput.trim() && onApplyCoupon) {
      onApplyCoupon(couponInput.trim());
      setAppliedCoupon(couponInput.trim());
      setCouponInput("");
    }
  };

  // Obtener precio formateado
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
  };

  // Obtener estado de envío gratis
  const getFreeShippingStatus = () => {
    if (subtotal >= freeShippingThreshold) return "free";
    const remaining = freeShippingThreshold - subtotal;
    if (remaining <= 1000) return "almost";
    return "none";
  };

  const freeShippingStatus = getFreeShippingStatus();

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Resumen de Precios
          </h3>
          <button
            onClick={() => setIsBreakdownVisible(!isBreakdownVisible)}
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <HiInformationCircle className="w-4 h-4" />
            {isBreakdownVisible ? "Ocultar detalles" : "Ver detalles"}
          </button>
        </div>

        {/* Barra de progreso envío gratis */}
        {freeShippingStatus !== "free" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-600 dark:text-zinc-400">
                Envío gratis en compras superiores a{" "}
                {formatPrice(freeShippingThreshold)}
              </span>
              {freeShippingStatus === "almost" && (
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  ¡Te faltan solo{" "}
                  {formatPrice(freeShippingThreshold - subtotal)}!
                </span>
              )}
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  freeShippingStatus === "almost"
                    ? "bg-gradient-to-r from-orange-400 to-orange-600"
                    : "bg-gradient-to-r from-primary-light to-primary"
                }`}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">
            Subtotal ({/* Aquí iría el número de items */} productos)
          </span>
          <span className="font-medium text-zinc-900 dark:text-white">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Descuentos */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <div className="flex items-center gap-2">
              <HiTag className="w-4 h-4" />
              <span>Descuentos</span>
              {appliedCoupon && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  {appliedCoupon}
                </span>
              )}
            </div>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        {/* Opción de envío */}
        <div className="space-y-2">
          <button
            onClick={() => setShowShippingOptions(!showShippingOptions)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <HiTruck className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Envío</span>
            </div>
            <div className="text-right">
              <span
                className={`font-medium ${
                  finalShipping === 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-zinc-900 dark:text-white"
                }`}
              >
                {finalShipping === 0 ? "GRATIS" : formatPrice(finalShipping)}
              </span>
              {shippingOptions.find(
                (option) => option.id === selectedShipping
              ) && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {
                    shippingOptions.find(
                      (option) => option.id === selectedShipping
                    )?.estimatedDays
                  }
                </div>
              )}
            </div>
          </button>

          {/* Opciones de envío expandibles */}
          <AnimatePresence>
            {showShippingOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 ml-6"
              >
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-white text-sm">
                          {option.name}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {option.description} • {option.estimatedDays}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-medium ${
                          option.price === 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-zinc-900 dark:text-white"
                        }`}
                      >
                        {option.price === 0
                          ? "GRATIS"
                          : formatPrice(option.price)}
                      </span>
                    </div>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Impuestos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiCreditCard className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-400">
              IVA ({taxRate}%)
            </span>
          </div>
          <span className="font-medium text-zinc-900 dark:text-white">
            {formatPrice(finalTax)}
          </span>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">
              Total
            </span>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Cupón de descuento */}
        {onApplyCoupon && (
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Código de descuento"
                className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Aplicar
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✓ Cupón "{appliedCoupon}" aplicado correctamente
              </div>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <p>• Los precios incluyen IVA</p>
            <p>
              • Envío gratis en compras superiores a{" "}
              {formatPrice(freeShippingThreshold)}
            </p>
            <p>• Los tiempos de entrega son estimados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;

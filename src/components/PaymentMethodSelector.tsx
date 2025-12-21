"use client";

import { useState } from "react";
import { PaymentMethod, PAYMENT_METHODS, BANK_TRANSFER_INFO } from "@/types/payment";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  cartTotal: number;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  cartTotal,
}: PaymentMethodSelectorProps) {
  const [showTransferDetails, setShowTransferDetails] = useState(false);

  const availableMethods = PAYMENT_METHODS.filter((method) => {
    if (!method.enabled) return false;
    if (method.minAmount && cartTotal < method.minAmount) return false;
    if (method.maxAmount && cartTotal > method.maxAmount) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Método de pago
      </p>
      
      <div className="space-y-2">
        {availableMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              selectedMethod === method.id
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodChange(method.id)}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{method.icon}</span>
                <span className="font-medium text-zinc-900 dark:text-white text-sm">
                  {method.name}
                </span>
                {method.processingTime && (
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                    {method.processingTime}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {method.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Detalles de transferencia bancaria */}
      {selectedMethod === "transfer" && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              📋 Datos para la transferencia
            </p>
            <button
              type="button"
              onClick={() => setShowTransferDetails(!showTransferDetails)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showTransferDetails ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          
          {showTransferDetails && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Banco:</span>
                <span className="text-blue-900 dark:text-blue-100 font-medium">
                  {BANK_TRANSFER_INFO.bank}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Tipo de cuenta:</span>
                <span className="text-blue-900 dark:text-blue-100 font-medium">
                  {BANK_TRANSFER_INFO.accountType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">CBU:</span>
                <span className="text-blue-900 dark:text-blue-100 font-mono font-medium">
                  {BANK_TRANSFER_INFO.cbu}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Alias:</span>
                <span className="text-blue-900 dark:text-blue-100 font-medium">
                  {BANK_TRANSFER_INFO.alias}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Titular:</span>
                <span className="text-blue-900 dark:text-blue-100 font-medium">
                  {BANK_TRANSFER_INFO.holder}
                </span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                ⚠️ Envianos el comprobante por WhatsApp o email para confirmar el pago.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Información de efectivo */}
      {selectedMethod === "cash" && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            💵 Tu pedido quedará reservado. Pagás el total cuando retires en nuestro local.
            <br />
            <span className="font-medium">Dirección: Av. Ejemplo 1234, CABA</span>
          </p>
        </div>
      )}
    </div>
  );
}

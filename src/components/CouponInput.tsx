"use client";

import { useState } from "react";
import { AppliedCoupon, CouponValidationResult } from "@/types/coupon";

interface CouponInputProps {
  cartTotal: number;
  categories?: string[];
  onCouponApplied: (coupon: AppliedCoupon | null) => void;
  appliedCoupon: AppliedCoupon | null;
}

export default function CouponInput({
  cartTotal,
  categories = [],
  onCouponApplied,
  appliedCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleApplyCoupon = async () => {
    if (!code.trim()) {
      setMessage("Ingresá un código de cupón");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          cartTotal,
          categories,
        }),
      });

      const result: CouponValidationResult = await response.json();

      if (result.isValid && result.coupon && result.discount) {
        onCouponApplied({
          code: result.coupon.code,
          type: result.coupon.type,
          value: result.coupon.value,
          discount: result.discount,
        });
        setMessage(result.message);
        setIsError(false);
      } else {
        setMessage(result.message);
        setIsError(true);
      }
    } catch {
      setMessage("Error al validar el cupón");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponApplied(null);
    setCode("");
    setMessage("");
    setIsError(false);
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <div>
              <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                Cupón {appliedCoupon.code}
              </p>
              <p className="text-green-600 dark:text-green-400 text-xs">
                -
                {appliedCoupon.type === "percentage"
                  ? `${appliedCoupon.value}%`
                  : `$${appliedCoupon.value.toLocaleString("es-AR")}`}{" "}
                = -${appliedCoupon.discount.toLocaleString("es-AR")}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 text-sm font-medium"
          >
            Quitar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código de cupón"
          className="flex-1 px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
          disabled={isLoading}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={isLoading || !code.trim()}
          className="px-4 py-2 text-sm font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Aplicar"}
        </button>
      </div>

      {message && (
        <p
          className={`text-xs ${isError ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

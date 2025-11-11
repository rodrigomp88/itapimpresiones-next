"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "@/redux/slice/cartSlice";

const CheckoutSummary: React.FC = () => {
  const cartItems = useAppSelector(selectCartItems);
  const cartTotalAmount = useAppSelector(selectCartTotalAmount);
  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity);

  return (
    <div>
      <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-3">
        Resumen de la Orden
      </h2>

      <div className="space-y-2 my-4 text-sm">
        {cartItems.map((item) => (
          <div className="flex justify-between" key={item.id}>
            <p className="w-2/3 truncate" title={item.name}>
              {item.name}{" "}
              <span className="text-gray-500 dark:text-gray-400">
                x{item.cartQuantity}
              </span>
            </p>
            <p>${(item.price * item.cartQuantity).toLocaleString("es-AR")}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
        <span className="text-lg font-bold">
          Total ({cartTotalQuantity} items)
        </span>
        <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
          ${cartTotalAmount.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;

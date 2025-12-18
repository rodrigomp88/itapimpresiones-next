"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectCartTotalQuantity } from "@/redux/slice/cartSlice";

const MobileNavigation = () => {
  const pathname = usePathname();
  const cartItemCount = useSelector(selectCartTotalQuantity);

  const navigationItems = [
    {
      icon: "home",
      label: "Inicio",
      href: "/",
      isActive: pathname === "/",
    },
    {
      icon: "store",
      label: "Tienda",
      href: "/tienda",
      isActive: pathname.startsWith("/tienda") || pathname.startsWith("/producto"),
    },
    {
      icon: "shopping_cart",
      label: "Carrito",
      href: "/checkout",
      isActive: pathname.startsWith("/checkout"),
      hasBadge: true,
    },
    {
      icon: "support",
      label: "Servicios",
      href: "/servicios",
      isActive: pathname.startsWith("/servicios"),
      isSpecial: true,
    },
    {
      icon: "receipt_long",
      label: "Pedidos",
      href: "/orders",
      isActive: pathname.startsWith("/orders"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-1">
        {navigationItems.map((item, index) => (
          <Link 
            key={index}
            href={item.href} 
            className={`flex flex-col items-center justify-center w-full h-full transition-colors relative ${
              item.isActive 
                ? "text-primary" 
                : "text-muted-light dark:text-muted-dark hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {item.isSpecial ? (
              // Botón central especial (Servicios)
              <motion.div
                className="flex flex-col items-center -mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-4 border-surface-light dark:border-surface-dark">
                  <span className="material-icons-outlined text-2xl">{item.icon}</span>
                </div>
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="material-icons-outlined text-2xl relative">
                  {item.icon}
                  {item.hasBadge && cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </span>
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;

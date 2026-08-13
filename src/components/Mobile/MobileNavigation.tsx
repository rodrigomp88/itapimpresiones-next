"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const MobileNavigation = () => {
  const pathname = usePathname();

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
      isActive:
        pathname.startsWith("/tienda") || pathname.startsWith("/producto"),
    },
    {
      icon: "shopping_bag",
      label: "Bolsas",
      href: "/bolsas",
      isActive: pathname.startsWith("/bolsas"),
    },
    {
      icon: "checkroom",
      label: "Indumentaria",
      href: "/indumentaria",
      isActive: pathname.startsWith("/indumentaria"),
    },
    {
      icon: "support",
      label: "Servicios",
      href: "/servicios",
      isActive: pathname.startsWith("/servicios"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/20 pb-safe z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group ${item.isActive ? "transform -translate-y-1" : "hover:transform hover:-translate-y-0.5"}`}
          >
            {/* Botones regulares con diseño mejorado */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {item.isActive && (
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary/20 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0 }}
                  />
                )}
                <span
                  className={`material-symbols-outlined text-2xl relative transition-all duration-300 ${
                    item.isActive
                      ? "text-transparent bg-gradient-to-r from-primary to-primary bg-clip-text drop-shadow-sm"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                  }`}
                >
                  {item.icon}
                </span>
              </div>
              <span
                className={`text-xs mt-1.5 font-medium transition-all duration-300 ${
                  item.isActive
                    ? "text-gray-800 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Indicador de estado activo */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
    </nav>
  );
};

export default MobileNavigation;

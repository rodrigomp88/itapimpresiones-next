"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const MobileHero = () => {
  return (
    <section className="relative pt-6 pb-10 overflow-hidden bg-gradient-to-b from-blue-50 to-background-light dark:from-blue-900/20 dark:to-background-dark">
      <div className="px-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-sm mx-auto animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-500/20 blur-3xl rounded-full opacity-50 transform scale-75 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              <Image
                alt="Gorras exclusivas personalizadas con logo corporativo"
                width={384}
                height={256}
                priority
                className="relative z-10 w-full h-64 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                src="/images/carousel0.webp"
              />
            </div>
            <motion.h1
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Gorras Exclusivas
            </motion.h1>
            <motion.p
              className="text-text-light dark:text-text-dark mb-6 text-sm px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              El toque final para tu identidad corporativa. Personaliza con
              bordado de alta calidad.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/tienda?category=gorras">
                <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 transition-all active:scale-95 w-full sm:w-auto">
                  Ver Gorras
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-8 h-1.5 bg-primary rounded-full"></div>
          <div className="w-2 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="w-2 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;

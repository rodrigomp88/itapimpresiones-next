"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SlideData } from "@/types";

interface SliderProps {
  slides: SlideData[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-200">
        No hay imágenes
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden group bg-white dark:bg-black">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Clean background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white dark:from-slate-900 dark:to-black" />

          {/* Content Container */}
          <div className="relative z-10 h-full grid md:grid-cols-2 items-center max-w-7xl mx-auto px-6 md:px-12">
            {/* Text Content */}
            <motion.div
              className="flex flex-col items-center md:items-start text-center md:text-left space-y-5"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                {slides[current].heading}
              </h2>
              <p className="text-base md:text-lg font-light text-slate-600 dark:text-gray-300 max-w-md leading-relaxed">
                {slides[current].desc}
              </p>
              {slides[current].ctaLink && (
                <Link href={slides[current].ctaLink}>
                  <button className="mt-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    {slides[current].ctaText || "Ver Más"}
                  </button>
                </Link>
              )}
            </motion.div>

            {/* Main Image - Clear and prominent */}
            <motion.div
              className="hidden md:flex items-center justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <img
                src={slides[current].image}
                alt={slides[current].heading}
                className="max-h-[400px] w-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-full p-3 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 z-20"
            aria-label="Anterior"
          >
            <span className="text-2xl">&#10094;</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-full p-3 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 z-20"
            aria-label="Siguiente"
          >
            <span className="text-2xl">&#10095;</span>
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-8 bg-slate-800 dark:bg-white"
                    : "w-2 bg-slate-400 dark:bg-white/50 hover:bg-slate-500 dark:hover:bg-white/70"
                }`}
                aria-label={`Ir a slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Slider;

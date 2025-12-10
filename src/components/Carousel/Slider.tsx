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
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden group bg-gray-50 dark:bg-black/40">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={slides[current].image}
              alt={slides[current].heading}
              className="w-auto h-full max-w-full object-contain mx-auto drop-shadow-xl"
            />
            {/* Gradient Overlay for text readability (lighter now) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 lg:px-24">
            <div className="max-w-xl text-white space-y-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-black leading-tight tracking-tight"
              >
                {slides[current].heading}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl font-medium text-gray-200"
              >
                {slides[current].desc}
              </motion.p>

              {slides[current].ctaLink && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link href={slides[current].ctaLink}>
                    <button className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      {slides[current].ctaText || "Ver Más"}
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-white/10 text-white rounded-full p-3 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <span className="text-2xl">&#10094;</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-white/10 text-white rounded-full p-3 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
            aria-label="Siguiente"
          >
            <span className="text-2xl">&#10095;</span>
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === current
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/80"
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

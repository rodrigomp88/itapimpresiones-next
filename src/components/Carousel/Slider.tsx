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
      <div className="flex items-center justify-center h-[600px] bg-gray-200">
        No hay imágenes
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
      
      {/* Background image with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      ></div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 w-full h-full grid md:grid-cols-2 items-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Text Content */}
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 p-6 lg:p-12"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
              {slides[current].heading}
            </h1>
            <p className="text-lg md:text-xl font-light text-slate-100 max-w-lg leading-relaxed opacity-90">
              {slides[current].desc}
            </p>
            {slides[current].ctaLink && (
              <Link href={slides[current].ctaLink}>
                <button className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-semibold hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  {slides[current].ctaText || "Ver Servicios"}
                </button>
              </Link>
            )}
          </motion.div>

          {/* Image Content */}
          <motion.div
            className="flex items-center justify-center p-4"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <img
              src={slides[current].image}
              alt={slides[current].heading}
              className="max-h-[500px] w-auto object-contain drop-shadow-xl"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-white/10 text-white rounded-full p-3 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 z-30"
            aria-label="Anterior"
          >
            <span className="text-2xl">&#10094;</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-white/10 text-white rounded-full p-3 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 z-30"
            aria-label="Siguiente"
          >
            <span className="text-2xl">&#10095;</span>
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-8 bg-white opacity-100 shadow-sm"
                    : "w-2 bg-white/50"
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

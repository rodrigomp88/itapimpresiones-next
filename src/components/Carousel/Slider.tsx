"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Image {
  url: string;
}

interface SliderProps {
  images: Image[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-200">
        No hay imágenes
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={current}
          src={images[current].url}
          alt={`Slide ${current + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition"
            aria-label="Anterior"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition"
            aria-label="Siguiente"
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
};

export default Slider;

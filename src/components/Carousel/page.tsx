"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Link from "next/link";
import useSlider from "@/src/hooks/useSlider";

const Carousel: React.FC = () => {
  const { currentSlide, nextSlide, prevSlide, goToSlide, sliderData } =
    useSlider();

  const handleClickIndicator = (index: number) => {
    goToSlide(index);
  };

  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          className="w-full h-full absolute inset-0 grid md:grid-cols-2 items-center"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-4 p-4">
            <h1 className="text-2xl md:text-4xl font-bold">
              {sliderData[currentSlide].heading}
            </h1>
            <p className="text-lg">{sliderData[currentSlide].desc}</p>
          </div>

          <div className="flex items-center justify-center p-4">
            <img
              src={sliderData[currentSlide].image}
              alt={sliderData[currentSlide].heading}
              className="max-h-[70vh] w-auto object-contain"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-5 w-full flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2">
          <button
            className="control-btn"
            onClick={prevSlide}
            aria-label="Slide anterior"
          >
            <FaAngleLeft />
          </button>
          {sliderData.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-black dark:bg-white"
                  : "w-4 bg-gray-400"
              }`}
              onClick={() => handleClickIndicator(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
          <button
            className="control-btn"
            onClick={nextSlide}
            aria-label="Siguiente slide"
          >
            <FaAngleRight />
          </button>
        </div>

        <Link href="/shop" className="btn-primary">
          Mira nuestra tienda
        </Link>
      </div>
    </div>
  );
};

export default Carousel;

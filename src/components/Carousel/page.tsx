"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import useSlider from "@/hooks/useSlider";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: { opacity: 0 },
};

const textVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const imageVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

const Carousel: React.FC = () => {
  const { currentSlide, nextSlide, prevSlide, goToSlide, sliderData } =
    useSlider();

  const handleClickIndicator = useCallback((index: number) => {
    goToSlide(index);
  }, [goToSlide]);

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>

      {/* Background image with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${sliderData[currentSlide].image})` }}
      ></div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          className="w-full h-full absolute inset-0 grid md:grid-cols-2 items-center z-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={textVariants}
            className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 p-6 lg:p-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-lg">
              {sliderData[currentSlide].heading}
            </h1>
            <p className="text-lg md:text-xl font-light text-slate-100 max-w-lg leading-relaxed opacity-90">
              {sliderData[currentSlide].desc}
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-semibold hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Ver Servicios
            </Link>
          </motion.div>

          <motion.div
            variants={imageVariants}
            className="flex items-center justify-center p-4"
          >
            <Image
              src={sliderData[currentSlide].image}
              alt={sliderData[currentSlide].heading}
              width={500}
              height={500}
              unoptimized
              className="max-h-[500px] w-auto object-contain drop-shadow-xl"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-30">
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-white opacity-100 shadow-sm"
                  : "w-2 bg-white/50"
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
      </div>
    </div>
  );
};

export default Carousel;

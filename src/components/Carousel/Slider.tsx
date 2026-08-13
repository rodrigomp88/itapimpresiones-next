"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SlideData } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SliderProps {
  slides: SlideData[];
}

const Slider: React.FC<SliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [announceText, setAnnounceText] = useState("");
  const isMobile = useIsMobile();

  // Auto-slide effect (pausa durante navegación manual)
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = prev === slides.length - 1 ? 0 : prev + 1;
        setAnnounceText(
          `Slide ${next + 1} de ${slides.length}: ${slides[next].heading}`
        );
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navegación por teclado
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (slides.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setIsPlaying(false);
          prevSlide();
          break;
        case "ArrowRight":
          event.preventDefault();
          setIsPlaying(false);
          nextSlide();
          break;
        case "Home":
          event.preventDefault();
          setIsPlaying(false);
          goToSlide(0);
          break;
        case "End":
          event.preventDefault();
          setIsPlaying(false);
          goToSlide(slides.length - 1);
          break;
        case " ":
          event.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    },
    [slides.length, isPlaying] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const nextSlide = () => {
    const next = current === slides.length - 1 ? 0 : current + 1;
    setCurrent(next);
    setAnnounceText(
      `Slide ${next + 1} de ${slides.length}: ${slides[next].heading}`
    );
  };

  const prevSlide = () => {
    const prev = current === 0 ? slides.length - 1 : current - 1;
    setCurrent(prev);
    setAnnounceText(
      `Slide ${prev + 1} de ${slides.length}: ${slides[prev].heading}`
    );
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAnnounceText(
      `Slide ${index + 1} de ${slides.length}: ${slides[index].heading}`
    );
  };

  if (!slides || slides.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[500px] bg-gray-200"
        role="alert"
      >
        No hay imágenes
      </div>
    );
  }

  return (
    <section
      className="relative w-full h-[600px] md:h-[500px] overflow-hidden group bg-white dark:bg-black"
      role="region"
      aria-label="Carrusel de imágenes"
      aria-roledescription="carrusel"
    >
      {/* Live region para anunciar cambios a lectores de pantalla */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {announceText}
      </div>

      {/* Controles de reproducción/pausa (ocultos visualmente) */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="sr-only"
        aria-label={
          isPlaying
            ? "Pausar carrusel automático"
            : "Reanudar carrusel automático"
        }
      >
        {isPlaying ? "Pausar" : "Reanudar"}
      </button>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${current + 1} de ${slides.length}`}
        >
          {/* Clean background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white dark:from-slate-900 dark:to-black" />

          {/* Content Container */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-12">
            {isMobile ? (
              // LAYOUT MÓVIL: imagen arriba, texto abajo
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                {/* Imagen ARRIBA en móvil */}
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Image
                    src={slides[current].image}
                    alt={slides[current].heading}
                    width={320}
                    height={320}
                    priority={current === 0}
                    className="max-h-[320px] w-auto object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 320px"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
                    }}
                  />
                </motion.div>

                {/* Texto ABAJO en móvil */}
                <motion.div
                  className="flex flex-col items-center text-center space-y-3 px-2"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                    {slides[current].heading}
                  </h2>
                  <p className="text-sm font-light text-slate-600 dark:text-gray-300 max-w-md leading-relaxed">
                    {slides[current].desc}
                  </p>
                  {slides[current].ctaLink && (
                    <Link href={slides[current].ctaLink}>
                      <button className="mt-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg">
                        {slides[current].ctaText || "Ver Más"}
                      </button>
                    </Link>
                  )}
                </motion.div>
              </div>
            ) : (
              // LAYOUT DESKTOP: texto izquierda, imagen derecha
              <div className="h-full grid md:grid-cols-2 items-center">
                {/* Texto IZQUIERDA en desktop */}
                <motion.div
                  className="flex flex-col items-start text-left space-y-5 pr-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h2 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                    {slides[current].heading}
                  </h2>
                  <p className="text-lg font-light text-slate-600 dark:text-gray-300 max-w-md leading-relaxed">
                    {slides[current].desc}
                  </p>
                  {slides[current].ctaLink && (
                    <Link href={slides[current].ctaLink}>
                      <button className="mt-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        {slides[current].ctaText || "Ver Más"}
                      </button>
                    </Link>
                  )}
                </motion.div>

                {/* Imagen DERECHA en desktop */}
                <motion.div
                  className="flex items-center justify-center pl-8"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Image
                    src={slides[current].image}
                    alt={slides[current].heading}
                    width={450}
                    height={450}
                    priority={current === 0}
                    className="max-h-[450px] w-auto object-contain drop-shadow-2xl"
                    sizes="(min-width: 769px) 50vw, 450px"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDQ1MCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0NTAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
                    }}
                  />
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Botones de navegación */}
          <div className="sr-only">
            <p>
              Use las flechas del teclado para navegar, Home para ir al primer
              slide, End para el último, y Espacio para pausar/reanudar.
            </p>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-full p-2 md:p-3 transition-colors backdrop-blur-sm opacity-70 md:opacity-0 group-hover:opacity-100 z-20"
            aria-label={`Slide anterior (${current === 0 ? slides.length : current} de ${slides.length})`}
            aria-describedby="carousel-instructions"
          >
            <span className="text-lg md:text-2xl" aria-hidden="true">
              ‹
            </span>
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-slate-200 hover:bg-slate-300 dark:text-white rounded-full p-2 md:p-3 transition-colors backdrop-blur-sm opacity-70 md:opacity-0 group-hover:opacity-100 z-20"
            aria-label={`Slide siguiente (${current === slides.length - 1 ? 1 : current + 2} de ${slides.length})`}
            aria-describedby="carousel-instructions"
          >
            <span className="text-lg md:text-2xl" aria-hidden="true">
              ›
            </span>
          </button>

          {/* Indicadores de puntos */}
          <nav
            className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20"
            aria-label="Navegación de slides"
            role="tablist"
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  idx === current
                    ? "w-6 md:w-8 bg-slate-800 dark:bg-white"
                    : "w-1.5 md:w-2 bg-slate-400 dark:bg-white/50 hover:bg-slate-500 dark:hover:bg-white/70"
                }`}
                aria-label={`Ir a slide ${idx + 1}: ${slides[idx].heading}`}
                aria-current={idx === current ? "true" : "false"}
                role="tab"
                tabIndex={idx === current ? 0 : -1}
              >
                <span className="sr-only">Slide {idx + 1}</span>
              </button>
            ))}
          </nav>

          {/* Instrucciones ocultas para lectores de pantalla */}
          <div id="carousel-instructions" className="sr-only">
            Carrusel de {slides.length} slides. Use las flechas izquierda y
            derecha para navegar.
            {isPlaying
              ? "Reproducción automática activa."
              : "Reproducción automática pausada."}
          </div>
        </>
      )}
    </section>
  );
};

export default Slider;

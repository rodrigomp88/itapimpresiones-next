"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import InkBlob from "@/components/Design/InkBlob";

/**
 * HeroSection — Hero con estilo Streetwear Broken Grid
 * Productos flotantes, manchas de tinta, tipografía bold
 */
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#f5f5f0] dark:bg-prussian-blue">
      {/* Manchas de tinta como fondo */}
      <InkBlob
        color="var(--color-primary)"
        variant="bottom"
        opacity={0.08}
        className="absolute top-0 left-0 w-full h-64"
      />
      <InkBlob
        color="var(--color-cta)"
        variant="right"
        opacity={0.05}
        className="absolute top-1/4 right-0 w-96 h-96"
      />

      {/* Contenido principal */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Texto */}
          <div className="space-y-6 lg:space-y-8">
            {/* Etiqueta */}
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Impresión Textil & Packaging
              </span>
            </div>

            {/* Título principal */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-prussian-blue dark:text-white leading-[0.9] tracking-tight">
              Tu marca
              <br />
              <span className="text-primary">merece</span>
              <br />
              <span className="relative inline-block">
                destacar
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-cta"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,8 C50,12 100,4 200,8 L200,12 L0,12 Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-lg">
              Serigrafía, DTF y sublimado. Convertimos tu diseño en productos
              que hablan por tu marca.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/tienda">
                <button className="px-8 py-4 bg-cta text-white rounded-xl font-bold text-lg hover:bg-cta-dark transition-all duration-300 hover:shadow-xl hover:shadow-cta/30 hover:-translate-y-1">
                  Ver Productos
                </button>
              </Link>
              <Link href="/servicios">
                <button className="px-8 py-4 bg-white dark:bg-zinc-800 text-prussian-blue dark:text-white rounded-xl font-bold text-lg border-2 border-prussian-blue/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  Nuestros Servicios
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-extrabold text-primary">10+</p>
                <p className="text-sm text-zinc-500">Años de experiencia</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">500+</p>
                <p className="text-sm text-zinc-500">Marcas confían en nosotros</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">24h</p>
                <p className="text-sm text-zinc-500">Tiempo de respuesta</p>
              </div>
            </div>
          </div>

          {/* Productos flotantes */}
          <div className="relative h-[500px] lg:h-[600px] hidden md:block">
            {/* Producto principal — flotante */}
            <div className="absolute top-10 left-10 lg:left-20 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300" />
                <div className="relative w-64 h-80 bg-white rounded-3xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:-translate-y-3">
                  <Image
                    src="/images/carousel1.webp"
                    alt="Remera personalizada"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="256px"
                    priority
                  />
                </div>
                {/* Etiqueta flotante */}
                <div className="absolute -top-4 -right-4 bg-cta text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  Nuevo
                </div>
              </div>
            </div>

            {/* Producto secundario — superpuesto */}
            <div className="absolute bottom-20 right-10 lg:right-20 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cta/20 rounded-3xl translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300" />
                <div className="relative w-48 h-48 bg-white rounded-3xl overflow-hidden border-2 border-cta/20 group-hover:border-cta/40 transition-all duration-300 group-hover:-translate-y-3 rotate-3 group-hover:rotate-6">
                  <Image
                    src="/images/carousel3.webp"
                    alt="Gorra personalizada"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="192px"
                  />
                </div>
              </div>
            </div>

            {/* Producto tercario — pequeño */}
            <div className="absolute top-1/2 -translate-y-1/2 right-1/4 group hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
                <div className="relative w-32 h-40 bg-white rounded-2xl overflow-hidden border-2 border-secondary/20 group-hover:border-secondary/40 transition-all duration-300 group-hover:-translate-y-2 -rotate-2 group-hover:-rotate-4">
                  <Image
                    src="/images/carousel0.webp"
                    alt="Bolsa personalizada"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="128px"
                  />
                </div>
              </div>
            </div>

            {/* Mancha de tinta decorativa */}
            <svg
              className="absolute -bottom-10 -left-10 w-64 h-64 text-primary/10"
              viewBox="0 0 200 200"
            >
              <path
                d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-sm text-zinc-400">Scroll</span>
        <svg
          className="w-6 h-6 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

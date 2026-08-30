"use client";

import React from "react";
import TechniqueCircle from "@/components/Design/TechniqueCircle";
import InkBlob from "@/components/Design/InkBlob";

/**
 * TechniquesSection — Sección de técnicas con círculos diagonales
 * Muestra Serigrafía, DTF y Sublimado en disposición asimétrica
 */
const TechniquesSection: React.FC = () => {
  const techniques = [
    {
      name: "Serigrafía",
      description: "Tinta de alta resistencia para grandes tiradas. Colores vibrantes que duran.",
      icon: "palette",
      color: "var(--color-primary)",
      bgColor: "rgba(1, 133, 193, 0.1)",
    },
    {
      name: "DTF",
      description: "Full color sin mínimos. Perfecto para diseños detallados y fotografías.",
      icon: "print",
      color: "var(--color-secondary)",
      bgColor: "rgba(2, 174, 156, 0.1)",
    },
    {
      name: "Sublimado",
      description: "Colores que se integran al tejido. Ideal para poliéster y materiales claros.",
      icon: "colorize",
      color: "var(--color-accent)",
      bgColor: "rgba(254, 144, 11, 0.1)",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Mancha de tinta superior */}
      <InkBlob
        color="var(--color-primary)"
        variant="top"
        opacity={0.05}
        className="absolute top-0 left-0 w-full h-32"
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Encabezado */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block text-sm font-semibold text-primary mb-4 tracking-wider uppercase">
            Nuestras Técnicas
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-prussian-blue dark:text-white mb-6">
            Elegí la técnica
            <br />
            <span className="text-primary">perfecta</span> para tu marca
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Cada técnica tiene sus ventajas. Te asesoramos para elegir la mejor
            opción según tu diseño, cantidad y presupuesto.
          </p>
        </div>

        {/* Círculos en diagonal */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16">
          {/* Línea conectora (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-zinc-200 dark:border-zinc-700" />

          {/* Serigrafía — arriba izquierda */}
          <div className="relative z-10 md:-translate-y-8">
            <TechniqueCircle {...techniques[0]} />
          </div>

          {/* DTF — centro */}
          <div className="relative z-20 md:translate-y-4">
            <TechniqueCircle {...techniques[1]} />
          </div>

          {/* Sublimado — abajo derecha */}
          <div className="relative z-10 md:translate-y-16">
            <TechniqueCircle {...techniques[2]} />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <a href="/servicios">
            <button className="px-8 py-4 bg-prussian-blue dark:bg-white text-white dark:text-prussian-blue rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Conocé todas las opciones
            </button>
          </a>
        </div>
      </div>

      {/* Mancha de tinta inferior */}
      <InkBlob
        color="var(--color-cta)"
        variant="bottom"
        opacity={0.05}
        className="absolute bottom-0 right-0 w-96 h-96"
      />
    </section>
  );
};

export default TechniquesSection;

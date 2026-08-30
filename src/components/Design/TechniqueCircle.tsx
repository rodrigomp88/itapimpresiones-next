"use client";

import React from "react";

interface TechniqueCircleProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  className?: string;
}

/**
 * TechniqueCircle — Círculo interactivo para técnicas de impresión
 * Se muestra en disposición diagonal asimétrica
 */
const TechniqueCircle: React.FC<TechniqueCircleProps> = ({
  name,
  description,
  icon,
  color,
  bgColor,
  className = "",
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Círculo principal */}
      <div
        className="relative w-40 h-40 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
        style={{ backgroundColor: bgColor }}
      >
        {/* Borde punteado animado */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"
          style={{ borderColor: color }}
        />

        {/* Ícono */}
        <span
          className="material-symbols-outlined text-5xl md:text-6xl mb-2 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12"
          style={{ color }}
        >
          {icon}
        </span>

        {/* Nombre */}
        <h3
          className="font-bold text-lg md:text-xl"
          style={{ color }}
        >
          {name}
        </h3>
      </div>

      {/* Tooltip con descripción */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:-translate-y-2 z-10">
        <p className="text-sm text-zinc-600 dark:text-zinc-300 text-center">
          {description}
        </p>
        {/* Flecha */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-zinc-800 rotate-45" />
      </div>
    </div>
  );
};

export default TechniqueCircle;

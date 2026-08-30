"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FloatingProductProps {
  name: string;
  price: number;
  image: string;
  slug: string;
  size?: "sm" | "md" | "lg";
  rotation?: number;
  className?: string;
}

/**
 * FloatingProduct — Producto con imagen PNG flotante
 * Efecto de producto "despegado" de la superficie
 */
const FloatingProduct: React.FC<FloatingProductProps> = ({
  name,
  price,
  image,
  slug,
  size = "md",
  rotation = 0,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-48 h-48",
    md: "w-64 h-64",
    lg: "w-80 h-80",
  };

  return (
    <Link href={`/producto/${slug}`}>
      <div
        className={`relative group cursor-pointer ${className}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Sombra brutalista */}
        <div className="absolute inset-0 bg-prussian-blue/20 rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />

        {/* Producto flotante */}
        <div
          className={`relative ${sizeClasses[size]} bg-white rounded-2xl overflow-hidden border-2 border-prussian-blue/10 group-hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-2`}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Info superpuesta */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-semibold text-sm truncate">
              {name}
            </h3>
            <p className="text-cta font-bold text-lg">
              ${price.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        {/* Etiqueta de precio flotante */}
        <div className="absolute -top-3 -right-3 bg-cta text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
          ${price.toLocaleString("es-AR")}
        </div>
      </div>
    </Link>
  );
};

export default FloatingProduct;

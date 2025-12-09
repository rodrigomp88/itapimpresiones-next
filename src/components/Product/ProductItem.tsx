"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, ProductImage } from "@/types";
import { motion } from "framer-motion";

// Helper para obtener la URL limpia
const getImageUrl = (img: string | ProductImage): string => {
  if (typeof img === "string") return img;
  return img?.url || "";
};

const ProductItem: React.FC<Product> = ({
  name,
  slug,
  price = 0,
  images,
  pause,
  description,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseEnter = () => {
    if (images && images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  if (!slug) return null;

  // Obtenemos la URL actual usando el helper
  const currentImageSrc =
    images && images.length > 0 ? getImageUrl(images[currentImageIndex]) : "";

  return (
    <Link href={`/producto/${slug}`} className="block group h-full">
      <motion.div
        className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-primary/10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <div className="relative overflow-hidden w-full h-64">
          {!imageLoaded && (
            <div className="absolute inset-0 w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
          )}
          {currentImageSrc ? (
            <Image
              fill
              className={`object-contain transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              src={currentImageSrc}
              alt={name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-zinc-800">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col p-4 gap-2 flex-grow">
          <h3
            className="text-zinc-900 dark:text-zinc-100 font-bold text-lg truncate"
            title={name}
          >
            {name}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2">
            {description || "Suave, resistente y perfecta para el día a día."}
          </p>

          {/* Opcional: Mostrar indicación de colores disponibles */}
          <div className="flex gap-1 mt-1">
            {images.slice(0, 4).map((img, idx) => {
              const color = typeof img !== "string" ? img.color : "Todos";
              if (color === "Todos") return null;

              const colorMap: any = {
                Blanco: "bg-gray-100 border-gray-300",
                Negro: "bg-black",
                Rojo: "bg-red-500",
                Azul: "bg-blue-500",
                Verde: "bg-green-500",
                Amarillo: "bg-yellow-400",
              };

              return (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full border ${
                    colorMap[color] || "bg-gray-400"
                  }`}
                  title={color}
                />
              );
            })}
          </div>

          <div className="mt-auto pt-2">
            {pause ? (
              <p className="font-bold text-red-500">Sin Stock</p>
            ) : (
              <p className="text-zinc-900 dark:text-zinc-100 font-black text-xl">
                ${price.toLocaleString("es-AR")}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <motion.button
            className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Ver Detalles</span>
            <span className="material-symbols-outlined !text-lg">
              arrow_forward
            </span>
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductItem;

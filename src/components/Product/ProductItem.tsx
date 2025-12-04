"use client";

import { useState } from "react";
import Link from "next/link";
import { FaRuler } from "react-icons/fa";
import { Product } from "@/types";

const ProductItem: React.FC<Product> = ({
  id,
  name,
  slug,
  price = 0,
  images,
  pause,
  unity = 1,
  size,
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

  if (!slug) {
    return null;
  }

  return (
    <Link href={`/producto/${slug}`} className="block group h-full">
      <div
        className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-primary/10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative overflow-hidden w-full h-64">
          {!imageLoaded && (
            <div className="absolute inset-0 w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
          )}
          {images && images.length > 0 ? (
            <img
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              src={images[currentImageIndex]}
              alt={name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-zinc-800">
              Sin imagen
            </div>
          )}
          {/* Mock Badge - Logic can be added later */}
          {/* <span className="absolute top-3 left-3 bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
            NUEVO
          </span> */}
        </div>

        <div className="flex flex-col p-4 gap-2 flex-grow">
          <h3
            className="text-zinc-900 dark:text-zinc-100 font-bold text-lg truncate"
            title={name}
          >
            {name}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2">
            {description ||
              "Suave, resistente y perfecta para el día a día o para personalizar."}
          </p>
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
          <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors cursor-pointer">
            <span>Ver Detalles</span>
            <span className="material-symbols-outlined !text-lg">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;

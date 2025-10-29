"use client";

import { useState } from "react";
import { Product } from "@/src/types";
import Link from "next/link";
import { FaRuler } from "react-icons/fa";

const ProductItem: React.FC<Product> = ({
  id,
  name,
  price,
  images,
  pause,
  unity,
  size,
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

  return (
    <Link href={`/producto-detalle/${id}`} className="block group">
      <div
        className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
          )}
          {images && images.length > 0 && (
            <img
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              src={images[currentImageIndex]}
              alt={name}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold truncate" title={name}>
            {name}
          </h3>

          {size && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <FaRuler />
              <span>{size}</span>
            </div>
          )}

          <div className="flex-grow" />

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {pause ? (
              <p className="font-bold text-red-500">Sin Stock</p>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  ${price.toLocaleString("es-AR")}
                </span>
                <span className="text-sm text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                  Mín. {unity}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;

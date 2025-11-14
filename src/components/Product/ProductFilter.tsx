"use client";

import React, { useState } from "react";

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  onPriceChange: (price: number) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  currentPrice,
  onPriceChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClearFilter = () => {
    onCategoryChange("Todas");
    onPriceChange(maxPrice);
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 sticky top-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-t-lg"
      >
        <h3 className="font-semibold text-lg">Filtrar</h3>
        <ChevronIcon isOpen={isOpen} />
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Categorías</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => onCategoryChange(cat)}
                  className={`w-full p-2 text-left rounded-md transition-colors duration-200 ${
                    selectedCategory === cat
                      ? "bg-violet-600 text-white font-semibold"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Precio</h3>
            <p className="text-center text-lg font-medium">
              ${Number(currentPrice).toLocaleString("es-AR")}
            </p>
            <div className="mt-2">
              <input
                type="range"
                value={currentPrice}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                min={minPrice}
                max={maxPrice}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-violet-500"
              />
            </div>
          </div>

          <button
            onClick={handleClearFilter}
            className="w-full p-2 rounded-md cursor-pointer text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            X Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;

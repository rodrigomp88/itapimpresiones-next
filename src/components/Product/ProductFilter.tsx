"use client";

import React from "react";

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
  const handleClearFilter = () => {
    onCategoryChange("Todas");
    onPriceChange(maxPrice);
  };

  return (
    <div className="p-4 rounded-lg border sticky top-20 border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Flitrar</h3>
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
        className="w-full p-2 rounded-md cursor-pointer"
      >
        X Limpiar Filtros
      </button>
    </div>
  );
};

export default ProductFilter;

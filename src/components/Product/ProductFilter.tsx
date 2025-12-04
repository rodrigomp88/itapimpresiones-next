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
  return (
    <div className="sticky top-24 flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
      {/* Categories Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
          Categorías
        </h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat
                  ? "bg-primary/10 dark:bg-primary/20"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
            >
              <span
                className={`material-symbols-outlined !text-xl ${selectedCategory === cat
                    ? "text-primary"
                    : "text-zinc-700 dark:text-zinc-300"
                  }`}
                style={
                  selectedCategory === cat
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {cat === "Todas" ? "grid_view" : "checkroom"}
              </span>
              <p
                className={`text-sm font-medium leading-normal ${selectedCategory === cat
                    ? "text-primary font-bold"
                    : "text-zinc-800 dark:text-zinc-200"
                  }`}
              >
                {cat}
              </p>
            </button>
          ))}
        </div>
      </div>
      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Price Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
          Precio
        </h3>
        <p className="text-center text-lg font-medium text-zinc-900 dark:text-zinc-100">
          ${Number(currentPrice).toLocaleString("es-AR")}
        </p>
        <div className="mt-2">
          <input
            type="range"
            value={currentPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            min={minPrice}
            max={maxPrice}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
          />
        </div>
      </div>
      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Sizes Filter (Mocked) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
          Talle
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {["S", "M", "L", "XL"].map((size) => (
            <label
              key={size}
              className="flex items-center justify-center cursor-pointer"
            >
              <input className="peer sr-only" type="checkbox" />
              <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors w-full text-center">
                {size}
              </div>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Color Filter (Mocked) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
          Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            "bg-black",
            "bg-white",
            "bg-blue-600",
            "bg-red-600",
            "bg-green-500",
          ].map((colorClass, index) => (
            <label key={index} className="cursor-pointer">
              <input
                className="peer sr-only"
                name="color-filter"
                type="radio"
              />
              <div
                className={`w-6 h-6 rounded-full ${colorClass} border-2 ${colorClass === "bg-white"
                    ? "border-zinc-300"
                    : "border-transparent"
                  } ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-transparent peer-checked:ring-primary`}
              ></div>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Customization Filter (Mocked) */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            className="form-checkbox h-4 w-4 rounded text-primary focus:ring-primary/50 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:checked:bg-primary"
            type="checkbox"
          />
          <span className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">
            Disponibles para personalizar
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilter;

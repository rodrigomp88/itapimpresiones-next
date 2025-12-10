"use client";
import React, { useState } from "react";

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  onPriceChange: (price: number) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  isCustomizable: boolean;
  onCustomizableChange: (checked: boolean) => void;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  selectedBagType?: string;
  onBagTypeChange?: (bagType: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  currentPrice,
  onPriceChange,
  selectedSize,
  onSizeChange,
  isCustomizable,
  onCustomizableChange,
  selectedColor = "Todos",
  onColorChange,
  selectedBagType = "Todos",
  onBagTypeChange,
}) => {
  // Estado para controlar si el filtro está abierto o cerrado
  // Se inicializa en 'false' para que venga colapsado por defecto
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    "Todos",
    "Blanco",
    "Negro",
    "Rojo",
    "Azul",
    "Verde",
    "Amarillo",
  ];
  const bagTypes = ["Todos", "Troquel", "Manija"];

  const colorMap: Record<string, string> = {
    Todos: "bg-gradient-to-br from-zinc-200 to-zinc-400",
    Blanco: "bg-white border-2 border-zinc-300",
    Negro: "bg-black",
    Rojo: "bg-red-500",
    Azul: "bg-blue-500",
    Verde: "bg-green-500",
    Amarillo: "bg-yellow-400",
  };

  return (
    // Quitamos 'p-6' del contenedor principal para manejarlo dentro
    <div className="sticky top-24 flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Botón para colapsar/desplegar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            filter_list
          </span>
          <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
            Filtros
          </h3>
        </div>
        <span
          className={`material-symbols-outlined transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Contenido colapsable */}
      {/* Usamos una expresión condicional para mostrar/ocultar */}
      {isOpen && (
        <div className="p-6 flex flex-col gap-6 border-t border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-200">
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary/10 dark:bg-primary/20"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined !text-xl ${
                      selectedCategory === cat
                        ? "text-primary"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                    style={
                      selectedCategory === cat
                        ? { fontVariationSettings: "'FILL' 1" }
                        : {}
                    }
                  >
                    {cat === "Todas"
                      ? "grid_view"
                      : cat === "Bolsas"
                      ? "shopping_bag"
                      : cat === "Gorras"
                      ? "sports_baseball"
                      : cat === "Remeras"
                      ? "checkroom"
                      : cat === "Buzos"
                      ? "styler"
                      : "category"}
                  </span>
                  <p
                    className={`text-sm font-medium leading-normal ${
                      selectedCategory === cat
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

          {/* Color Filter */}
          {onColorChange && (
            <>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
                  Color
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => onColorChange(color)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        colorMap[color]
                      } ${
                        selectedColor === color
                          ? "ring-4 ring-primary ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      title={color}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800" />
            </>
          )}

          {/* Bag Type Filter */}
          {selectedCategory === "Bolsas" && onBagTypeChange && (
            <>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
                  Tipo de Bolsa
                </h3>
                <div className="flex flex-col gap-2">
                  {bagTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => onBagTypeChange(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                        selectedBagType === type
                          ? "bg-primary text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800" />
            </>
          )}

          {/* Sizes Filter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-zinc-900 dark:text-zinc-100 text-base font-bold leading-normal">
              Talle
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {["Todos", "S", "M", "L", "XL"].map((size) => (
                <label
                  key={size}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="size-filter"
                    checked={selectedSize === size}
                    onChange={() => onSizeChange(size)}
                  />
                  <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors w-full text-center">
                    {size === "Todos" ? "All" : size}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Customization Filter */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="form-checkbox h-4 w-4 rounded text-primary focus:ring-primary/50 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:checked:bg-primary"
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => onCustomizableChange(e.target.checked)}
              />
              <span className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">
                Personalizable
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;

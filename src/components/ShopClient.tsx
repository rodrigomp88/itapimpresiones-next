"use client";

import { useEffect, useState } from "react";
import ProductFilter from "./Product/ProductFilter";
import ProductList from "./Product/ProductList";
import ProductSkeleton from "./Product/ProductSkeleton";
import { Product, ProductImage } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  GET_PRICE_RANGE,
  selectMaxPrice,
  selectMinPrice,
  selectProducts,
  STORE_PRODUCTS,
} from "@/redux/slice/productSlice";
import {
  FILTER_BY_CATEGORY,
  FILTER_BY_PRICE,
  FILTER_BY_SIZE,
  FILTER_BY_CUSTOMIZATION,
  selectFilteredProducts,
} from "@/redux/slice/filterSlice";

interface ShopClientProps {
  initialProducts: Product[];
}

const ShopClient: React.FC<ShopClientProps> = ({ initialProducts }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const minPrice = useAppSelector(selectMinPrice);
  const maxPrice = useAppSelector(selectMaxPrice);
  const filteredProducts = useAppSelector(selectFilteredProducts);

  const [category, setCategory] = useState("Todas");
  const [price, setPrice] = useState(maxPrice || 0);
  const [size, setSize] = useState("Todos");
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedColor, setSelectedColor] = useState("Todos");
  const [selectedBagType, setSelectedBagType] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setIsLoading(true);
    dispatch(STORE_PRODUCTS({ products: initialProducts }));
    dispatch(GET_PRICE_RANGE({ products: initialProducts }));
    dispatch(
      FILTER_BY_CATEGORY({ products: initialProducts, category: "Todas" })
    );
    setTimeout(() => setIsLoading(false), 500);
  }, [dispatch, initialProducts]);

  useEffect(() => {
    if (maxPrice) setPrice(maxPrice);
  }, [maxPrice]);

  const allCategories = ["Todas", ...new Set(products.map((p) => p.category))];

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    dispatch(FILTER_BY_CATEGORY({ products, category: val }));
  };
  const handlePriceChange = (val: number) => {
    setPrice(val);
    dispatch(FILTER_BY_PRICE({ products, price: val }));
  };
  const handleSizeChange = (val: string) => {
    setSize(val);
    dispatch(FILTER_BY_SIZE({ products, size: val }));
  };
  const handleCustomizableChange = (checked: boolean) => {
    setIsCustomizable(checked);
    dispatch(FILTER_BY_CUSTOMIZATION({ products, customizable: checked }));
  };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value);
  const handleColorChange = (val: string) => setSelectedColor(val);
  const handleBagTypeChange = (val: string) => setSelectedBagType(val);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // --- FILTRADO DE COLOR POR IMAGEN ---
  let colorAndBagFiltered = filteredProducts;

  if (selectedColor !== "Todos") {
    colorAndBagFiltered = colorAndBagFiltered.filter((p) => {
      if (!p.images || p.images.length === 0) return false;
      return p.images.some((img) => {
        if (typeof img === "string") return false; // Ignoramos legacy sin color
        return (img as ProductImage).color === selectedColor;
      });
    });
  }

  if (selectedBagType !== "Todos" && category === "Bolsas") {
    colorAndBagFiltered = colorAndBagFiltered.filter(
      (p) => p.bagType === selectedBagType.toLowerCase()
    );
  }

  // --- BÚSQUEDA ---
  const searchFiltered = searchQuery
    ? colorAndBagFiltered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : colorAndBagFiltered;

  const sortedProducts = [...searchFiltered].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popular":
      default:
        return 0;
    }
  });

  return (
    <div className="w-full">
      {/* Hero Banner Moderno */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative max-w-screen-xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium w-fit">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Nueva Colección Disponible
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                Descubre Nuestra
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Tienda
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Explora nuestra selección de productos personalizados de alta calidad. 
                Desde remeras hasta bolsas, encontrá todo lo que necesitás para tu marca.
              </p>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {products.length}+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Productos
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    500+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Clientes
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    5★
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Valoración
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-blue-600 text-white text-sm font-semibold tracking-wide hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5">
                  Explorar Productos
                </button>
                <button className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-white border border-slate-200 text-slate-700 text-sm font-semibold tracking-wide hover:bg-slate-50 transition-all hover:border-slate-300">
                  Ver Ofertas
                </button>
              </div>
            </div>

            <div className="relative lg:h-[400px] flex items-center justify-center">
              <div className="relative z-10 w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto w-full md:px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2">
            <a
              className="text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:text-primary"
              href="/"
            >
              Inicio
            </a>
            <span className="text-zinc-600 dark:text-zinc-400 text-sm">/</span>
            <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
              Productos
            </span>
          </div>

          {/* Barra de Búsqueda */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-between gap-4 items-center">
            <div className="flex min-w-72 flex-col gap-2">
              <h2 className="text-zinc-900 dark:text-zinc-100 text-2xl font-black">
                Explora Nuestros Productos
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-base">
                {searchFiltered.length} productos encontrados
                {searchQuery && ` para "${searchQuery}"`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Toggle Vista */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid" 
                      ? "bg-white dark:bg-gray-700 shadow-sm" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list" 
                      ? "bg-white dark:bg-gray-700 shadow-sm" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zM3 14a1 1 0 100 2h14a1 1 0 100-2H3zM3 9a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM9 9a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zM9 14a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Ordenar por:
                </span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="form-select rounded-lg border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm p-2"
                >
                  <option value="popular">Más populares</option>
                  <option value="price-low">Precio: bajo a alto</option>
                  <option value="price-high">Precio: alto a bajo</option>
                  <option value="newest">Novedades</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <aside className="col-span-12 md:col-span-3">
              <ProductFilter
                categories={allCategories}
                selectedCategory={category}
                onCategoryChange={handleCategoryChange}
                minPrice={minPrice || 0}
                maxPrice={maxPrice || 0}
                currentPrice={price}
                onPriceChange={handlePriceChange}
                selectedSize={size}
                onSizeChange={handleSizeChange}
                isCustomizable={isCustomizable}
                onCustomizableChange={handleCustomizableChange}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                selectedBagType={selectedBagType}
                onBagTypeChange={handleBagTypeChange}
              />
            </aside>
            <main className="col-span-12 md:col-span-9">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <ProductList products={sortedProducts}  />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopClient;

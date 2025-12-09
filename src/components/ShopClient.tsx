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

  const sortedProducts = [...colorAndBagFiltered].sort((a, b) => {
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
    <div className="max-w-screen-xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col gap-6">
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
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div className="flex min-w-72 flex-col gap-2">
            <p className="text-zinc-900 dark:text-zinc-100 text-4xl font-black">
              Nuestros Productos
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-base">
              Explora nuestra selección.
            </p>
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
              <ProductList products={sortedProducts} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopClient;

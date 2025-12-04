"use client";

import { useEffect, useState } from "react";
import ProductFilter from "./Product/ProductFilter";
import ProductList from "./Product/ProductList";
import { Product } from "@/types";
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

  useEffect(() => {
    dispatch(STORE_PRODUCTS({ products: initialProducts }));
    dispatch(GET_PRICE_RANGE({ products: initialProducts }));
    dispatch(
      FILTER_BY_CATEGORY({ products: initialProducts, category: "Todas" })
    );
  }, [dispatch, initialProducts]);

  useEffect(() => {
    if (maxPrice) {
      setPrice(maxPrice);
    }
  }, [maxPrice]);

  const allCategories = [
    "Todas",
    ...new Set(products.map((product) => product.category)),
  ];

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    dispatch(FILTER_BY_CATEGORY({ products, category: newCategory }));
  };

  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
    dispatch(FILTER_BY_PRICE({ products, price: newPrice }));
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full px-6 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          <a
            className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-normal hover:text-primary"
            href="/"
          >
            Inicio
          </a>
          <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-normal">
            /
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium leading-normal">
            Productos
          </span>
        </div>
        <div className="flex flex-wrap justify-between gap-4 items-center">
          <div className="flex min-w-72 flex-col gap-2">
            <p className="text-zinc-900 dark:text-zinc-100 text-4xl font-black leading-tight tracking-[-0.033em]">
              Nuestros Productos
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-base font-normal leading-normal">
              Explora nuestra selección de indumentaria de alta calidad, lista
              para comprar o personalizar a tu gusto.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 dark:text-zinc-400 text-sm">
              Ordenar por:
            </span>
            <select className="form-select rounded-lg border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:border-primary focus:ring-primary/50 p-2">
              <option>Más populares</option>
              <option>Precio: bajo a alto</option>
              <option>Precio: alto a bajo</option>
              <option>Novedades</option>
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
            />
          </aside>

          <main className="col-span-12 md:col-span-9">
            <ProductList products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopClient;

"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  STORE_PRODUCTS,
  GET_PRICE_RANGE,
  selectProducts,
  selectMinPrice,
  selectMaxPrice,
} from "@/src/redux/slice/productSlice";
import {
  FILTER_BY_CATEGORY,
  FILTER_BY_PRICE,
  selectFilteredProducts,
} from "@/src/redux/slice/filterSlice";
import { Product } from "@/src/types";
import ProductFilter from "./Product/ProductFilter";
import ProductList from "./Product/ProductList";

interface ShopClientProps {
  initialProducts: Product[];
}

const ShopClient: React.FC<ShopClientProps> = ({ initialProducts }) => {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const minPrice = useAppSelector(selectMinPrice);
  const maxPrice = useAppSelector(selectMaxPrice);
  const filteredProducts = useAppSelector(selectFilteredProducts);

  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState(maxPrice || 0);

  useEffect(() => {
    dispatch(STORE_PRODUCTS({ products: initialProducts }));
    dispatch(GET_PRICE_RANGE({ products: initialProducts }));
  }, [dispatch, initialProducts]);

  useEffect(() => {
    if (maxPrice) {
      setPrice(maxPrice);
    }
  }, [maxPrice]);

  const allCategories = [
    "All",
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
    <section className="p-5 my-1">
      <h1>Nuestra Tienda</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
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
        <main className="md:w-3/4">
          <ProductList products={filteredProducts} />
        </main>
      </div>
    </section>
  );
};

export default ShopClient;

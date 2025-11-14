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
    <section className="p-5 my-1">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
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

        <main className="w-full md:w-3/4">
          <ProductList products={filteredProducts} />
        </main>
      </div>
    </section>
  );
};

export default ShopClient;

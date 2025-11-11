"use client";

import { useState, useEffect, useMemo } from "react";
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";
import { Product } from "@/types";

interface ProductContainerProps {
  initialProducts: Product[];
}

const ProductContainer: React.FC<ProductContainerProps> = ({
  initialProducts,
}) => {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [category, setCategory] = useState<string>("Todas");
  const [price, setPrice] = useState<number>(0);

  const { minPrice, maxPrice, allCategories } = useMemo(() => {
    if (initialProducts.length === 0) {
      return { minPrice: 0, maxPrice: 0, allCategories: ["Todas"] };
    }
    const prices = initialProducts.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const categories = [
      "Todas",
      ...new Set(initialProducts.map((p) => p.category)),
    ];
    return { minPrice: min, maxPrice: max, allCategories: categories };
  }, [initialProducts]);

  useEffect(() => {
    setPrice(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    let tempProducts = [...initialProducts];

    if (category !== "Todas") {
      tempProducts = tempProducts.filter((p) => p.category === category);
    }

    if (price > 0) {
      tempProducts = tempProducts.filter((p) => p.price <= price);
    }

    setFilteredProducts(tempProducts);
  }, [category, price, initialProducts]);

  return (
    <section className="flex flex-col md:flex-row gap-8 p-4">
      <div className="w-full md:w-1/4">
        <ProductFilter
          categories={allCategories}
          selectedCategory={category}
          onCategoryChange={setCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          currentPrice={price}
          onPriceChange={setPrice}
        />
      </div>
      <div className="w-full md:w-3/4">
        <ProductList products={filteredProducts} />
      </div>
    </section>
  );
};

export default ProductContainer;

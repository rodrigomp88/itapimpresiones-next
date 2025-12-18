"use client";

import { Product } from "@/types";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: Product[];
  lastElementRef?: (node: HTMLDivElement) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, lastElementRef }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 col-span-full">
        <p className="text-lg text-gray-500">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          ref={index === products.length - 1 ? lastElementRef : undefined}
        >
          <ProductItem {...product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;

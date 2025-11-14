"use client";

import { Product } from "@/types";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 col-span-full">
        <p className="text-lg text-gray-500">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductList;

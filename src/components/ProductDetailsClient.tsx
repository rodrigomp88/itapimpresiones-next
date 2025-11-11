"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaAngleDoubleLeft, FaCartPlus, FaRuler } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  selectCartItems,
} from "../redux/slice/cartSlice";
import { Product } from "../types";
import Slider from "./Carousel/Slider";

interface ProductDetailsClientProps {
  product: Product;
}

const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({
  product,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const isCartAdded = cartItems.some((item) => item.id === product.id);

  const addToCart = () => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
    router.push("/cart");
  };

  return (
    <div className="py-8">
      <Link href="/tienda" className="link">
        <FaAngleDoubleLeft />
        Volver a la tienda
      </Link>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 rounded-lg shadow-md overflow-hidden">
        <Slider images={product.images.map((imgUrl) => ({ url: imgUrl }))} />

        <div className="p-6 flex flex-col">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h1 className="text-3xl font-bold uppercase">{product.name}</h1>
            {product.size && (
              <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                <FaRuler />
                <span>{product.size}</span>
              </p>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 my-4 flex-grow">
            {product.description}
          </p>

          <div className="mt-auto pt-4">
            {product.pause ? (
              <p className="text-lg text-center font-bold text-red-500">
                Sin Stock
              </p>
            ) : (
              <>
                {isCartAdded ? (
                  <Link href="/cart" className="btn btn-secondary w-full">
                    Ya está en el carrito
                  </Link>
                ) : (
                  <div>
                    <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                      Mínimo de compra: {product.unity} unidades
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                        ${product.price.toLocaleString("es-AR")}
                      </p>
                      <button className="btn btn-primary" onClick={addToCart}>
                        <FaCartPlus />
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsClient;

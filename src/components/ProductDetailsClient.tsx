"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  selectCartItems,
} from "../redux/slice/cartSlice";
import { Product } from "../types";
import { useEffect, useState } from "react";

interface ProductDetailsClientProps {
  product: Product;
}

const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({
  product,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const [isClient, setIsClient] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isCartAdded = cartItems.some((item) => item.id === product.id);

  const addToCart = () => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="flex-grow">
      <div className="max-w-screen-xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2">
            <Link
              className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-normal hover:text-primary"
              href="/"
            >
              Inicio
            </Link>
            <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-normal">
              /
            </span>
            <Link
              className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-normal hover:text-primary"
              href="/tienda"
            >
              Tienda
            </Link>
            <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-normal">
              /
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium leading-normal">
              {product.name}
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <Image
                  fill
                  className="object-cover"
                  src={product.images[selectedImage]}
                  alt={product.name}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white dark:bg-zinc-900 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === index
                      ? "border-primary ring-2 ring-primary/50"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-primary"
                      }`}
                  >
                    <Image
                      fill
                      className={`object-cover ${selectedImage === index ? "" : "opacity-75"
                        }`}
                      src={image}
                      alt={`${product.name} - Vista ${index + 1}`}
                      sizes="(max-width: 768px) 20vw, 10vw"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="text-zinc-900 dark:text-zinc-100 text-4xl font-black leading-tight tracking-[-0.033em]">
                  {product.name}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-base font-normal leading-normal">
                  {product.description}
                </p>
                <p className="text-zinc-900 dark:text-zinc-100 text-3xl font-black leading-tight">
                  ${product.price.toLocaleString("es-AR")}
                </p>
              </div>

              {/* Size Display */}
              {product.size && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-zinc-900 dark:text-zinc-100 text-sm font-bold leading-normal">
                    Talle/Tamaño
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-primary/10">
                      {product.size}
                    </div>
                  </div>
                </div>
              )}

              {/* Personalization Section */}
              <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary rounded p-4 flex flex-col gap-4">
                <h3 className="text-primary text-lg font-bold">
                  ¿Querés personalizar este producto?
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                  Añadí tu logo o diseño. Ideal para empresas, eventos o
                  simplemente para darle tu toque único.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined !text-xl">
                      add_photo_alternate
                    </span>
                    <span>Subir mi logo</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                    <span className="material-symbols-outlined !text-xl">
                      edit
                    </span>
                    <span>Añadir texto</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                {!product.pause && (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={decrementQuantity}
                        className="flex items-center justify-center rounded-lg h-12 w-12 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          remove
                        </span>
                      </button>
                      <span className="text-zinc-900 dark:text-zinc-100 text-xl font-bold w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="flex items-center justify-center rounded-lg h-12 w-12 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                    {!isClient ? (
                      <div className="w-full sm:w-auto flex-grow h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ) : isCartAdded ? (
                      <Link
                        href="/cart"
                        className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-base font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          shopping_cart
                        </span>
                        <span>Ver Carrito</span>
                      </Link>
                    ) : (
                      <button
                        onClick={addToCart}
                        className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-base font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          shopping_cart
                        </span>
                        <span>Añadir al Carrito</span>
                      </button>
                    )}
                  </>
                )}
                {product.pause && (
                  <p className="text-lg text-center font-bold text-red-500 w-full">
                    Sin Stock
                  </p>
                )}
              </div>
              {product.unity && !product.pause && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Mínimo de compra: {product.unity} unidades
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsClient;

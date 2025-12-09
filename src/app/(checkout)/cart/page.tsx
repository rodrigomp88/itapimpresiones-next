"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  ADD_TO_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  DECREASE_CART,
  REMOVE_FROM_CART,
  SAVE_URL,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "@/redux/slice/cartSlice";
import { Product, ProductImage, CartItem } from "@/types";

// Helper para obtener la URL de la imagen
const getImageUrl = (image: string | ProductImage | undefined): string => {
  if (!image) return "/placeholder.png";
  if (typeof image === "string") {
    return image !== "" ? image : "/placeholder.png";
  }
  return image.url || "/placeholder.png";
};

const CartPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const cartTotalAmount = useAppSelector(selectCartTotalAmount);
  // const cartTotalQuantity = useAppSelector(selectCartTotalQuantity); // Descomentar si se usa

  // CORRECCIÓN PRINCIPAL AQUÍ:
  // Cuando aumentamos desde el carrito, forzamos cartQuantity a 1.
  // Así Redux sabe que solo debe sumar 1 unidad, no duplicar la cantidad actual.
  const increaseCart = (cart: CartItem) => {
    const itemToIncrease: CartItem = { ...cart, cartQuantity: 1 };
    dispatch(ADD_TO_CART(itemToIncrease));
  };

  const decreaseCart = (cart: CartItem) => dispatch(DECREASE_CART(cart));
  const removeFromCart = (cart: CartItem) => dispatch(REMOVE_FROM_CART(cart));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [cartItems, dispatch]);

  const handleCheckout = () => {
    if (status === "authenticated") {
      router.push("/checkout");
    } else {
      dispatch(SAVE_URL("/checkout"));
      router.push("/auth/login");
    }
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl">Cargando carrito...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap gap-2 pb-4">
            <Link
              className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary"
              href="/"
            >
              Inicio
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              /
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
              Carrito de Compras
            </span>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <span
              className="material-symbols-outlined text-gray-300 dark:text-gray-600 mb-4"
              style={{ fontSize: "80px" }}
            >
              shopping_cart
            </span>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Tu carrito está vacío
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Link
              href="/tienda"
              className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors"
            >
              Ir a la Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 pb-4">
          <Link
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary"
            href="/"
          >
            Inicio
          </Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            /
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
            Carrito de Compras
          </span>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pb-8">
          <p className="text-zinc-900 dark:text-zinc-100 text-4xl font-black min-w-72">
            Tu Carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <table className="w-full">
              <thead className="border-b border-zinc-200 dark:border-zinc-700">
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="px-6 py-3 text-left text-zinc-900 dark:text-zinc-300 w-2/5 text-xs font-semibold uppercase">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-zinc-900 dark:text-zinc-300 w-1/5 text-xs font-semibold uppercase">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-zinc-900 dark:text-zinc-300 w-1/5 text-xs font-semibold uppercase">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-zinc-900 dark:text-zinc-300 w-1/5 text-xs font-semibold uppercase">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-right text-zinc-900 dark:text-zinc-300 w-auto text-xs font-semibold uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cart, index) => {
                  const imageSrc =
                    cart.images && cart.images.length > 0
                      ? getImageUrl(cart.images[0])
                      : "/placeholder.png";

                  return (
                    <tr
                      key={cart.id}
                      className={`border-b border-zinc-200 dark:border-zinc-700 ${
                        index === cartItems.length - 1 ? "last:border-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0 border border-zinc-200 dark:border-zinc-700"
                            style={{ backgroundImage: `url('${imageSrc}')` }}
                          ></div>
                          <div>
                            <Link
                              href={`/producto/${cart.slug}`}
                              className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold hover:text-primary"
                            >
                              {cart.name}
                            </Link>
                            {cart.size && (
                              <p className="text-gray-500 dark:text-gray-400 text-xs">
                                Talle: {cart.size}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                        ${cart.price.toLocaleString("es-AR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden max-w-[100px]">
                          <button
                            onClick={() => decreaseCart(cart)}
                            className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            -
                          </button>
                          <input
                            className="w-full text-center border-0 bg-transparent text-gray-800 dark:text-white focus:ring-0 p-1"
                            type="text"
                            value={cart.cartQuantity}
                            readOnly
                          />
                          <button
                            onClick={() => increaseCart(cart)}
                            className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-white text-sm font-semibold">
                        $
                        {(cart.price * cart.cartQuantity).toLocaleString(
                          "es-AR"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeFromCart(cart)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 sticky top-10">
              <h2 className="text-zinc-900 dark:text-zinc-100 text-xl font-bold pb-4 border-b border-zinc-200 dark:border-zinc-700">
                Resumen del Pedido
              </h2>
              <div className="space-y-4 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                    ${cartTotalAmount.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Envío
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Se calculará en el siguiente paso
                  </span>
                </div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    ${cartTotalAmount.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors"
                >
                  Proceder al Pago
                </button>
                <Link
                  href="/tienda"
                  className="w-full flex items-center justify-center rounded-lg h-12 bg-zinc-50 dark:bg-zinc-700/50 text-zinc-900 dark:text-zinc-100 text-base font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Continuar Comprando
                </Link>
              </div>
              <div className="mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Pagos seguros con:
                </p>
                <div className="flex justify-center items-center gap-4 mt-2 text-gray-400 dark:text-gray-500">
                  <span className="text-xs">💳 Visa</span>
                  <span className="text-xs">💳 Mastercard</span>
                  <span className="text-xs">💳 PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

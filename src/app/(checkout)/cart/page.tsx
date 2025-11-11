"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaArrowLeft, FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  ADD_TO_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  CLEAR_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  SAVE_URL,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "@/redux/slice/cartSlice";
import { Product } from "@/types";
import CheckoutSummary from "@/components/CheckoutSummary/CheckoutSummary";

const CartPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const cartTotalAmount = useAppSelector(selectCartTotalAmount);
  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity);

  const increaseCart = (cart: Product) => dispatch(ADD_TO_CART(cart));
  const decreaseCart = (cart: Product) => dispatch(DECREASE_CART(cart));
  const removeFromCart = (cart: Product) => dispatch(REMOVE_FROM_CART(cart));
  const clearCart = () => dispatch(CLEAR_CART());

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
        {/* Aquí puedes poner un spinner o un esqueleto de UI si quieres */}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-3xl font-thin">Tu carrito está vacío</p>
        <Link
          href="/tienda"
          className="flex items-center justify-center my-6 gap-2 underline text-violet-500 hover:text-violet-700"
        >
          <FaArrowLeft />
          <span>Volver a la tienda</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <h1 className="text-2xl font-semibold">
            Carrito ({cartTotalQuantity})
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-red-500 hover:text-red-700"
            >
              <FaTrashAlt /> Vaciar carrito
            </button>
          )}
        </div>
        <div>
          {cartItems.map((cart) => (
            <div
              key={cart.id}
              className="grid grid-cols-[auto_1fr] gap-x-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:flex md:items-center"
            >
              <div className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center row-span-2 md:row-auto">
                <img
                  className="max-h-full max-w-full object-contain"
                  src={cart.images[0]}
                  alt={cart.name}
                />
              </div>

              <div className="ml-0 flex-grow md:ml-4">
                <Link
                  href={`/producto-detalle/${cart.id}`}
                  className="font-semibold hover:underline"
                >
                  {cart.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${cart.price.toLocaleString("es-AR")} c/u
                </p>
                <button
                  onClick={() => removeFromCart(cart)}
                  className="text-xs text-red-500 hover:underline mt-1"
                >
                  Quitar
                </button>
              </div>

              <div className="col-start-2 mt-2 flex items-center justify-between md:col-auto md:mt-0 md:justify-start md:gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => decreaseCart(cart)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <FaMinus />
                  </button>
                  <p className="w-8 text-center font-semibold">
                    {cart.cartQuantity}
                  </p>
                  <button
                    onClick={() => increaseCart(cart)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <FaPlus />
                  </button>
                </div>

                <p className="w-auto text-right font-semibold md:w-24">
                  ${(cart.price * cart.cartQuantity).toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <CheckoutSummary />
          <button onClick={handleCheckout} className="btn btn-primary w-full">
            Continuar con la Compra
          </button>
          <Link
            href="/tienda"
            className="flex items-center justify-center mt-4 gap-2 text-sm text-violet-500 hover:underline"
          >
            <FaArrowLeft />
            <span>Seguir comprando</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

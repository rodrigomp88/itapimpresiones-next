import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CartItem, Product } from "@/types";
import {
  NotiflixFailure,
  NotiflixSuccess,
  NotiflixWarning,
} from "@/components/Notiflix/Notiflix";

interface CartState {
  cartItems: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
  previousURL: string;
}

const getInitialCartItems = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem("cartItems");

    return item ? JSON.parse(item) : [];
  }
  return [];
};

const initialState: CartState = {
  cartItems: getInitialCartItems(),
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  previousURL: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADD_TO_CART(state, action: PayloadAction<Product>) {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      const unity = action.payload.unity || 1;

      if (productIndex >= 0) {
        state.cartItems[productIndex].cartQuantity += 1;
        NotiflixSuccess(`Agregó 1 item de "${action.payload.name}" al carrito`);
      } else {
        const tempProduct: CartItem = {
          ...action.payload,
          cartQuantity: unity,
        };
        state.cartItems.push(tempProduct);
        NotiflixSuccess(
          `Agregó ${unity} items de "${action.payload.name}" al carrito`
        );
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    DECREASE_CART(state, action: PayloadAction<Product>) {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      const unity = state.cartItems[productIndex].unity || 1;

      if (state.cartItems[productIndex].cartQuantity > unity) {
        state.cartItems[productIndex].cartQuantity -= 1;
        NotiflixFailure(
          `Quitó un item de "${action.payload.name}" del carrito`
        );
      } else {
        NotiflixWarning(
          `La cantidad mínima de "${action.payload.name}" es ${unity}`
        );
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    REMOVE_FROM_CART(state, action: PayloadAction<Product>) {
      const newCartItem = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.cartItems = newCartItem;
      NotiflixFailure(`Eliminó "${action.payload.name}" del carrito`);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    CLEAR_CART(state) {
      state.cartItems = [];
      NotiflixWarning("El carrito fue vaciado");
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    CALCULATE_SUBTOTAL(state) {
      const array: number[] = [];
      state.cartItems.map((item) => {
        const { price, cartQuantity } = item;
        const cartItemAmount = price * cartQuantity;
        return array.push(cartItemAmount);
      });
      const totalAmount = array.reduce((a, b) => a + b, 0);
      state.cartTotalAmount = totalAmount;
    },

    CALCULATE_TOTAL_QUANTITY(state) {
      const array: number[] = [];
      state.cartItems.map((item) => {
        const { cartQuantity } = item;
        return array.push(cartQuantity);
      });
      const totalQuantity = array.reduce((a, b) => a + b, 0);
      state.cartTotalQuantity = totalQuantity;
    },

    SAVE_URL(state, action: PayloadAction<string>) {
      state.previousURL = action.payload;
    },
  },
});

export const {
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  SAVE_URL,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCartTotalQuantity = (state: RootState) =>
  state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state: RootState) =>
  state.cart.cartTotalAmount;
export const selectPreviousURL = (state: RootState) => state.cart.previousURL;

export default cartSlice.reducer;

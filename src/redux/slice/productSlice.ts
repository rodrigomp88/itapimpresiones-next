import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Product } from "@/src/types";

interface ProductState {
  products: Product[];
  minPrice: number | null;
  maxPrice: number | null;
}

const initialState: ProductState = {
  products: [],
  minPrice: null,
  maxPrice: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    STORE_PRODUCTS(state, action: PayloadAction<{ products: Product[] }>) {
      state.products = action.payload.products;
    },
    GET_PRICE_RANGE(state, action: PayloadAction<{ products: Product[] }>) {
      if (action.payload.products.length === 0) return;
      const prices = action.payload.products.map((product) => product.price);
      state.minPrice = Math.min(...prices);
      state.maxPrice = Math.max(...prices);
    },
  },
});

export const { STORE_PRODUCTS, GET_PRICE_RANGE } = productSlice.actions;

export const selectProducts = (state: RootState) => state.product.products;
export const selectMinPrice = (state: RootState) => state.product.minPrice;
export const selectMaxPrice = (state: RootState) => state.product.maxPrice;

export default productSlice.reducer;

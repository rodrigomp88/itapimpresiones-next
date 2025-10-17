import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/src/types";
import { RootState } from "../store";

interface FilterState {
  filteredProducts: Product[];
}

const initialState: FilterState = {
  filteredProducts: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_BY_CATEGORY(
      state,
      action: PayloadAction<{ products: Product[]; category: string }>
    ) {
      const { products, category } = action.payload;
      if (category === "All") {
        state.filteredProducts = products;
      } else {
        state.filteredProducts = products.filter(
          (product) => product.category === category
        );
      }
    },
    FILTER_BY_PRICE(
      state,
      action: PayloadAction<{ products: Product[]; price: number }>
    ) {
      const { products, price } = action.payload;
      state.filteredProducts = products.filter(
        (product) => product.price <= price
      );
    },
  },
});

export const { FILTER_BY_CATEGORY, FILTER_BY_PRICE } = filterSlice.actions;

export const selectFilteredProducts = (state: RootState) =>
  state.filter.filteredProducts;

export default filterSlice.reducer;

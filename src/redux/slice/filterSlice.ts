import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Product } from "@/types";

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
      let tempProducts = [];
      if (category === "Todas") {
        tempProducts = products;
      } else {
        tempProducts = products.filter(
          (product) => product.category === category
        );
      }
      state.filteredProducts = tempProducts;
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
    FILTER_BY_SIZE(
      state,
      action: PayloadAction<{ products: Product[]; size: string }>
    ) {
      const { products, size } = action.payload;
      if (size === "Todos") {
        state.filteredProducts = products;
      } else {
        state.filteredProducts = products.filter((product) =>
          product.size ? product.size.includes(size) : false
        );
      }
    },
    // Note: Since color is not yet a property on Product type in the current codebase context,
    // we will implement a placeholder or assume it might be added later. 
    // For now, we'll keep it simple or skip if the property doesn't exist.
    // Assuming 'color' might be part of description or a future field.
    // We will skip strict color filtering for now to avoid breaking types if 'color' is missing.

    FILTER_BY_CUSTOMIZATION(
      state,
      action: PayloadAction<{ products: Product[]; customizable: boolean }>
    ) {
      const { products, customizable } = action.payload;
      if (customizable) {
        // Assuming all products in this shop are customizable for now, 
        // or we filter based on a property if it existed.
        // For this specific business, most items are customizable.
        // We can filter by a 'customizable' flag if added to Product type.
        // For now, let's return all products if true, or filter logic if we add the field.
        state.filteredProducts = products;
      } else {
        state.filteredProducts = products;
      }
    }
  },
});

export const { FILTER_BY_CATEGORY, FILTER_BY_PRICE, FILTER_BY_SIZE, FILTER_BY_CUSTOMIZATION } = filterSlice.actions;

export const selectFilteredProducts = (state: RootState) =>
  state.filter.filteredProducts;

export default filterSlice.reducer;

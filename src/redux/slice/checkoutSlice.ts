import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ShippingAddress {
  name: string;
  mail: string;
  phone: string;
}

interface CheckoutState {
  shippingAddress: ShippingAddress | null;
}

const initialState: CheckoutState = {
  shippingAddress: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    SAVE_SHIPPING_ADDRESS(state, action: PayloadAction<ShippingAddress>) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { SAVE_SHIPPING_ADDRESS } = checkoutSlice.actions;

export const selectShippingAddress = (state: RootState) =>
  state.checkout.shippingAddress;

export default checkoutSlice.reducer;

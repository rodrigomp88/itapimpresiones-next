import { useReducer, useCallback } from "react";
import { Product, ProductImage } from "../types";

interface ProductDetailsState {
  selectedImage: number;
  userLogo: string | null;
  logoPos: { x: number; y: number };
  logoSize: number;
  isDragging: boolean;
  quantity: number;
  isCartAdded: boolean;
  minQty: number;
}

type ProductDetailsAction = 
  | { type: "SET_SELECTED_IMAGE"; payload: number }
  | { type: "SET_USER_LOGO"; payload: string | null }
  | { type: "SET_LOGO_POS"; payload: { x: number; y: number } }
  | { type: "SET_LOGO_SIZE"; payload: number }
  | { type: "SET_IS_DRAGGING"; payload: boolean }
  | { type: "SET_QUANTITY"; payload: number }
  | { type: "INCREMENT_QUANTITY" }
  | { type: "DECREMENT_QUANTITY"; payload: number }
  | { type: "SET_IS_CART_ADDED"; payload: boolean }
  | { type: "RESET_LOGO_STATE" }
  | { type: "INITIALIZE_QUANTITY"; payload: number };

const productDetailsReducer = (state: ProductDetailsState, action: ProductDetailsAction): ProductDetailsState => {
  switch (action.type) {
    case "SET_SELECTED_IMAGE":
      return { ...state, selectedImage: action.payload };
    case "SET_USER_LOGO":
      return { ...state, userLogo: action.payload };
    case "SET_LOGO_POS":
      return { ...state, logoPos: action.payload };
    case "SET_LOGO_SIZE":
      return { ...state, logoSize: action.payload };
    case "SET_IS_DRAGGING":
      return { ...state, isDragging: action.payload };
    case "SET_QUANTITY":
      return { ...state, quantity: action.payload };
    case "INCREMENT_QUANTITY":
      return { ...state, quantity: state.quantity + 1 };
    case "DECREMENT_QUANTITY":
      if (state.quantity > action.payload) {
        return { ...state, quantity: state.quantity - 1 };
      }
      return state; // Do not decrement if it's at minQty
    case "SET_IS_CART_ADDED":
      return { ...state, isCartAdded: action.payload };
    case "RESET_LOGO_STATE":
        return { ...state, userLogo: null, logoPos: { x: 50, y: 50 }, logoSize: 30 };
    case "INITIALIZE_QUANTITY":
        return { ...state, quantity: action.payload };
    default:
      return state;
  }
};

export const useProductDetailsReducer = (initialMinQty: number) => {
  const initialState: ProductDetailsState = {
    selectedImage: 0,
    userLogo: null,
    logoPos: { x: 50, y: 50 },
    logoSize: 30,
    isDragging: false,
    quantity: initialMinQty, // Initialize with product's minQty
    isCartAdded: false,
    minQty: initialMinQty,
  };

  const [state, dispatch] = useReducer(productDetailsReducer, initialState);

  const setSelectedImage = useCallback((index: number) => {
    dispatch({ type: "SET_SELECTED_IMAGE", payload: index });
  }, []);

  const setUserLogo = useCallback((logo: string | null) => {
    dispatch({ type: "SET_USER_LOGO", payload: logo });
  }, []);

  const setLogoPos = useCallback((pos: { x: number; y: number }) => {
    dispatch({ type: "SET_LOGO_POS", payload: pos });
  }, []);

  const setLogoSize = useCallback((size: number) => {
    dispatch({ type: "SET_LOGO_SIZE", payload: size });
  }, []);

  const setIsDragging = useCallback((dragging: boolean) => {
    dispatch({ type: "SET_IS_DRAGGING", payload: dragging });
  }, []);

  const setQuantity = useCallback((qty: number) => {
    dispatch({ type: "SET_QUANTITY", payload: qty });
  }, []);

  const incrementQuantity = useCallback(() => {
    dispatch({ type: "INCREMENT_QUANTITY" });
  }, []);

  const decrementQuantity = useCallback(() => {
    dispatch({ type: "DECREMENT_QUANTITY", payload: state.minQty });
  }, [state.minQty]);

  const setIsCartAdded = useCallback((added: boolean) => {
    dispatch({ type: "SET_IS_CART_ADDED", payload: added });
  }, []);

  const resetLogoState = useCallback(() => {
    dispatch({ type: "RESET_LOGO_STATE" });
  }, []);

  const initializeQuantity = useCallback((qty: number) => {
    dispatch({ type: "INITIALIZE_QUANTITY", payload: qty });
  }, []);

  return {
    state,
    setSelectedImage,
    setUserLogo,
    setLogoPos,
    setLogoSize,
    setIsDragging,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    setIsCartAdded,
    resetLogoState,
    initializeQuantity,
  };
};

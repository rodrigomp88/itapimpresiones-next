import { useReducer, useCallback } from "react";
import { Product } from "../types";

export interface ShopState {
  category: string;
  price: number;
  size: string;
  isCustomizable: boolean;
  isLoading: boolean;
  sortBy: string;
  selectedColor: string;
  selectedBagType: string;
  searchQuery: string;
  viewMode: "grid" | "list";
  minPrice: number;
  maxPrice: number;
}

type ShopAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_PRICE"; payload: number }
  | { type: "SET_SIZE"; payload: string }
  | { type: "SET_IS_CUSTOMIZABLE"; payload: boolean }
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_SORT_BY"; payload: string }
  | { type: "SET_SELECTED_COLOR"; payload: string }
  | { type: "SET_SELECTED_BAG_TYPE"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" }
  | { type: "SET_PRICE_RANGE"; payload: { minPrice: number; maxPrice: number } };

const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_SIZE":
      return { ...state, size: action.payload };
    case "SET_IS_CUSTOMIZABLE":
      return { ...state, isCustomizable: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "SET_SELECTED_COLOR":
      return { ...state, selectedColor: action.payload };
    case "SET_SELECTED_BAG_TYPE":
      return { ...state, selectedBagType: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_PRICE_RANGE":
      return { ...state, minPrice: action.payload.minPrice, maxPrice: action.payload.maxPrice, price: action.payload.maxPrice };
    default:
      return state;
  }
};

export const useShopReducer = (initialMaxPrice: number) => {
  const initialState: ShopState = {
    category: "Todas",
    price: initialMaxPrice || 0,
    size: "Todos",
    isCustomizable: false,
    isLoading: true,
    sortBy: "popular",
    selectedColor: "Todos",
    selectedBagType: "Todos",
    searchQuery: "",
    viewMode: "grid",
    minPrice: 0,
    maxPrice: initialMaxPrice || 0,
  };

  const [state, dispatch] = useReducer(shopReducer, initialState);

  const setCategory = useCallback((category: string) => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  }, []);

  const setPrice = useCallback((price: number) => {
    dispatch({ type: "SET_PRICE", payload: price });
  }, []);

  const setSize = useCallback((size: string) => {
    dispatch({ type: "SET_SIZE", payload: size });
  }, []);

  const setIsCustomizable = useCallback((isCustomizable: boolean) => {
    dispatch({ type: "SET_IS_CUSTOMIZABLE", payload: isCustomizable });
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: "SET_IS_LOADING", payload: isLoading });
  }, []);

  const setSortBy = useCallback((sortBy: string) => {
    dispatch({ type: "SET_SORT_BY", payload: sortBy });
  }, []);

  const setSelectedColor = useCallback((selectedColor: string) => {
    dispatch({ type: "SET_SELECTED_COLOR", payload: selectedColor });
  }, []);

  const setSelectedBagType = useCallback((selectedBagType: string) => {
    dispatch({ type: "SET_SELECTED_BAG_TYPE", payload: selectedBagType });
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: searchQuery });
  }, []);

  const setViewMode = useCallback((viewMode: "grid" | "list") => {
    dispatch({ type: "SET_VIEW_MODE", payload: viewMode });
  }, []);

  const setPriceRange = useCallback((minPrice: number, maxPrice: number) => {
    dispatch({ type: "SET_PRICE_RANGE", payload: { minPrice, maxPrice } });
  }, []);

  return {
    state,
    setCategory,
    setPrice,
    setSize,
    setIsCustomizable,
    setIsLoading,
    setSortBy,
    setSelectedColor,
    setSelectedBagType,
    setSearchQuery,
    setViewMode,
    setPriceRange,
  };
};

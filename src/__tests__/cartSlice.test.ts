import cartReducer, {
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
} from "../redux/slice/cartSlice";
import { CartItem } from "../types";

const mockProduct: CartItem = {
  id: "1",
  name: "Producto de Prueba",
  slug: "producto-prueba",
  price: 1000,
  images: [{ url: "/test.jpg", color: "Todos" }],
  pause: false,
  unity: 1,
  size: "M",
  category: "Test",
  description: "Descripción",
  createdAt: "2025-01-01",
  cartQuantity: 1,
  stock: 100,
  stockType: "physical",
};

describe("cartSlice", () => {
  const initialState = {
    cartItems: [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
    previousURL: "",
  };

  it("should return the initial state", () => {
    expect(cartReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should handle ADD_TO_CART", () => {
    const action = ADD_TO_CART(mockProduct);
    const result = cartReducer(initialState, action);

    expect(result.cartItems).toHaveLength(1);
    expect(result.cartItems[0].id).toBe("1");
    expect(result.cartItems[0].cartQuantity).toBe(1);
  });

  it("should handle REMOVE_FROM_CART", () => {
    const stateWithItem = {
      ...initialState,
      cartItems: [mockProduct],
    };

    const action = REMOVE_FROM_CART(mockProduct);
    const result = cartReducer(stateWithItem, action);

    expect(result.cartItems).toHaveLength(0);
  });

  it("should handle CLEAR_CART", () => {
    const stateWithItems = {
      ...initialState,
      cartItems: [mockProduct, { ...mockProduct, id: "2" }],
    };

    const action = CLEAR_CART();
    const result = cartReducer(stateWithItems, action);

    expect(result.cartItems).toHaveLength(0);
  });

  it("should calculate subtotal correctly", () => {
    const stateWithItems = {
      ...initialState,
      cartItems: [
        { ...mockProduct, price: 100, cartQuantity: 2 }, // 200
        { ...mockProduct, id: "2", price: 50, cartQuantity: 1 }, // 50
      ],
    };

    const action = CALCULATE_SUBTOTAL();
    const result = cartReducer(stateWithItems, action);

    expect(result.cartTotalAmount).toBe(250);
  });

  it("should calculate total quantity correctly", () => {
    const stateWithItems = {
      ...initialState,
      cartItems: [
        { ...mockProduct, cartQuantity: 3 },
        { ...mockProduct, id: "2", cartQuantity: 2 },
      ],
    };

    const action = CALCULATE_TOTAL_QUANTITY();
    const result = cartReducer(stateWithItems, action);

    expect(result.cartTotalQuantity).toBe(5);
  });
});

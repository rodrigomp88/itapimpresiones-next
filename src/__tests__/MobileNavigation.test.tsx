import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MobileNavigation from "@/components/Mobile/MobileNavigation";
import cartReducer from "@/redux/slice/cartSlice";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

describe("MobileNavigation", () => {
  const mockPathname = "/";

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
  });

  const renderWithProvider = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <MobileNavigation />
      </Provider>
    );
  };

  test("debe renderizar todos los elementos de navegación", () => {
    renderWithProvider();

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Tienda")).toBeInTheDocument();
    expect(screen.getByText("Carrito")).toBeInTheDocument();
    expect(screen.getByText("Servicios")).toBeInTheDocument();
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
  });

  test("debe mostrar el elemento activo correctamente", () => {
    (usePathname as jest.Mock).mockReturnValue("/tienda");
    renderWithProvider();

    const tiendaButton = screen.getByText("Tienda").closest("a");
    expect(tiendaButton).toHaveClass("transform", "-translate-y-1");
  });

  test("debe mostrar badge del carrito cuando hay productos", () => {
    const store = createMockStore({
      cart: {
        items: [
          { id: "1", name: "Producto 1", price: 10, quantity: 2 },
          { id: "2", name: "Producto 2", price: 5, quantity: 1 },
        ],
        total: 3,
      },
    });

    renderWithProvider(store);

    // El badge debe aparecer cuando hay items en el carrito
    const cartButton = screen.getByText("Carrito").closest("a");
    expect(cartButton).toBeInTheDocument();

    // Buscar el badge por el conteo
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("el botón especial de Servicios debe tener el diseño correcto", () => {
    (usePathname as jest.Mock).mockReturnValue("/servicios");
    renderWithProvider();

    const serviciosButton = screen.getByText("Servicios").closest("a");
    expect(serviciosButton).toBeInTheDocument();

    // Verificar que tiene las clases de transformación especiales
    expect(serviciosButton).toHaveClass("transform", "-translate-y-1");
  });

  test("debe manejar navegación entre páginas", () => {
    renderWithProvider();

    const inicioLink = screen.getByText("Inicio").closest("a");
    expect(inicioLink).toHaveAttribute("href", "/");

    const tiendaLink = screen.getByText("Tienda").closest("a");
    expect(tiendaLink).toHaveAttribute("href", "/tienda");

    const carritoLink = screen.getByText("Carrito").closest("a");
    expect(carritoLink).toHaveAttribute("href", "/checkout");

    const serviciosLink = screen.getByText("Servicios").closest("a");
    expect(serviciosLink).toHaveAttribute("href", "/servicios");

    const pedidosLink = screen.getByText("Pedidos").closest("a");
    expect(pedidosLink).toHaveAttribute("href", "/orders");
  });

  test("debe renderizar sin errores en modo oscuro", () => {
    document.documentElement.classList.add("dark");
    renderWithProvider();

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Tienda")).toBeInTheDocument();

    document.documentElement.classList.remove("dark");
  });

  test("debe aplicar clases de diseño moderno correctamente", () => {
    renderWithProvider();

    const navigation = screen.getByRole("navigation");
    expect(navigation).toHaveClass("bg-gradient-to-r");
    expect(navigation).toHaveClass("backdrop-blur-xl");
    expect(navigation).toHaveClass("shadow-2xl");
  });
});

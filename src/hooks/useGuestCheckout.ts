"use client";

import { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItems, selectCartTotalAmount } from "@/redux/slice/cartSlice";
import { AppliedCoupon } from "@/types/coupon";
import { PaymentMethod } from "@/types/payment";

export interface GuestUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  notes?: string;
}

export interface GuestOrder {
  id?: string;
  guestUser: GuestUser;
  orderItems: any[];
  orderAmount: number;
  depositAmount: number;
  remainingAmount: number;
  shippingCost: number;
  taxAmount: number;
  appliedCoupon?: AppliedCoupon;
  paymentMethod: PaymentMethod;
  orderStatus: "pending" | "confirmed" | "processing" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
  lastUpdated: Date;
  guestOrderToken: string;
  migratedToUser?: boolean;
  userId?: string;
}

export interface GuestCheckoutState {
  guestUser: GuestUser;
  step: "checkout" | "payment" | "confirmation" | "success";
  isSubmitting: boolean;
  currentOrder: GuestOrder | null;
  error: string | null;
  validationErrors: Partial<Record<keyof GuestUser, string>>;
}

const initialGuestUser: GuestUser = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  province: "",
  notes: "",
};

export const useGuestCheckout = () => {
  const cartItems = useAppSelector(selectCartItems);
  const cartTotalAmount = useAppSelector(selectCartTotalAmount);

  const [state, setState] = useState<GuestCheckoutState>({
    guestUser: initialGuestUser,
    step: "checkout",
    isSubmitting: false,
    currentOrder: null,
    error: null,
    validationErrors: {},
  });

  // Calcular costos
  const calculateCosts = useCallback(() => {
    const couponDiscount = state.currentOrder?.appliedCoupon?.discount || 0;
    const subtotalAfterDiscount = cartTotalAmount - couponDiscount;
    
    const depositPercentage = 50;
    const depositAmount = Math.round(subtotalAfterDiscount * (depositPercentage / 100));
    const remainingAmount = subtotalAfterDiscount - depositAmount;
    
    const shippingCost = state.guestUser.province && cartTotalAmount > 0 
      ? (cartTotalAmount >= 10000 ? 0 : 600)
      : 0;
    
    const taxAmount = subtotalAfterDiscount * 0.21;
    
    return {
      subtotalAfterDiscount,
      depositAmount,
      remainingAmount,
      shippingCost,
      taxAmount,
      finalTotal: subtotalAfterDiscount + shippingCost + taxAmount,
    };
  }, [cartTotalAmount, state.currentOrder?.appliedCoupon, state.guestUser.province]);

  // Validar datos del usuario guest
  const validateGuestUser = useCallback((guestUser: GuestUser): boolean => {
    const errors: Partial<Record<keyof GuestUser, string>> = {};
    
    if (!guestUser.name.trim()) errors.name = "El nombre es obligatorio";
    if (!guestUser.email.trim()) errors.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(guestUser.email)) errors.email = "Email inválido";
    if (!guestUser.phone.trim()) errors.phone = "El teléfono es obligatorio";
    if (!guestUser.address.trim()) errors.address = "La dirección es obligatoria";
    if (!guestUser.city.trim()) errors.city = "La ciudad es obligatoria";
    if (!guestUser.postalCode.trim()) errors.postalCode = "El código postal es obligatorio";
    if (!guestUser.province.trim()) errors.province = "La provincia es obligatoria";
    
    setState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  }, []);

  // Actualizar datos del usuario guest
  const updateGuestUser = useCallback((field: keyof GuestUser, value: string) => {
    setState(prev => ({
      ...prev,
      guestUser: { ...prev.guestUser, [field]: value },
      validationErrors: { ...prev.validationErrors, [field]: undefined },
      error: null,
    }));
  }, []);

  // Crear orden guest
  const createGuestOrder = useCallback(async (appliedCoupon?: AppliedCoupon, paymentMethod?: PaymentMethod) => {
    if (cartItems.length === 0) {
      setState(prev => ({ ...prev, error: "El carrito está vacío" }));
      return null;
    }

    if (!validateGuestUser(state.guestUser)) {
      setState(prev => ({ ...prev, error: "Por favor completa todos los campos requeridos" }));
      return null;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const costs = calculateCosts();
      const guestOrderToken = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        cartQuantity: item.cartQuantity,
        imageURL: typeof item.images[0] === "string" ? item.images[0] : item.images[0]?.url || "",
      }));

      const guestOrder: GuestOrder = {
        guestUser: state.guestUser,
        orderItems,
        orderAmount: cartTotalAmount,
        depositAmount: costs.depositAmount,
        remainingAmount: costs.remainingAmount,
        shippingCost: costs.shippingCost,
        taxAmount: costs.taxAmount,
        appliedCoupon,
        paymentMethod: paymentMethod || 'mercadopago',
        orderStatus: "pending",
        paymentStatus: "pending",
        createdAt: new Date(),
        lastUpdated: new Date(),
        guestOrderToken,
        migratedToUser: false,
      };

      localStorage.setItem("guestOrder", JSON.stringify(guestOrder));
      localStorage.setItem("guestOrderToken", guestOrderToken);

      setState(prev => ({
        ...prev,
        currentOrder: guestOrder,
        step: "payment",
        isSubmitting: false,
      }));

      return guestOrder;
    } catch (error) {
      console.error("Error creating guest order:", error);
      setState(prev => ({
        ...prev,
        error: "Error al crear la orden. Intenta nuevamente.",
        isSubmitting: false,
      }));
      return null;
    }
  }, [cartItems, cartTotalAmount, state.guestUser, validateGuestUser, calculateCosts]);

  // Procesar pago para guest
  const processGuestPayment = useCallback(async (orderId: string) => {
    if (!state.currentOrder) return;

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const response = await fetch("/api/mercadopago/create-guest-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          guestOrder: state.currentOrder,
        }),
      });

      if (!response.ok) throw new Error("Error en el pago");

      const paymentData = await response.json();

      setState(prev => ({
        ...prev,
        currentOrder: prev.currentOrder ? {
          ...prev.currentOrder,
          paymentStatus: "paid",
          orderStatus: "confirmed",
        } : null,
        step: "success",
        isSubmitting: false,
      }));

      return paymentData;
    } catch (error) {
      console.error("Error processing payment:", error);
      setState(prev => ({
        ...prev,
        error: "Error al procesar el pago",
        isSubmitting: false,
      }));
      return null;
    }
  }, [state.currentOrder]);

  // Limpiar orden guest
  const clearGuestOrder = useCallback(() => {
    localStorage.removeItem("guestOrder");
    localStorage.removeItem("guestOrderToken");
    setState({
      guestUser: initialGuestUser,
      step: "checkout",
      isSubmitting: false,
      currentOrder: null,
      error: null,
      validationErrors: {},
    });
  }, []);

  // Migrar orden guest a usuario registrado
  const migrateToUser = useCallback(async (userId: string) => {
    if (!state.currentOrder) return;

    try {
      const response = await fetch("/api/guest-order/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestOrderToken: state.currentOrder.guestOrderToken,
          userId,
        }),
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          currentOrder: prev.currentOrder ? {
            ...prev.currentOrder,
            migratedToUser: true,
            userId,
          } : null,
        }));
      }
    } catch (error) {
      console.error("Error migrating order:", error);
    }
  }, [state.currentOrder]);

  // Cargar orden guest desde localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem("guestOrder");
    if (savedOrder) {
      try {
        const guestOrder = JSON.parse(savedOrder);
        setState(prev => ({
          ...prev,
          currentOrder: guestOrder,
          guestUser: guestOrder.guestUser,
        }));
      } catch (error) {
        console.error("Error loading guest order:", error);
        clearGuestOrder();
      }
    }
  }, [clearGuestOrder]);

  return {
    ...state,
    cartItems,
    cartTotalAmount,
    costs: calculateCosts(),
    updateGuestUser,
    validateGuestUser,
    createGuestOrder,
    processGuestPayment,
    clearGuestOrder,
    migrateToUser,
    setStep: (step: GuestCheckoutState["step"]) => 
      setState(prev => ({ ...prev, step })),
    setError: (error: string | null) => 
      setState(prev => ({ ...prev, error })),
  };
};

export default useGuestCheckout;

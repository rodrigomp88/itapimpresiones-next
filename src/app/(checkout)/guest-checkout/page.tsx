"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useGuestCheckout from "@/hooks/useGuestCheckout";
import { AppliedCoupon } from "@/types/coupon";
import { PaymentMethod } from "@/types/payment";
import CheckoutOptions from "@/components/Checkout/CheckoutOptions";
import GuestUserForm from "@/components/Checkout/GuestUserForm";
import PaymentSummary from "@/components/Checkout/PaymentSummary";
import PaymentProcessing from "@/components/Checkout/PaymentProcessing";
import SuccessPage from "@/components/Checkout/SuccessPage";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiShoppingCart,
  HiUser,
  HiArrowLeft,
  HiCreditCard,
  HiCheckCircle,
  HiExclamationCircle,
  HiX,
  HiShieldCheck,
} from "react-icons/hi";

const GuestCheckoutPage: React.FC = () => {
  const router = useRouter();
  const {
    step,
    guestUser,
    isSubmitting,
    currentOrder,
    error,
    cartItems,
    cartTotalAmount,
    costs,
    updateGuestUser,
    createGuestOrder,
    processGuestPayment,
    clearGuestOrder,
    setError,
  } = useGuestCheckout();

  // Redireccionar al carrito si está vacío
  useEffect(() => {
    if (cartItems.length === 0 && step === "checkout") {
      router.push("/cart");
    }
  }, [cartItems.length, step, router]);

  // Handlers con tipos explícitos
  const handleGuestUserFormSubmit = (
    appliedCoupon: AppliedCoupon | undefined,
    paymentMethod?: PaymentMethod
  ) => {
    createGuestOrder(appliedCoupon, paymentMethod);
  };

  const handlePaymentComplete = () => {
    if (currentOrder?.id) {
      processGuestPayment(currentOrder.id);
    }
  };

  // Renderizar contenido basado en el paso actual
  const renderStepContent = () => {
    switch (step) {
      case "checkout":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Formulario principal */}
            <div className="lg:col-span-2">
              <CheckoutOptions
                onGuestCheckout={() => {}}
                onUserCheckout={() => router.push("/checkout")}
              />

              <div className="mt-6">
                <GuestUserForm
                  guestUser={guestUser}
                  onUpdateField={updateGuestUser}
                  onSubmit={handleGuestUserFormSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <PaymentSummary
                cartItems={cartItems}
                cartTotalAmount={cartTotalAmount}
                costs={costs}
                currentOrder={currentOrder}
              />
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="max-w-4xl mx-auto">
            <PaymentProcessing
              order={currentOrder}
              onPaymentComplete={handlePaymentComplete}
              isProcessing={isSubmitting}
            />
          </div>
        );

      case "success":
        return (
          <div className="max-w-2xl mx-auto">
            <SuccessPage
              order={currentOrder}
              onContinueShopping={() => {
                clearGuestOrder();
                router.push("/");
              }}
              onCreateAccount={() => {
                // TODO: Implementar creación de cuenta
                router.push("/auth/register");
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 pb-6">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Carrito
          </Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            /
          </span>
          <span className="text-prussian-blue dark:text-zinc-100 text-sm font-medium">
            {step === "checkout" && "Finalizar Compra"}
            {step === "payment" && "Procesar Pago"}
            {step === "success" && "Pedido Confirmado"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 dark:bg-primary/15 rounded-full">
              {step === "checkout" && (
                <HiShoppingCart className="w-6 h-6 text-primary dark:text-primary-light" />
              )}
              {step === "payment" && (
                <HiCreditCard className="w-6 h-6 text-primary dark:text-primary-light" />
              )}
              {step === "success" && (
                <HiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-prussian-blue dark:text-white">
                {step === "checkout" && "Compra sin registro"}
                {step === "payment" && "Procesar Pago"}
                {step === "success" && "¡Pedido confirmado!"}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {step === "checkout" &&
                  "Completa tus datos para realizar la compra"}
                {step === "payment" && "Confirma tu pedido y procede al pago"}
                {step === "success" &&
                  "Tu pedido ha sido procesado exitosamente"}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                step === "checkout"
                  ? "bg-primary/10 text-primary-dark dark:bg-primary/15 dark:text-primary-light"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              }`}
            >
              <HiUser className="w-4 h-4" />
              Datos
            </div>

            <div
              className={`w-8 h-px ${
                step !== "checkout"
                  ? "bg-green-300 dark:bg-green-600"
                  : "bg-gray-300 dark:bg-zinc-600"
              }`}
            />

            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                step === "payment"
                  ? "bg-primary/10 text-primary-dark dark:bg-primary/15 dark:text-primary-light"
                  : step === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              <HiCreditCard className="w-4 h-4" />
              Pago
            </div>

            <div
              className={`w-8 h-px ${
                step === "success"
                  ? "bg-green-300 dark:bg-green-600"
                  : "bg-gray-300 dark:bg-zinc-600"
              }`}
            />

            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                step === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              <HiCheckCircle className="w-4 h-4" />
              Confirmado
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <HiExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Footer Info */}
        {step === "checkout" && (
          <div className="mt-8 p-4 bg-primary/10 dark:bg-primary/10 border border-primary/20 dark:border-primary-dark rounded-lg">
            <div className="flex items-start gap-3">
              <HiShieldCheck className="w-5 h-5 text-primary dark:text-primary-light mt-0.5" />
              <div>
                <p className="text-primary-dark dark:text-primary-light font-medium text-sm mb-1">
                  Compra 100% segura
                </p>
                <p className="text-primary-dark dark:text-primary-light text-xs">
                  Tus datos están protegidos. Podrás crear una cuenta después de
                  la compra si lo deseas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestCheckoutPage;

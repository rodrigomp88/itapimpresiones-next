"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { ShippingAddress } from "@/redux/slice/checkoutSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  CLEAR_CART,
  selectCartItems,
  selectCartTotalAmount,
} from "@/redux/slice/cartSlice";
import { auth, db } from "@/firebase/config";
import {
  NotiflixFailure,
  NotiflixSuccess,
} from "@/components/Notiflix/Notiflix";
import Link from "next/link";
import { shippingAddressSchema } from "@/lib/validationSchemas";
import CouponInput from "@/components/CouponInput";
import { AppliedCoupon } from "@/types/coupon";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { PaymentMethod, BANK_TRANSFER_INFO } from "@/types/payment";

const initialAddressState: ShippingAddress = {
  name: "",
  mail: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  province: "",
  notes: "",
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status: sessionStatus } = useSession();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  const [shippingAddress, setShippingAddress] = useState(initialAddressState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mercadopago");

  const cartItems = useAppSelector(selectCartItems);
  const cartTotalAmount = useAppSelector(selectCartTotalAmount);

  // Calcular descuento del cupón
  const couponDiscount = appliedCoupon?.discount || 0;
  const subtotalAfterDiscount = cartTotalAmount - couponDiscount;

  // Calcular montos de seña (sobre el subtotal con descuento)
  const depositPercentage = 50;
  const depositAmount = Math.round(
    subtotalAfterDiscount * (depositPercentage / 100)
  );
  const remainingAmount = subtotalAfterDiscount - depositAmount;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch, cartItems]);

  // Calcular costos de envío e impuestos
  useEffect(() => {
    if (shippingAddress.province && cartTotalAmount > 0) {
      // Costo de envío basado en provincia (ejemplo simple)
      const shippingRates: { [key: string]: number } = {
        "Buenos Aires": 500,
        Córdoba: 800,
        "Santa Fe": 700,
        Mendoza: 900,
        Tucumán: 1000,
        "Entre Ríos": 750,
        Salta: 1100,
        Chaco: 850,
        Corrientes: 800,
        Misiones: 950,
      };

      const baseShipping = shippingRates[shippingAddress.province] || 600;
      // Envío gratis para compras > $10,000
      const finalShipping = cartTotalAmount >= 10000 ? 0 : baseShipping;
      setShippingCost(finalShipping);

      // Impuestos (21% IVA en Argentina)
      const taxRate = 0.21;
      const tax = cartTotalAmount * taxRate;
      setTaxAmount(tax);
    } else {
      setShippingCost(0);
      setTaxAmount(0);
    }
  }, [shippingAddress.province, cartTotalAmount]);

  useEffect(() => {
    if (sessionStatus === "loading" || isFirebaseLoading) return;
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (firebaseUser) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setShippingAddress({
            name: userData.name || session?.user?.name || "",
            mail: userData.mail || session?.user?.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            postalCode: userData.postalCode || "",
            province: userData.province || "",
            notes: userData.notes || "",
          });
        } else {
          setShippingAddress({
            name: session?.user?.name || "",
            mail: session?.user?.email || "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            province: "",
            notes: "",
          });
        }
      };
      fetchUserData();
    }
  }, [sessionStatus, session, firebaseUser, isFirebaseLoading, router]);

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  // Validar stock antes del checkout (solo para productos físicos)
  const validateStockAvailability = (): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    cartItems.forEach((item) => {
      // Solo validar stock para productos físicos
      if (item.stockType === "physical" && item.stock < item.cartQuantity) {
        errors.push(
          `${item.name}: Solo hay ${item.stock} unidades disponibles (solicitaste ${item.cartQuantity})`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      NotiflixFailure("Error: La sesión de usuario no está disponible.");
      return;
    }

    // Validar stock antes del checkout
    const stockValidation = validateStockAvailability();
    if (!stockValidation.isValid) {
      NotiflixFailure(
        `Problemas de stock: ${stockValidation.errors.join(", ")}`
      );
      return;
    }

    // Validar con ZOD
    const validationResult = shippingAddressSchema.safeParse(shippingAddress);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      NotiflixFailure(`Errores en el formulario: ${errors}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        cartQuantity: item.cartQuantity,
        imageURL:
          typeof item.images[0] === "string"
            ? item.images[0]
            : item.images[0]?.url || "",
      }));

      // Crear orden en Firebase primero
      const orderData = {
        userID: firebaseUser.uid,
        userEmail: firebaseUser.email,
        shippingAddress,
        orderItems: orderItems,
        orderAmount: cartTotalAmount,
        depositAmount: depositAmount,
        remainingAmount: remainingAmount,
        orderStatus: "pending",
        paymentStatus: "pending",
        createdAt: Timestamp.now().toDate(),
        lastUpdatedBy: "cliente",
        hasUnreadAdminMessage: true,
        hasUnreadClientMessage: false,
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);
      const orderId = orderRef.id;

      // Guardar dirección completa en perfil de usuario
      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          name: shippingAddress.name,
          mail: shippingAddress.mail,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          province: shippingAddress.province,
          notes: shippingAddress.notes,
        },
        { merge: true }
      );

      // Crear preferencia de pago en MercadoPago
      const paymentResponse = await fetch(
        "/api/mercadopago/create-preference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            items: orderItems,
            totalAmount: depositAmount, // Solo cobrar la seña inicialmente
            fullAmount: cartTotalAmount, // Guardar el monto total para referencia
            shippingAddress,
            userEmail: firebaseUser.email,
          }),
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("Error al crear la preferencia de pago");
      }

      const paymentData = await paymentResponse.json();

      // Mostrar mensaje si es modo desarrollo
      if (paymentData.isDevelopment) {
        NotiflixSuccess("Modo desarrollo: Simulando pago con MercadoPago");
      }

      // Limpiar carrito (el pago se procesará después)
      dispatch(CLEAR_CART());

      // Redirigir a MercadoPago (o simulación)
      window.location.href = paymentData.initPoint;
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      NotiflixFailure(
        "Hubo un problema al procesar tu orden. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionStatus === "loading" || isFirebaseLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          Cargando checkout...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 pb-4">
          <Link
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
            href="/cart"
          >
            Carrito
          </Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            /
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
            Finalizar Compra
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-wrap justify-between gap-3 pb-8">
          <p className="text-zinc-900 dark:text-zinc-100 text-4xl font-black min-w-72">
            Detalles de Envío
          </p>
        </div>

        <form
          onSubmit={handleOrderSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* Formulario de Dirección */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                Información de Contacto
              </h2>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Ej: Juan Pérez"
                    value={shippingAddress.name}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="mail"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="mail"
                      name="mail"
                      placeholder="Ej: juan@mail.com"
                      value={shippingAddress.mail}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Ej: +54 9 11..."
                      value={shippingAddress.phone}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Dirección Completa
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Ej: Calle Ficticia 123, Piso 4, Depto B"
                    value={shippingAddress.address}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Ej: Buenos Aires"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      placeholder="Ej: 1000"
                      value={shippingAddress.postalCode}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Provincia/Estado
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      placeholder="Ej: Buenos Aires"
                      value={shippingAddress.province}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                      required
                    />
                  </div>
                  <div></div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Notas de envío (opcional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Ej: Tocar timbre, dejar en conserjería, etc."
                    value={shippingAddress.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setShippingAddress({
                        ...shippingAddress,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                Tu Pedido
              </h2>

              {/* Cupón de descuento */}
              <div className="mb-4">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  ¿Tenés un cupón?
                </p>
                <CouponInput
                  cartTotal={cartTotalAmount}
                  categories={cartItems.map((item) => item.category)}
                  onCouponApplied={setAppliedCoupon}
                  appliedCoupon={appliedCoupon}
                />
              </div>

              {/* Resumen de costos detallado */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Subtotal
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    ${cartTotalAmount.toLocaleString("es-AR")}
                  </span>
                </div>

                {/* Mostrar descuento del cupón */}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Descuento ({appliedCoupon.code})</span>
                    <span>
                      -${appliedCoupon.discount.toLocaleString("es-AR")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Envío
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        ¡Gratis!
                      </span>
                    ) : (
                      `$${shippingCost.toLocaleString("es-AR")}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    IVA (21%)
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    ${Math.round(taxAmount).toLocaleString("es-AR")}
                  </span>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 space-y-2">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-zinc-900 dark:text-zinc-100">
                      Total del pedido
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100">
                      $
                      {Math.round(
                        cartTotalAmount + shippingCost + taxAmount
                      ).toLocaleString("es-AR")}
                    </span>
                  </div>

                  {/* Seña (50%) */}
                  <div className="flex justify-between text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Seña requerida (50%)
                    </span>
                    <span className="text-blue-800 dark:text-blue-200 font-bold">
                      ${depositAmount.toLocaleString("es-AR")}
                    </span>
                  </div>

                  {/* Restante */}
                  <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                    <span>Restante al finalizar</span>
                    <span className="font-medium">
                      ${remainingAmount.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>

                {/* Información sobre pagos */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-amber-800 dark:text-amber-200 text-xs font-medium mb-1">
                    💰 Sistema de pagos
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-xs">
                    Pagás el 50% ahora para confirmar tu pedido. El resto se
                    paga al finalizar el trabajo.
                  </p>
                </div>

                {cartTotalAmount >= 10000 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-800 dark:text-green-200 text-xs">
                      🎉 ¡Envío gratis por compra mayor a $10.000!
                    </p>
                  </div>
                )}
              </div>

              {/* Selector de método de pago */}
              <div className="mb-6 border-t border-zinc-200 dark:border-zinc-700 pt-4">
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  cartTotal={cartTotalAmount}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  "Confirmar Pedido"
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Al confirmar, aceptas nuestros términos y condiciones de
                  envío.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

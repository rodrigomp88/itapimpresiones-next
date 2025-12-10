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
import CheckoutSummary from "@/components/CheckoutSummary/CheckoutSummary";
import Link from "next/link";

const initialAddressState: ShippingAddress = {
  name: "",
  mail: "",
  phone: "",
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status: sessionStatus } = useSession();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  const [shippingAddress, setShippingAddress] = useState(initialAddressState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = useAppSelector(selectCartItems);
  const cartTotalAmount = useAppSelector(selectCartTotalAmount);

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
          });
        } else {
          setShippingAddress({
            name: session?.user?.name || "",
            mail: session?.user?.email || "",
            phone: "",
          });
        }
      };
      fetchUserData();
    }
  }, [sessionStatus, session, firebaseUser, isFirebaseLoading, router]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      NotiflixFailure("Error: La sesión de usuario no está disponible.");
      return;
    }
    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.mail
    ) {
      NotiflixFailure("Por favor, complete todos los campos de envío.");
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

      const orderData = {
        userID: firebaseUser.uid,
        userEmail: firebaseUser.email,
        shippingAddress,
        orderItems: orderItems,
        orderAmount: cartTotalAmount,
        orderStatus: "Orden Recibida",
        createdAt: Timestamp.now().toDate(),
        lastUpdatedBy: "cliente",
        hasUnreadAdminMessage: true,
        hasUnreadClientMessage: false,
      };

      await addDoc(collection(db, "orders"), orderData);

      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          name: shippingAddress.name,
          mail: shippingAddress.mail,
          phone: shippingAddress.phone,
        },
        { merge: true }
      );

      dispatch(CLEAR_CART());
      NotiflixSuccess("¡Orden realizada con éxito!");
      router.push("/orders");
    } catch (error) {
      console.error("Error al guardar la orden:", error);
      NotiflixFailure("Hubo un problema al procesar tu orden.");
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
              </div>
            </div>
          </div>

          {/* Resumen del Pedido (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                Tu Pedido
              </h2>

              {/* Aquí usamos tu componente CheckoutSummary existente, pero si quieres estilos consistentes podrías reescribirlo o asegurarte que CheckoutSummary use estilos limpios */}
              <div className="mb-6">
                <CheckoutSummary />
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

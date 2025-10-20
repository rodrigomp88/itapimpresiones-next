"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { ShippingAddress } from "@/src/redux/slice/checkoutSlice";
import {
  CLEAR_CART,
  selectCartItems,
  selectCartTotalAmount,
} from "@/src/redux/slice/cartSlice";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  NotiflixFailure,
  NotiflixSuccess,
} from "@/src/components/Notiflix/Notiflix";
import { db } from "@/src/firebase/config";
import CheckoutSummary from "@/src/components/CheckoutSummary/CheckoutSummary";

const initialAddressState: ShippingAddress = {
  name: "",
  mail: "",
  phone: "",
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  const [shippingAddress, setShippingAddress] = useState(initialAddressState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = useAppSelector(selectCartItems);
  const cartTotalAmount = useAppSelector(selectCartTotalAmount);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    const fetchUserData = async () => {
      if (session?.user?.id) {
        const userRef = doc(db, "users", session.user.id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setShippingAddress({
            name: userData.name || session.user.name || "",
            mail: userData.mail || session.user.email || "",
            phone: userData.phone || "",
          });
        } else {
          setShippingAddress({
            name: session.user.name || "",
            mail: session.user.email || "",
            phone: "",
          });
        }
      }
    };
    fetchUserData();
  }, [status, session, router]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      NotiflixFailure("Error: No se ha encontrado el ID del usuario.");
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
      const orderData = {
        userID: session.user.id,
        userEmail: session.user.email,
        shippingAddress,
        cartItems,
        orderAmount: cartTotalAmount,
        orderStatus: "Orden Recibida",
        createdAt: Timestamp.now().toDate(),
      };
      await addDoc(collection(db, "orders"), orderData);

      await setDoc(
        doc(db, "users", session.user.id),
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

  if (status === "loading") {
    return <div className="text-center p-8">Cargando...</div>;
  }

  return (
    <form onSubmit={handleOrderSubmit}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Dirección de Envío</h2>
          <div>
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={shippingAddress.name}
              onChange={handleShippingChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="mail">Correo Electrónico</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={shippingAddress.mail}
              onChange={handleShippingChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Número de Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleShippingChange}
              className="input"
              required
            />
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
          <CheckoutSummary />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Realizar Pedido"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CheckoutPage;

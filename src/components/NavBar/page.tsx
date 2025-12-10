"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { IoCartOutline } from "react-icons/io5";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import UserNotificationProvider from "../Notifications/UserNotificationProvider";
import InAppNotificationHandler from "../Notifications/InAppNotificationHandler";
import Image from "next/image";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
  selectCartItems, // <--- 1. Importar el selector de items
} from "@/redux/slice/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import UserNotificationBell from "../Notifications/UserNotificationBell";

const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_USER_ADMIN;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity);
  const cartItems = useAppSelector(selectCartItems); // <--- 2. Suscribirse a los items
  const dispatch = useAppDispatch();

  // <--- 3. Agregar cartItems como dependencia
  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch, cartItems]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const logoutUser = () => signOut({ callbackUrl: "/" });

  if (status === "loading") {
    return (
      <nav className="sticky top-0 z-20 h-16 bg-white dark:bg-black animate-pulse"></nav>
    );
  }

  return (
    <>
      {status === "authenticated" && (
        <>
          {!isAdmin && <UserNotificationProvider />}
          <InAppNotificationHandler />
        </>
      )}

      <nav className="sticky top-0 z-30 flex items-center justify-between py-3 px-5 md:px-20 xl:px-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="relative">
          <Image
            src={"/images/logoblack.png"}
            width={90}
            height={40}
            alt="Itap Impresiones Logo"
            className="block dark:hidden"
            priority
          />
          <Image
            src={"/images/logowhite.png"}
            width={90}
            height={40}
            alt="Itap Impresiones Logo"
            className="hidden dark:block"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="group">
            Inicio
            <span className="underline-hover" />
          </Link>
          <Link href="/servicios" className="group">
            Servicios
            <span className="underline-hover" />
          </Link>
          <Link href="/bolsas" className="group">
            Bolsas
            <span className="underline-hover" />
          </Link>
          <Link href="/indumentaria" className="group">
            Indumentaria
            <span className="underline-hover" />
          </Link>
          <Link href="/tienda" className="group">
            Tienda
            <span className="underline-hover" />
          </Link>
          {status === "authenticated" && (
            <Link href="/orders" className="group">
              Órdenes
              <span className="underline-hover" />
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="group bg-yellow-400 text-black px-2 py-1 rounded-md"
            >
              Panel Admin
              <span className="underline-hover" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {status === "authenticated" && (
            <div className="relative hidden md:block">
              <UserNotificationBell />
            </div>
          )}

          <Link href="/cart" className="relative group">
            <IoCartOutline className="h-6 w-6" />

            {/* Solo mostramos el badge si hay items */}
            {cartTotalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-in zoom-in duration-300">
                {cartTotalQuantity > 99 ? "99+" : cartTotalQuantity}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {status === "unauthenticated" ? (
              <Link href="/auth/login" className="btn-sm">
                Ingresar
              </Link>
            ) : (
              <>
                <p className="text-sm">
                  Hola, {user?.name || user?.email?.split("@")[0]}
                </p>
                <button
                  onClick={logoutUser}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-all cursor-pointer"
                >
                  Salir
                </button>
              </>
            )}
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-2xl z-50">
            {isSidebarOpen ? <RiCloseLine /> : <RiMenu3Fill />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <MobileSidebar closeSidebar={toggleSidebar} logoutUser={logoutUser} />
        )}
      </AnimatePresence>
    </>
  );
};

interface MobileSidebarProps {
  closeSidebar: () => void;
  logoutUser: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  closeSidebar,
  logoutUser,
}) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_USER_ADMIN;
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSidebar]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-30"
      />
      <motion.div
        ref={sidebarRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-black z-40 shadow-lg p-6"
      >
        <div className="flex flex-col h-full pt-16 text-xl">
          <div className="flex justify-between items-center mb-6">
            {status === "authenticated" && (
              <p className="font-semibold">
                Hola, {user?.name || user?.email?.split("@")[0]}
              </p>
            )}

            {status === "authenticated" && (
              <div className="relative">
                <UserNotificationBell />
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-6">
            <Link href="/" className="sidebar-link" onClick={closeSidebar}>
              Inicio
            </Link>
            <Link
              href="/servicios"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              Servicios
            </Link>
            <Link
              href="/bolsas"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              Bolsas
            </Link>
            <Link
              href="/indumentaria"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              Indumentaria
            </Link>
            <Link
              href="/tienda"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              Tienda
            </Link>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/orders"
                  className="sidebar-link"
                  onClick={closeSidebar}
                >
                  Órdenes
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="sidebar-link"
                    onClick={closeSidebar}
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logoutUser();
                    closeSidebar();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-all cursor-pointe"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="sidebar-link"
                  onClick={closeSidebar}
                >
                  Ingresar
                </Link>
                <Link
                  href="/auth/register"
                  className="sidebar-link"
                  onClick={closeSidebar}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;

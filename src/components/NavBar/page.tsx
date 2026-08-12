"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { IoCartOutline } from "react-icons/io5";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import UserNotificationProvider from "../Notifications/UserNotificationProvider";
import InAppNotificationHandler from "../Notifications/InAppNotificationHandler";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
  selectCartItems, // <--- 1. Importar el selector de items
} from "@/redux/slice/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import UserNotificationBell from "../Notifications/UserNotificationBell";
import { ThemeToggle } from "../ThemeProvider";

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

      <nav
        id="navigation"
        className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="flex items-center justify-between whitespace-nowrap px-6 lg:px-12 py-4 max-w-[1440px] mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 text-blue-600">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_6_330)">
                  <path
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              PrintStudio
            </h2>
          </Link>

          <div className="hidden md:flex flex-1 justify-end items-center gap-10">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/servicios"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
              >
                Servicios
              </Link>
              <Link
                href="/bolsas"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
              >
                Bolsas
              </Link>
              <Link
                href="/indumentaria"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
              >
                Indumentaria
              </Link>
              <Link
                href="/tienda"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
              >
                Tienda
              </Link>
              {status === "authenticated" && (
                <Link
                  href="/orders"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
                >
                  Órdenes
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
                >
                  Panel Admin
                </Link>
              )}
            </div>
            {status === "unauthenticated" && (
              <Link
                href="/auth/login"
                className="flex cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                <span className="mr-2 material-symbols-outlined !text-lg">
                  person
                </span>
                <span>Ingresar</span>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4 ml-4">
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

            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <div className="hidden md:flex items-center gap-2">
              {status === "authenticated" && (
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
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-all cursor-pointer"
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

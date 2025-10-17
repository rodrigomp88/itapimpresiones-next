"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { IoCartOutline } from "react-icons/io5";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";
import { motion } from "framer-motion";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
} from "@/src/redux/slice/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_USER_ADMIN;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const logoutUser = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <nav className="sticky top-0 z-20 h-16 bg-white dark:bg-black animate-pulse"></nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-20 flex items-center justify-between py-3 px-5 md:px-20 xl:px-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            Itap<span className="text-violet-500">Impresiones</span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="group">
            Inicio
            <span className="underline-hover" />
          </Link>
          <Link href="/shop" className="group">
            Tienda
            <span className="underline-hover" />
          </Link>

          {status === "authenticated" && (
            <Link href="/orders" className="group">
              Mis Órdenes
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
          <Link href="/cart" className="relative">
            <IoCartOutline className="h-6 w-6" />
            {cartTotalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartTotalQuantity > 9 ? "+9" : cartTotalQuantity}
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
                <button onClick={logoutUser} className="btn-sm-secondary">
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

      <MobileSidebar
        isOpen={isSidebarOpen}
        closeSidebar={toggleSidebar}
        logoutUser={logoutUser}
      />
    </>
  );
};

interface MobileSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  logoutUser: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  closeSidebar,
  logoutUser,
}) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_USER_ADMIN;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-black z-40 shadow-lg p-6"
    >
      <div className="flex flex-col h-full pt-16 text-xl space-y-6">
        {status === "authenticated" && (
          <p className="text-center font-semibold">
            Hola, {user?.name || user?.email?.split("@")[0]}
          </p>
        )}

        <Link href="/" className="sidebar-link" onClick={closeSidebar}>
          Inicio
        </Link>
        <Link href="/shop" className="sidebar-link" onClick={closeSidebar}>
          Tienda
        </Link>

        {status === "authenticated" ? (
          <>
            <Link
              href="/orders"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              Mis Órdenes
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
              className="sidebar-link text-red-500 text-left"
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
    </motion.div>
  );
};

export default Navbar;

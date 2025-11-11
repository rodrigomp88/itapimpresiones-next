"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { IoCartOutline } from "react-icons/io5";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import UserNotificationBell from "../Notifications/UserNotificationBell";
import UserNotificationProvider from "../Notifications/UserNotificationProvider";
import InAppNotificationHandler from "../Notifications/InAppNotificationHandler";
import Image from "next/image";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
} from "@/redux/slice/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

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

      <nav className="sticky top-0 z-30 flex items-center justify-between py-3 px-5 md:px-20 xl:px-40 bg-black border-b border-gray-200">
        <Link href="/" className="relative h-10 w-[100px]">
          <Image
            src={"/images/logowhite.png"}
            width={150}
            height={40}
            alt="Itap Impresiones Logo"
            className="h-10 w-auto hidden dark:block"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="group">
            Inicio
            <span className="underline-hover" />
          </Link>
          <Link href="/tienda" className="group">
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
          {status === "authenticated" && (
            <div className="hidden md:block">
              <UserNotificationBell />
            </div>
          )}
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
            {status === "authenticated" && <UserNotificationBell />}
          </div>

          <div className="flex flex-col space-y-6">
            <Link href="/" className="sidebar-link" onClick={closeSidebar}>
              Inicio
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
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;

import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import React from "react";

/**
 * Layout público de ITAP — navbar minimal + contenido.
 * Sin Footer, sin decoraciones, sin scripts. Solo navegación funcional.
 */

async function getCartCount(): Promise<number> {
  // El cart count real se hidrata del lado cliente vía Redux;
  // el SSR no tiene acceso al store. Mostramos 0 en servidor y
  // el componente cliente reemplaza cuando esté listo.
  return 0;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartCount = await getCartCount();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between px-5 lg:px-20 py-4 max-w-[1440px] mx-auto">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/isotipo-fondo-claro.svg"
              alt=""
              className="h-9 w-auto"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo-horizontal-fondo-claro.svg"
              alt="ITAP Impresiones"
              className="h-5 w-auto"
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-prussian-blue hover:text-ocean-blue transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-prussian-blue hover:text-ocean-blue transition-colors"
            >
              Ingresar
            </Link>
            <Link
              href="/cart"
              className="relative text-prussian-blue hover:text-ocean-blue transition-colors"
              aria-label="Carrito"
            >
              <IoCartOutline className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="min-h-screen px-5 lg:px-20" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}

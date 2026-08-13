import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex justify-center items-center">
          <img
            src="/images/brand/logo-horizontal-fondo-claro.svg"
            alt="ITAP Impresiones"
            className="h-10 w-auto dark:hidden"
          />
          <img
            src="/images/brand/logo-horizontal-blanco.svg"
            alt="ITAP Impresiones"
            className="h-10 w-auto hidden dark:block"
          />
        </Link>
      </div>
      <main className="p-4 md:p-8">{children}</main>
    </section>
  );
}

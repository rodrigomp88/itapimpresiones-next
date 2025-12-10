import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-black font-sans">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-105 duration-200"
          >
            {/* Ajusta la lógica de imágenes según tu tema si es necesario, aquí muestro ambas para el ejemplo o usa la que corresponda */}
            <Image
              alt="Logo Itap"
              className="mx-auto h-12 w-auto dark:hidden"
              src="/images/logoblack.png"
              width={150}
              height={50}
              priority
            />
            <Image
              alt="Logo Itap"
              className="mx-auto h-12 w-auto hidden dark:block"
              src="/images/logowhite.png"
              width={150}
              height={50}
              priority
            />
          </Link>
        </div>

        {/* El children (Login o Register) traerá su propia tarjeta/diseño */}
        {children}

        {/* Footer Link */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/tienda"
            className="group font-medium text-primary hover:text-primary/80 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">
              &larr;
            </span>
            Volver a la tienda
          </Link>
        </p>
      </div>
    </main>
  );
}

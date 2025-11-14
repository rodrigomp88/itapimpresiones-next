import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" passHref>
            <Image
              alt="Logo Itap"
              className="mx-auto h-12 w-auto"
              src="/images/logowhite.png"
              width={150}
              height={50}
            />
          </Link>
        </div>

        <div className="py-8 px-6 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 sm:px-10">
          {children}
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/tienda"
            className="group font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors duration-200"
          >
            <span className="group-hover:-translate-x-1 inline-block transition-transform duration-200">
              &larr;
            </span>{" "}
            Volver a la tienda
          </Link>
        </p>
      </div>
    </main>
  );
}

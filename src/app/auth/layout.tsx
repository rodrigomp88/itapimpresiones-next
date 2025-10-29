import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen grid items-center justify-center p-4">
      <Link href="/tienda" className="mb-6 inline-block text-center">
        &larr; Volver a la tienda
      </Link>
      <div className="w-2xl max-w-md rounded-lg shadow-lg p-8">{children}</div>
    </main>
  );
}

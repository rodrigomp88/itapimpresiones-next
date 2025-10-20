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
        <Link href="/">
          <h1 className="text-2xl font-bold">Itap Impresiones</h1>
        </Link>
      </div>
      <main className="p-4 md:p-8">{children}</main>
    </section>
  );
}

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
        <Link href="/" className="relative h-10 w-[100px]">
          <Image
            src={"/images/logo.png"}
            width={150}
            height={40}
            alt="Itap Impresiones Logo"
            className="h-10 w-auto hidden dark:block"
            priority
          />
        </Link>
      </div>
      <main className="p-4 md:p-8">{children}</main>
    </section>
  );
}

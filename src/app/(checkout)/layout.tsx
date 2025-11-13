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
          <Image
            src={"/images/logowhite.png"}
            width={100}
            height={50}
            alt="Itap Impresiones Logo"
            className="hidden dark:block"
            priority
          />
        </Link>
      </div>
      <main className="p-4 md:p-8">{children}</main>
    </section>
  );
}

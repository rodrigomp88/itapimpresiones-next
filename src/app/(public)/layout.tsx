import Footer from "@/components/Footer/page";
import Navbar from "@/components/NavBar/page";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-5 lg:px-20">{children}</main>
      <Footer />
    </>
  );
}

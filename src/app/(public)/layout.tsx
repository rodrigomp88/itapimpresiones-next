import Footer from "@/components/Footer/page";
import Navbar from "@/components/NavBar/page";
import MobileLayout from "@/components/Mobile/MobileLayout";
import SkipLink from "@/components/SkipLink";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileLayout>
      {/* Skip Links para accesibilidad */}
      <SkipLink href="#main-content">Saltar al contenido principal</SkipLink>
      <SkipLink href="#navigation">Saltar a la navegación</SkipLink>
      <SkipLink href="#footer">Saltar al pie de página</SkipLink>

      <Navbar />
      
      <main 
        id="main-content" 
        className="min-h-screen px-5 lg:px-20"
        tabIndex={-1}
      >
        {children}
      </main>
      
      <Footer />
    </MobileLayout>
  );
}

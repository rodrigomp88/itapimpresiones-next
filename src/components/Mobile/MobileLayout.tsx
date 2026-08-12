"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileNavigation from "./MobileNavigation";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    // Si no es móvil, renderizar normalmente
    return <>{children}</>;
  }

  // Si es móvil, renderizar el mismo contenido pero optimizado para móvil
  return (
    <div className="relative">
      {/* Contenido principal optimizado para móvil */}
      <main className="min-h-screen">
        {/* El mismo contenido de la página pero con padding móvil */}
        <div className="px-4 pb-24">{children}</div>
      </main>

      {/* Navegación Bottom Bar */}
      <MobileNavigation />
    </div>
  );
};

export default MobileLayout;

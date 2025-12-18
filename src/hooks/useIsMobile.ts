"use client";

import { useState, useEffect } from "react";

/**
 * Hook personalizado para detectar si el dispositivo es móvil
 * @returns boolean - true si es móvil, false si es desktop
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para verificar si es móvil
    const checkIsMobile = () => {
      // Verificar por tamaño de pantalla
      const screenWidth = window.innerWidth;
      const isMobileBySize = screenWidth < 768;
      
      // Verificar por user agent
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'mobile', 'android', 'iphone', 'ipad', 'tablet', 
        'blackberry', 'windows phone', 'webos'
      ];
      const isMobileByUA = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      );

      // Verificar por capacidades táctiles
      const hasTouchScreen = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0;
      
      // Combinar todas las verificaciones
      const result = isMobileBySize || (isMobileByUA && hasTouchScreen);
      
      setIsMobile(result);
    };

    // Verificar al cargar
    checkIsMobile();

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

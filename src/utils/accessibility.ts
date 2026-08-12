"use client";

import { useRef, useEffect } from "react";

// ♿ UTILIDADES DE ACCESIBILIDAD

/**
 * Hook para manejar focus en modales y diálogos
 */
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Guardar el elemento que tenía el foco antes del modal
    const previousFocus = document.activeElement;

    // Enfocar el primer elemento del modal
    if (focusRef.current) {
      focusRef.current.focus();
    }

    // Restaurar el foco al cerrar
    return () => {
      if (previousFocus && previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, []);

  return focusRef;
};

/**
 * Hook para aria-live regions
 */
export const useAriaLive = () => {
  const announce = (message: string) => {
    const liveRegion = document.getElementById("aria-live-region");
    if (liveRegion) {
      liveRegion.textContent = message;
      // Limpiar después de un tiempo
      setTimeout(() => {
        liveRegion.textContent = "";
      }, 1000);
    }
  };

  return announce;
};

/**
 * Valida contraste de colores (simplificado)
 */
export const validateColorContrast = (
  foreground: string,
  background: string
): { ratio: number; isValid: boolean; level: "AA" | "AAA" | "FAIL" } => {
  // Conversión básica RGB a luminosidad
  const getLuminosity = (color: string): number => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminosity(foreground);
  const l2 = getLuminosity(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  if (ratio >= 7) return { ratio, isValid: true, level: "AAA" };
  if (ratio >= 4.5) return { ratio, isValid: true, level: "AA" };
  return { ratio, isValid: false, level: "FAIL" };
};

/**
 * Props para componentes accesibles
 */
export interface AccessibleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/**
 * Configuración de tamaños accesibles
 */
export const buttonSizes = {
  sm: "min-h-[32px] px-3 text-sm",
  md: "min-h-[40px] px-4 text-base",
  lg: "min-h-[48px] px-6 text-lg",
};

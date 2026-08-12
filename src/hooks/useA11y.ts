import { useEffect, useRef, useState } from "react";

/**
 * Hook para manejar la navegación por teclado
 */
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onSpace?: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          onEnter?.();
          break;
        case "Escape":
          onEscape?.();
          break;
        case " ":
          event.preventDefault();
          onSpace?.();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, onEscape, onSpace]);
};

/**
 * Hook para manejar el focus trapping en modales
 */
export const useFocusTrap = (isActive: boolean = false) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook para gestionar el live region (regiones dinámicas)
 */
export const useLiveRegion = (announcements: string[] = []) => {
  const [currentIndex, setCurrentIndex] = useState(-1);

  const announce = (message: string) => {
    announcements.push(message);
    setCurrentIndex(announcements.length - 1);
  };

  const currentMessage = currentIndex >= 0 ? announcements[currentIndex] : "";

  return { announce, currentMessage };
};

/**
 * Hook para detectar si el usuario está usando el teclado
 */
export const useKeyboardUser = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsKeyboardUser(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsKeyboardUser(true);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return isKeyboardUser;
};

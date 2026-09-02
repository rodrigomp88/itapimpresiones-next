"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Toggle de tema para las páginas de catálogo (portadas de la app).
 * Comparte el mismo mecanismo del landing: atributo data-theme en <html>
 * y persistencia en localStorage con la key "itap-theme".
 */
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") {
      setTheme(attr);
      return;
    }
    const stored = localStorage.getItem("itap-theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial =
      stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("itap-theme", next);
      } catch {}
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme };
}

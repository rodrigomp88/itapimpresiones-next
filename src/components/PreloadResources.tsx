"use client";

import { useEffect } from "react";

// Componente para preload de recursos críticos
const PreloadResources: React.FC = () => {
  useEffect(() => {
    // Preload de imágenes críticas
    const preloadCriticalImages = () => {
      const criticalImages = [
        "/images/logoblack.webp",
        "/images/logowhite.webp",
        "/images/carousel0.webp",
      ];

      criticalImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };

    preloadCriticalImages();
  }, []);

  return null;
};

export default PreloadResources;

'use client';

import { useEffect } from 'react';

// Componente para preload de recursos críticos
const PreloadResources: React.FC = () => {
  useEffect(() => {
    // Preload de fuentes críticas
    const preloadFonts = () => {
      const fontLinks = [
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
          rel: 'preload',
          as: 'style',
          onload: "this.onload=null;this.rel='stylesheet'"
        }
      ];

      fontLinks.forEach(font => {
        const link = document.createElement('link');
        link.href = font.href;
        link.rel = font.rel;
        link.as = font.as;
        if (font.onload) link.onload = new Function(font.onload) as any;
        document.head.appendChild(link);
      });
    };

    // Preload de imágenes críticas
    const preloadCriticalImages = () => {
      const criticalImages = [
        '/images/logoblack.png',
        '/images/logowhite.png',
        '/images/carousel0.png'
      ];

      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    // Preload de scripts importantes
    const preloadScripts = () => {
      // Preload Firebase scripts si es necesario
      const firebaseScript = document.createElement('link');
      firebaseScript.rel = 'preload';
      firebaseScript.href = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
      firebaseScript.as = 'script';
      document.head.appendChild(firebaseScript);
    };

    // Ejecutar preloads
    preloadFonts();
    preloadCriticalImages();
    preloadScripts();
  }, []);

  return null;
};

export default PreloadResources;

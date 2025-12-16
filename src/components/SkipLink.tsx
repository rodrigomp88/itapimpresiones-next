'use client';

import { useEffect, useState } from 'react';

const SkipLink: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Mostrar skip link cuando se presiona Tab desde el inicio
      if (e.key === 'Tab' && !isVisible) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      // Ocultar después de usarlo
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <a
      href="#main-content"
      className="fixed top-4 left-4 z-50 bg-primary text-white px-4 py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 hover:bg-primary/90"
      onClick={() => setIsVisible(false)}
    >
      Saltar al contenido principal
    </a>
  );
};

export default SkipLink;

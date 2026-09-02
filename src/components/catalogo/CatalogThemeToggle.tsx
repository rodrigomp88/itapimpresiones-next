'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

/**
 * Toggle claro/oscuro para el catálogo público.
 * Comparte el store global de tema con el resto de la app.
 */
export function CatalogThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full"
      onClick={toggleTheme}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      suppressHydrationWarning
    >
      {dark ? <Sun className="h-4.5 w-4.5" aria-hidden="true" /> : <Moon className="h-4.5 w-4.5" aria-hidden="true" />}
    </Button>
  );
}

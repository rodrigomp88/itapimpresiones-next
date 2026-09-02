'use client';

import { useState, useEffect } from 'react';
import { getPublicProducts, getPublicSettings } from '@/lib/public-products';
import { CatalogClient } from './CatalogClient';
import { CatalogTheme } from './CatalogTheme';
import type { PublicProduct } from '@/lib/public-products';
import type { BrandingSettings } from '@/hooks/use-settings';

export function CatalogPage() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [productsResult, settingsResult] = await Promise.all([
          getPublicProducts(200),
          getPublicSettings(),
        ]);
        if (cancelled) return;
        if (!settingsResult || !settingsResult.branding?.catalogEnabled) {
          setError(true);
          return;
        }
        setProducts(productsResult);
        setBranding(settingsResult.branding as BrandingSettings);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Cargando catálogo...</div>
      </div>
    );
  }

  if (error || !branding) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center px-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Catálogo no disponible</h1>
          <p className="text-muted-foreground">El catálogo no está habilitado o no se pudo cargar.</p>
        </div>
      </div>
    );
  }

  return (
    <CatalogTheme branding={branding}>
      <CatalogClient initialProducts={products} branding={branding} />
    </CatalogTheme>
  );
}

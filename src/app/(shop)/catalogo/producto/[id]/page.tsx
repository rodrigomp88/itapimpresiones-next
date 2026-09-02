'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPublicProducts, getPublicSettings } from '@/lib/public-products';
import { CatalogTheme } from '../../CatalogTheme';
import { ProductPageClient } from './ProductPageClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { PublicProduct } from '@/lib/public-products';
import type { SettingsValues } from '@/lib/config-schema';
import type { BrandingSettings } from '@/hooks/use-settings';

export default function ProductoPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [settings, setSettings] = useState<SettingsValues | null>(null);
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [products, publicSettings] = await Promise.all([
          getPublicProducts(200),
          getPublicSettings(),
        ]);
        if (cancelled) return;
        if (!publicSettings || !publicSettings.branding?.catalogEnabled) {
          setNotFound(true);
          return;
        }
        const found = products.find(p => p.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setProduct(found);
        setSettings(publicSettings);
        setBranding(publicSettings.branding as BrandingSettings);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Cargando producto...</div>
      </div>
    );
  }

  if (notFound || !product || !settings || !branding) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center px-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-4">El producto no está disponible o fue dado de baja.</p>
          <Link href="/catalogo">
            <Button variant="outline" className="gap-2 rounded-full">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CatalogTheme branding={branding}>
      <ProductPageClient product={product} settings={settings} branding={branding} />
    </CatalogTheme>
  );
}

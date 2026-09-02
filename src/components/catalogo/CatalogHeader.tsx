'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { BrandingSettings } from '@/hooks/use-settings';

interface CatalogHeaderProps {
  branding: BrandingSettings;
}

export function CatalogHeader({ branding }: CatalogHeaderProps) {
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo + back */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Volver al panel"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link href="/catalogo" className="flex items-center gap-2.5">
            {branding.logoUrl ? (
              <Image
                src={branding.logoUrl}
                alt={branding.businessName}
                width={28}
                height={28}
                className="object-contain"
                unoptimized
                sizes="28px"
              />
            ) : (
              <span className="font-display text-sm font-bold text-foreground">{branding.businessName}</span>
            )}
          </Link>
        </div>

        {/* Cart */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label={`Carrito de compras, ${itemCount} producto${itemCount !== 1 ? 's' : ''}`}
        >
          <ShoppingCart className="h-5 w-5 text-foreground" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center tabular-nums">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

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
    <header className="landing-nav landing-nav--shop">
      <Link href="/" className="landing-nav__brand" aria-label="Volver al inicio">
        {branding.logoUrl ? (
          <Image
            src={branding.logoUrl}
            alt={branding.businessName}
            width={150}
            height={44}
            className="landing-nav__logo"
            unoptimized
            sizes="150px"
          />
        ) : (
          <span className="font-display text-base font-extrabold text-foreground">
            {branding.businessName}
          </span>
        )}
      </Link>

      <div className="landing-nav__right">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="landing-nav__theme"
          aria-label={`Carrito de compras, ${itemCount} producto${itemCount !== 1 ? 's' : ''}`}
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-cta text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import type { BrandingSettings } from '@/hooks/use-settings';
import type { PublicProduct } from '@/lib/public-products';

interface CatalogHeroProps {
  branding: BrandingSettings;
  initialProducts: PublicProduct[];
  apparelCount: number;
  capsCount: number;
  bagsCount: number;
}

export function CatalogHero({ branding, initialProducts, apparelCount, capsCount, bagsCount }: CatalogHeroProps) {
  return (
    <section className="landing-hero landing-hero--catalog" aria-labelledby="catalog-hero-title">
      <span className="crop crop--tl" />
      <span className="crop crop--tr" />
      <span className="crop crop--bl" />
      <span className="crop crop--br" />
      <div className="landing-hero__mesh" />

      <p className="landing-block-label">Catálogo</p>

      <h1 id="catalog-hero-title" className="landing-hero__title">
        Impresión que <em>impacta</em>
      </h1>

      <div className="landing-hero__row">
        <p className="landing-hero__sub">
          <strong>
            {branding.businessName || 'ITAP Impresiones'}
          </strong>
          {' '}
          {branding.businessDescription || 'Indumentaria, bolsas y gorras personalizadas con tecnología DTF y serigrafía. Calidad que se siente.'}
        </p>

        <div className="landing-hero__actions">
          <button
            type="button"
            className="landing-btn landing-btn--solid"
            onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explorar Catálogo
            <ArrowDown className="h-4 w-4" />
          </button>
          <a href="/catalogo" className="landing-btn landing-btn--ghost">
            Volver al inicio
          </a>
        </div>
      </div>

      <div className="landing-hero__stats" aria-hidden="true">
        <div>
          <span className="stat-num">{initialProducts.length}+</span>
          <span className="stat-k">productos</span>
        </div>
        <div>
          <span className="stat-num">{apparelCount}</span>
          <span className="stat-k">indumentaria</span>
        </div>
        <div>
          <span className="stat-num">{bagsCount}</span>
          <span className="stat-k">bolsas</span>
        </div>
        <div>
          <span className="stat-num">{capsCount}</span>
          <span className="stat-k">gorras</span>
        </div>
      </div>
    </section>
  );
}

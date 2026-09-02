import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
    <section
      className="relative overflow-hidden rounded-card-lg mx-4 mt-4 sm:mx-6 sm:mt-6 bg-gradient-to-br from-primary via-primary/90 to-[#015a8a] text-white"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:px-10 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-5 text-center lg:text-left order-2 lg:order-1 justify-center">
            <h1
              id="hero-title"
              className="animate-float-in font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              style={{ animationDelay: '100ms' }}
            >
              Impresión que{' '}
              <span className="text-secondary">impacta</span>
            </h1>

            <p
              className="animate-float-in text-lg text-white/80 sm:text-xl max-w-lg mx-auto lg:mx-0"
              style={{ animationDelay: '200ms' }}
            >
              {branding.businessDescription || 'Indumentaria, bolsas y gorras personalizadas con tecnología DTF y serigrafía. Calidad que se siente.'}
            </p>

            <div className="animate-float-in flex flex-wrap gap-4 justify-center lg:justify-start" style={{ animationDelay: '300ms' }}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-float rounded-full px-8"
                onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explorar Catálogo
                <ArrowDown className="h-5 w-5" />
              </Button>
            </div>

            <div className="animate-float-in mt-4 flex flex-wrap gap-8 text-sm text-white/70 justify-center lg:justify-start" style={{ animationDelay: '400ms' }}>
              <div>
                <span className="block text-2xl font-bold text-white">{initialProducts.length}+</span>
                productos
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">{apparelCount}</span>
                indumentaria
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">{bagsCount}</span>
                bolsas
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">{capsCount}</span>
                gorras
              </div>
            </div>
          </div>

          <div className="relative lg:order-1 order-1 flex flex-col items-center gap-6">
            <div className="animate-float-in relative w-full max-w-sm h-48 sm:h-64" style={{ animationDelay: '250ms' }}>
              {branding.logoUrl && (
                <div className="relative aspect-square max-w-[200px] mx-auto">
                  <Image
                    src={branding.logoUrl}
                    alt={branding.businessName}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    unoptimized
                    sizes="200px"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

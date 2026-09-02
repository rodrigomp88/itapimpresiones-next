import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import type { BrandingSettings } from '@/hooks/use-settings';

interface CatalogClosingCTAProps {
  branding: BrandingSettings;
  lastUpdated?: string;
}

export function CatalogClosingCTA({ branding, lastUpdated }: CatalogClosingCTAProps) {
  return (
    <section className="relative overflow-hidden rounded-card-lg mx-4 mb-4 sm:mx-6 sm:mb-6 bg-gradient-to-r from-primary to-secondary text-white" aria-labelledby="closing-title">
      {/* Dot pattern texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:px-10 sm:py-16 flex flex-col items-center text-center gap-3">
        <h2 id="closing-title" className="font-display text-3xl sm:text-4xl font-bold">
          ¿Listo para tu próximo proyecto?
        </h2>
        <p className="text-lg text-white/80 max-w-md leading-relaxed">
          Contactanos y te armamos una cotización a medida.
        </p>
        {branding.whatsappNumber && (
          <Button
            size="lg"
            className="mt-4 gap-2 rounded-full bg-white text-primary hover:bg-white/90 shadow-float px-8"
            onClick={() => {
              const msg = branding.whatsappMessage.replace('{productName}', 'un pedido personalizado');
              window.open(`https://wa.me/${branding.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
            }}
            aria-label="Consultar por WhatsApp"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            Consultar por WhatsApp
          </Button>
        )}
        <p className="text-xs text-white/60 pt-4">
          {branding.businessName} · Catálogo de productos{lastUpdated ? ` · Actualizado ${new Date(lastUpdated).toLocaleDateString('es-AR')}` : ''}
        </p>
      </div>
    </section>
  );
}

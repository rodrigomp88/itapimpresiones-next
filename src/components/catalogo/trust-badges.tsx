'use client';

import { useRef, useState, useEffect } from 'react';
import { Truck, Shield, RotateCcw, Headphones, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Envío a todo el país',
    description: 'Recibí tu pedido donde estés.',
    cta: 'Consultar envíos',
  },
  {
    icon: Shield,
    title: 'Pago seguro',
    description: 'Pagá tus compras de forma rápida y segura.',
    cta: 'Medios de pago',
  },
  {
    icon: RotateCcw,
    title: 'Garantía de calidad',
    description: 'Si no te gusta, lo resolvemos.',
    cta: 'Conocer más',
  },
  {
    icon: Headphones,
    title: 'Asesoramiento',
    description: 'Te asesoramos en cada paso del proceso.',
    cta: 'Contactar',
  },
  {
    icon: FileText,
    title: 'Presupuestos',
    description: 'Pedí tu presupuesto sin compromiso.',
    cta: 'Solicitar',
  },
];

export function TrustBadges() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <section id="confianza" className="py-8 sm:py-12" aria-label="¿Por qué elegirnos?">
      <div className="relative px-3 sm:px-6">
        <div
          ref={scrollRef}
          className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1"
        >
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="flex-none w-[42vw] sm:w-52 lg:flex-1 snap-start rounded-2xl bg-muted/40 border border-border/60 flex flex-col overflow-hidden"
                style={{ aspectRatio: '1 / 2' }}
              >
                {/* Icon area */}
                <div className="flex-1 flex items-center justify-center px-3 pt-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" aria-hidden="true" />
                  </div>
                </div>

                {/* Text content */}
                <div className="px-3 pb-3 flex flex-col items-center gap-1.5">
                  <h3 className="font-bold text-[11px] sm:text-xs text-primary text-center leading-snug uppercase tracking-wide">{badge.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed text-center">{badge.description}</p>
                  <button
                    type="button"
                    className="mt-1 text-[10px] sm:text-[11px] font-semibold text-white bg-primary rounded-full px-3 py-1.5 hover:bg-primary/90 transition-colors"
                  >
                    {badge.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll arrows */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center hover:bg-background transition-colors lg:hidden"
            aria-label="Ver tarjetas anteriores"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={scrollRight}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center hover:bg-background transition-colors lg:hidden"
            aria-label="Ver más tarjetas"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        )}
      </div>
    </section>
  );
}

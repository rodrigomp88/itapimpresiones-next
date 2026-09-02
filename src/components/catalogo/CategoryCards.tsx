'use client';

import { ShoppingBag, Shirt, Crown, Sparkles } from 'lucide-react';
import type { PublicProduct } from '@/lib/public-products';

interface CategoryCardsProps {
  products: PublicProduct[];
  activeFilter: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  {
    key: 'Indumentaria',
    label: 'Indumentaria',
    icon: Shirt,
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    overlay: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
  },
  {
    key: 'Bolsas',
    label: 'Bolsas',
    icon: ShoppingBag,
    gradient: 'from-emerald-600 via-emerald-500 to-teal-400',
    overlay: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
  },
  {
    key: 'Gorras',
    label: 'Gorras',
    icon: Crown,
    gradient: 'from-amber-600 via-orange-500 to-yellow-400',
    overlay: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
  },
  {
    key: 'Proximo',
    label: 'Próximo',
    icon: Sparkles,
    gradient: 'from-purple-600 via-fuchsia-500 to-pink-400',
    overlay: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
    disabled: true,
  },
];

function countByCategory(products: PublicProduct[], key: string): number {
  return products.filter(p => {
    if (key === 'Indumentaria') return p.type === 'apparel' && p.visualType !== 'cap';
    if (key === 'Bolsas') return p.type === 'bags';
    if (key === 'Gorras') return p.type === 'apparel' && p.visualType === 'cap';
    return false;
  }).length;
}

export function CategoryCards({ products, activeFilter, onSelectCategory }: CategoryCardsProps) {
  return (
    <section className="px-4 sm:px-6 pt-5 pb-1" aria-label="Categorías">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = countByCategory(products, cat.key);
          const isActive = activeFilter === cat.key;
          const isDisabled = cat.disabled;

          return (
            <button
              key={cat.key}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelectCategory(isActive ? 'Todos' : cat.key)}
              className={`group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-start justify-end p-5 sm:p-6 text-left transition-all duration-300 ${
                isDisabled
                  ? 'opacity-60 cursor-not-allowed'
                  : isActive
                    ? 'ring-2 ring-white shadow-lg scale-[1.02]'
                    : 'hover:shadow-lg hover:-translate-y-0.5'
              }`}
              aria-label={`${cat.label}${count > 0 ? ` (${count} productos)` : ''}${isDisabled ? ' — próximamente' : ''}`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />

              {/* Pattern overlay for texture */}
              <div className="absolute inset-0 opacity-20" aria-hidden="true" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)',
                backgroundSize: '16px 16px'
              }} />

              {/* Dark overlay for text readability */}
              <div className={`absolute inset-0 ${cat.overlay}`} />

              {/* Icon watermark — large, faded */}
              <Icon
                className="absolute top-4 right-4 h-20 w-20 sm:h-24 sm:w-24 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative z-10 w-full">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" aria-hidden="true" />
                  <span className="text-white font-bold text-lg sm:text-xl tracking-tight">{cat.label}</span>
                </div>
                {isDisabled ? (
                  <span className="text-white/70 text-sm font-medium">Próximamente</span>
                ) : (
                  <span className="text-white/80 text-sm">
                    {count} producto{count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Active indicator */}
              {isActive && !isDisabled && (
                <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-white shadow-sm" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

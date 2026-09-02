'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye, GitCompare, Info, PackageCheck } from 'lucide-react';
import type { PublicProduct } from '@/lib/public-products';
import { formatPriceARS } from '@/lib/formatters';
import { ToteBagDiagram, KidneyBagDiagram } from '@/components/apparel/diagrams';

// Map visualType to diagram SVGs (for apparel)
function getDiagramSvg(visualType?: string): string {
  const diagramMap: Record<string, string> = {
    'tshirt': '/images/diagrams/tshirt-front.svg',
    'tank-top': '/images/diagrams/tank-top-front.svg',
    'polo': '/images/diagrams/polo-front.svg',
    'long-sleeve': '/images/diagrams/long-sleeve-front.svg',
    'jacket-nohood': '/images/diagrams/jacket-nohood-front.svg',
    'jacket-hood': '/images/diagrams/jacket-hood-front.svg',
    'hoodie-rn': '/images/diagrams/hoodie-rn-front.svg',
    'hoodie-hood': '/images/diagrams/hoodie-hood-front.svg',
    'cap': '/images/diagrams/cap.svg',
  };

  return diagramMap[visualType || 'tshirt'] || '/images/diagrams/tshirt-front.svg';
}

interface ProductCardProps {
  product: PublicProduct;
  /** Precio calculado "desde" (con settings); fallback: precioLista */
  desdePrice?: number;
  /** Cantidad mínima para este producto */
  minQty?: number;
  onAddToCompare?: (product: PublicProduct) => void;
  onViewDetail: (product: PublicProduct) => void;
}

const techniqueColors: Record<string, string> = {
  'DTF': 'bg-primary',
  'Serigrafía': 'bg-secondary',
  'Sublimación': 'bg-accent',
  'Bordado': 'bg-tertiary',
};

export function ProductCard({ product, onAddToCompare, onViewDetail, desdePrice, minQty }: ProductCardProps) {
  const name = product.type === 'apparel' ? product.producto : (product.nombreDisplay || product.material);
  const diagramSvg = getDiagramSvg(product.visualType);
  const baseTechnique = product.tipoImpresion?.[0] || (product.type === 'bags' ? 'Serigrafía' : 'DTF');
  const inStock = product.estado === 'en_stock';
  const techniqueColor = techniqueColors[baseTechnique] || 'bg-primary';

  return (
    <article
      className="group rounded-card bg-card card-border shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onViewDetail(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetail(product); }}
      aria-label={`Ver detalles de ${name}`}
    >
      {/* Technique color strip */}
      <div className={`h-1 ${techniqueColor}`} aria-hidden="true" />

      <div className="relative aspect-[4/3] overflow-hidden bg-muted hover-zoom">
        {product.imagenUrl ? (
          <Image
            src={product.imagenUrl}
            alt={product.producto || product.material}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-4 bg-muted/50">
            {product.type === 'bags' ? (
              product.tipoManija?.toLowerCase().includes('riñ') ? (
                <KidneyBagDiagram className="w-full h-full text-muted-foreground opacity-60" />
              ) : (
                <ToteBagDiagram className="w-full h-full text-muted-foreground opacity-60" />
              )
            ) : (
              <Image
                src={diagramSvg}
                alt={`${name} - visualización por defecto`}
                fill
                className="w-full h-full object-contain p-4 opacity-60"
                unoptimized
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg leading-snug">{name}</h3>

        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-lg text-foreground leading-tight">
              Desde <span className="text-primary">{formatPriceARS(desdePrice ?? product.precioLista)}</span>/u
            </p>
            <span className="text-muted-foreground" title={`Precio para ${minQty && minQty > 1 ? `${minQty} unidades` : '1 unidad'} en técnica ${baseTechnique}`}>
              <Info className="h-4 w-4" />
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {minQty && minQty > 1 ? `Mín. ${minQty} u. · ` : ''}{inStock ? 'Disponible' : 'A pedido'} · 3-5 días hábiles
          </p>
        </div>

        {!!product.tipoImpresion?.length && (
          <div className="flex flex-wrap gap-1">
            {product.tipoImpresion.map(t => (
              <span key={t} className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        {inStock && (
          <div className="flex items-center gap-1 text-xs font-medium text-secondary">
            <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Stock disponible
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); onViewDetail(product); }}
            aria-label={`Ver detalles de ${name}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Detalles
          </Button>
          {onAddToCompare && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary"
              onClick={(e) => { e.stopPropagation(); onAddToCompare(product); }}
              aria-label={`Agregar ${name} a comparador`}
              title="Agregar a comparador"
            >
              <GitCompare className="h-4.5 w-4.5" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
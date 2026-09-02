'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CatalogGarmentVisualizer, type CatalogCustomZone } from '@/components/catalogo/CatalogGarmentVisualizer';
import type { PublicProduct } from '@/lib/public-products';

export interface FichaRow {
  label: string;
  value: string | undefined;
}

interface CatalogProductGalleryProps {
  product: PublicProduct;
  name: string;
  viewMode: 'esquema' | 'foto';
  setViewMode: (mode: 'esquema' | 'foto') => void;
  selectedColor?: string;
  visualSelectedAreas: string[];
  customZones: CatalogCustomZone[];
  stampDims?: Record<string, string>;
  sizeSummary?: string;
  onCustomZoneMove: (id: string, xPercent: number, yPercent: number) => void;
  infoTab: 'info' | 'specs' | 'howto' | 'faq';
  setInfoTab: (tab: 'info' | 'specs' | 'howto' | 'faq') => void;
  fichaRows: FichaRow[];
}

export function CatalogProductGallery({
  product,
  name,
  viewMode,
  setViewMode,
  selectedColor,
  visualSelectedAreas,
  customZones,
  stampDims,
  sizeSummary,
  onCustomZoneMove,
  infoTab,
  setInfoTab,
  fichaRows,
}: CatalogProductGalleryProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {product.imagenUrl && (
          <div className="flex justify-center">
            <div className="inline-flex bg-muted/40 p-1" role="group" aria-label="Modo de vista">
              <Button type="button" variant={viewMode === 'esquema' ? 'default' : 'ghost'} size="sm" className="rounded-full h-8 px-4 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => setViewMode('esquema')} aria-pressed={viewMode === 'esquema'}>
                Esquema
              </Button>
              <Button type="button" variant={viewMode === 'foto' ? 'default' : 'ghost'} size="sm" className="rounded-full h-8 px-4 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => setViewMode('foto')} aria-pressed={viewMode === 'foto'}>
                Foto
              </Button>
            </div>
          </div>
        )}

        {viewMode === 'foto' && product.imagenUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image src={product.imagenUrl} alt={name} fill className="object-cover" unoptimized sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        ) : (
          <CatalogGarmentVisualizer
            product={product}
            color={selectedColor}
            selectedAreas={visualSelectedAreas}
            customZones={customZones}
            stampDims={stampDims}
            sizeSummary={sizeSummary}
            onCustomZoneMove={onCustomZoneMove}
          />
        )}
      </div>

      {/* Ficha técnica — debajo del visualizador */}
      <section className="bg-card shadow-card dark:shadow-card-dark overflow-hidden" aria-labelledby="ficha-title">
        <div className="overflow-x-auto">
          <div className="flex min-w-max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Información del producto">
            {([
              ['info', 'Información'], ['specs', 'Especificaciones'], ['howto', 'Cómo pedir'], ['faq', 'Preguntas frecuentes'],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" role="tab" aria-selected={infoTab === value} onClick={() => setInfoTab(value)}
                className={`w-full py-3 text-sm font-medium transition-colors ${infoTab === value ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 min-h-40">
          {infoTab === 'info' && <div><h2 id="ficha-title" className="text-lg font-bold mb-3">Descripción</h2><p className="text-sm text-muted-foreground leading-relaxed">{product.descripcion || product.caracteristicas_tela || product.uso_recomendado || 'Producto personalizable a pedido.'}</p>{product.descripcionBullets && product.descripcionBullets.length > 0 && <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{product.descripcionBullets.map(bullet => <li key={bullet} className="flex gap-2"><span className="text-primary" aria-hidden="true">•</span><span>{bullet}</span></li>)}</ul>}</div>}
          {infoTab === 'specs' && <div><h2 className="text-lg font-bold mb-4">Especificaciones del producto</h2><dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">{fichaRows.map(row => <div key={row.label}><dt className="text-xs font-medium text-muted-foreground">{row.label}</dt><dd className="text-sm text-foreground mt-0.5">{row.value || 'Consultar'}</dd></div>)}</dl></div>}
          {infoTab === 'howto' && <div className="space-y-6"><div><h2 className="text-lg font-bold mb-3">Normas de diseño</h2><p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.normasDiseno || 'Subí archivos PNG, JPG o WebP con buena resolución y fondo transparente cuando corresponda. La muestra es orientativa y el equipo puede solicitar ajustes antes de producir.'}</p></div><div><h2 className="text-lg font-bold mb-3">Proceso de pedido</h2><p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.procesoPedido || '1. Elegí producto, técnica, área y cantidades.\n2. Subí tu diseño y agregá indicaciones.\n3. Revisá y aprobá la muestra visual.\n4. Enviamos el pedido para confirmar disponibilidad y producción.'}</p></div></div>}
          {infoTab === 'faq' && <div><h2 className="text-lg font-bold mb-4">Preguntas frecuentes</h2><div className="space-y-4">{(product.preguntasFrecuentes || [{ pregunta: '¿Puedo pedir más de un talle?', respuesta: 'Sí, indicá la cantidad correspondiente en cada talle.' }, { pregunta: '¿La muestra visual es definitiva?', respuesta: 'Es una referencia; confirmamos cualquier ajuste técnico antes de producir.' }]).map(item => <div key={item.pregunta}><p className="text-sm font-semibold">{item.pregunta}</p><p className="text-sm text-muted-foreground mt-1">{item.respuesta}</p></div>)}</div></div>}
        </div>
      </section>
    </div>
  );
}

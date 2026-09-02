'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { SizeCatKey } from '@/components/catalogo/catalog-utils';
import { MANIJA_LABELS } from '@/components/catalogo/catalog-utils';
import { formatPriceARS } from '@/lib/formatters';
import { colorHexResolved } from '@/lib/color-map';

interface SizeGroup {
  key: SizeCatKey;
  label: string;
  sizes: string[];
}

interface CatalogFiltersSidebarProps {
  clearAllFilters: () => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  maxPrice: number;
  sizeGroups: SizeGroup[];
  selectedSizeKeys: string[];
  setSelectedSizeKeys: React.Dispatch<React.SetStateAction<string[]>>;
  allTechniques: (string | undefined)[];
  selectedTechniques: string[];
  setSelectedTechniques: React.Dispatch<React.SetStateAction<string[]>>;
  allColors: string[];
  selectedColors: string[];
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
  allBagTypes: (string | undefined)[];
  selectedBagTypes: string[];
  setSelectedBagTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

export function CatalogFiltersSidebar({
  clearAllFilters, priceRange, setPriceRange, maxPrice,
  sizeGroups, selectedSizeKeys, setSelectedSizeKeys,
  allTechniques, selectedTechniques, setSelectedTechniques,
  allColors, selectedColors, setSelectedColors,
  allBagTypes, selectedBagTypes, setSelectedBagTypes,
}: CatalogFiltersSidebarProps) {
  const selectedSizeSet = useMemo(() => new Set(selectedSizeKeys), [selectedSizeKeys]);
  const selectedTechniquesSet = useMemo(() => new Set(selectedTechniques), [selectedTechniques]);
  const selectedColorsSet = useMemo(() => new Set(selectedColors), [selectedColors]);
  const selectedBagTypesSet = useMemo(() => new Set(selectedBagTypes), [selectedBagTypes]);

  return (
    <aside id="filters-sidebar" className="lg:col-span-1 space-y-6" aria-label="Filtros de productos">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Filtros</h2>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={clearAllFilters}
        >
          <X className="h-4 w-4 mr-1" aria-hidden="true" /> Limpiar
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="label-sm font-medium text-foreground mb-2 block">Rango de precio</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPriceARS(priceRange[0])}</span>
              <span>{formatPriceARS(priceRange[1])}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={e => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                 className="flex-1 accent-primary h-2 bg-muted appearance-none cursor-pointer"
                aria-label="Precio mínimo"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                className="flex-1 accent-primary h-2 bg-muted appearance-none cursor-pointer"
                aria-label="Precio máximo"
              />
            </div>
          </div>
        </div>

        {sizeGroups.length > 0 && (
          <div className="space-y-4">
            <h3 className="label-sm font-medium text-foreground block" id="talles-label">Talles</h3>
            {sizeGroups.map(group => (
              <div key={group.key}>
                <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">{group.label}</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="talles-label">
                  {group.sizes.map(size => {
                    const key = `${group.key}:${size}`;
                    const active = selectedSizeSet.has(key);
                    return (
                      <Button
                        key={key}
                        type="button"
                        variant={active ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full px-2.5 py-1 text-xs h-9 font-medium"
                        onClick={() => setSelectedSizeKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
                        aria-pressed={active}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {allTechniques.length > 0 && (
          <div>
            <p className="label-sm font-medium text-foreground mb-2 block">Técnica</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Técnicas de impresión">
              {allTechniques.filter((t): t is string => Boolean(t)).map((tech) => (
                <Button
                  key={tech}
                  type="button"
                  variant={selectedTechniquesSet.has(tech) ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full px-2.5 py-1 text-xs h-9 font-medium"
                  onClick={() => setSelectedTechniques(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech])}
                  aria-pressed={selectedTechniquesSet.has(tech)}
                >
                  {tech}
                </Button>
              ))}
            </div>
          </div>
        )}

        {allColors.length > 0 && (
          <div>
            <p className="label-sm font-medium text-foreground mb-2 block">Colores</p>
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Colores">
              {allColors.map(color => {
                const active = selectedColorsSet.has(color);
                const hex = colorHexResolved(color);
                return (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    aria-label={`Color ${color}`}
                    aria-pressed={active}
                    onClick={() => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])}
                    className={`h-7 w-7 rounded-full border transition-[box-shadow,ring] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? 'ring-2 ring-ring ring-offset-2 border-transparent' : 'border-black/10 hover:ring-2 hover:ring-ring/40 hover:ring-offset-1'}`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {allBagTypes.length > 0 && (
          <div>
            <p className="label-sm font-medium text-foreground mb-2 block">Tipo de manija</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tipos de manija">
              {allBagTypes.filter((t): t is string => Boolean(t)).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={selectedBagTypesSet.has(type) ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full px-2.5 py-1 text-xs h-9 font-medium"
                  onClick={() => setSelectedBagTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                  aria-pressed={selectedBagTypesSet.has(type)}
                >
                  {MANIJA_LABELS[type] ?? type}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full rounded-full"
        onClick={clearAllFilters}
      >
        <X className="h-4 w-4 mr-2" aria-hidden="true" /> Limpiar todos los filtros
      </Button>
    </aside>
  );
}

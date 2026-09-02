'use client';

import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CatalogThemeToggle } from '@/components/catalogo/CatalogThemeToggle';
import type { ActiveChip } from '@/components/catalogo/catalog-utils';

interface CatalogSearchBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  sortBy: 'name' | 'price-low' | 'price-high';
  setSortBy: (v: 'name' | 'price-low' | 'price-high') => void;
  showFilters: boolean;
  setShowFilters: (v: boolean | ((prev: boolean) => boolean)) => void;
  activeChips: ActiveChip[];
}

export function CatalogSearchBar({
  searchQuery, setSearchQuery,
  viewMode, setViewMode, sortBy, setSortBy, showFilters, setShowFilters, activeChips,
}: CatalogSearchBarProps) {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-80">
            <label htmlFor="search-input" className="sr-only">Buscar productos</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              id="search-input"
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
              aria-label="Buscar productos"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-muted p-1 shadow-inner" role="group" aria-label="Vista">
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-10 w-10 rounded-full transition"
                onClick={() => setViewMode('grid')}
                aria-label="Vista cuadrícula"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="h-4.5 w-4.5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-10 w-10 rounded-full transition"
                onClick={() => setViewMode('list')}
                aria-label="Vista lista"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-4.5 w-4.5" aria-hidden="true" />
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="h-9 px-2 py-1 text-xs bg-background text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition cursor-pointer"
                aria-label="Ordenar productos"
              >
                <option value="name">A-Z</option>
                <option value="price-low">Menor precio</option>
                <option value="price-high">Mayor precio</option>
              </select>
            </div>

            <Button
              type="button"
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              className="h-10 gap-2 rounded-full relative"
              onClick={() => setShowFilters(v => !v)}
              aria-expanded={showFilters}
              aria-controls="filters-sidebar"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" aria-hidden="true" />
              Filtros
              {activeChips.length > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full text-xs font-bold flex items-center justify-center ${showFilters ? 'bg-primary text-primary-foreground' : 'bg-primary text-white'}`}>
                  {activeChips.length}
                </span>
              )}
            </Button>

            <CatalogThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

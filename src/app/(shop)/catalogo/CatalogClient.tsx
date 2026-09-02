'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductListSection } from '@/components/catalogo/ProductListSection';
import { InquireModal } from '@/components/catalogo/InquireModal';
import { CatalogHeader } from '@/components/catalogo/CatalogHeader';
import { AnnouncementBar } from '@/components/catalogo/AnnouncementBar';
import { WhatsAppFloat } from '@/components/catalogo/WhatsAppFloat';
import { CartDrawer } from '@/components/catalogo/CartDrawer';
import { SizeGuideModal } from '@/components/catalogo/SizeGuideModal';
import { PublicBudgetBuilder } from '@/components/catalogo/PublicBudgetBuilder';
import { CheckoutModal } from '@/components/catalogo/CheckoutModal';
import { CatalogHero } from '@/components/catalogo/CatalogHero';
import { CatalogSearchBar } from '@/components/catalogo/CatalogSearchBar';
import { CategoryCards } from '@/components/catalogo/CategoryCards';
import { CatalogFiltersSidebar } from '@/components/catalogo/CatalogFiltersSidebar';
import { CatalogCompareDialog } from '@/components/catalogo/CatalogCompareDialog';
import { CatalogClosingCTA } from '@/components/catalogo/CatalogClosingCTA';
import { TrustBadges } from '@/components/catalogo/trust-badges';
import type { PublicProduct } from '@/lib/public-products';
import type { BrandingSettings } from '@/hooks/use-settings';
import type { SettingsValues } from '@/lib/config-schema';
import {
  ITEMS_PER_PAGE,
  productSizeCategory,
  sortSizes,
  canonColor,
  buildActiveChips,
  filterProducts,
  computeMinQtys,
  computeDesdePrices,
  type SizeCatKey,
  SIZE_CAT_LABELS,
} from '@/components/catalogo/catalog-utils';

interface CatalogClientProps {
  initialProducts: PublicProduct[];
  branding: BrandingSettings;
  lastUpdated?: string;
}

function CatalogClientInner({ initialProducts, branding, lastUpdated }: CatalogClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [compareProducts, setCompareProducts] = useState<PublicProduct[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const router = useRouter();
  const [catalogSettings, setCatalogSettings] = useState<SettingsValues | null>(null);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetInitialProduct] = useState<PublicProduct | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedSizeKeys, setSelectedSizeKeys] = useState<string[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBagTypes, setSelectedBagTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<PublicProduct[]>([]);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      try {
        const { getPublicSettings } = await import('@/lib/public-products');
        const data = await getPublicSettings();
        if (!cancelled && data) setCatalogSettings(data);
      } catch { /* settings load is non-critical */ }
    }
    loadSettings();
    return () => { cancelled = true; };
  }, []);

  const sizeGroups = useMemo(() => {
    const buckets = new Map<SizeCatKey, Set<string>>();
    initialProducts.forEach(p => {
      if (p.type !== 'apparel' || p.sizes.length === 0) return;
      const cat = productSizeCategory(p.producto);
      if (!buckets.has(cat)) buckets.set(cat, new Set());
      p.sizes.forEach(s => buckets.get(cat)!.add(s.talle));
    });
    const order: SizeCatKey[] = ['ninos', 'damas', 'adultos', 'especiales'];
    return order
      .filter(k => buckets.has(k))
      .map(k => ({
        key: k,
        label: SIZE_CAT_LABELS[k],
        sizes: [...buckets.get(k)!].sort(sortSizes),
      }));
  }, [initialProducts]);

  const allTechniques = useMemo(() => [...new Set(initialProducts.flatMap(p => p.tipoImpresion ?? []))], [initialProducts]);
  const allColors = useMemo(() => [...new Set(initialProducts.flatMap(p => p.colors.map(canonColor)))].sort(), [initialProducts]);
  const allBagTypes = useMemo(() => [...new Set(initialProducts.reduce<string[]>((acc, p) => { if (p.type === 'bags' && p.tipoManija) acc.push(p.tipoManija); return acc; }, []))], [initialProducts]);
  const maxPrice = useMemo(() => Math.max(...initialProducts.map(p => p.precioLista), 100000), [initialProducts]);
  const { apparelCount, bagsCount, capsCount } = useMemo(() => initialProducts.reduce(
    (acc, p) => {
      if (p.type === 'apparel' && p.visualType !== 'cap') acc.apparelCount++;
      if (p.type === 'bags') acc.bagsCount++;
      if (p.type === 'apparel' && p.visualType === 'cap') acc.capsCount++;
      return acc;
    },
    { apparelCount: 0, bagsCount: 0, capsCount: 0 }
  ), [initialProducts]);

  const minQtys = useMemo(() => computeMinQtys(initialProducts, catalogSettings), [initialProducts, catalogSettings]);
  const desdePrices = useMemo(() => computeDesdePrices(initialProducts, catalogSettings, minQtys), [initialProducts, catalogSettings, minQtys]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('Todos');
    setPriceRange([0, maxPrice]);
    setSelectedSizeKeys([]);
    setSelectedTechniques([]);
    setSelectedColors([]);
    setSelectedBagTypes([]);
  }, [maxPrice]);

  const activeChips = useMemo(() => buildActiveChips({
    searchQuery, setSearchQuery, activeFilter, setActiveFilter,
    priceRange, setPriceRange, maxPrice,
    selectedSizeKeys, setSelectedSizeKeys,
    selectedTechniques, setSelectedTechniques,
    selectedColors, setSelectedColors,
    selectedBagTypes, setSelectedBagTypes,
  }), [searchQuery, activeFilter, priceRange, maxPrice, selectedSizeKeys, selectedTechniques, selectedColors, selectedBagTypes]);

  const filtered = useMemo(() => filterProducts(initialProducts, {
    searchQuery, activeFilter, priceRange, selectedSizeKeys,
    selectedTechniques, selectedColors, selectedBagTypes, sortBy,
  }), [initialProducts, searchQuery, activeFilter, priceRange, selectedSizeKeys, selectedTechniques, selectedColors, selectedBagTypes, sortBy]);

  useEffect(() => {
    let cancelled = false;
    const initialSlice = filtered.slice(0, ITEMS_PER_PAGE);
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setDisplayedProducts(initialSlice);
        setPage(1);
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [filtered]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = nextPage * ITEMS_PER_PAGE;
    const newProducts = filtered.slice(start, end);
    if (newProducts.length > 0) {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
    }
  }, [page, filtered]);

  useEffect(() => {
    if (displayedProducts.length >= filtered.length) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayedProducts.length < filtered.length) {
        loadMore();
      }
    }, { threshold: 0.1, rootMargin: '100px' });
    if (lastElementRef.current) observer.current.observe(lastElementRef.current);
    return () => { if (observer.current) observer.current.disconnect(); };
  }, [displayedProducts.length, filtered.length, loadMore]);

  const handleInquire = (product: PublicProduct) => {
    setSelectedProduct(product);
  };

  const handleViewDetail = (product: PublicProduct) => {
    router.push(`/catalogo/producto/${product.id}`);
  };

  const addToCompare = (product: PublicProduct) => {
    setCompareProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
    setShowCompare(true);
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => setCompareProducts([]);

  const hasMore = displayedProducts.length < filtered.length;

  return (
    <div className="flex flex-col min-h-screen bg-background catalog-noise-bg">
      <a
        href="#product-list"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 shadow-lg font-medium"
      >
        Saltar al contenido principal
      </a>

      <AnnouncementBar branding={branding} />

      <CatalogHeader branding={branding} />

      <CatalogHero
        branding={branding}
        initialProducts={initialProducts}
        apparelCount={apparelCount}
        capsCount={capsCount}
        bagsCount={bagsCount}
      />

      <CatalogSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeChips={activeChips}
      />

      <CategoryCards
        products={initialProducts}
        activeFilter={activeFilter}
        onSelectCategory={setActiveFilter}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-5" id="product-list">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {showFilters && (
            <CatalogFiltersSidebar
              clearAllFilters={clearAllFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              sizeGroups={sizeGroups}
              selectedSizeKeys={selectedSizeKeys}
              setSelectedSizeKeys={setSelectedSizeKeys}
              allTechniques={allTechniques}
              selectedTechniques={selectedTechniques}
              setSelectedTechniques={setSelectedTechniques}
              allColors={allColors}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              allBagTypes={allBagTypes}
              selectedBagTypes={selectedBagTypes}
              setSelectedBagTypes={setSelectedBagTypes}
            />
          )}

          <ProductListSection
            initialProducts={initialProducts}
            filteredProducts={filtered}
            displayedProducts={displayedProducts}
            hasMore={hasMore}
            viewMode={viewMode}
            loadMore={loadMore}
            lastElementRef={lastElementRef}
            onInquire={handleInquire}
            onAddToCompare={addToCompare}
            onViewDetail={handleViewDetail}
            activeChips={activeChips}
            desdePrices={desdePrices}
            minQtys={minQtys}
            onClearAllFilters={clearAllFilters}
            fullWidth={!showFilters}
          />
        </div>
      </main>

      <TrustBadges />

      <CatalogClosingCTA branding={branding} lastUpdated={lastUpdated} />

      <CatalogCompareDialog
        open={showCompare}
        onOpenChange={setShowCompare}
        compareProducts={compareProducts}
        removeFromCompare={removeFromCompare}
        clearCompare={clearCompare}
        branding={branding}
      />

      <InquireModal
        open={!!selectedProduct}
        onOpenChange={(v) => { if (!v) setSelectedProduct(null); }}
        product={selectedProduct}
        branding={branding}
      />

      <SizeGuideModal
        open={showSizeGuide}
        onOpenChange={setShowSizeGuide}
        title={branding.sizeGuideTitle || 'Guía de Talles'}
        imageUrl={branding.sizeGuideImageUrl}
      />

      <PublicBudgetBuilder
        open={budgetOpen}
        onOpenChange={setBudgetOpen}
        products={initialProducts}
        branding={branding}
        initialProduct={budgetInitialProduct}
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />

      <CartDrawer onGoToCheckout={() => setCheckoutOpen(true)} />

      <WhatsAppFloat branding={branding} />
    </div>
  );
}

export function CatalogClient({ initialProducts, branding, lastUpdated }: CatalogClientProps) {
  return (
    <CatalogClientInner
      initialProducts={initialProducts}
      branding={branding}
      lastUpdated={lastUpdated}
    />
  );
}

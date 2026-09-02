'use client';

import Link from 'next/link';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ChevronLeft } from 'lucide-react';
import { useCatalogProductPage } from '@/hooks/use-catalog-product-page';
import { CatalogProductGallery } from './CatalogProductGallery';
import { CatalogProductConfigurator } from './CatalogProductConfigurator';
import { CatalogProductDialogs } from './CatalogProductDialogs';
import type { PublicProduct } from '@/lib/public-products';
import type { SettingsValues } from '@/lib/config-schema';
import type { BrandingSettings } from '@/hooks/use-settings';

interface ProductPageClientProps {
  product: PublicProduct;
  settings: SettingsValues;
  branding: BrandingSettings;
}

export function ProductPageClient({ product, settings, branding }: ProductPageClientProps) {
  const state = useCatalogProductPage(product, settings, branding);

  const {
    isBag, isCap, name,
    viewMode, setViewMode,
    selectedColor, setSelectedColor,
    activeTechnique, handleTechniqueChange,
    tecnicas, minQty, presets, totalQty, qty, setQty, sizeQty, handleSizeQty, handleQuantityPreset,
    sizeSummary, unitPrice, total, priceResult,
    colorsExpanded, setColorsExpanded,
    selectedAreas, selectedAreasSet, toggleArea, setSelectedAreas,
    availableZones, hasPrintAreaSection,
    customZones, removeCustomZone, setShowZoneDialog,
    packPremium, setPackPremium,
    handleAddToCart, addedToCart, handleOpenDesign,
    designAreas, allAreasHaveArtwork,
    designOpen, setDesignOpen,
    designStep, setDesignStep,
    designNotes, setDesignNotes,
    designApproved, setDesignApproved,
    uploadingDesign, artwork, setArtwork, handleArtworkChange, resetArtworkFiles,
    showZoneDialog, zoneForm, setZoneForm, addCustomZone,
    checkoutOpen, setCheckoutOpen,
    visualSelectedAreas, handleCustomZoneMove,
    infoTab, setInfoTab,
    fichaRows,
  } = state;

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-16">
        <main className="max-w-6xl mx-auto px-4 pt-20 pb-10">
          {/* Breadcrumb */}
          <nav aria-label="Navegación" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/catalogo" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Catálogo
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground font-medium">{isBag ? 'Bolsas' : isCap ? 'Gorras' : 'Indumentaria'}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Columna izquierda: visualizador + ficha técnica */}
            <CatalogProductGallery
              product={product}
              name={name}
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedColor={selectedColor}
              visualSelectedAreas={visualSelectedAreas}
              customZones={customZones}
              stampDims={priceResult?.stampDims}
              sizeSummary={sizeSummary}
              onCustomZoneMove={handleCustomZoneMove}
              infoTab={infoTab}
              setInfoTab={setInfoTab}
              fichaRows={fichaRows}
            />

            {/* Columna derecha: configuración */}
            <CatalogProductConfigurator
              product={product}
              branding={branding}
              isBag={isBag}
              isCap={isCap}
              name={name}
              activeTechnique={activeTechnique}
              handleTechniqueChange={handleTechniqueChange}
              tecnicas={tecnicas}
              minQty={minQty}
              totalQty={totalQty}
              qty={qty}
              setQty={setQty}
              sizeQty={sizeQty}
              handleSizeQty={handleSizeQty}
              handleQuantityPreset={handleQuantityPreset}
              presets={presets}
              sizeSummary={sizeSummary}
              unitPrice={unitPrice}
              total={total}
              priceResult={priceResult}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              colorsExpanded={colorsExpanded}
              setColorsExpanded={setColorsExpanded}
              selectedAreas={selectedAreas}
              selectedAreasSet={selectedAreasSet}
              toggleArea={toggleArea}
              setSelectedAreas={setSelectedAreas}
              availableZones={availableZones}
              hasPrintAreaSection={hasPrintAreaSection}
              customZones={customZones}
              removeCustomZone={removeCustomZone}
              setShowZoneDialog={setShowZoneDialog}
              packPremium={packPremium}
              setPackPremium={setPackPremium}
              handleAddToCart={handleAddToCart}
              addedToCart={addedToCart}
              handleOpenDesign={handleOpenDesign}
              designAreasCount={designAreas.length}
            />
          </div>
        </main>

        <CatalogProductDialogs
          branding={branding}
          showZoneDialog={showZoneDialog}
          setShowZoneDialog={setShowZoneDialog}
          zoneForm={zoneForm}
          setZoneForm={setZoneForm}
          addCustomZone={addCustomZone}
          designOpen={designOpen}
          setDesignOpen={setDesignOpen}
          onDesignClose={() => {
            setDesignStep('upload');
            setArtwork({});
            resetArtworkFiles();
            setDesignNotes('');
            setDesignApproved(false);
          }}
          product={product}
          selectedColor={selectedColor}
          designStep={designStep}
          setDesignStep={setDesignStep}
          designAreas={designAreas}
          designNotes={designNotes}
          setDesignNotes={setDesignNotes}
          designApproved={designApproved}
          setDesignApproved={setDesignApproved}
          uploadingDesign={uploadingDesign}
          artwork={artwork}
          handleArtworkChange={handleArtworkChange}
          visualSelectedAreas={visualSelectedAreas}
          customZones={customZones}
          stampDims={priceResult?.stampDims}
          sizeSummary={sizeSummary}
          handleCustomZoneMove={handleCustomZoneMove}
          handleApproveDesign={state.handleApproveDesign}
          allAreasHaveArtwork={allAreasHaveArtwork}
          checkoutOpen={checkoutOpen}
          setCheckoutOpen={setCheckoutOpen}
        />
      </div>
    </TooltipProvider>
  );
}

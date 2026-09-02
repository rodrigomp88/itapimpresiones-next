'use client';

import type { PublicProduct } from '@/lib/public-products';
import type { CatalogCustomZone } from '@/components/catalogo/CatalogGarmentVisualizer';
import { CatalogDesignDialog } from './CatalogDesignDialog';
import { CustomZoneDialog } from './CustomZoneDialog';
import { CartDrawer } from '@/components/catalogo/CartDrawer';
import { CartButton } from '@/components/catalogo/CartButton';
import { CheckoutModal } from '@/components/catalogo/CheckoutModal';
import { WhatsAppFloat } from '@/components/catalogo/WhatsAppFloat';
import type { BrandingSettings } from '@/hooks/use-settings';

interface CatalogProductDialogsProps {
  branding: BrandingSettings;
  showZoneDialog: boolean;
  setShowZoneDialog: (open: boolean) => void;
  zoneForm: { name: string; side: 'front' | 'back'; widthCm: number; heightCm: number };
  setZoneForm: (form: { name: string; side: 'front' | 'back'; widthCm: number; heightCm: number }) => void;
  addCustomZone: () => void;
  designOpen: boolean;
  setDesignOpen: (open: boolean) => void;
  onDesignClose: () => void;
  product: PublicProduct;
  selectedColor?: string;
  designStep: 'upload' | 'review' | 'notes';
  setDesignStep: (step: 'upload' | 'review' | 'notes') => void;
  designAreas: Array<{ id: string; name: string; side: 'front' | 'back'; dimensions?: string }>;
  designNotes: string;
  setDesignNotes: (notes: string) => void;
  designApproved: boolean;
  setDesignApproved: (approved: boolean) => void;
  uploadingDesign: boolean;
  artwork: Record<string, { imageDataUrl: string; fileName: string }>;
  handleArtworkChange: (areaId: string, file: File | undefined) => void;
  visualSelectedAreas: string[];
  customZones: CatalogCustomZone[];
  stampDims?: Record<string, string>;
  sizeSummary?: string;
  handleCustomZoneMove: (id: string, xPercent: number, yPercent: number) => void;
  handleApproveDesign: () => void;
  allAreasHaveArtwork: boolean;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
}

export function CatalogProductDialogs(props: CatalogProductDialogsProps) {
  const {
    branding, showZoneDialog, setShowZoneDialog, zoneForm, setZoneForm, addCustomZone,
    designOpen, setDesignOpen, onDesignClose, product, selectedColor, designStep, setDesignStep,
    designAreas, designNotes, setDesignNotes, designApproved, setDesignApproved,
    uploadingDesign, artwork, handleArtworkChange, visualSelectedAreas, customZones,
    stampDims, sizeSummary, handleCustomZoneMove, handleApproveDesign, allAreasHaveArtwork,
    checkoutOpen, setCheckoutOpen,
  } = props;

  return (
    <>
      <WhatsAppFloat branding={branding} />

      <CustomZoneDialog
        open={showZoneDialog}
        onOpenChange={setShowZoneDialog}
        zoneForm={zoneForm}
        setZoneForm={setZoneForm}
        onAdd={addCustomZone}
      />

      <CatalogDesignDialog
        open={designOpen}
        onOpenChange={(open) => {
          setDesignOpen(open);
          if (!open) onDesignClose();
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
        stampDims={stampDims}
        sizeSummary={sizeSummary}
        handleCustomZoneMove={handleCustomZoneMove}
        handleApproveDesign={handleApproveDesign}
        allAreasHaveArtwork={allAreasHaveArtwork}
      />

      <CartButton />
      <CartDrawer onGoToCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}

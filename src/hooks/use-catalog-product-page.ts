'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirebaseApp } from '@/firebase';
import { uploadDesignFile } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { useCatalogPrice } from '@/hooks/use-catalog-price';
import { useProductSpecs } from '@/hooks/use-product-specs';
import { getMinQuantity, getPresets } from '@/lib/catalog-helpers';
import { stampingZones } from '@/components/apparel/stamping-zones';
import { apparelMeasures, buildMeasuresFromConfig, type StampingMeasure } from '@/lib/apparel-measures';
import { getAvailableTechniques } from '@/lib/public-calculator';
import { getPublicStampingConfig } from '@/lib/public-products';
import { formatPriceARS } from '@/lib/formatters';
import type { CatalogCustomZone } from '@/components/catalogo/CatalogGarmentVisualizer';
import type { PublicProduct } from '@/lib/public-products';
import type { SettingsValues } from '@/lib/config-schema';
import type { BrandingSettings } from '@/hooks/use-settings';

export interface UseCatalogProductPageReturn {
  // Props
  branding: BrandingSettings;
  // Derived flags
  isBag: boolean;
  isCap: boolean;
  productType: 'apparel' | 'bags';
  // State
  viewMode: 'esquema' | 'foto';
  setViewMode: (mode: 'esquema' | 'foto') => void;
  selectedColor: string | undefined;
  setSelectedColor: (color: string | undefined) => void;
  activeTechnique: string;
  handleTechniqueChange: (technique: string) => void;
  selectedAreas: string[];
  setSelectedAreas: (areas: string[]) => void;
  selectedAreasSet: Set<string>;
  toggleArea: (zoneId: string) => void;
  customZones: CatalogCustomZone[];
  showZoneDialog: boolean;
  setShowZoneDialog: (open: boolean) => void;
  zoneForm: { name: string; side: 'front' | 'back'; widthCm: number; heightCm: number };
  setZoneForm: (form: { name: string; side: 'front' | 'back'; widthCm: number; heightCm: number }) => void;
  addCustomZone: () => void;
  removeCustomZone: (id: string) => void;
  handleCustomZoneMove: (id: string, xPercent: number, yPercent: number) => void;
  packPremium: boolean;
  setPackPremium: (value: boolean) => void;
  qty: number;
  setQty: (value: number | ((prev: number) => number)) => void;
  sizeQty: Record<string, number>;
  handleSizeQty: (size: string, value: number) => void;
  handleQuantityPreset: (value: number) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  measures: StampingMeasure[];
  designOpen: boolean;
  setDesignOpen: (open: boolean) => void;
  designApproved: boolean;
  setDesignApproved: (approved: boolean) => void;
  designNotes: string;
  setDesignNotes: (notes: string) => void;
  artwork: Record<string, { imageDataUrl: string; fileName: string }>;
  setArtwork: (artwork: Record<string, { imageDataUrl: string; fileName: string }>) => void;
  handleArtworkChange: (areaId: string, file: File | undefined) => void;
  artworkFiles: React.MutableRefObject<Record<string, File>>;
  resetArtworkFiles: () => void;
  uploadingDesign: boolean;
  setUploadingDesign: (uploading: boolean) => void;
  designStep: 'upload' | 'review' | 'notes';
  setDesignStep: (step: 'upload' | 'review' | 'notes') => void;
  infoTab: 'info' | 'specs' | 'howto' | 'faq';
  setInfoTab: (tab: 'info' | 'specs' | 'howto' | 'faq') => void;
  addedToCart: boolean;
  setAddedToCart: (added: boolean) => void;
  colorsExpanded: boolean;
  setColorsExpanded: (expanded: boolean) => void;
  // Derived / computed
  name: string;
  tecnicas: string[];
  minQty: number;
  presets: number[];
  totalQty: number;
  sizeSummary: string | undefined;
  priceResult: ReturnType<typeof useCatalogPrice>;
  unitPrice: number;
  total: number;
  availableZones: Array<{ id: string; name: string }>;
  hasPrintAreaSection: boolean;
  visualSelectedAreas: string[];
  fichaRows: ReturnType<typeof useProductSpecs>;
  designAreas: Array<{ id: string; name: string; side: 'front' | 'back'; dimensions?: string }>;
  allAreasHaveArtwork: boolean;
  handleOpenDesign: () => void;
  handleApproveDesign: () => Promise<void>;
  handleAddToCart: () => void;
  formatPriceARS: (value: number) => string;
}

export function useCatalogProductPage(
  product: PublicProduct,
  settings: SettingsValues,
  branding: BrandingSettings,
): UseCatalogProductPageReturn {
  const { addItem } = useCart();
  const { toast } = useToast();

  const isBag = product.type === 'bags';
  const isCap = product.type === 'apparel' && product.visualType === 'cap';
  const productType: 'apparel' | 'bags' = isBag ? 'bags' : 'apparel';
  const initialTecnicas = useMemo(() => getAvailableTechniques(product), [product]);
  const initialMinQty = getMinQuantity(productType, initialTecnicas[0] || 'DTF', settings);

  const [viewMode, setViewMode] = useState<'esquema' | 'foto'>('esquema');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedTechnique, setSelectedTechnique] = useState<string | undefined>(undefined);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [customZones, setCustomZones] = useState<CatalogCustomZone[]>([]);
  const [showZoneDialog, setShowZoneDialog] = useState(false);
  const [zoneForm, setZoneForm] = useState({ name: '', side: 'front' as 'front' | 'back', widthCm: 10, heightCm: 10 });
  const [packPremium, setPackPremium] = useState(false);
  const [qty, setQty] = useState(initialMinQty);
  const [sizeQty, setSizeQty] = useState<Record<string, number>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [measures, setMeasures] = useState<StampingMeasure[]>(apparelMeasures);
  const [designOpen, setDesignOpen] = useState(false);
  const [designApproved, setDesignApproved] = useState(false);
  const [designNotes, setDesignNotes] = useState('');
  const [artwork, setArtwork] = useState<Record<string, { imageDataUrl: string; fileName: string }>>({});
  const artworkFiles = useRef<Record<string, File>>({});
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const [designStep, setDesignStep] = useState<'upload' | 'review' | 'notes'>('upload');
  const [infoTab, setInfoTab] = useState<'info' | 'specs' | 'howto' | 'faq'>('info');
  const [addedToCart, setAddedToCart] = useState(false);
  const [colorsExpanded, setColorsExpanded] = useState(false);

  // Medidas de estampado reales
  useEffect(() => {
    let cancelled = false;
    getPublicStampingConfig().then(config => {
      if (!cancelled && config) setMeasures(buildMeasuresFromConfig(config));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const tecnicas = initialTecnicas;
  const activeTechnique = selectedTechnique || tecnicas[0] || 'DTF';
  const minQty = useMemo(() => getMinQuantity(productType, activeTechnique, settings), [productType, activeTechnique, settings]);
  const presets = useMemo(() => getPresets(productType, settings), [productType, settings]);

  const handleSizeQty = useCallback((size: string, value: number) => {
    setSizeQty(prev => ({ ...prev, [size]: Math.max(0, value) }));
  }, []);

  const handleQuantityPreset = useCallback((value: number) => {
    if (product.sizes.length > 1) {
      const firstSize = product.sizes[0]?.talle;
      if (firstSize) setSizeQty({ [firstSize]: value });
      return;
    }
    setQty(value);
  }, [product.sizes]);

  const handleTechniqueChange = useCallback((technique: string) => {
    setSelectedTechnique(technique);
    const newMin = getMinQuantity(productType, technique, settings);
    setQty(newMin);
    setSizeQty(prev => {
      const next: Record<string, number> = {};
      for (const [k, v] of Object.entries(prev)) {
        next[k] = Math.max(0, Number(v) || 0);
      }
      return next;
    });
  }, [productType, settings]);

  const totalQty = useMemo(() => {
    const sizeTotal = Object.values(sizeQty).reduce((s, n) => s + (Number(n) || 0), 0);
    return sizeTotal > 0 ? sizeTotal : qty;
  }, [qty, sizeQty]);

  const sizeSummary = useMemo(() => {
    const entries = Object.entries(sizeQty).filter(([, q]) => (Number(q) || 0) > 0);
    if (entries.length === 0) return undefined;
    return entries.map(([size, q]) => `${size}(${q}u)`).join(' · ');
  }, [sizeQty]);

  const priceResult = useCatalogPrice(product, activeTechnique, totalQty, settings, {
    color: selectedColor,
    pack: packPremium ? 'PREMIUM' : 'ECO',
    selectedAreas,
    customZones: customZones.length > 0 ? customZones : undefined,
    measures,
  });

  const unitPrice = priceResult?.unitPrice ?? product.precioLista;
  const total = priceResult?.totalPrice ?? unitPrice * totalQty;

  const toggleArea = (zoneId: string) => {
    setSelectedAreas(prev => prev.includes(zoneId) ? prev.filter(a => a !== zoneId) : [...prev, zoneId]);
  };

  const selectedAreasSet = useMemo(() => new Set(selectedAreas), [selectedAreas]);

  const handleCustomZoneMove = useCallback((id: string, xPercent: number, yPercent: number) => {
    setCustomZones(prev => prev.map(z => z.id === id ? { ...z, xPercent, yPercent } : z));
  }, []);

  const addCustomZone = () => {
    if (!zoneForm.name.trim()) return;
    setCustomZones(prev => [...prev, { id: `custom_${Date.now()}`, ...zoneForm }]);
    setZoneForm({ name: '', side: 'front', widthCm: 10, heightCm: 10 });
    setShowZoneDialog(false);
  };

  const removeCustomZone = (id: string) => {
    setCustomZones(prev => prev.filter(z => z.id !== id));
    setArtwork(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleArtworkChange = (areaId: string, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    
    // Validación de tamaño: max 10MB
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      toast({ 
        variant: 'destructive', 
        title: 'Archivo muy grande', 
        description: `El archivo "${file.name}" supera los 10MB. Reducí la imagen e intentá de nuevo.` 
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setArtwork(prev => ({ ...prev, [areaId]: { imageDataUrl: reader.result as string, fileName: file.name } }));
        artworkFiles.current[areaId] = file;
        setDesignApproved(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const name = product.type === 'apparel' ? product.producto : (product.nombreDisplay || product.material);
  const availableZones = useMemo(() => {
    const validSet = new Set(product.validZones || []);
    return stampingZones.filter(z => validSet.has(z.id));
  }, [product]);

  const hasPrintAreaSection = !isBag || activeTechnique !== 'Sin Impresión';
  const visualSelectedAreas = isBag ? (activeTechnique !== 'Sin Impresión' ? ['frente'] : []) : selectedAreas;

  const fichaRows = useProductSpecs(product);

  const designAreas = useMemo(() => [
    ...(isBag && activeTechnique !== 'Sin Impresión' ? [{ id: 'frente', name: 'Frente', side: 'front' as const, dimensions: '30x25cm' }] : []),
    ...selectedAreas.flatMap(id => {
      const zone = stampingZones.find(item => item.id === id);
      return zone ? [{ id: zone.id, name: zone.name, side: zone.side as 'front' | 'back', dimensions: priceResult?.stampDims[id] }] : [];
    }),
    ...customZones.map(zone => ({ id: zone.id, name: zone.name, side: zone.side, dimensions: `${zone.widthCm}x${zone.heightCm}cm` })),
  ] as Array<{ id: string; name: string; side: 'front' | 'back'; dimensions?: string }>, [isBag, activeTechnique, selectedAreas, customZones, priceResult?.stampDims]);

  const allAreasHaveArtwork = designAreas.length > 0 && designAreas.every(area => Boolean(artwork[area.id]?.imageDataUrl));

  const handleOpenDesign = () => {
    setDesignApproved(false);
    setDesignStep('upload');
    setDesignOpen(true);
  };

  const handleApproveDesign = async () => {
    if (designAreas.length === 0) return;
    
    // Validación de tamaño de archivos (max 10MB cada uno)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    for (const area of designAreas) {
      const file = artworkFiles.current[area.id];
      if (file && file.size > maxFileSize) {
        toast({ 
          variant: 'destructive', 
          title: 'Archivo muy grande', 
          description: `El archivo "${file.name}" supera los 10MB. Reducí la imagen e intentá de nuevo.` 
        });
        return;
      }
    }

    setUploadingDesign(true);
    const approvedAt = new Date().toISOString();
    
    // Timeout global de 60 segundos para toda la operación
    const timeoutMs = 60000;
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: la operación tardó demasiado')), timeoutMs)
    );

    try {
      const auth = getAuth(getFirebaseApp());
      if (!auth.currentUser) await signInAnonymously(auth);
      const designId = `${product.id}_${Date.now()}`;
      
      const uploaded = await Promise.race([
        Promise.all(designAreas.map(async area => {
          const file = artworkFiles.current[area.id];
          let imageUrl = artwork[area.id]?.imageDataUrl;
          if (file) {
            try {
              imageUrl = await uploadDesignFile(`${designId}-${area.id}`, file);
            } catch (uploadError) {
              console.error(`[CatalogDesign] Error subiendo ${area.name}:`, uploadError);
              // keep dataUrl if upload fails
            }
          }
          return {
            id: area.id,
            name: area.name,
            side: area.side,
            imageDataUrl: imageUrl,
            fileName: artwork[area.id]?.fileName,
          };
        })),
        timeoutPromise
      ]);
      
      await addItem({
        product,
        quantity: totalQty,
        technique: activeTechnique,
        color: selectedColor,
        size: sizeSummary,
        unitPrice: priceResult?.unitPrice ?? 0,
        totalPrice: priceResult?.totalPrice ?? 0,
        design: {
          areas: uploaded,
          generalNotes: designNotes || undefined,
          approvedAt,
        },
      });
      setDesignOpen(false);
      setDesignApproved(true);
      if (uploaded.some(item => item.imageDataUrl?.startsWith('data:'))) {
        toast({ title: 'Muestra aprobada', description: 'El diseño quedó guardado en este dispositivo. Storage todavía no está habilitado para guardar los archivos en la nube.' });
      } else {
        toast({ title: '¡Diseño guardado!', description: 'Tu diseño se subió correctamente y se agregó al pedido.' });
      }
    } catch (error) {
      console.error('[CatalogDesign] Error uploading design:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      if (errorMessage.includes('Timeout')) {
        toast({ variant: 'destructive', title: 'Tiempo agotado', description: 'La subida tardó demasiado. Verificá tu conexión e intentá con archivos más pequeños.' });
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        toast({ variant: 'destructive', title: 'Error de permisos', description: 'No se pudo subir el diseño. Verificá la configuración de Firebase Storage.' });
      } else {
        toast({ variant: 'destructive', title: 'No se pudo guardar el diseño', description: 'Revisá los archivos e intentá nuevamente.' });
      }
    } finally {
      setUploadingDesign(false);
    }
  };

  const handleAddToCart = () => {
    if (!priceResult) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);
    addItem({
      product,
      quantity: totalQty,
      technique: activeTechnique,
      color: selectedColor,
      size: sizeSummary,
      unitPrice: priceResult.unitPrice,
      totalPrice: priceResult.totalPrice,
    });
    setAddedToCart(true);
    toast({
      title: 'Agregado al pedido',
      description: `${totalQty}u. ${activeTechnique} — ${formatPriceARS(priceResult.totalPrice)}`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const resetArtworkFiles = () => { artworkFiles.current = {}; };

  return {
    branding,
    isBag,
    isCap,
    productType,
    viewMode,
    setViewMode,
    selectedColor,
    setSelectedColor,
    activeTechnique,
    handleTechniqueChange,
    selectedAreas,
    setSelectedAreas,
    selectedAreasSet,
    toggleArea,
    customZones,
    showZoneDialog,
    setShowZoneDialog,
    zoneForm,
    setZoneForm,
    addCustomZone,
    removeCustomZone,
    handleCustomZoneMove,
    packPremium,
    setPackPremium,
    qty,
    setQty,
    sizeQty,
    handleSizeQty,
    handleQuantityPreset,
    checkoutOpen,
    setCheckoutOpen,
    measures,
    designOpen,
    setDesignOpen,
    designApproved,
    setDesignApproved,
    designNotes,
    setDesignNotes,
    artwork,
    setArtwork,
    artworkFiles,
    resetArtworkFiles,
    handleArtworkChange,
    uploadingDesign,
    setUploadingDesign,
    designStep,
    setDesignStep,
    infoTab,
    setInfoTab,
    addedToCart,
    setAddedToCart,
    colorsExpanded,
    setColorsExpanded,
    name,
    tecnicas,
    minQty,
    presets,
    totalQty,
    sizeSummary,
    priceResult,
    unitPrice,
    total,
    availableZones,
    hasPrintAreaSection,
    visualSelectedAreas,
    fichaRows,
    designAreas,
    allAreasHaveArtwork,
    handleOpenDesign,
    handleApproveDesign,
    handleAddToCart,
    formatPriceARS,
  };
}
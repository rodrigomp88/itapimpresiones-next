import type { PublicProduct } from '@/lib/public-products';
import type { SettingsValues } from '@/lib/config-schema';
import { publicCalculatePrice } from '@/lib/public-calculator';

export const ITEMS_PER_PAGE = 12;

export type SizeCatKey = 'ninos' | 'damas' | 'adultos' | 'especiales';

export const SIZE_CAT_LABELS: Record<SizeCatKey, string> = {
  ninos: 'Niños',
  damas: 'Mujeres',
  adultos: 'Adultos',
  especiales: 'Talles Especiales',
};

export function productSizeCategory(nombre: string): SizeCatKey {
  const n = (nombre || '').toLowerCase();
  if (n.includes('niñ') || n.includes('nino')) return 'ninos';
  if (n.includes('especial')) return 'especiales';
  if (n.includes('dama') || n.includes('mujer')) return 'damas';
  return 'adultos';
}

const LETTER_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

export function sortSizes(a: string, b: string): number {
  const rank = (s: string): number => {
    const u = s.toUpperCase();
    const idx = LETTER_ORDER.indexOf(u);
    if (idx !== -1) return idx;
    if (/^T\d+$/.test(u)) return 1000 + parseInt(u.slice(1), 10);
    if (/^\d+$/.test(u)) return 500 + parseInt(u, 10);
    return 2000;
  };
  return rank(a) - rank(b);
}

const COLOR_CANONICAL: Record<string, string> = {
  'blanca': 'Blanco', 'blanco': 'Blanco', 'white': 'Blanco',
  'negra': 'Negro', 'negro': 'Negro', 'black': 'Negro',
  'roja': 'Rojo', 'rojo': 'Rojo', 'red': 'Rojo',
  'azul': 'Azul', 'blue': 'Azul',
  'azul marino': 'Azul Marino', 'azul francia': 'Azul Francia',
  'celeste': 'Celeste',
  'verde': 'Verde', 'green': 'Verde',
  'verde militar': 'Verde Militar', 'verde oliva': 'Verde Oliva',
  'amarillo': 'Amarillo', 'yellow': 'Amarillo',
  'naranja': 'Naranja', 'orange': 'Naranja',
  'rosa': 'Rosa', 'fucsia': 'Fucsia',
  'violeta': 'Violeta', 'lila': 'Lila', 'lavanda': 'Lavanda',
  'gris': 'Gris', 'gray': 'Gris', 'gris melange': 'Gris Melange', 'gris oscuro': 'Gris Oscuro',
  'beige': 'Beige', 'natural': 'Natural', 'crema': 'Crema', 'crudo': 'Crudo',
  'marron': 'Marrón', 'marrón': 'Marrón', 'chocolate': 'Chocolate',
  'bordo': 'Bordo', 'bordeaux': 'Bordo', 'vino': 'Vino',
  'turquesa': 'Turquesa',
  'salmon': 'Salmón', 'salmón': 'Salmón',
};

export function canonColor(c: string): string {
  const key = c.toLowerCase().trim();
  return COLOR_CANONICAL[key] ?? c.charAt(0).toUpperCase() + c.slice(1);
}

export const MANIJA_LABELS: Record<string, string> = { TIRAS: 'Tiras', RIÑON: 'Troquel' };

export interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function buildActiveChips(opts: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  maxPrice: number;
  selectedSizeKeys: string[];
  setSelectedSizeKeys: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTechniques: string[];
  setSelectedTechniques: React.Dispatch<React.SetStateAction<string[]>>;
  selectedColors: string[];
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBagTypes: string[];
  setSelectedBagTypes: React.Dispatch<React.SetStateAction<string[]>>;
}): ActiveChip[] {
  const {
    searchQuery, setSearchQuery, activeFilter, setActiveFilter,
    priceRange, setPriceRange, maxPrice,
    selectedSizeKeys, setSelectedSizeKeys,
    selectedTechniques, setSelectedTechniques,
    selectedColors, setSelectedColors,
    selectedBagTypes, setSelectedBagTypes,
  } = opts;
  const chips: ActiveChip[] = [];
  if (searchQuery) chips.push({ key: 'q', label: `"${searchQuery}"`, onRemove: () => setSearchQuery('') });
  if (activeFilter !== 'Todos') chips.push({ key: 't', label: activeFilter, onRemove: () => setActiveFilter('Todos') });
  if (priceRange[0] > 0) chips.push({ key: 'pmin', label: `Desde ${formatPriceLocal(priceRange[0])}`, onRemove: () => setPriceRange([0, priceRange[1]]) });
  if (priceRange[1] < maxPrice) chips.push({ key: 'pmax', label: `Hasta ${formatPriceLocal(priceRange[1])}`, onRemove: () => setPriceRange([priceRange[0], maxPrice]) });
  selectedSizeKeys.forEach(k => chips.push({ key: `s-${k}`, label: k.replace(':', ' · '), onRemove: () => setSelectedSizeKeys(prev => prev.filter(x => x !== k)) }));
  selectedTechniques.forEach(t => chips.push({ key: `tech-${t}`, label: t, onRemove: () => setSelectedTechniques(prev => prev.filter(x => x !== t)) }));
  selectedColors.forEach(c => chips.push({ key: `c-${c}`, label: c, onRemove: () => setSelectedColors(prev => prev.filter(x => x !== c)) }));
  selectedBagTypes.forEach(b => chips.push({ key: `b-${b}`, label: MANIJA_LABELS[b] ?? b, onRemove: () => setSelectedBagTypes(prev => prev.filter(x => x !== b)) }));
  return chips;
}

function formatPriceLocal(v: number): string {
  return `$${v.toLocaleString('es-AR')}`;
}

export function filterProducts(
  initialProducts: PublicProduct[],
  opts: {
    searchQuery: string;
    activeFilter: string;
    priceRange: [number, number];
    selectedSizeKeys: string[];
    selectedTechniques: string[];
    selectedColors: string[];
    selectedBagTypes: string[];
    sortBy: 'name' | 'price-low' | 'price-high';
  }
): PublicProduct[] {
  let result = initialProducts;
  const { searchQuery, activeFilter, priceRange, selectedSizeKeys, selectedTechniques, selectedColors, selectedBagTypes, sortBy } = opts;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(p =>
      (p.producto || p.material || '').toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.material || '').toLowerCase().includes(q)
    );
  }

  if (activeFilter !== 'Todos') {
    if (activeFilter === 'Indumentaria') {
      result = result.filter(p => p.type === 'apparel' && p.visualType !== 'cap');
    } else if (activeFilter === 'Gorras') {
      result = result.filter(p => p.type === 'apparel' && p.visualType === 'cap');
    } else {
      result = result.filter(p => p.type === 'bags');
    }
  }

  result = result.filter(p => p.precioLista >= priceRange[0] && p.precioLista <= priceRange[1]);

  if (selectedSizeKeys.length > 0) {
    const sizeKeySet = new Set(selectedSizeKeys);
    result = result.filter(p => {
      if (p.type !== 'apparel') return false;
      const cat = productSizeCategory(p.producto);
      return p.sizes.some(s => sizeKeySet.has(`${cat}:${s.talle}`));
    });
  }

  if (selectedTechniques.length > 0) {
    const techSet = new Set(selectedTechniques);
    result = result.filter(p => (p.tipoImpresion ?? []).some(t => techSet.has(t)));
  }

  if (selectedColors.length > 0) {
    const colorSet = new Set(selectedColors);
    result = result.filter(p => p.colors.some(c => colorSet.has(canonColor(c))));
  }

  if (selectedBagTypes.length > 0) {
    const bagTypeSet = new Set(selectedBagTypes);
    result = result.filter(p => p.type !== 'bags' || (p.tipoManija && bagTypeSet.has(p.tipoManija)));
  }

  result = [...result].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.precioLista - b.precioLista;
      case 'price-high':
        return b.precioLista - a.precioLista;
      case 'name':
      default: {
        const nameA = a.type === 'apparel' ? a.producto : (a.nombreDisplay || a.material);
        const nameB = b.type === 'apparel' ? b.producto : (b.nombreDisplay || b.material);
        return nameA.localeCompare(nameB);
      }
    }
  });

  return result;
}

export function computeMinQtys(initialProducts: PublicProduct[], catalogSettings: SettingsValues | null): Record<string, number> {
  const map: Record<string, number> = {};
  if (!catalogSettings) return map;
  const minMap = catalogSettings.minimosCantidad;
  if (!minMap) return map;
  for (const p of initialProducts) {
    const group = p.type === 'bags' ? minMap.bolsas : minMap.indumentaria;
    if (!group) continue;
    const rawTech = p.tipoImpresion?.[0] || (p.type === 'bags' ? 'Serigrafía' : 'DTF');
    const t = rawTech.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
    if (t === 'serigrafia') map[p.id] = group.serigrafia ?? 1;
    else if (t === 'dtf') map[p.id] = group.dtf ?? 1;
    else if (t === 'sublimado' || t === 'sublimacion') map[p.id] = group.sublimado ?? 1;
    else if (t === 'sinimpresion') map[p.id] = group.sinImpresion ?? 1;
    else map[p.id] = 1;
  }
  return map;
}

export function computeDesdePrices(
  initialProducts: PublicProduct[],
  catalogSettings: SettingsValues | null,
  minQtys: Record<string, number>
): Record<string, number> {
  const map: Record<string, number> = {};
  if (!catalogSettings) return map;
  for (const p of initialProducts) {
    const tech = p.tipoImpresion?.[0] || (p.type === 'bags' ? 'Serigrafía' : 'DTF');
    const minQ = minQtys[p.id] || 1;
    const r = publicCalculatePrice({ product: p, technique: tech, size: undefined, color: undefined, quantity: minQ }, catalogSettings);
    if (r?.unitPrice) map[p.id] = r.unitPrice;
  }
  return map;
}

import { apparelZoneStyles, smallZones } from './stamping-zones';

export type VisualType = 'tshirt' | 'cap' | 'hoodie-rn' | 'hoodie-hood' | 'jacket-hood' | 'jacket-nohood' | 'polo' | 'tank-top' | 'long-sleeve' | 'pants';

export interface VisualConfig {
  frontImage: string;
  backImage: string | null;
  zones: Record<string, { styles: React.CSSProperties; label: string }>;
  defaultZones: string[];
  smallZones: string[];
  supportsBack: boolean;
  label: string;
}

export const VISUAL_CONFIGS: Record<VisualType, VisualConfig> = {
  tshirt: {
    frontImage: '/images/diagrams/tshirt-front.svg',
    backImage: '/images/diagrams/tshirt-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'mangaCorta', 'backCollar', 'custom'],
    smallZones: smallZones,
    supportsBack: true,
    label: 'Remera',
  },
  cap: {
    frontImage: '/images/diagrams/cap.svg',
    backImage: '/images/diagrams/cap-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['gorraFrente', 'gorraLateral', 'gorraPosterior'],
    smallZones: [],
    supportsBack: true,
    label: 'Gorra',
  },
  'hoodie-rn': {
    frontImage: '/images/diagrams/hoodie-rn-front.svg',
    backImage: '/images/diagrams/hoodie-rn-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'mangaCorta', 'backCollar', 'custom'],
    smallZones: smallZones,
    supportsBack: true,
    label: 'Buzo Cuello Redondo',
  },
  'hoodie-hood': {
    frontImage: '/images/diagrams/hoodie-hood-front.svg',
    backImage: '/images/diagrams/hoodie-hood-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'mangaCorta', 'backCollar', 'custom'],
    smallZones: smallZones,
    supportsBack: true,
    label: 'Buzo con Capucha',
  },
  'jacket-hood': {
    frontImage: '/images/diagrams/jacket-hood-front.svg',
    backImage: '/images/diagrams/jacket-hood-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'mangaCorta', 'backCollar', 'custom'],
    smallZones: smallZones,
    supportsBack: true,
    label: 'Campera con Capucha',
  },
  'jacket-nohood': {
    frontImage: '/images/diagrams/jacket-nohood-front.svg',
    backImage: '/images/diagrams/jacket-nohood-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'mangaCorta', 'backCollar', 'custom'],
    smallZones: smallZones,
    supportsBack: true,
    label: 'Campera sin Capucha',
  },
  polo: {
    frontImage: '/images/diagrams/polo-front.svg',
    backImage: '/images/diagrams/polo-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'mangaCorta', 'backCollar', 'custom'],
    smallZones: smallZones,
    supportsBack: true,
    label: 'Chomba / Polo',
  },
  'tank-top': {
    frontImage: '/images/diagrams/tank-top-front.svg',
    backImage: '/images/diagrams/tank-top-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'backCollar', 'custom'],
    smallZones: ['backCollar'],
    supportsBack: true,
    label: 'Musculosa',
  },
  'long-sleeve': {
    frontImage: '/images/diagrams/long-sleeve-front.svg',
    backImage: '/images/diagrams/long-sleeve-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'mangaCorta', 'backCollar', 'custom'],
    smallZones: smallZones,
    supportsBack: true,
    label: 'Remera Manga Larga',
  },
  pants: {
    frontImage: '/images/diagrams/pants-front.svg',
    backImage: '/images/diagrams/pants-back.svg',
    zones: apparelZoneStyles,
    defaultZones: ['fullFront', 'fullBack', 'centroPecho', 'pechoIzqLogo', 'backCollar', 'custom'],
    smallZones: ['centroPecho', 'pechoIzqLogo', 'backCollar'],
    supportsBack: true,
    label: 'Pantalón',
  },
};

const VISUAL_TYPES = Object.keys(VISUAL_CONFIGS) as VisualType[];

export function getVisualType(productName: string): VisualType {
  const lower = productName.toLowerCase();
  if (lower.includes('pantalon') || lower.includes('friza') || lower.includes('frizado') || lower.includes('jogger') || lower.includes('bermuda')) return 'pants';
  if (lower.includes('buzo') && (lower.includes('capucha') || lower.includes('hood'))) return 'hoodie-hood';
  if (lower.includes('buzo') || lower.includes('hoodie')) return 'hoodie-rn';
  if (lower.includes('campera') && lower.includes('capucha')) return 'jacket-hood';
  if (lower.includes('campera') || lower.includes('jacket')) return 'jacket-nohood';
  if (lower.includes('gorra') || lower.includes('cap')) return 'cap';
  if (lower.includes('chomba') || lower.includes('polo')) return 'polo';
  if (lower.includes('musculosa') || lower.includes('tank') || lower.includes('singlet') || lower.includes('crop top') || lower.includes('chaleco') || lower.includes('malvinas') || lower.includes('boxy')) return 'tank-top';
  if (lower.includes('manga larga') || lower.includes('long sleeve')) return 'long-sleeve';
  return 'tshirt';
}

export const visualTypeOptions = VISUAL_TYPES.map(v => ({
  value: v,
  label: VISUAL_CONFIGS[v].label,
}));

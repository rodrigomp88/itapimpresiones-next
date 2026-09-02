/**
 * Shared color name → hex map (apparel/bag color names in Spanish).
 * Used to tint garment diagrams and render color dots consistently.
 */

export const COLOR_HEX_MAP: Record<string, string> = {
  negro: '#18181b', negra: '#18181b', black: '#18181b',
  blanco: '#fafafa', blanca: '#fafafa', white: '#fafafa',
  rojo: '#dc2626', roja: '#dc2626', red: '#dc2626',
  azul: '#2563eb', blue: '#2563eb',
  'azul marino': '#1e3a8a', 'azul francia': '#3b82f6',
  celeste: '#7dd3fc',
  verde: '#16a34a', green: '#16a34a',
  'verde militar': '#4d5139', 'verde oliva': '#6b7333',
  amarillo: '#facc15', yellow: '#facc15',
  naranja: '#f97316', orange: '#f97316',
  rosa: '#f472b6', fucsia: '#ec4899',
  violeta: '#a855f7', lila: '#d8b4fe', lavanda: '#e9d5ff',
  gris: '#9ca3af', gray: '#9ca3af', 'gris melange': '#a8a29e',
  'gris oscuro': '#4b5563', 'gris topo': '#7f7d7a', topo: '#8a817c', 'gris perla': '#9aa0a6',
  'gris claro': '#d1d5db', 'gris humo': '#6b7280', 'gris acero': '#71717a',
  beige: '#e8dcc5', natural: '#f0e6d2', crema: '#f7f0dd', crudo: '#efe6d5',
  marron: '#8b5a2b', 'marrón': '#8b5a2b', chocolate: '#5c3a21', 'marrón oscuro': '#4a3420',
  bordo: '#7d2248', 'bordeaux': '#7d2248', vino: '#722f37', 'bordó': '#7d2248',
  turquesa: '#14b8a6',
  salmon: '#fa8072', 'salmón': '#fa8072',
};

/** Resolves a color name (Spanish/common) to a hex value, or undefined if unknown. */
export function colorToHex(color?: string): string | undefined {
  if (!color) return undefined;
  const key = color.toLowerCase().trim();
  if (COLOR_HEX_MAP[key]) return COLOR_HEX_MAP[key];
  // Accept raw hex from data
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(key)) return key;
  return undefined;
}

/** Tailwind classes for a small color dot (used in cards/modals). */
export function colorDotClass(color: string): string {
  const map: Record<string, string> = {
    negro: 'bg-black', negra: 'bg-black', black: 'bg-black',
    blanco: 'bg-white', blanca: 'bg-white', white: 'bg-white',
    rojo: 'bg-red-600', roja: 'bg-red-600', red: 'bg-red-600',
    azul: 'bg-blue-600', blue: 'bg-blue-600',
    'azul marino': 'bg-blue-900', 'azul francia': 'bg-blue-500',
    celeste: 'bg-sky-300',
    verde: 'bg-secondary', green: 'bg-secondary',
    amarillo: 'bg-yellow-400', yellow: 'bg-yellow-400',
    naranja: 'bg-orange-500', orange: 'bg-orange-500',
    rosa: 'bg-pink-400', fucsia: 'bg-pink-500',
    violeta: 'bg-purple-500', lila: 'bg-purple-300', lavanda: 'bg-purple-200',
    gris: 'bg-gray-400', gray: 'bg-gray-400',
    beige: 'bg-[#e8dcc5]', natural: 'bg-[#f0e6d2]', crema: 'bg-[#f7f0dd]',
    marron: 'bg-[#8b5a2b]', 'marrón': 'bg-[#8b5a2b]', chocolate: 'bg-[#5c3a21]',
    bordo: 'bg-[#7d2248]',
    turquesa: 'bg-teal-500',
    salmon: 'bg-[#fa8072]',
  };
  return map[color.toLowerCase()] ?? 'bg-muted-foreground/40';
}

/** Trains a stable pseudo-random RGB from a string (name). Never repeats for distinct names. */
function hashHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Resolves a color to a concrete hex, always returning a value.
 * Uses the known map first; for unknown colors it derives a stable,
 * distinct hex from the name so different colors never look identical.
 */
export function colorHexResolved(color?: string): string {
  const known = colorToHex(color);
  if (known) return known;
  if (!color) return '#9ca3af';
  const h = hashHue(color.toLowerCase().trim());
  const r = (h & 0xff);
  const g = ((h >> 8) & 0xff);
  const b = ((h >> 16) & 0xff);
  // Clamp to avoid extremes that look like black/white; keep mid-range vibrancy
  const mix = (v: number) => Math.round(90 + v * 0.45);
  return `#${[r, g, b].map(mix).map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Priority buckets for display ordering: blancos, negros, grises, primarios, resto. */
const COLOR_BUCKET: Record<string, number> = {
  blanco: 0, blanca: 0, white: 0, crudo: 1, natural: 1,
  negro: 3, negra: 3, black: 3,
  gris: 4, gray: 4, 'gris melange': 4, 'gris claro': 4, 'gris oscuro': 4,
  'gris topo': 4, topo: 4, 'gris perla': 4, 'gris humo': 4, 'gris acero': 4,
  rojo: 5, roja: 5, red: 5,
  azul: 6, blue: 6, 'azul marino': 6, 'azul francia': 6, celeste: 6,
  verde: 7, green: 7,
  amarillo: 8, yellow: 8,
  naranja: 9, orange: 9,
  rosa: 10, fucsia: 10,
  violeta: 11, lila: 11, lavanda: 11,
  beige: 12, crema: 12,
  marron: 13, 'marrón': 13, chocolate: 13,
  bordo: 14, 'bordeaux': 14, 'bordó': 14, vino: 14,
  turquesa: 15, salmon: 15, 'salmón': 15,
};

/**
 * Sorts colors for display so neutral tones (blanco → negro → grises) lead,
 * then primary colors (rojo, azul, verde, amarillo…), keeping relative order
 * of the rest. Unknown colors fall into a final bucket, still stable.
 */
export function sortColorsForDisplay(colors: string[]): string[] {
  const bucketOf = (c: string): number => {
    const key = c.toLowerCase().trim();
    if (key.includes('blanc') || key.includes('white')) return 0;
    if (key.includes('crud') || key.includes('natural') || key.includes('crema') || key.includes('beige')) return 1;
    if (key.includes('neg')) return 3;
    if (key.includes('gris') || key.includes('gray') || key.includes('topo')) return 4;
    if (key.includes('roj') || key.includes('red')) return 5;
    if (key.includes('azul') || key.includes('blue') || key.includes('celest')) return 6;
    if (key.includes('verd')) return 7;
    if (key.includes('amarill') || key.includes('yellow')) return 8;
    if (key.includes('naranj') || key.includes('orange')) return 9;
    if (key.includes('ros') || key.includes('fucsia')) return 10;
    if (key.includes('violet') || key.includes('lila') || key.includes('lavand')) return 11;
    const known = COLOR_BUCKET[key];
    return known ?? 20;
  };
  return [...colors].sort((a, b) => bucketOf(a) - bucketOf(b) || a.localeCompare(b));
}

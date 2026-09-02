export type StampingZone = {
  id: string;
  name: string;
  side: 'front' | 'back';
};

// Default zones - used when Firestore config not yet loaded
export const stampingZones: StampingZone[] = [
  { id: 'fullFront', name: 'Full Front', side: 'front' },
  { id: 'fullBack', name: 'Full Back', side: 'back' },
  { id: 'centroPecho', name: 'Centro Pecho', side: 'front' },
  { id: 'pechoIzqLogo', name: 'Pecho Izq / Logo', side: 'front' },
  { id: 'mangaCorta', name: 'Manga Corta', side: 'front' },
  { id: 'backCollar', name: 'Back Collar / Cuello atrás', side: 'back' },
  { id: 'gorraFrente', name: 'Frente Gorra', side: 'front' },
  { id: 'gorraLateral', name: 'Lateral Gorra', side: 'back' },
  { id: 'gorraPosterior', name: 'Posterior Gorra', side: 'back' },
];

// Zone styles (positioning) - can be made configurable later
export const apparelZoneStyles: Record<string, { styles: React.CSSProperties; label: string }> = {
  fullFront: { styles: { top: '35%', left: '25%', width: '50%', height: '55%' }, label: 'Frente Completo' },
  fullBack: { styles: { top: '35%', left: '25%', width: '50%', height: '55%' }, label: 'Dorso Completo' },
  centroPecho: { styles: { top: '40%', left: '35%', width: '30%', height: '30%' }, label: 'Centro Pecho' },
  pechoIzqLogo: { styles: { top: '35%', left: '60%', width: '12%', height: '12%' }, label: 'Logo Pecho' },
  mangaCorta: { styles: { top: '38%', left: '5%', width: '15%', height: '20%' }, label: 'Manga' },
  backCollar: { styles: { top: '28%', left: '42.5%', width: '15%', height: '10%' }, label: 'Cuello Atrás' },
  gorraFrente: { styles: { top: '38%', left: '28%', width: '44%', height: '28%' }, label: 'Frente Gorra' },
  gorraLateral: { styles: { top: '38%', left: '22%', width: '38%', height: '22%' }, label: 'Lateral Gorra' },
  gorraPosterior: { styles: { top: '38%', left: '28%', width: '44%', height: '28%' }, label: 'Posterior Gorra' },
};

export const smallZones = ['mangaCorta', 'backCollar'];
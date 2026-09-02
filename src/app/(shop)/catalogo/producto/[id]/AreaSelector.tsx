'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Shirt, Info } from 'lucide-react';

const AREA_PRESETS = [
  { id: 'front-back', label: 'Frente + dorso', areas: ['fullFront', 'fullBack'] },
  { id: 'small-back', label: 'Frente chico + dorso grande', areas: ['centroPecho', 'fullBack'] },
  { id: 'left-back', label: 'Pecho izquierdo + dorso', areas: ['pechoIzqLogo', 'fullBack'] },
  { id: 'front-only', label: 'Solo frente', areas: ['fullFront'] },
  { id: 'cap-all', label: 'Frente + lateral + dorso', areas: ['gorraFrente', 'gorraLateral', 'gorraPosterior'] },
  { id: 'cap-front-side', label: 'Frente + lateral', areas: ['gorraFrente', 'gorraLateral'] },
  { id: 'cap-front-back', label: 'Frente + dorso', areas: ['gorraFrente', 'gorraPosterior'] },
  { id: 'cap-front-only', label: 'Solo frente', areas: ['gorraFrente'] },
] as const;

interface AreaSelectorProps {
  availableZones: Array<{ id: string; name: string }>;
  selectedAreasSet: Set<string>;
  isBag: boolean;
  toggleArea: (zoneId: string) => void;
  setSelectedAreas: (areas: string[]) => void;
}

export function AreaSelector({
  availableZones,
  selectedAreasSet,
  isBag,
  toggleArea,
  setSelectedAreas,
}: AreaSelectorProps) {
  if (!availableZones.length) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <p className="text-sm font-medium text-muted-foreground">Área de impresión</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground cursor-help"><Info className="h-3 w-3" aria-hidden="true" /></span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">Elegí dónde irá el estampado. Cada zona adicional agrega costo al precio final.</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {availableZones.map(zone => {
          const active = selectedAreasSet.has(zone.id);
          return (
            <button key={zone.id} type="button" onClick={() => toggleArea(zone.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 h-9 text-sm font-medium transition-[color,background-color,border-color,box-shadow] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? 'border-primary bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}>
              <Shirt className="h-3.5 w-3.5" aria-hidden="true" />{zone.name}
            </button>
          );
        })}
      </div>
      {!isBag && (
        <div className="space-y-1.5 mb-2">
          <p className="text-xs text-muted-foreground">Combinaciones recomendadas</p>
          <div className="flex flex-wrap gap-1.5">
            {AREA_PRESETS.filter((preset: typeof AREA_PRESETS[number]) => preset.areas.every((id: string) => availableZones.some((zone: { id: string; name: string }) => zone.id === id))).map((preset: typeof AREA_PRESETS[number]) => (
              <button key={preset.id} type="button" onClick={() => setSelectedAreas([...preset.areas])}
                className="rounded-full border border-primary/30 bg-primary/5 px-3 h-9 text-xs font-medium text-primary hover:bg-primary/10 transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
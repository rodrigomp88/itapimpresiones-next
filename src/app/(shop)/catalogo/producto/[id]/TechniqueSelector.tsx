'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TECHNIQUE_INFO } from '@/lib/catalog-helpers';

interface TechniqueSelectorProps {
  tecnicas: string[];
  activeTechnique: string;
  onTechniqueChange: (technique: string) => void;
}

export function TechniqueSelector({ tecnicas, activeTechnique, onTechniqueChange }: TechniqueSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1.5">Técnica de impresión</p>
      <div className="flex flex-wrap gap-1.5">
        {tecnicas.map(t => {
          const active = activeTechnique === t;
          const info = TECHNIQUE_INFO[t];
          return (
            <Tooltip key={t}>
              <TooltipTrigger asChild>
                <button type="button" onClick={() => onTechniqueChange(t)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 h-9 text-sm font-medium transition-[color,background-color,border-color,box-shadow] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? 'border-primary bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}>
                  {t}
                </button>
              </TooltipTrigger>
              {info && <TooltipContent side="top" className="max-w-xs text-xs"><p className="font-semibold mb-0.5">{info.label}</p><p>{info.description}</p></TooltipContent>}
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
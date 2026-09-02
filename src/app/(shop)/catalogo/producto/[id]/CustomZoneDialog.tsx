'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export interface ZoneFormState {
  name: string;
  side: 'front' | 'back';
  widthCm: number;
  heightCm: number;
}

interface CustomZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zoneForm: ZoneFormState;
  setZoneForm: (form: ZoneFormState) => void;
  onAdd: () => void;
}

export function CustomZoneDialog({ open, onOpenChange, zoneForm, setZoneForm, onAdd }: CustomZoneDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader><DialogTitle>Nueva zona personalizada</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label htmlFor="zona-nombre" className="text-sm font-medium">Nombre</label>
            <Input id="zona-nombre" value={zoneForm.name} onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })} placeholder="Ej: Logo personalizado" />
          </div>
          <div>
            <span className="text-sm font-medium" aria-label="Lado de la zona">Lado</span>
            <div className="flex gap-2 mt-1" role="group" aria-label="Lado de la zona">
              <Button type="button" variant={zoneForm.side === 'front' ? 'default' : 'outline'} size="sm" onClick={() => setZoneForm({ ...zoneForm, side: 'front' })}>Frente</Button>
              <Button type="button" variant={zoneForm.side === 'back' ? 'default' : 'outline'} size="sm" onClick={() => setZoneForm({ ...zoneForm, side: 'back' })}>Dorso</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zona-ancho" className="text-sm font-medium">Ancho (cm)</label>
              <Input id="zona-ancho" type="number" inputMode="decimal" value={zoneForm.widthCm || ''} onChange={(e) => setZoneForm({ ...zoneForm, widthCm: Number(e.target.value) || 0 })} min="0.1" step="0.1" />
            </div>
            <div>
              <label htmlFor="zona-alto" className="text-sm font-medium">Alto (cm)</label>
              <Input id="zona-alto" type="number" inputMode="decimal" value={zoneForm.heightCm || ''} onChange={(e) => setZoneForm({ ...zoneForm, heightCm: Number(e.target.value) || 0 })} min="0.1" step="0.1" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" onClick={onAdd} disabled={!zoneForm.name.trim()}>Agregar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl?: string;
  title: string;
}

export function SizeGuideModal({ open, onOpenChange, imageUrl, title }: SizeGuideModalProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 flex items-center justify-between">
          <div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
            <DialogDescription className="text-sm">Referencia de medidas para elegir tu talle correcto</DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Cerrar">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="p-4">
          <div className="relative aspect-[3/4] max-h-[70vh] overflow-auto">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain p-4 bg-background"
              priority
              unoptimized
              sizes="100vw"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Las medidas son orientativas y pueden variar según el modelo y proveedor.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
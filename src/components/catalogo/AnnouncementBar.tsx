'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { BrandingSettings } from '@/hooks/use-settings';

export function AnnouncementBar({ branding }: { branding: BrandingSettings }) {
  const [dismissed, setDismissed] = useState(false);

  if (!branding.announcementEnabled || !branding.announcementText || dismissed) {
    return null;
  }

  return (
    <div
      className="w-full border-b px-4 py-2 text-sm font-medium text-center"
      style={{ backgroundColor: branding.primaryColor, color: '#ffffff' }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-4">
        <span className="truncate">{branding.announcementText}</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary/20"
          onClick={() => setDismissed(true)}
          aria-label="Cerrar anuncio"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

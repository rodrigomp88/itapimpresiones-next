'use client';

import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { BrandingSettings } from '@/hooks/use-settings';

interface WhatsAppFloatProps {
  branding: BrandingSettings;
  onOpenChange?: (open: boolean) => void;
}

export function WhatsAppFloat({ branding, onOpenChange }: WhatsAppFloatProps) {
  const [open, setIsOpen] = useState(false);

  if (!branding.whatsappNumber) {
    return null;
  }

  const cleanNumber = branding.whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent(branding.whatsappMessage || 'Hola, quiero consultar');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-white shadow-fab transition-all duration-300 hover:scale-110 hover:shadow-glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        aria-label="Chatear por WhatsApp"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-30" aria-hidden="true" />
        <MessageCircle className="h-7 w-7 relative z-10" aria-hidden="true" />
      </a>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-6 right-6 z-50"
            onClick={() => {
              setIsOpen(false);
              if (onOpenChange) onOpenChange(false);
            }}
            aria-label="Cerrar flotador"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </>
  );
}
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import Image from 'next/image';
import { Send, Loader2, AlertCircle, Package, MessageSquare, Tag as TagIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPriceARS } from '@/lib/formatters';
import type { PublicProduct } from '@/lib/public-products';
import type { BrandingSettings } from '@/hooks/use-settings';

interface InquireModalProps {
  product: PublicProduct | null;
  branding: BrandingSettings;
  /** Controlado por el padre: cierre via X, ESC o clic afuera */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AR_PHONE_REGEX = /^(\+?54\s?)?(9\s?)?\d{10}$/;

export function InquireModal({ product, branding, open, onOpenChange }: InquireModalProps) {
  const { toast } = useToast();
  const productName = product?.type === 'apparel' ? product.producto : product?.nombreDisplay || product?.material || '';
  const price = product?.precioLista || 0;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Mensaje pre-armado solo cuando hay producto (evita texto vacío entre renders)
  const defaultMessage = product
    ? branding.whatsappMessage?.replace('{productName}', productName) || `Hola, quiero consultar por ${productName}`
    : '';
  const effectiveMessage = message || defaultMessage;

  const validatePhone = (value: string): string | null => {
    if (!value) return 'Contanos tu teléfono para responderte';
    const cleaned = value.replace(/\D/g, '');
    if (!AR_PHONE_REGEX.test(cleaned)) {
      return 'Formato inválido. Ej: 5491112345678';
    }
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setPhoneError(value ? validatePhone(value) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const phoneErrorMsg = validatePhone(phone);
    if (phoneErrorMsg) {
      setPhoneError(phoneErrorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanNumber = branding.whatsappNumber?.replace(/\D/g, '');
      const whatsappMessage = `${effectiveMessage}\n\n---` +
        `\nNombre: ${name}` +
        `\nTeléfono: ${phone}` +
        (email ? `\nEmail: ${email}` : '') +
        `\nProducto: ${productName} (${product.code})` +
        `\nTipo: ${product.type === 'apparel' ? 'Indumentaria' : 'Bolsa'}` +
        (price > 0 ? `\nPrecio base: ${formatPriceARS(price)}` : '') +
        (product.tipoImpresion?.length ? `\nTécnica: ${product.tipoImpresion.join(', ')}` : '');

      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setIsSubmitting(false);
      toast({
        title: 'Consulta lista',
        description: 'Se abrió WhatsApp con tu consulta. ¡Gracias!',
      });
    } catch {
      setIsSubmitting(false);
      toast({
        title: 'No se pudo abrir WhatsApp',
        description: 'Revisá tu conexión e intentá nuevamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto shadow-dialog dark:shadow-dialog-dark">
        {product && (
          <>
            <DialogHeader className="pb-1">
              <div className="flex items-center gap-2 text-sm pr-8">
                <Badge variant="secondary" className="gap-1 px-2.5 py-1 text-xs font-medium">
                  <TagIcon className="h-3 w-3" />
                  Consulta rápida
                </Badge>
                <span className="text-muted-foreground font-medium">{product.code}</span>
              </div>
              <DialogTitle className="text-left text-xl font-bold leading-tight pt-1.5">
                Te cotizamos por WhatsApp
              </DialogTitle>
              <DialogDescription className="text-left text-sm text-muted-foreground pt-1">
                Dejanos tus datos y te respondemos al instante.
              </DialogDescription>
            </DialogHeader>

            {/* Producto */}
            <div className="flex items-center gap-3 bg-muted/40 p-3">
              <div className="relative w-14 h-14 bg-background flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.imagenUrl ? (
                  <Image src={product.imagenUrl} alt={productName} fill sizes="56px" className="object-cover" unoptimized />
                ) : (
                  <Package className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{productName}</h4>
                <p className="text-sm font-bold text-primary">{price > 0 ? `${formatPriceARS(price)} /u` : 'Precio a cotizar'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="inq-nombre" className="label-sm text-muted-foreground block">Tu nombre</label>
                <Input id="inq-nombre" placeholder="Ej: Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inq-telefono" className="label-sm text-muted-foreground block">Tu WhatsApp</label>
                <Input
                  id="inq-telefono"
                  placeholder="5491112345678"
                  value={phone}
                  onChange={handlePhoneChange}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={phoneError ? 'true' : 'false'}
                  aria-describedby={phoneError ? 'phone-error' : undefined}
                />
                {phoneError && (
                  <p id="phone-error" className="text-xs text-destructive flex items-center gap-1" role="alert">
                    <AlertCircle className="h-3 w-3" aria-hidden="true" />
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inq-email" className="label-sm text-muted-foreground block">Email <span className="normal-case">(opcional)</span></label>
                <Input id="inq-email" placeholder="Para enviarte el presupuesto" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inq-mensaje" className="label-sm text-muted-foreground block">Mensaje</label>
                <Textarea
                  id="inq-mensaje"
                  placeholder={defaultMessage}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
                {!message && defaultMessage && (
                  <p className="text-xs text-muted-foreground">Se envía: "{defaultMessage}"</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-2 h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    <MessageSquare className="h-5 w-5" aria-hidden="true" />
                    Enviar por WhatsApp
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Te abre WhatsApp con la consulta ya escrita.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

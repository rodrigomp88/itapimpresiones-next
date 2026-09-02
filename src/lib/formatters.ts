// Formatters con Intl hoisted a nivel de módulo (crearlos por llamada es caro)
const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ars2Formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const plainFormatter = new Intl.NumberFormat('es-AR');

export function formatPriceARS(value: number): string {
  return arsFormatter.format(value);
}

export function formatCurrency(value: number): string {
  return ars2Formatter.format(value);
}

export function formatNumberARS(value: number): string {
  return plainFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export function formatDateARS(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return dateFormatter.format(new Date(dateStr + 'T00:00:00'));
}

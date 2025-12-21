/**
 * Tipos para el sistema de pagos
 */

export type PaymentMethod = 'mercadopago' | 'transfer' | 'cash';

export interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  minAmount?: number;
  maxAmount?: number;
  processingTime?: string;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    description: 'Tarjeta de crédito/débito, efectivo en puntos de pago',
    icon: '💳',
    enabled: true,
    processingTime: 'Inmediato',
  },
  {
    id: 'transfer',
    name: 'Transferencia Bancaria',
    description: 'Transferencia a cuenta bancaria (verificación en 24-48hs)',
    icon: '🏦',
    enabled: true,
    minAmount: 5000,
    processingTime: '24-48 horas',
  },
  {
    id: 'cash',
    name: 'Efectivo al Retirar',
    description: 'Pagás cuando retirás tu pedido en nuestro local',
    icon: '💵',
    enabled: true,
    processingTime: 'Al retirar',
  },
];

export interface BankTransferDetails {
  bank: string;
  accountType: string;
  accountNumber: string;
  cbu: string;
  alias: string;
  holder: string;
  cuit: string;
}

export const BANK_TRANSFER_INFO: BankTransferDetails = {
  bank: 'Banco Galicia',
  accountType: 'Cuenta Corriente',
  accountNumber: '123456/7',
  cbu: '0070999030004123456710',
  alias: 'ITAP.IMPRESIONES',
  holder: 'ITAP Impresiones SRL',
  cuit: '30-12345678-9',
};

export interface PaymentResult {
  success: boolean;
  orderId: string;
  paymentMethod: PaymentMethod;
  redirectUrl?: string;
  message: string;
  transferDetails?: BankTransferDetails;
}

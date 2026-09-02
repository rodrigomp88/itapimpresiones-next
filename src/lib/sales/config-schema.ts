import { z } from 'zod';

export const discountTierSchema = z.object({
  quantity: z.coerce.number().int().positive(),
  discount: z.coerce.number().min(0).max(1),
  commissionReduction: z.coerce.number().min(0).max(1).default(0),
});

export const bagDiscountTierSchema = z.object({
  quantity: z.coerce.number().int().positive(),
  discount: z.coerce.number().min(0).max(1),
  commissionReduction: z.coerce.number().min(0).max(1),
});

export const sellerSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  isActive: z.boolean(),
});

// Branding / Catálogo Público
export const brandingSchema = z.object({
  businessName: z.string().default('Itap Impresiones'),
  businessDescription: z.string().default('Impresiones textiles y bolsas ecológicas personalizadas'),
  logoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#154212'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#A8C69F'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#D48C2E'),
  whatsappNumber: z.string().default(''),
  whatsappMessage: z.string().default('Hola, quiero consultar por {productName}'),
  announcementText: z.string().default(''),
  announcementEnabled: z.boolean().default(false),
  catalogEnabled: z.boolean().default(true),
  catalogShowPrices: z.boolean().default(false),
  sizeGuideImageUrl: z.string().url().optional().or(z.literal('')),
  sizeGuideTitle: z.string().default('Guía de Talles'),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
});

export const settingsSchema = z.object({
  // Macro
  dolar: z.coerce.number().positive({ message: 'Debe ser un número positivo.' }),
  nafta: z.coerce.number().positive({ message: 'Debe ser un número positivo.' }),
  consumoAuto: z.coerce.number().positive({ message: 'Debe ser un número positivo.' }),
  amortizacionAuto: z.coerce.number().min(0).max(1),
  kmRecorridoLocal: z.coerce.number().int().min(0),
  viajesAlMes: z.coerce.number().int().min(0),

  // Gastos Fijos
  alquiler: z.coerce.number().min(0),
  energia: z.coerce.number().min(0),
  internet: z.coerce.number().min(0),
  celular: z.coerce.number().min(0),
  monotributo: z.coerce.number().min(0),
  produccionEstimadaPrendas: z.coerce.number().int().positive(),
  produccionEstimadaBolsas: z.coerce.number().int().positive(),

  // Mano de Obra y Costos de Pack
  valorHoraPrenda: z.coerce.number().min(0),
  prendasPorHora: z.coerce.number().int().positive(),
  valorHoraBolsa: z.coerce.number().min(0),
  unidadesPorHoraBolsa: z.coerce.number().int().positive(),
  horasLaboralesPorDia: z.coerce.number().positive('Debe ser mayor a 0.'),
  costoPackPremium: z.coerce.number().min(0, 'El costo no puede ser negativo.'),
  costoPackECO: z.coerce.number().min(0, 'El costo no puede ser negativo.'),
  
  // Aplicación DTF
  usaAplicacionDTFExterna: z.boolean(),
  costoAplicacionDTFExterna: z.coerce.number().min(0),
  costoPlancha: z.coerce.number().min(0, "El costo de la plancha no puede ser negativo."),
  vidaUtilPlanchaMeses: z.coerce.number().int().positive("La vida útil debe ser un número entero positivo."),
  costoEnergiaAplicacion: z.coerce.number().min(0, "El costo de energía no puede ser negativo."),
  factorAplicacionDTFChica: z.coerce.number().min(0).max(1, 'Factor 0-1 (ej: 0.5 para 50%).').default(0.5),
  mermaBolsa: z.coerce.number().min(1).max(2, 'Factor de merma (ej: 1.03 para 3%).').default(1.03),


  // Costos Comerciales Generales
  iibb: z.coerce.number().min(0).max(1, 'Debe ser un valor entre 0 y 1 (ej: 0.04 para 4%).'),
  publicidad: z.coerce.number().min(0).max(1, 'Debe ser un valor entre 0 y 1.'),
  recargoTarjeta: z.coerce.number().min(0).max(1, 'Debe ser un valor entre 0 y 1 (ej: 0.15 para 15%).'),
  objetivoMargenGlobal: z.coerce.number().min(0).max(1, 'Debe ser un valor entre 0 y 1 (ej: 0.30 para 30%).'),

  // Márgenes y Comisiones - Ropa
  margenContadoPrenda: z.coerce.number().min(0).max(1, 'Debe ser un valor entre 0 y 1 (ej: 0.30 para 30%).'),
  gananciaMinimaPrenda: z.coerce.number().min(0).max(1),
  comisionVendedorPrenda: z.coerce.number().min(0).max(1, 'La comisión debe estar entre 0 y 1.'),
  
  // Márgenes y Comisiones - Bolsas
  margenContadoBolsa: z.coerce.number().min(0).max(1, 'Debe ser un valor entre 0 y 1 (ej: 0.30 para 30%).'),
  gananciaMinimaBolsa: z.coerce.number().min(0).max(1),
  comisionVendedorBolsa: z.coerce.number().min(0).max(1, 'La comisión debe estar entre 0 y 1.'),

  // DTF
  costoMetroLinealDTF: z.coerce.number().min(0),
  anchoUtilDTF: z.coerce.number().positive(),
  largoRolloDTF: z.coerce.number().positive(),
  mermaDTF: z.coerce.number().min(1),

  // Serigrafía
  costoFijoSerigrafiaPrenda: z.coerce.number().min(0, 'El costo no puede ser negativo.'),
  coloresIncluidosSerigrafiaPrenda: z.coerce.number().int().min(1).max(8).default(2),
  factorDobleFazSerigrafiaPrenda: z.coerce.number().min(1).max(5).default(2),
  costoBaseSerigrafiaBolsa: z.coerce.number().min(0),
  costoColorAdicionalSerigrafiaBolsa: z.coerce.number().min(0),

  // Vinilo
  costoViniloPorCm2: z.coerce.number().min(0, 'El costo no puede ser negativo.').default(0.85),
  costoFijoVinilo: z.coerce.number().min(0, 'El costo fijo de vinilo no puede ser negativo.').default(500),

  // Sublimación
  costoSublimacionPorCm2: z.coerce.number().min(0, 'El costo no puede ser negativo.').default(1.20),
  costoFijoSublimacion: z.coerce.number().min(0, 'El costo fijo de sublimación no puede ser negativo.').default(800),

  // Bordado
  costoBordadoBase: z.coerce.number().min(0, 'El costo base de bordado no puede ser negativo.').default(2500),
  costoBordadoPorPunto: z.coerce.number().min(0, 'El costo por punto no puede ser negativo.').default(0.05),
  puntosPorMinuto: z.coerce.number().int().positive('Debe ser un número entero positivo.').default(800),
  velocidadBordado: z.coerce.number().int().positive('Debe ser un número entero positivo.').default(800),

  // Transfer
  costoTransferPorCm2: z.coerce.number().min(0, 'El costo no puede ser negativo.').default(0.95),
  costoFijoTransfer: z.coerce.number().min(0, 'El costo fijo de transfer no puede ser negativo.').default(600),

  // Vendedores
  sellers: z.array(sellerSchema).default([
    { id: 'default', name: 'Sin Asignar', email: '', isActive: true },
    { id: 'seller1', name: 'Vendedor 1', email: 'vendedor1@empresa.com', isActive: true },
    { id: 'seller2', name: 'Vendedor 2', email: 'vendedor2@empresa.com', isActive: true },
  ]),

  // Descuentos por Volumen
  descuentosPrenda: z.array(discountTierSchema).default([]),
  descuentosPrendaHabilitados: z.boolean().default(false),
  descuentosBolsa: z.array(bagDiscountTierSchema).default([]),
  descuentosBolsaHabilitados: z.boolean().default(false),

  // Mínimos de Cantidad por Producto y Técnica
  minimosCantidad: z.object({
    indumentaria: z.object({
      serigrafia: z.coerce.number().int().min(1).default(5),
      dtf: z.coerce.number().int().min(1).default(1),
      sublimado: z.coerce.number().int().min(1).default(1),
      sinImpresion: z.coerce.number().int().min(1).default(1),
    }),
    bolsas: z.object({
      serigrafia: z.coerce.number().int().min(1).default(100),
      dtf: z.coerce.number().int().min(1).default(10),
      sublimado: z.coerce.number().int().min(1).default(10),
      sinImpresion: z.coerce.number().int().min(1).default(1),
    }),
  }).default({
    indumentaria: { serigrafia: 5, dtf: 1, sublimado: 1, sinImpresion: 1 },
    bolsas: { serigrafia: 100, dtf: 10, sublimado: 10, sinImpresion: 1 },
  }),

  // Pricing
  descuentoCompetitivo: z.coerce.number().min(0, 'El descuento no puede ser negativo.').default(1000),
  costoDobleFazSerigrafiaBolsa: z.coerce.number().min(0, 'El costo no puede ser negativo.').default(50),

  // Terminaciones (costos por terminación, se suman por producto)
  costoEtiquetado: z.coerce.number().min(0).default(0),
  costoDoblado: z.coerce.number().min(0).default(0),
  costoEmbolsado: z.coerce.number().min(0).default(0),
  costoHangtag: z.coerce.number().min(0).default(0),
  costoSticker: z.coerce.number().min(0).default(0),
  costoPackaging: z.coerce.number().min(0).default(0),

  // Notificaciones
  autoNotifyEnabled: z.boolean().default(false),

  // Condiciones de Pago
  paymentConditions: z.string().optional().default('Transf. Bancaria, Mercado Pago, Efectivo. Se requiere 50% de seña para confirmar el pedido.'),

  // Presupuesto
  presupuestoValidoDias: z.coerce.number().int().min(1).max(90).default(7),

  // Branding / Catálogo Público
  branding: brandingSchema.prefault({}),
});

export type SettingsValues = z.infer<typeof settingsSchema>;

export const defaultSettings: SettingsValues = {
  // Macro
  dolar: 1475,
  nafta: 1650,
  consumoAuto: 10,
  amortizacionAuto: 0.3,
  kmRecorridoLocal: 25,
  viajesAlMes: 12,
  
  // Gastos Fijos
  alquiler: 28000,
  energia: 0,
  internet: 5000,
  celular: 15000,
  monotributo: 65000,
  produccionEstimadaPrendas: 500,
  produccionEstimadaBolsas: 5000,
  
  // Mano de Obra y Costos de Pack
  valorHoraPrenda: 9000,
  prendasPorHora: 9,
  valorHoraBolsa: 5000,
  unidadesPorHoraBolsa: 200,
  horasLaboralesPorDia: 8,
  costoPackPremium: 1050,
  costoPackECO: 150,
  
  // Aplicación DTF
  usaAplicacionDTFExterna: true,
  costoAplicacionDTFExterna: 1000,
  costoPlancha: 600000,
  vidaUtilPlanchaMeses: 24,
  costoEnergiaAplicacion: 30,
  factorAplicacionDTFChica: 0.5,
  mermaBolsa: 1.03,

  // Costos Comerciales Generales
  iibb: 0.04,
  publicidad: 0.05,
  recargoTarjeta: 0.15,
  objetivoMargenGlobal: 0.30,
  
  // Márgenes y Comisiones - Ropa
  margenContadoPrenda: 0.43,
  gananciaMinimaPrenda: 0.15, 
  comisionVendedorPrenda: 0.16,

  // Márgenes y Comisiones - Bolsas
  margenContadoBolsa: 0.3,
  gananciaMinimaBolsa: 0.1,
  comisionVendedorBolsa: 0.10,
  
  // DTF
  costoMetroLinealDTF: 10214.50,
  anchoUtilDTF: 58,
  largoRolloDTF: 100,
  mermaDTF: 1.4,
  
  // Serigrafía
  costoFijoSerigrafiaPrenda: 1500,
  coloresIncluidosSerigrafiaPrenda: 2,
  factorDobleFazSerigrafiaPrenda: 2,
  costoBaseSerigrafiaBolsa: 100,
  costoColorAdicionalSerigrafiaBolsa: 50,

  // Vinilo
  costoViniloPorCm2: 0.85,
  costoFijoVinilo: 500,

  // Sublimación
  costoSublimacionPorCm2: 1.20,
  costoFijoSublimacion: 800,

  // Bordado
  costoBordadoBase: 2500,
  costoBordadoPorPunto: 0.05,
  puntosPorMinuto: 800,
  velocidadBordado: 800,

  // Transfer
  costoTransferPorCm2: 0.95,
  costoFijoTransfer: 600,
  
  // Vendedores
  sellers: [
    { id: 'default', name: 'Sin Asignar', email: '', isActive: true },
    { id: 'seller1', name: 'Vendedor 1', email: 'vendedor1@empresa.com', isActive: true },
    { id: 'seller2', name: 'Vendedor 2', email: 'vendedor2@empresa.com', isActive: true },
  ],

  // Descuentos por Volumen
  descuentosPrenda: [],
  descuentosPrendaHabilitados: false,
  descuentosBolsa: [],
  descuentosBolsaHabilitados: false,

  // Mínimos de Cantidad
  minimosCantidad: {
    indumentaria: { serigrafia: 5, dtf: 1, sublimado: 1, sinImpresion: 1 },
    bolsas: { serigrafia: 100, dtf: 10, sublimado: 10, sinImpresion: 1 },
  },

  // Pricing
  descuentoCompetitivo: 1000,
  costoDobleFazSerigrafiaBolsa: 50,

  // Terminaciones
  costoEtiquetado: 0,
  costoDoblado: 0,
  costoEmbolsado: 0,
  costoHangtag: 0,
  costoSticker: 0,
  costoPackaging: 0,

  // Notificaciones
  autoNotifyEnabled: false,

  // Condiciones de Pago
  paymentConditions: 'Transf. Bancaria, Mercado Pago, Efectivo. Se requiere 50% de seña para confirmar el pedido.',

  // Presupuesto
  presupuestoValidoDias: 7,

  // Branding / Catálogo Público
  branding: {
    businessName: 'Itap Impresiones',
    businessDescription: 'Impresiones textiles y bolsas ecológicas personalizadas',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#154212',
    secondaryColor: '#A8C69F',
    accentColor: '#D48C2E',
    whatsappNumber: '',
    whatsappMessage: 'Hola, quiero consultar por {productName}',
    announcementText: '',
    announcementEnabled: false,
    catalogEnabled: true,
    catalogShowPrices: false,
    sizeGuideImageUrl: '',
    sizeGuideTitle: 'Guía de Talles',
    instagramUrl: '',
    facebookUrl: '',
  },
};

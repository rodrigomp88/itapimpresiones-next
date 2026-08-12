import { z } from "zod";

// Schema para productos
export const productSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  unity: z.number().int().positive("Las unidades mínimas deben ser mayor a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  size: z.string().optional(),
  bagType: z.enum(["troquel", "manija", ""]).optional(),
});

// Schema para formularios de contacto
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  message: z
    .string()
    .min(1, "El mensaje es requerido")
    .max(2000, "El mensaje no puede exceder 2000 caracteres"),
  service: z.string().optional(),
  quantity: z
    .number()
    .int()
    .positive("La cantidad debe ser mayor a 0")
    .optional(),
  bagSize: z.string().optional(),
  productType: z.string().optional(),
  formType: z.enum(["services", "bags", "apparel"]),
});

// Schema para direcciones de envío
export const shippingAddressSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  mail: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(8, "Teléfono inválido")
    .max(20, "Teléfono demasiado largo"),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "Dirección demasiado larga"),
  city: z
    .string()
    .min(2, "Ciudad requerida")
    .max(100, "Ciudad demasiado larga"),
  postalCode: z
    .string()
    .min(4, "Código postal inválido")
    .max(10, "Código postal demasiado largo"),
  province: z
    .string()
    .min(2, "Provincia requerida")
    .max(100, "Provincia demasiado larga"),
  notes: z.string().max(500, "Notas demasiado largas").optional(),
});

// Schema para órdenes
export const orderSchema = z.object({
  userID: z.string().min(1, "El ID de usuario es requerido"),
  userEmail: z.string().email("Email inválido"),
  orderAmount: z.number().positive("El monto debe ser mayor a 0"),
  orderStatus: z.string().min(1, "El estado es requerido"),
  orderItems: z
    .array(
      z.object({
        id: z.string().min(1, "ID requerido"),
        name: z.string().min(1, "Nombre requerido"),
        price: z.number().positive("Precio debe ser mayor a 0"),
        cartQuantity: z.number().int().positive("Cantidad debe ser mayor a 0"),
        imageURL: z.string().url("URL de imagen inválida"),
      })
    )
    .min(1, "Debe haber al menos un item"),
  shippingAddress: shippingAddressSchema,
});

// Tipos inferidos
export type ProductFormData = z.infer<typeof productSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type OrderData = z.infer<typeof orderSchema>;

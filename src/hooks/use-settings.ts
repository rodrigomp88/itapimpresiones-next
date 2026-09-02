import type { z } from "zod";
import type { brandingSchema } from "@/lib/sales/config-schema";

// En la web solo necesitamos el tipo (el catálogo lee settings vía getPublicSettings).
export type BrandingSettings = z.infer<typeof brandingSchema>;

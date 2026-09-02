import { Metadata } from "next";
import { CatalogPage } from "./CatalogPage";

export const metadata: Metadata = {
  title: "Catálogo de Productos | ITAP Impresiones",
  description:
    "Descubrí nuestra línea completa de indumentaria personalizable (DTF, Serigrafía) y bolsas ecológicas. Consultá precios al instante.",
};

export default function CatalogoRoute() {
  return <CatalogPage />;
}

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  limit as fbLimit,
  addDoc,
  doc,
  getDoc,
  type DocumentSnapshot,
} from "firebase/firestore";
import getSalesApp from "@/firebase/sales";
import { ACTIVE_PRODUCT_STATUSES } from "./types";
import type { PublicBudgetRequest } from "./types";
import { settingsSchema, type SettingsValues } from "./config-schema";

export type PublicProduct = {
  id: string;
  type: "apparel" | "bags";
  code: string;
  producto: string;
  material: string;
  proveedor: string;
  costoLista: number;
  precioLista: number;
  moneda: string;
  sizes: {
    talle: string;
    ancho_cm?: number;
    largo_cm?: number;
    hombro_cm?: number;
    manga_cm?: number;
  }[];
  colors: string[];
  imagenUrl?: string;
  visualType?: string;
  composicion?: string;
  caracteristicas_tela?: string;
  uso_recomendado?: string;
  cuidado?: string;
  medidas_nota?: string;
  familia_cuidados?: string;
  esCore?: boolean;
  estado: string;
  validZones?: string[];
  origen?: string;
  unidBulto?: number;
  costoFleteBulto?: number;
  medida?: string;
  tipoManija?: string;
  color?: string;
  colorInterior?: string;
  colorExterior?: string;
  tipoImpresion?: string[];
  colorsExterior?: string[];
  colorsInterior?: string[];
  cierre?: string;
  refuerzos?: string;
  sublimable?: boolean;
  // Nombre descriptivo para mostrar en catálogo
  nombreDisplay?: string;
  descripcion?: string;
  descripcionBullets?: string[];
  marca?: string;
  genero?: string;
  modelo?: string;
  pesoMaterial?: string;
  normasDiseno?: string;
  preguntasFrecuentes?: Array<{ pregunta: string; respuesta: string }>;
  procesoPedido?: string;
};

// Normaliza tipoImpresion a array (soporta string legacy y array de Firestore)
function normalizeTechniques(value: unknown): string[] | undefined {
  if (Array.isArray(value))
    return value.filter((v) => typeof v === "string") as string[];
  if (typeof value === "string" && value) return [value];
  return undefined;
}

function mapApparelProduct(doc: DocumentSnapshot): PublicProduct {
  const data = doc.data() ?? {};

  const normalizeSizes = (
    sizes: unknown[]
  ): {
    talle: string;
    ancho_cm?: number;
    largo_cm?: number;
    hombro_cm?: number;
    manga_cm?: number;
  }[] => {
    if (!Array.isArray(sizes)) return [];
    return sizes.reduce<
      {
        talle: string;
        ancho_cm?: number;
        largo_cm?: number;
        hombro_cm?: number;
        manga_cm?: number;
      }[]
    >((acc, s) => {
      let normalized: {
        talle: string;
        ancho_cm?: number;
        largo_cm?: number;
        hombro_cm?: number;
        manga_cm?: number;
      };
      if (typeof s === "string") {
        normalized = { talle: s };
      } else if (typeof s === "number") {
        normalized = { talle: String(s) };
      } else if (s && typeof s === "object") {
        const obj = s as Record<string, unknown>;
        const talle = obj.talle || obj.size || obj.talla || obj.name || "";
        normalized = {
          talle: String(talle).toUpperCase(),
          ancho_cm: obj.ancho_cm as number | undefined,
          largo_cm: obj.largo_cm as number | undefined,
          hombro_cm: obj.hombro_cm as number | undefined,
          manga_cm: obj.manga_cm as number | undefined,
        };
      } else {
        normalized = { talle: "" };
      }
      if (normalized.talle) acc.push(normalized);
      return acc;
    }, []);
  };

  return {
    id: doc.id,
    type: "apparel",
    code: data.code ?? "",
    producto: data.producto ?? data.nombre ?? "",
    material: "",
    proveedor: data.proveedor ?? "",
    costoLista: data.costoLista ?? data.precioLista ?? 0,
    precioLista: data.costoLista ?? data.precioLista ?? 0,
    moneda: "ARS",
    sizes: normalizeSizes(data.sizes as unknown[]),
    colors: data.colores ?? data.colors ?? [],
    imagenUrl: data.imagenUrl,
    visualType: data.visualType ?? "tshirt",
    composicion: data.composicion,
    caracteristicas_tela: data.caracteristicas_tela,
    uso_recomendado: data.uso_recomendado,
    cuidado: data.cuidado,
    medidas_nota: data.medidas_nota,
    familia_cuidados: data.familia_cuidados,
    esCore: data.esCore ?? false,
    estado: data.estado ?? "a_pedidos",
    validZones: data.validZones ?? [],
    tipoImpresion: normalizeTechniques(data.tipoImpresion),
    descripcion: data.descripcion,
    descripcionBullets: data.descripcionBullets,
    marca: data.marca,
    genero: data.genero,
    modelo: data.modelo,
    pesoMaterial: data.pesoMaterial ?? data.peso_material,
    normasDiseno: data.normasDiseno ?? data.normas_diseno,
    preguntasFrecuentes: data.preguntasFrecuentes ?? data.preguntas_frecuentes,
    procesoPedido: data.procesoPedido ?? data.proceso_pedido,
  };
}

function mapBagProduct(doc: DocumentSnapshot): PublicProduct {
  const data = doc.data() ?? {};
  const isLocal = (data.code || "").includes("-LOC-") || data.origen === "LOCAL";
  const proveedorFinal = data.proveedor || (isLocal ? "Eco Rodeo" : "Corbag");

  // Fallback para tipoManija igual que en useProducts (lee del código -RIN-)
  const tipoManija =
    data.tipoManija ?? (data.code?.includes("-RIN-") ? "RIÑON" : "TIRAS");
  const medidasTxt = data.medidas ?? data.medida ?? "";
  const catWeb = data.catalogoWeb;

  return {
    id: doc.id,
    type: "bags",
    code: data.code ?? "",
    producto: catWeb?.nombre ?? data.material ?? data.producto ?? "",
    material: data.material ?? "",
    proveedor: proveedorFinal,
    costoLista: data.costoLista ?? data.precioLista ?? 0,
    precioLista: data.precioLista ?? data.costoLista ?? 0,
    moneda: data.moneda ?? (isLocal ? "ARS" : "USD"),
    sizes: [],
    colors: data.colores ?? data.colors ?? [],
    imagenUrl: data.imagenUrl ?? catWeb?.imagen ?? undefined,
    visualType: "",
    composicion: data.composicion ?? "",
    caracteristicas_tela: data.caracteristicas_tela ?? "",
    descripcion: catWeb?.descripcion ?? data.descripcion,
    descripcionBullets: data.descripcionBullets,
    uso_recomendado: catWeb?.referencia_uso ?? data.uso_recomendado ?? "",
    cuidado: data.cuidado ?? "",
    medidas_nota: catWeb?.medida_detalle ?? data.medidas_nota ?? "",
    familia_cuidados: data.familia_cuidados ?? "",
    esCore: data.esCore ?? false,
    estado: data.estado ?? "a_pedidos",
    validZones: data.validZones ?? [],
    origen: data.origen,
    unidBulto: data.unidBulto,
    costoFleteBulto: data.costoFleteBulto,
    medida: data.medida,
    tipoManija: tipoManija,
    color: data.color,
    colorInterior: data.colorInterior,
    colorExterior: data.colorExterior,
    tipoImpresion: normalizeTechniques(data.tipoImpresion),
    colorsExterior: data.colorsExterior,
    colorsInterior: data.colorsInterior,
    cierre: catWeb?.cierre ?? undefined,
    refuerzos: catWeb?.refuerzos ?? undefined,
    sublimable:
      typeof catWeb?.sublimable === "boolean" ? catWeb.sublimable : undefined,
    nombreDisplay:
      catWeb?.nombre ??
      (medidasTxt && tipoManija
        ? `Bolsa ${data.material} ${medidasTxt} ${tipoManija}`
        : data.material ?? data.producto ?? "Bolsa"),
    marca: data.marca ?? catWeb?.marca,
    genero: data.genero ?? catWeb?.genero,
    modelo: data.modelo ?? catWeb?.modelo,
    pesoMaterial: data.pesoMaterial ?? catWeb?.peso_material,
    normasDiseno: data.normasDiseno ?? catWeb?.normas_diseno,
    preguntasFrecuentes:
      data.preguntasFrecuentes ?? catWeb?.preguntas_frecuentes,
    procesoPedido: data.procesoPedido ?? catWeb?.proceso_pedido,
  };
}

export async function getPublicProducts(
  maxProducts = 100
): Promise<PublicProduct[]> {
  try {
    const db = getFirestore(getSalesApp());

    const [apparelSnap, bagsSnap] = await Promise.all([
      getDocs(
        query(
          collection(db, "products"),
          where("estado", "in", ACTIVE_PRODUCT_STATUSES),
          orderBy("producto"),
          fbLimit(maxProducts)
        )
      ),
      getDocs(
        query(
          collection(db, "bag-products"),
          where("estado", "in", ACTIVE_PRODUCT_STATUSES),
          orderBy("material"),
          fbLimit(maxProducts)
        )
      ),
    ]);

    // Filtrar bolsas que estén duplicadas en products (la fuente canónica de bolsas es bag-products)
    const apparelProducts = apparelSnap.docs.reduce<PublicProduct[]>(
      (acc, d) => {
        if (!(d.data().code || "").startsWith("BOL-"))
          acc.push(mapApparelProduct(d));
        return acc;
      },
      []
    );
    const bagProducts = bagsSnap.docs.map(mapBagProduct);

    return [...apparelProducts, ...bagProducts].sort((a, b) => {
      // Prioridad de entrada: bolsas locales primero (dentro del mismo tipo)
      if (a.type === "bags" && b.type === "bags" && a.origen !== b.origen) {
        return a.origen === "LOCAL" ? -1 : 1;
      }
      const nameA = a.type === "apparel" ? a.producto : a.nombreDisplay || a.material;
      const nameB = b.type === "apparel" ? b.producto : b.nombreDisplay || b.material;
      return nameA.localeCompare(nameB);
    });
  } catch (error) {
    console.error("[Sales] Error fetching public products:", error);
    return [];
  }
}

// Suscripción en tiempo real: el catálogo se actualiza al instante cuando
// cambian productos en la app (sin necesidad de recargar la página).
export function subscribePublicProducts(
  onData: (products: PublicProduct[]) => void,
  onError?: (error: unknown) => void,
  maxProducts = 100
): () => void {
  const db = getFirestore(getSalesApp());
  const seen = { apparel: [] as PublicProduct[], bags: [] as PublicProduct[] };

  const emit = () => {
    const all = [...seen.apparel, ...seen.bags].sort((a, b) => {
      if (a.type === "bags" && b.type === "bags" && a.origen !== b.origen) {
        return a.origen === "LOCAL" ? -1 : 1;
      }
      const nameA = a.type === "apparel" ? a.producto : a.nombreDisplay || a.material;
      const nameB = b.type === "apparel" ? b.producto : b.nombreDisplay || b.material;
      return nameA.localeCompare(nameB);
    });
    onData(all);
  };

  const unsubs = [
    onSnapshot(
      query(
        collection(db, "products"),
        where("estado", "in", ACTIVE_PRODUCT_STATUSES),
        orderBy("producto"),
        fbLimit(maxProducts)
      ),
      (snap) => {
        seen.apparel = snap.docs.reduce<PublicProduct[]>((acc, d) => {
          if (!(d.data().code || "").startsWith("BOL-"))
            acc.push(mapApparelProduct(d));
          return acc;
        }, []);
        emit();
      },
      onError
    ),
    onSnapshot(
      query(
        collection(db, "bag-products"),
        where("estado", "in", ACTIVE_PRODUCT_STATUSES),
        orderBy("material"),
        fbLimit(maxProducts)
      ),
      (snap) => {
        seen.bags = snap.docs.map(mapBagProduct);
        emit();
      },
      onError
    ),
  ];
  return () => unsubs.forEach((u) => u());
}

export async function getPublicProductById(
  id: string,
  type: "apparel" | "bags"
): Promise<PublicProduct | null> {
  try {
    const db = getFirestore(getSalesApp());
    const collectionName = type === "apparel" ? "products" : "bag-products";
    const snap = await getDocs(
      query(collection(db, collectionName), where("__name__", "==", id))
    );
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return type === "apparel"
      ? mapApparelProduct(docSnap)
      : mapBagProduct(docSnap);
  } catch (error) {
    console.error("[Sales] Error fetching public product:", error);
    return null;
  }
}

export async function getPublicSettings(): Promise<SettingsValues | null> {
  try {
    const db = getFirestore(getSalesApp());
    const snap = await getDoc(doc(db, "config", "app_settings"));
    if (!snap.exists()) return null;
    const data = snap.data();
    // Parsear con settingsSchema para obtener SettingsValues completo
    const parsed = settingsSchema.safeParse(data);
    if (!parsed.success) {
      console.warn(
        "[Sales] Settings parse warning:",
        parsed.error.flatten().fieldErrors
      );
      // Fallback: defaults para campos faltantes
      return settingsSchema.parse({});
    }
    return parsed.data;
  } catch (error) {
    console.error("[Sales] Error fetching settings:", error);
    return null;
  }
}

import type {
  SizeCategory,
  Zone,
  VisualTypeConfig,
} from "./apparel-measures";

export interface PublicStampingConfig {
  sizeCategories: SizeCategory[];
  zones: Zone[];
  visualTypes: VisualTypeConfig[];
}

/**
 * Trae stamping-config/current (configuración de zonas de estampado del
 * cotizador interno) para que los precios del catálogo público coincidan.
 */
export async function getPublicStampingConfig(): Promise<PublicStampingConfig | null> {
  try {
    // stamping-config requiere auth → anonymous sign-in previo
    const { ensureSalesAuth } = await import("@/firebase/sales");
    await ensureSalesAuth();
    const db = getFirestore(getSalesApp());
    const snap = await getDoc(doc(db, "stamping-config", "current"));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    if (!data?.sizeCategories || !data?.zones || !data?.visualTypes) return null;
    return {
      sizeCategories: data.sizeCategories as SizeCategory[],
      zones: data.zones as Zone[],
      visualTypes: data.visualTypes as VisualTypeConfig[],
    };
  } catch (error) {
    console.warn("[Sales] Error fetching stamping config:", error);
    return null;
  }
}

// Firestore rechaza undefined en cualquier nivel del objeto — limpiar recursivamente
function deepCleanUndefined(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(deepCleanUndefined);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, deepCleanUndefined(v)])
    );
  }
  return obj;
}

// Submit a public budget request from the catalog
export async function submitPublicBudgetRequest(
  request: Omit<PublicBudgetRequest, "id" | "createdAt" | "status">
): Promise<string | null> {
  try {
    const firestore = getFirestore(getSalesApp());
    const cleanPayload = deepCleanUndefined({
      ...request,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    const docRef = await addDoc(
      collection(firestore, "public-budget-requests"),
      cleanPayload
    );
    return docRef.id;
  } catch (error) {
    console.error("[Sales] Error submitting budget request:", error);
    return null;
  }
}

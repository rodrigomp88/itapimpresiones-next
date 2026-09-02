import ProductDetailsClient from "@/components/ProductDetailsClient";
import { db } from "@/firebase/config";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { Product, ProductImage } from "@/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cachedQuery, CACHE_KEYS, CACHE_TTL } from "@/lib/firebase-cache";

// ISR: Revalidar cada hora (3600 segundos)
export const revalidate = 3600;

// Permitir generar nuevas rutas dinámicamente
export const dynamicParams = true;

// Definimos el tipo de las props para Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "Remera Algodón Blanca",
    slug: "remera-algodon-blanca",
    price: 2500,
    images: [{ url: "/images/carousel1.webp", color: "Blanco" }],
    pause: false,
    unity: 1,
    size: "M",
    category: "Remeras",
    color: "Blanco",
    description: "Remera de algodón peinado 100%. Calidad premium.",
    stock: 50,
    stockType: "physical",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bolsa Friselina Standard",
    slug: "bolsa-friselina-standard",
    price: 800,
    images: [{ url: "/images/brand/logo-horizontal-negro.svg", color: "Blanco" }],
    pause: false,
    unity: 1,
    size: "30x40",
    category: "Bolsas",
    color: "Blanco",
    bagType: "manija",
    description: "Bolsa de friselina ecológica. Personalizable.",
    stock: 200,
    stockType: "physical",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Gorra Bordada Negra",
    slug: "gorra-bordada-negra",
    price: 3500,
    images: [{ url: "/images/carousel3.webp", color: "Negro" }],
    pause: false,
    unity: 1,
    size: "Única",
    category: "Gorras",
    color: "Negro",
    description: "Gorra con bordado personalizado. Estilo único.",
    stock: 30,
    stockType: "physical",
    createdAt: new Date().toISOString(),
  },
];

async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;

  if (!db) {
    console.warn("Firestore not available. Showing fallback product.");
    return fallbackProducts.find((p) => p.slug === slug) || null;
  }

  return cachedQuery(
    CACHE_KEYS.productBySlug(slug),
    async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          return null;
        }

        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();

        const productData = {
          id: docSnap.id,
          name: data.name,
          slug: data.slug,
          price: data.price,
          images: data.images || [],
          pause: data.pause,
          unity: data.unity,
          size: data.size,
          category: data.category,
          color: data.color || "Todos",
          bagType: data.bagType,
          description: data.description || data.desc,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString(),
        };

        return productData as Product;
      } catch (error) {
        console.error(
          "Servidor: Error al obtener el producto por slug:",
          error
        );
        return null;
      }
    },
    CACHE_TTL.PRODUCT_DETAIL
  );
}

export async function generateStaticParams() {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      return [];
    }

    const paths = snapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));

    return paths.filter((p) => p.slug);
  } catch (error) {
    console.error("Error al generar las rutas estáticas de productos:", error);
    return [];
  }
}

// Función para obtener la URL de la imagen
function getImageUrl(image: ProductImage | string): string {
  if (typeof image === "string") {
    return image;
  }
  return image.url;
}

// Función para generar metadata dinámica
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Itap Impresiones",
      description: "El producto que buscas no existe.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://itapimpresiones.com";
  const productUrl = `${baseUrl}/producto/${product.slug}`;

  return {
    title: `${product.name} | Itap Impresiones`,
    description:
      product.description ||
      `Comprar ${product.name} - ${product.category} - Precio: $${product.price}`,
    keywords: [
      product.name,
      product.category,
      "impresiones",
      "bolsas",
      "indumentaria",
      "personalizado",
      "diseño gráfico",
      ...(product.bagType ? [product.bagType] : []),
      ...(product.color ? [product.color] : []),
    ],
    openGraph: {
      title: product.name,
      description:
        product.description || `Comprar ${product.name} - ${product.category}`,
      url: productUrl,
      siteName: "Itap Impresiones",
      images:
        product.images.length > 0
          ? [
              {
                url: getImageUrl(product.images[0]),
                width: 1200,
                height: 630,
                alt: product.name,
              },
            ]
          : [
              {
                url: `${baseUrl}/images/brand/logo-horizontal-negro.svg`,
                width: 1200,
                height: 630,
                alt: "Itap Impresiones",
              },
            ],
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description || `Comprar ${product.name} - ${product.category}`,
      images:
        product.images.length > 0
          ? [getImageUrl(product.images[0])]
          : [`${baseUrl}/images/logoblack.png`],
    },
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const ProductDetailsPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Structured Data para productos */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product?.name,
            description:
              product?.description ||
              `Comprar ${product?.name} - ${product?.category}`,
            image: product?.images?.map((img) => getImageUrl(img)) || [],
            offers: {
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://itapimpresiones.com"}/producto/${product?.slug}`,
              priceCurrency: "ARS",
              price: product?.price,
              availability: product?.pause
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Itap Impresiones",
              },
            },
            category: product?.category,
            brand: {
              "@type": "Brand",
              name: "Itap Impresiones",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "24",
            },
          }),
        }}
      />
      <ProductDetailsClient product={product!} />
    </>
  );
};

export default ProductDetailsPage;

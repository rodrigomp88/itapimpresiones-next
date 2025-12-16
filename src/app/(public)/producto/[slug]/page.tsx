import ProductDetailsClient from "@/components/ProductDetailsClient";
import { db } from "@/firebase/config";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { Product, ProductImage } from "@/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Definimos el tipo de las props para Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null; // Validación extra

  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`Servidor: No se encontró producto con slug: ${slug}`);
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
    console.error("Servidor: Error al obtener el producto por slug:", error);
    return null;
  }
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
  if (typeof image === 'string') {
    return image;
  }
  return image.url;
}

// Función para generar metadata dinámica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Itap Impresiones",
      description: "El producto que buscas no existe.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itapimpresiones.com";
  const productUrl = `${baseUrl}/producto/${product.slug}`;

  return {
    title: `${product.name} | Itap Impresiones`,
    description: product.description || `Comprar ${product.name} - ${product.category} - Precio: $${product.price}`,
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
      description: product.description || `Comprar ${product.name} - ${product.category}`,
      url: productUrl,
      siteName: "Itap Impresiones",
      images: product.images.length > 0 ? [
        {
          url: getImageUrl(product.images[0]),
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ] : [
        {
          url: `${baseUrl}/images/logoblack.png`,
          width: 1200,
          height: 630,
          alt: "Itap Impresiones",
        }
      ],
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Comprar ${product.name} - ${product.category}`,
      images: product.images.length > 0 ? [getImageUrl(product.images[0])] : [`${baseUrl}/images/logoblack.png`],
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
            "name": product?.name,
            "description": product?.description || `Comprar ${product?.name} - ${product?.category}`,
            "image": product?.images?.map(img => getImageUrl(img)) || [],
            "offers": {
              "@type": "Offer",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://itapimpresiones.com"}/producto/${product?.slug}`,
              "priceCurrency": "ARS",
              "price": product?.price,
              "availability": product?.pause ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Itap Impresiones"
              }
            },
            "category": product?.category,
            "brand": {
              "@type": "Brand",
              "name": "Itap Impresiones"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "24"
            }
          })
        }}
      />
      <ProductDetailsClient product={product!} />
    </>
  );
};

export default ProductDetailsPage;

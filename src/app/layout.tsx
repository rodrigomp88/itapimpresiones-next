import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import SessionHandler from "../components/SessionHandler";

import { initSentry } from "../utils/sentry";

initSentry();

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "ITAP Impresiones — Serigrafía, DTF y sublimado en Mendoza",
  description:
    "Serigrafía, DTF y sublimado sobre indumentaria y friselina en Guaymallén, Mendoza. Remeras, buzos, gorras y bolsas impresas a pedido.",

  metadataBase: new URL("https://itapimpresiones.com"),

  manifest: "/manifest.json",

  openGraph: {
    title: "ITAP Impresiones — Serigrafía, DTF y sublimado en Mendoza",
    description:
      "Serigrafía, DTF y sublimado sobre indumentaria y friselina en Guaymallén, Mendoza. Remeras, buzos, gorras y bolsas impresas a pedido.",
    url: "https://itapimpresiones.com",
    siteName: "ITAP Impresiones",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ITAP Impresiones — Serigrafía, DTF y sublimado en Mendoza",
      },
    ],
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ITAP Impresiones — Serigrafía, DTF y sublimado en Mendoza",
    description:
      "Serigrafía, DTF y sublimado sobre indumentaria y friselina en Guaymallén, Mendoza.",
    images: ["/opengraph-image.png"],
  },

  icons: {
    icon: "/images/brand/favicon-negro.svg",
    shortcut: "/images/brand/favicon-144-negro.png",
    apple: "/images/brand/favicon-144-negro.png",
    other: {
      rel: "icon",
      url: "/images/brand/favicon-negro.svg",
      sizes: "any",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={jakarta.variable}>
      <body
        className="antialiased bg-white text-prussian-blue"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("itap-theme");if(!t){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
        <div id="main-content">
          <Providers>
            <SessionHandler />
            {children}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "Organization",
                      "@id": "https://itapimpresiones.com/#organization",
                      "name": "ITAP Impresiones",
                      "url": "https://itapimpresiones.com",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://itapimpresiones.com/images/brand/logo-horizontal-negro.svg",
                        "width": 300,
                        "height": 60,
                      },
                      "email": "itapimpresiones@gmail.com",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Guaymallén",
                        "addressRegion": "Mendoza",
                        "addressCountry": "AR",
                      },
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://itapimpresiones.com/#webpage",
                      "url": "https://itapimpresiones.com",
                      "name": "ITAP Impresiones — Serigrafía, DTF y sublimado en Mendoza",
                      "isPartOf": {
                        "@id": "https://itapimpresiones.com/#organization",
                      },
                      "description":
                        "Serigrafía, DTF y sublimado sobre indumentaria y friselina en Guaymallén, Mendoza.",
                      "inLanguage": "es-AR",
                    },
                    {
                      "@type": "LocalBusiness",
                      "@id": "https://itapimpresiones.com/#localbusiness",
                      "name": "ITAP Impresiones",
                      "description":
                        "Serigrafía, DTF y sublimado sobre indumentaria y friselina en Guaymallén, Mendoza.",
                      "url": "https://itapimpresiones.com",
                      "image": "https://itapimpresiones.com/images/og-image.png",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Guaymallén",
                        "addressRegion": "Mendoza",
                        "addressCountry": "AR",
                      },
                      "areaServed": {
                        "@type": "City",
                        "name": "Gran Mendoza",
                      },
                      "openingHoursSpecification": [
                        {
                          "@type": "OpeningHoursSpecification",
                          "dayOfWeek": [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                          ],
                          "opens": "09:00",
                          "closes": "18:00",
                        },
                      ],
                      "priceRange": "$$",
                      "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Servicios de impresión",
                        "itemListElement": [
                          {
                            "@type": "Offer",
                            "itemOffered": {
                              "@type": "Service",
                              "name": "Serigrafía sobre indumentaria",
                            },
                          },
                          {
                            "@type": "Offer",
                            "itemOffered": {
                              "@type": "Service",
                              "name": "DTF transfer por film",
                            },
                          },
                          {
                            "@type": "Offer",
                            "itemOffered": {
                              "@type": "Service",
                              "name": "Sublimado sobre poliéster",
                            },
                          },
                          {
                            "@type": "Offer",
                            "itemOffered": {
                              "@type": "Service",
                              "name": "Indumentaria de trabajo",
                            },
                          },
                          {
                            "@type": "Offer",
                            "itemOffered": {
                              "@type": "Service",
                              "name": "Bolsas de friselina personalizadas",
                            },
                          },
                        ],
                      },
                    },
                  ],
                }),
              }}
            />
          </Providers>
        </div>
      </body>
    </html>
  );
}

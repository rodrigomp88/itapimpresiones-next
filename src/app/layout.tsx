import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import SessionHandler from "../components/SessionHandler";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import PWAInstaller from "../components/PWAInstaller";
import MobileNavigationWrapper from "../components/Mobile/MobileNavigationWrapper";

import { initSentry } from "../utils/sentry";

// Inicializar Sentry
initSentry();

export const metadata: Metadata = {
  title: "Itap Impresiones - Soluciones Gráficas y Personalizadas",
  description:
    "Servicio de impresiones en bolsas, gorras, remeras, buzos con impresiones perzonalizadas de tu nogocio o empresa y más. Calidad y diseño para tu marca.",

  metadataBase: new URL("https://itapimpresiones.vercel.app"),

  manifest: "/manifest.json",

  openGraph: {
    title: "Itap Impresiones - Soluciones Gráficas y Personalizadas",
    description:
      "Servicio de impresiones en bolsas, gorras, remeras, buzos con impresiones perzonalizadas de tu nogocio o empresa y más. Calidad y diseño para tu marca.",
    url: "https://itapimpresiones.vercel.app",
    siteName: "Itap Impresiones",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Logo y eslogan de Itap Impresiones",
      },
    ],
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Itap Impresiones - Soluciones Gráficas y Personalizadas",
    description:
      "Servicio de impresiones en bolsas, gorras, buzos con impresiones perzonalizadas de tu nogocio o empresa y más. Calidad y diseño para tu marca.",
    images: ["/opengraph-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "icon",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnects para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link
          rel="preconnect"
          href="https://firebaseinstallations.googleapis.com"
        />

        {/* DNS prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.gstatic.com" />

        {/* Critical CSS inlining para mejor FCP */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS para above-the-fold content */
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
            .font-display { font-family: 'Work Sans', system-ui, sans-serif; }

            /* Loading states */
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            /* Critical layout */
            .min-h-screen { min-height: 100vh; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
          `,
          }}
        />

        {/* Fonts optimizadas */}
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />

        {/* Preload critical resources */}
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />
        <link rel="preload" as="image" href="/android-chrome-512x512.png" />

        {/* Preload critical above-the-fold images */}
        <link rel="preload" as="image" href="/images/carousel0.png" />
        <link rel="preload" as="image" href="/images/carousel1.png" />
        <link rel="preload" as="image" href="/images/carousel3.png" />

        {/* Script para evitar FOUC en cambio de tema */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var theme = localStorage.getItem('itap-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (theme === 'system') {
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                }
                // Si es 'light' o no hay tema, no hacer nada (por defecto es claro)
              } catch (e) {}
            })();
          `,
          }}
        />
      </head>
      <body
        className={`font-display antialiased bg-white dark:bg-black text-slate-800 dark:text-slate-200`}
        suppressHydrationWarning
      >
        {/* Main content landmark */}
        <div id="main-content">
          <Providers>
            <SessionHandler />
            <ServiceWorkerRegister />
            <PWAInstaller />
            {children}

            {/* Navegación móvil - solo visible en dispositivos móviles */}
            <MobileNavigationWrapper />

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  url: "https://itapimpresiones.vercel.app",
                  logo: "https://itapimpresiones.vercel.app/android-chrome-512x512.png",
                }),
              }}
            />
          </Providers>
        </div>
      </body>
    </html>
  );
}

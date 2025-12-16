import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SessionHandler from "../components/SessionHandler";
import PreloadResources from "../components/PreloadResources";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import PWAInstaller from "../components/PWAInstaller";
import SkipLink from "../components/SkipLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://firebaseinstallations.googleapis.com" />

        {/* DNS prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.gstatic.com" />

        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
  <body
    className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black text-slate-800 dark:text-slate-200`}
    suppressHydrationWarning
  >
    {/* Skip Link para navegación por teclado */}
    <SkipLink />

    {/* Main content landmark */}
    <div id="main-content">
        <Providers>
          <SessionHandler />
          <ServiceWorkerRegister />
          <PWAInstaller />
          {children}

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

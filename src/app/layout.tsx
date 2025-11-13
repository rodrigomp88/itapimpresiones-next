import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SessionHandler from "../components/SessionHandler";

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

  manifest: "/site.webmanifest",

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
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black text-slate-800 dark:text-slate-200`}
      >
        <Providers>
          <SessionHandler />
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
      </body>
    </html>
  );
}

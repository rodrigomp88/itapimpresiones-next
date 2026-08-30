"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileHero from "@/components/Mobile/MobileHero";
import MobileFeatured from "@/components/Mobile/MobileFeatured";
import ErrorBoundary from "@/components/ErrorBoundary";

const FeaturedProducts = dynamic(
  () => import("@/components/Shop/FeaturedProducts"),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-lg h-64" />
        ))}
      </div>
    ),
  }
);

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <div className="font-display bg-white dark:bg-slate-900 text-prussian-blue dark:text-white antialiased">
      <main className="flex-1">
        <section className="w-full">
          {isMobile ? <MobileHero /> : <MobileHero />}
        </section>

        <section className="w-full py-20 bg-white dark:bg-slate-900">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent">
                Novedades Destacadas
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Descubre lo último en personalización y diseño.
              </p>
            </div>

            {isMobile ? (
              <MobileFeatured />
            ) : (
              <ErrorBoundary>
                <FeaturedProducts />
              </ErrorBoundary>
            )}

            <div className="mt-12 flex justify-center">
              <Link href="/tienda">
                <button className="px-8 py-3 bg-cta text-white rounded-lg font-semibold hover:bg-cta-dark transition-colors">
                  Ver Toda la Tienda
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-white dark:bg-slate-900">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nuestros Servicios
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Soluciones completas para llevar tu marca al siguiente nivel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { img: "/images/carousel1.webp", title: "Serigrafía", text: "Diseños vibrantes y duraderos." },
                { img: "/images/carousel3.webp", title: "DTF", text: "Full color sin mínimos." },
                { img: "/images/carousel0.webp", title: "Sublimado", text: "Colores que se integran al tejido." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-4 group">
                  <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 aspect-[4/3]">
                    <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-12">Confían en Nosotros</h2>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3emsY4lBNr1yqarGKV3rvx9fYmXEXxb9Yk603FobSlfS9V7zy7J4EPTVMfXD9VH7HVeT8TI6akXW_YabpF4-YY4QUNHHbb6F1_pvDPZZ1Wd1-WytYKhHi9AntYTO9YpddWyV68lEOgMeU6Nqa5IDtCYlH2aRrb1kOv8-qqfhbh6PNa6q2DU6FdSO2YQ5mQFzX7XlT_wFy9F7aAEICUxAsW3VeitKwknQIf8x9YNkzSrMHnons848u-cylZNp7AJfQFujy-ursVLM" alt="Cliente 1" width={120} height={40} className="object-contain" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

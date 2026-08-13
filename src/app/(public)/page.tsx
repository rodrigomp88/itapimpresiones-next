"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useIsMobile";
import HomeBanners from "@/components/Home/HomeBanners";
import MobileHero from "@/components/Mobile/MobileHero";
import MobileFeatured from "@/components/Mobile/MobileFeatured";

// Lazy load FeaturedProducts since it's below the fold
const FeaturedProducts = dynamic(
  () => import("@/components/Shop/FeaturedProducts"),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-200 dark:bg-slate-700 rounded-lg h-64"
          />
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
        {/* Hero */}
        <section className="w-full">
          {isMobile ? <MobileHero /> : <HomeBanners />}
        </section>

        {/* Destacados */}
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

            {isMobile ? <MobileFeatured /> : <FeaturedProducts />}

            <div className="mt-12 flex justify-center">
              <Link href="/tienda">
                <button className="px-8 py-3 bg-cta text-white rounded-lg font-semibold hover:bg-cta-dark transition-colors">
                  Ver Toda la Tienda
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="w-full py-20 bg-white dark:bg-slate-900">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nuestros Servicios Principales
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Soluciones completas para llevar tu marca al siguiente nivel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  img: "/images/carousel1.webp",
                  title: "Impresión de Remeras",
                  text: "Diseños vibrantes y duraderos en remeras de alta calidad.",
                },
                {
                  img: "/images/carousel3.webp",
                  title: "Gorras Personalizadas",
                  text: "Estilo único con bordados o estampados para tu marca.",
                },
                {
                  img: "/images/carousel0.webp",
                  title: "Indumentaria Corporativa",
                  text: "Uniformes profesionales que reflejan tu identidad.",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-4 group">
                  <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 aspect-[4/3]">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className="w-full py-20 bg-white dark:bg-slate-900">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Nos comprometemos a ofrecerte la mejor calidad y servicio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                ["palette", "Calidad de Impresión", "Tecnología de última generación para resultados nítidos y duraderos."],
                ["checkroom", "Materiales Premium", "Seleccionamos los mejores tejidos para garantizar comfort y resistencia."],
                ["groups", "Asesoramiento 1 a 1", "Te acompañamos desde la idea hasta el producto final terminado."],
                ["schedule", "Entregas Puntuales", "Cumplimos los plazos acordados porque tu negocio no puede esperar."],
              ].map(([icon, title, desc], i) => (
                <div
                  key={i}
                  className="p-8 rounded-xl bg-slate-50 dark:bg-slate-800 border hover:shadow-md transition-shadow"
                >
                  <span className="material-symbols-outlined text-4xl text-primary mb-4 block">
                    {icon}
                  </span>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logos clientes */}
        <section className="w-full py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-12">Confían en Nosotros</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3emsY4lBNr1yqarGKV3rvx9fYmXEXxb9Yk603FobSlfS9V7zy7J4EPTVMfXD9VH7HVeT8TI6akXW_YabpF4-YY4QUNHHbb6F1_pvDPZZ1Wd1-WytYKhHi9AntYTO9YpddWyV68lEOgMeU6Nqa5IDtCYlH2aRrb1kOv8-qqfhbh6PNa6q2DU6FdSO2YQ5mQFzX7XlT_wFy9F7aAEICUxAsW3VeitKwknQIf8x9YNkzSrMHnons848u-cylZNp7AJfQFujy-ursVLM"
                alt="Cliente 1"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

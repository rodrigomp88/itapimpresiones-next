"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import InkBlob from "@/components/Design/InkBlob";

const products = [
  { id: 1, name: "Remera Básica Algodón", price: 4500, image: "/images/carousel1.webp", slug: "remera-basica" },
  { id: 2, name: "Gorra Sublimable", price: 3200, image: "/images/carousel3.webp", slug: "gorra-sublimable" },
  { id: 3, name: "Bolsa Friselina 30x40", price: 1800, image: "/images/carousel0.webp", slug: "bolsa-friselina" },
  { id: 4, name: "Buzo Premium Friza", price: 12000, image: "/images/carousel1.webp", slug: "buzo-premium" },
];

const FeaturedSection: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 bg-[#f5f5f0] dark:bg-zinc-950 overflow-hidden">
      <InkBlob color="var(--color-secondary)" variant="left" opacity={0.06} className="absolute top-1/4 -left-20 w-96 h-96" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="inline-block text-sm font-semibold text-secondary mb-4 tracking-wider uppercase">Destacados</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-prussian-blue dark:text-white">
              Lo que está<br /><span className="text-secondary">vendiendo ahora</span>
            </h2>
          </div>
          <Link href="/tienda">
            <button className="mt-6 md:mt-0 px-6 py-3 bg-white dark:bg-zinc-800 text-prussian-blue dark:text-white rounded-xl font-semibold border-2 border-zinc-200 dark:border-zinc-700 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1">
              Ver todo →
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-5 md:row-span-2 group">
            <Link href={`/producto/${products[0].slug}`}>
              <div className="relative h-80 md:h-full min-h-[400px] bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-primary/30 transition-all duration-300">
                <Image src={products[0].image} alt={products[0].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 40vw" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white font-bold text-xl mb-1">{products[0].name}</h3>
                  <p className="text-cta font-extrabold text-2xl">${products[0].price.toLocaleString("es-AR")}</p>
                </div>
                <div className="absolute top-4 left-4 bg-cta text-white px-3 py-1 rounded-full text-sm font-bold">Más vendido</div>
              </div>
            </Link>
          </div>

          <div className="md:col-span-4 group">
            <Link href={`/producto/${products[1].slug}`}>
              <div className="relative h-64 bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-secondary/30 transition-all duration-300">
                <Image src={products[1].image} alt={products[1].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white font-bold text-lg">{products[1].name}</h3>
                  <p className="text-secondary font-extrabold text-xl">${products[1].price.toLocaleString("es-AR")}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="md:col-span-3 group">
            <Link href={`/producto/${products[2].slug}`}>
              <div className="relative h-64 bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-accent/30 transition-all duration-300">
                <Image src={products[2].image} alt={products[2].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 25vw" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white font-bold text-lg">{products[2].name}</h3>
                  <p className="text-accent font-extrabold text-xl">${products[2].price.toLocaleString("es-AR")}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="md:col-span-7 group">
            <Link href={`/producto/${products[3].slug}`}>
              <div className="relative h-64 bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-primary/30 transition-all duration-300">
                <Image src={products[3].image} alt={products[3].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 58vw" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white font-bold text-xl mb-1">{products[3].name}</h3>
                  <p className="text-primary font-extrabold text-2xl">${products[3].price.toLocaleString("es-AR")}</p>
                </div>
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">Nuevo</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;

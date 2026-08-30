"use client";

import React from "react";
import InkBlob from "@/components/Design/InkBlob";

const benefits = [
  { icon: "palette", title: "Calidad de Impresión", desc: "Tecnología de última generación para resultados nítidos y duraderos.", color: "var(--color-primary)" },
  { icon: "checkroom", title: "Materiales Premium", desc: "Seleccionamos los mejores tejidos para garantizar comfort y resistencia.", color: "var(--color-secondary)" },
  { icon: "groups", title: "Asesoramiento 1 a 1", desc: "Te acompañamos desde la idea hasta el producto final terminado.", color: "var(--color-accent)" },
  { icon: "schedule", title: "Entregas Puntuales", desc: "Cumplimos los plazos acordados porque tu negocio no puede esperar.", color: "var(--color-cta)" },
];

const TrustSection: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 bg-white dark:bg-zinc-900 overflow-hidden">
      <InkBlob color="var(--color-accent)" variant="right" opacity={0.05} className="absolute top-1/3 -right-20 w-96 h-96" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-accent mb-4 tracking-wider uppercase">¿Por qué elegirnos?</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-prussian-blue dark:text-white">
            No somos una imprenta más.<br /><span className="text-accent">Somos tu socio creativo.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="relative group" style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}>
              <div className="absolute inset-0 rounded-3xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" style={{ backgroundColor: `${b.color}20` }} />
              <div className="relative p-8 bg-white dark:bg-zinc-800 rounded-3xl border-2 border-zinc-100 dark:border-zinc-700 group-hover:border-transparent transition-all duration-300 group-hover:-translate-y-2">
                <span className="material-symbols-outlined text-5xl mb-4 block" style={{ color: b.color }}>{b.icon}</span>
                <h3 className="font-bold text-xl text-prussian-blue dark:text-white mb-2">{b.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 bg-[#f5f5f0] dark:bg-zinc-800 px-8 py-4 rounded-2xl">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-white dark:border-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{i}</span>
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-semibold text-prussian-blue dark:text-white">500+ marcas confían en nosotros</p>
              <p className="text-sm text-zinc-500">Desde 2014</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

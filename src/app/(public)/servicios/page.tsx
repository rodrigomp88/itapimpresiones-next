import React from "react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

const ServicesPage = () => {
  return (
    <div className="bg-white dark:bg-slate-900 font-display text-slate-900 dark:text-white antialiased">
      <main className="flex-grow">
        <section
          className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden"
          id="inicio"
        >
          <div className="container mx-auto px-6 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6 text-center lg:text-left z-10">
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-[-0.033em]">
                  Impresión Textil Profesional: Serigrafía y DTF de Alta Calidad
                </h1>
                <p className="text-base font-normal leading-normal lg:text-lg text-slate-600 dark:text-slate-100">
                  Damos vida a tus diseños en remeras, buzos, gorras y más.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <a
                    className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-blue-600 text-white text-sm font-semibold tracking-wide hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                    href="#portfolio"
                  >
                    Ver Productos
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-white border border-slate-200 text-slate-700 text-sm font-semibold tracking-wide hover:bg-slate-50 transition-all hover:border-slate-300"
                    href="#contacto"
                  >
                    Solicitar Cotización
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-12 lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2">
              <div className="w-8 h-2 bg-white rounded-full shadow-sm"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          className="container mx-auto px-4 py-16 sm:py-24 bg-white dark:bg-slate-900 rounded-xl"
          id="servicios"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] dark:text-white">
              Nuestros Servicios de Impresión
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Ofrecemos las mejores técnicas para cada tipo de proyecto. Elige
              la que mejor se adapte a tus necesidades.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Serigrafía Feature */}
              <div className="flex-1 flex flex-col gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-2xl font-bold tracking-tight dark:text-white">
                  Serigrafía
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Técnica tradicional ideal para diseños con colores planos y
                  grandes cantidades. Ofrece una durabilidad excepcional y
                  colores vibrantes.
                </p>
                <ul className="space-y-3 mt-2 text-gray-700 dark:text-gray-200">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      package_2
                    </span>
                    <span>Ideal para grandes tiradas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      shield
                    </span>
                    <span>Máxima durabilidad al lavado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      palette
                    </span>
                    <span>Colores intensos y opacos</span>
                  </li>
                </ul>
              </div>
              {/* DTF Feature */}
              <div className="flex-1 flex flex-col gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-2xl font-bold tracking-tight dark:text-white">
                  DTF (Direct to Film)
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tecnología moderna perfecta para diseños complejos, con
                  degradados y a todo color. Excelente para tiradas cortas y
                  medianas.
                </p>
                <ul className="space-y-3 mt-2 text-gray-700 dark:text-gray-200">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      photo_library
                    </span>
                    <span>Perfecto para diseños full-color</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      layers
                    </span>
                    <span>Sin mínimo de unidades</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      texture
                    </span>
                    <span>Tacto suave y gran elasticidad</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section
          className="container mx-auto px-4 py-16 sm:py-24 bg-white dark:bg-slate-900"
          id="portfolio"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] dark:text-white">
              Conoce Nuestro Trabajo
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Proyectos realizados para empresas, eventos e indumentaria
              personalizada.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="group aspect-square overflow-hidden rounded-lg relative">
              <Image
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYChaR5Bn0-GYEi6ED0NXD6UBMngCpfCU5szu3l8UQedn_fNlkKTig5B9nXgbQz_JTl9V-fUIBl768Fja8yTCP4DxDSf3IxEWBHc7kX4xiKXPj67Esni2_KzJSPQ1jL91wRlG4jRVV6Sw7Jvc0oQWsC7gjhWbx2PrGvOqslpk-DKtJZnTZUiwxdmDDnF_x4ULbQIeINIxoeNIouhy6lSDiH1kZRWfH26VXUr9mj-W5-_Es_uQAdohbgPM1479WZEfiMO4kxoFkXlU"
                alt="Remeras para Evento"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                <p className="text-white font-semibold">Remeras para Evento</p>
              </div>
            </div>
            <div className="group aspect-square overflow-hidden rounded-lg relative">
              <Image
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPIG4ysf45_RxdSJDKGFA4daVosJKjX-1N5TahDo62MhzKT6FNjCWtPdEHwl4LgEEsSP6TdMmg9X5u4jfI0JthkbM9vk5yCxnpwllcS1ODgN7-Bww-_bZttCH0pF4QKhP56XEA_pv08VmhyRYfVyDF_ga5ZiJCduOhAH26b7R7DUiVuzhIZBbQDtN1Py8irDAjL-e9vLXH73ZmLZC2kkMwCVvjzYeXf2_feWZBVAs0DkOC7S-hdjNZBsFde_rHpPajwCtZBlzy2T4"
                alt="Buzos para Empresas"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                <p className="text-white font-semibold">Buzos para Empresas</p>
              </div>
            </div>
            <div className="group aspect-square overflow-hidden rounded-lg relative">
              <Image
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQABuFXf2NA4nQdOmp4ymkRjDK7vgY2j_AeTXS5tdeE5df3VL5lpKz3nuhnNw-RWbyjSorDrPm-S_yhQrvEGm1ggX3F-bkazSTbkw1mlER9sEBKMkqGu20JaYQ-bFhZnqgfI-x6MR9bj1zPlPzw2DIgSp1Ffmxoowy-GgQLToEGNoLCK3ydoYDGIx2F0i9wn3ar3vFGVo4caYxgFwgHk2W9KOWRkzvC-HUCwGRViuWkxjoFuhl5egb4_2pJfWc9jZO4DKDdHrogg"
                alt="Gorras Personalizadas"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                <p className="text-white font-semibold">
                  Gorras Personalizadas
                </p>
              </div>
            </div>
            <div className="group aspect-square overflow-hidden rounded-lg relative">
              <Image
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYwftHXYU33GbhuhagiLOldZ--J-KYE4jCw5BNgeWOVKf1KILwevCieGADOQcIDASi5shxfsc3aesRG8ixyt5SVrQO-bugzCY53LXvrBe6nABxtrDxBojX7UHnTX_n31-AYXaGtHlv47wY1IaQPaYWr4Ash-8GBNac4Fk7tT68XdVoPgQ43mbzHtOGFBqv5ll1lpkLbp0Cp0PEyiP_Tn-c62jLUsaSq8zltWVTK8CHdC4hFunU5RtxHsgiX-PwVTL25_k0ZFB4Gvs"
                alt="Bolsas de Friselina"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                <p className="text-white font-semibold">Bolsas de Friselina</p>
              </div>
            </div>
            <div className="group aspect-square overflow-hidden rounded-lg relative">
              <Image
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7hCduA6Gw6qep84N216yIsvMLphfgJT6cZzsLnHb7qiXYLCEmQtvtqvjpyXJlg1OVAPPfXPLNi6cKGQcC4eW5cCsu1izx4OGZqe9C0UUNAbWBtJ0Fuj22Zg0pFjCp4F0y5vZlJjtes1yeU_gh-fqCCw1cg1A6lQbR-AQgoRft_-2zvBcVzlM1xhMnYeXQOW0AeBeDKf4bNIBBx3uA4MIt2RnNcj6YY4INRwujj0GLv2dbWKwfIeqAD3FgpyfVH3jNo43axfVWY4o"
                alt="Indumentaria Promocional"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                <p className="text-white font-semibold">
                  Indumentaria Promocional
                </p>
              </div>
            </div>
            <div className="group aspect-square overflow-hidden rounded-lg relative">
              <Image
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZIPQm_Ju2khKHi-NQSF5Ptvx_XGCVlgiZ0pWCXdtiWVyUMDxwJkZ1pognfg8-kB0PfUF-ngSOi_s89FgiE2pfDe2ypv8NYcHGjo_G6sK_vGXswPiiWkytDLgVNy3PmiRrQk4ET_8lCRtePUw97tXR7QNdtpCLLPloM_8GkxdC0mXzAeYsUKUUV26q7Iy7QqtnF517cab1272a1e8qXH6xinnNtrs5hD-w-S0b4GuHbFbH8_8YvOMbi-i9twT6sQE-NO79cUo_xHQ"
                alt="Diseños a Todo Color"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                <p className="text-white font-semibold">Diseños a Todo Color</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 bg-white dark:bg-slate-900 rounded-xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] dark:text-white">
              Nuestro Proceso Simplificado
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Trabajar con nosotros es fácil. Sigue estos simples pasos para
              materializar tu proyecto.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined !text-4xl">
                  lightbulb
                </span>
              </div>
              <h3 className="text-lg font-bold dark:text-white">
                1. Envía tu idea
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cuéntanos sobre tu proyecto y envíanos tu diseño a través de
                nuestro formulario de contacto.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined !text-4xl">
                  rate_review
                </span>
              </div>
              <h3 className="text-lg font-bold dark:text-white">
                2. Recibe tu cotización
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nuestro equipo revisará tu solicitud y te enviará una cotización
                detallada y un boceto digital.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined !text-4xl">
                  local_shipping
                </span>
              </div>
              <h3 className="text-lg font-bold dark:text-white">
                3. Producción y Entrega
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Una vez aprobado, comenzamos la producción y te entregamos tu
                pedido en tiempo y forma.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section
          className="container mx-auto px-4 py-16 sm:py-24 bg-white dark:bg-slate-900"
          id="contacto"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] dark:text-white">
              Solicita tu Cotización Personalizada
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Cuéntanos sobre tu proyecto y nuestro equipo se pondrá en contacto
              a la brevedad.
            </p>
          </div>
          <ContactForm formType="services" />
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;

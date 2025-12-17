"use client";

import Link from "next/link";
import Image from "next/image";
import FeaturedProducts from "@/components/Shop/FeaturedProducts";
import HomeBanners from "@/components/Home/HomeBanners";

const Home = () => {
  return (
    <div className="font-display bg-white dark:bg-slate-900 text-slate-900 dark:text-white antialiased">
      <main className="flex-1">
        <section className="w-full">
          <HomeBanners />
        </section>
        <section className="w-full py-20 bg-white dark:bg-slate-900">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Novedades Destacadas
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-light">
                Descubre lo último en personalización y diseño.
              </p>
            </div>
            <FeaturedProducts />
            <div className="mt-12 flex justify-center">
              <Link href="/tienda">
                <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm">
                  Ver Toda la Tienda
                </button>
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-24 bg-background-alt dark:bg-slate-950">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
              Nuestros Servicios Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4 group cursor-pointer">
                <div className="relative w-full bg-slate-200 rounded-xl overflow-hidden aspect-[16/10] shadow-sm">
                  <Image
                    src="/images/carousel1.png"
                    alt="Impresión de Remeras"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">Impresión de Remeras</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Diseños vibrantes y duraderos en remeras de alta calidad.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 group cursor-pointer">
                <div className="relative w-full bg-slate-200 rounded-xl overflow-hidden aspect-[16/10] shadow-sm">
              <Image
                src="/images/carousel3.png"
                alt="Gorras Personalizadas"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                }}
              />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">Gorras Personalizadas</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Estilo único con bordados o estampados para tu marca.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 group cursor-pointer">
                <div className="relative w-full bg-slate-200 rounded-xl overflow-hidden aspect-[16/10] shadow-sm">
                  <Image
                    src="/images/carousel0.png"
                    alt="Indumentaria Corporativa"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">Indumentaria Corporativa</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Uniformes profesionales que reflejan tu identidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-24 bg-white dark:bg-slate-900">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight mb-4">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Nos comprometemos a ofrecerte la mejor calidad y servicio en cada pedido.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-8 rounded-xl bg-background-alt dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-5">
                  <span className="material-symbols-outlined !text-4xl">palette</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Calidad de Impresión</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Acabados nítidos y duraderos con tecnología de punta.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-background-alt dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-5">
                  <span className="material-symbols-outlined !text-4xl">checkroom</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Materiales Premium</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Textiles seleccionados para confort y resistencia.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-background-alt dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-5">
                  <span className="material-symbols-outlined !text-4xl">groups</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Asesoramiento 1 a 1</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Te guiamos en cada paso para asegurar el éxito.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-background-alt dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-5">
                  <span className="material-symbols-outlined !text-4xl">schedule</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Entregas Puntuales</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cumplimos los plazos porque tu tiempo vale.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-20 bg-background-alt dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight mb-12">
              Confían en Nosotros
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 grayscale opacity-60 hover:opacity-100 transition-opacity duration-300">
              <img
                width={150}
                height={40}
                alt="Client Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3emsY4lBNr1yqarGKV3rvx9fYmXEXxb9Yk603FobSlfS9V7zy7J4EPTVMfXD9VH7HVeT8TI6akXW_YabpF4-YY4QUNHHbb6F1_pvDPZZ1Wd1-WytYKhHi9AntYTO9YpddWyV68lEOgMeU6Nqa5IDtCYlH2aRrb1kOv8-qqfhbh6PNa6q2DU6FdSO2YQ5mQFzX7XlT_wFy9F7aAEICUxAsW3VeitKwknQIf8x9YNkzSrMHnons848u-cylZNp7AJfQFujy-ursVLM"
                className="h-8 md:h-10 object-contain"
              />
              <img
                width={150}
                height={40}
                alt="Client Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrON91xhkk6R4pw7QVF9uftO1MY1-fHa7eFOYpJ9pvJm0jfPG9WkOJWeqIQWJ-_Kid61ie7N1j1xuZVLBf86UJe84aWaF-JwAvkRrDpAt70sUcyQmGrTpXACEIZhU_st0hRX-CcTkxM0BOEz-SxXs1oZ-MTaWopWhsweEdnOawbfAzClimUO6VW8no8Xl5BgaVBxHmN8A_gGAhSx140U6enGZ4ad9XN5FWBRzri3FX25VQTLtVoSNZxnsd1ZVhSbPBb5O1ctvEPd8"
                className="h-8 md:h-10 object-contain"
              />
              <img
                width={150}
                height={40}
                alt="Client Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9LqJMN4nR_zfG5Ce9Sx10M3Ba3_jfxO7BOfTKm-AP4iWKgTa5RrUctm2HDLwctb9NkARLZZai6R7rn0USv_yeGSwc-o2EZG9kNMS0IT0BOds8D3wiGYNxF9nGDXD3X8QVIrJUDCwSUWrhc1VepBDLLW8mJXgIxvFG5RFmui1QdWy06cyk0vxYvfFQJOhp7FXCgBcSyX4sRLAyiMh_13cFV0U44JLxhC_dsCQu69sDR6UYq26YmVTjnrS9_goA1I6gxpll7D1sNpw"
                className="h-8 md:h-10 object-contain"
              />
              <img
                width={150}
                height={40}
                alt="Client Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo-vYzOZBx0UGJCNCXXATa3K10NjaDkU6V7DYHxOoCANM9yBlCKpX4WkuyGQRoQLHgvwgQxhkKdNUc1bUNE83yGU4Yg4tQ-u_bMFt_62n2il6bkSkqZGsK0fM-fRvWJjq3udnGLRUeqpxLpUcxmximIsuapWyZfA8L0gKa-vE9kIKVSfIH6tYLO2yYm-5-QQk1xa8rabFm0SyjqoNlusMfeQfjXaYQLsQHRU0QHEQ-4HNkt1Gz0b-oIXAflSndUnhTU_MVnLy-KKA"
                className="h-8 md:h-10 object-contain"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

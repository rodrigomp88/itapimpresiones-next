"use client";

import Link from "next/link";
import Image from "next/image";
import FeaturedProducts from "@/components/Shop/FeaturedProducts";
import HomeBanners from "@/components/Home/HomeBanners";

const Home = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1">
          {/* Hero Section with Carousel */}
          <section className="w-full">
            <HomeBanners />
          </section>

          {/* Featured Products Section */}
          <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Novedades Destacadas
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Descubre lo último en personalización y diseño.
                </p>
              </div>
              <FeaturedProducts />
              <div className="flex justify-center mt-8">
                <Link href="/tienda">
                  <button className="btn btn-primary px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    Ver Toda la Tienda
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Services Section (Enhanced) */}
          <section className="w-full py-12 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center sm:text-3xl mb-8">
                Nuestros Servicios Principales
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 p-4">
                {/* Cards with Hover Effects */}
                {[
                  { title: "Impresión de Remeras", desc: "Diseños vibrantes en remeras de alta calidad.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnxStq18NJ7wAIDiSFoL5gn24j5HCTb84f9qlA7lBDiWrgMEtTsBJ23YdnDue9wRST2PBsKkdpnsYoBLhBYQAPiQp2LsK45kz33BUT684kh6I-WWrdPn7hu_Gt6AEyAOmgM3acjz_r8h5gckG2BvMVnMifPv80gGPbShkVNZb3ppPJtdMN8zB4coMBu1IhCkdJYZvLfpuOHlcmEpxvFJ3I2YQJR8jPKf8-QrMXo5jc5rIwCgzxMg3hZfx4H6Usr3-de4Mo3Wb4pNE" },
                  { title: "Gorras Personalizadas", desc: "Estilo único con bordados o estampados.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnRaP9yvD6Em36XeRVHuPQRpSgvOI7irAA_aqVZH8sRXUAATRTspdan8DortOBNVsk1baEbybraLf4O36r8w90yriR8jD4dX2Ty3FT3Vovgzgd_ww29frR5wWc_IZenvTqF3lymhiIVlgT2HFC5K76FG4ruwQl7EjXUxilsvaGnxooJS7C5h7BHjoTUyy1xf0ee3gLpztRS6tYv6A0MOx9Lo9M9RnKZcJT_-zrV_Zc0nz2Ht-DCTcbXxAMEsqftPNPTVGMDxM3T_Y" },
                  { title: "Buzos Estampados", desc: "Comodidad y marca para tu equipo.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwrz5dNbt2NaQ6vMfqzndRZIKHMqfX1cZvNgAxKYsxitcXDjKbIOL_WWvzpfWy9h9JPlYKhQqaaHWX0_Qy9-4qrWbDxkqx-zqF4bo9qBe2me_FImBpWZ_QtaQX0xQPaF7e8Ed7hfZFrWQKiJtXevf04GmIu5LbsOK7WwOT7r9G0aNQiqm4drAV5sP3eS4JnTw810x39nF9qepRNXAfhgKEl3OENG1DtcInemrlnqfYLbJBlHhorgMteC5Im84webVVx3ybtRSYZW4" },
                  { title: "Indumentaria Corporativa", desc: "Uniformes que reflejan tu identidad.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4kXf04GvtTkjT_46aDVcO4909CtSnzQgMNhjthKBwFPTkLps0gGl_WgqEPbQmp2csIqXkkNYWKYqxh8fq-Tet-EAhmBEqSGWu-rfPgs--QUzVlXT6e8wQUP6cey36vTNkFhNEWyVU9ZznYLaVxEaLnEPODJYMcfbh87tGWLJDjIWMI47BU5RAmoCLV_fhOZUPwOEHn0uFeM-TpyrtiFW-QElYeR8NDx6GHGHtbKgW6Zyzw-oBAV_VSPrpSJ1AgUC00ljTEstrpe4" }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col gap-3 pb-3 group cursor-pointer">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url("${item.img}")` }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white text-base font-medium leading-normal group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Us Section (Interactive) */}
          <section className="w-full py-12 md:py-24 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-10 @container">
                <div className="flex flex-col gap-4 text-center">
                  <h1 className="text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight sm:text-4xl">
                    ¿Por qué elegirnos?
                  </h1>
                  <p className="text-slate-800 dark:text-slate-200 text-base font-normal leading-normal max-w-[720px] mx-auto">
                    Nos comprometemos a ofrecerte la mejor calidad y servicio en cada pedido.
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-0">
                  {/* Interactive Cards */}
                  {[
                    { icon: "palette", title: "Calidad de Impresión", desc: "Acabados nítidos y duraderos con tecnología de punta." },
                    { icon: "checkroom", title: "Materiales Premium", desc: "Textiles seleccionados para confort y resistencia." },
                    { icon: "groups", title: "Asesoramiento 1 a 1", desc: "Te guiamos en cada paso para asegurar el éxito." },
                    { icon: "schedule", title: "Entregas Puntuales", desc: "Cumplimos los plazos porque tu tiempo vale." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-1 gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-6 flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                      <div className="text-primary mb-2">
                        <span className="material-symbols-outlined !text-4xl">
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                          {item.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Trusted By Section */}
          <section className="w-full py-12 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                  Confían en Nosotros
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-70">
                <Image width={150} height={40} className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-110 grayscale hover:grayscale-0 duration-300" alt="Client 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3emsY4lBNr1yqarGKV3rvx9fYmXEXxb9Yk603FobSlfS9V7zy7J4EPTVMfXD9VH7HVeT8TI6akXW_YabpF4-YY4QUNHHbb6F1_pvDPZZ1Wd1-WytYKhHi9AntYTO9YpddWyV68lEOgMeU6Nqa5IDtCYlH2aRrb1kOv8-qqfhbh6PNa6q2DU6FdSO2YQ5mQFzX7XlT_wFy9F7aAEICUxAsW3VeitKwknQIf8x9YNkzSrMHnons848u-cylZNp7AJfQFujy-ursVLM" />
                <Image width={150} height={40} className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-110 grayscale hover:grayscale-0 duration-300" alt="Client 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrON91xhkk6R4pw7QVF9uftO1MY1-fHa7eFOYpJ9pvJm0jfPG9WkOJWeqIQWJ-_Kid61ie7N1j1xuZVLBf86UJe84aWaF-JwAvkRrDpAt70sUcyQmGrTpXACEIZhU_st0hRX-CcTkxM0BOEz-SxXs1oZ-MTaWopWhsweEdnOawbfAzClimUO6VW8no8Xl5BgaVBxHmN8A_gGAhSx140U6enGZ4ad9XN5FWBRzri3FX25VQTLtVoSNZxnsd1ZVhSbPBb5O1ctvEPd8" />
                <Image width={150} height={40} className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-110 grayscale hover:grayscale-0 duration-300" alt="Client 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9LqJMN4nR_zfG5Ce9Sx10M3Ba3_jfxO7BOfTKm-AP4iWKgTa5RrUctm2HDLwctb9NkARLZZai6R7rn0USv_yeGSwc-o2EZG9kNMS0IT0BOds8D3wiGYNxF9nGDXD3X8QVIrJUDCwSUWrhc1VepBDLLW8mJXgIxvFG5RFmui1QdWy06cyk0vxYvfFQJOhp7FXCgBcSyX4sRLAyiMh_13cFV0U44JLxhC_dsCQu69sDR6UYq26YmVTjnrS9_goA1I6gxpll7D1sNpw" />
                <Image width={150} height={40} className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-110 grayscale hover:grayscale-0 duration-300" alt="Client 4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo-vYzOZBx0UGJCNCXXATa3K10NjaDkU6V7DYHxOoCANM9yBlCKpX4WkuyGQRoQLHgvwgQxhkKdNUc1bUNE83yGU4Yg4tQ-u_bMFt_62n2il6bkSkqZGsK0fM-fRvWJjq3udnGLRUeqpxLpUcxmximIsuapWyZfA8L0gKa-vE9kIKVSfIH6tYLO2yYm-5-QQk1xa8rabFm0SyjqoNlusMfeQfjXaYQLsQHRU0QHEQ-4HNkt1Gz0b-oIXAflSndUnhTU_MVnLy-KKA" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;

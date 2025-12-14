"use client";

import Link from "next/link";
import Image from "next/image";

const Home = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-slate-200 antialiased">
      <main className="flex-1">
        <section className="w-full">
          <div className="relative w-full h-[600px] bg-slate-100 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNvBGQFcs78d2ZoldSkkBGjbKSKk0XcjZet_eQoMCAPqI7EOzYpqxawSD2D03jgDkC8KJH2ZLmFWZdJTksNIWNZaZ4WXjW5Wnilmuva16l_Dw9f1ufQVojo6vQx9f44CSI9o_fJ7-3HSBRyTrxUlnJlaFXgAveAO3fthinJtKrFR9O0iKkyKXRO9ydqmWLKH3RXrC3BiA6xvSEj41ArZGR9yCiSiqFyAWLxNqg2V1Q3JZje3DrWMYFKD4hYtzg_ME_azRaVJBpqVQ")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </div>
            <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center">
              <div className="max-w-2xl text-left">
                <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-sm">
                  Personalizamos <br /> tus Ideas
                </h1>
                <p className="text-slate-100 text-lg md:text-xl font-light mb-8 max-w-lg leading-relaxed opacity-90">
                  El toque final para tu identidad corporativa. Calidad superior y atención personalizada.
                </p>
                <Link href="/servicios">
                  <button className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Ver Servicios
                  </button>
                </Link>
              </div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              <span className="w-8 h-1.5 bg-white rounded-full opacity-100 shadow-sm"></span>
              <span className="w-2 h-1.5 bg-white/50 rounded-full"></span>
              <span className="w-2 h-1.5 bg-white/50 rounded-full"></span>
            </div>
          </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-slate-50 relative p-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNvBGQFcs78d2ZoldSkkBGjbKSKk0XcjZet_eQoMCAPqI7EOzYpqxawSD2D03jgDkC8KJH2ZLmFWZdJTksNIWNZaZ4WXjW5Wnilmuva16l_Dw9f1ufQVojo6vQx9f44CSI9o_fJ7-3HSBRyTrxUlnJlaFXgAveAO3fthinJtKrFR9O0iKkyKXRO9ydqmWLKH3RXrC3BiA6xvSEj41ArZGR9yCiSiqFyAWLxNqg2V1Q3JZje3DrWMYFKD4hYtzg_ME_azRaVJBpqVQ")`,
                    }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gorra Tracker</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    Gorra tracker, variedad de colores, impresas en dtf.
                  </p>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">$7.000</span>
                  </div>
                  <Link href="/tienda">
                    <button className="w-full mt-3 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      Ver Detalles <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-slate-50 relative p-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnxStq18NJ7wAIDiSFoL5gn24j5HCTb84f9qlA7lBDiWrgMEtTsBJ23YdnDue9wRST2PBsKkdpnsYoBLhBYQAPiQp2LsK45kz33BUT684kh6I-WWrdPn7hu_Gt6AEyAOmgM3acjz_r8h5gckG2BvMVnMifPv80gGPbShkVNZb3ppPJtdMN8zB4coMBu1IhCkdJYZvLfpuOHlcmEpxvFJ3I2YQJR8jPKf8-QrMXo5jc5rIwCgzxMg3hZfx4H6Usr3-de4Mo3Wb4pNE")`,
                    }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Remeras Premium</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    Remeras de algodón con tu logo a elección, impresión DTG.
                  </p>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">$16.000</span>
                  </div>
                  <Link href="/tienda">
                    <button className="w-full mt-3 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      Ver Detalles <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-slate-50 relative p-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmxVk643s8uDDhgjRbXDrgH0jHjHHwprx0KLG0HU50JSkbmhZMWoX5RyrhsD1k5yDikXyDbJjRtUdbMYRQ0CDrTkxQBXO_IQXIPx8BpDeQcgWItvfI_maL4-CPcUmSWsh7u4_bSLfWQjJ6n6PLRv9F_YPpv9bvSGn6QtEPmDJs78xC0aOXIz84UUN180ybVjLk6tzEPW9HZLsZFlO6mN2ZB6HcEkx8-JID5_C9DNoOT-Oj90RQcxRwWQpwjURSIXfGSVwP_bY9SqI")`,
                    }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bolsa Eco 40x45</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    Ideal para calzados, marroquinería e indumentaria.
                  </p>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">$700</span>
                  </div>
                  <Link href="/tienda">
                    <button className="w-full mt-3 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      Ver Detalles <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-slate-50 relative p-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBwrz5dNbt2NaQ6vMfqzndRZIKHMqfX1cZvNgAxKYsxitcXDjKbIOL_WWvzpfWy9h9JPlYKhQqaaHWX0_Qy9-4qrWbDxkqx-zqF4bo9qBe2me_FImBpWZ_QtaQX0xQPaF7e8Ed7hfZFrWQKiJtXevf04GmIu5LbsOK7WwOT7r9G0aNQiqm4drAV5sP3eS4JnTw810x39nF9qepRNXAfhgKEl3OENG1DtcInemrlnqfYLbJBlHhorgMteC5Im84webVVx3ybtRSYZW4")`,
                    }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Buzos Estampados</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    Buzos frizados premium, ideales para merch corporativo.
                  </p>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">$22.000</span>
                  </div>
                  <Link href="/tienda">
                    <button className="w-full mt-3 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      Ver Detalles <span className="material-symbols-outlined !text-sm">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
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
                <div className="w-full bg-slate-200 rounded-xl overflow-hidden aspect-[16/10] shadow-sm">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnxStq18NJ7wAIDiSFoL5gn24j5HCTb84f9qlA7lBDiWrgMEtTsBJ23YdnDue9wRST2PBsKkdpnsYoBLhBYQAPiQp2LsK45kz33BUT684kh6I-WWrdPn7hu_Gt6AEyAOmgM3acjz_r8h5gckG2BvMVnMifPv80gGPbShkVNZb3ppPJtdMN8zB4coMBu1IhCkdJYZvLfpuOHlcmEpxvFJ3I2YQJR8jPKf8-QrMXo5jc5rIwCgzxMg3hZfx4H6Usr3-de4Mo3Wb4pNE")`,
                    }}
                  ></div>
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">Impresión de Remeras</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Diseños vibrantes y duraderos en remeras de alta calidad.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 group cursor-pointer">
                <div className="w-full bg-slate-200 rounded-xl overflow-hidden aspect-[16/10] shadow-sm">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnRaP9yvD6Em36XeRVHuPQRpSgvOI7irAA_aqVZH8sRXUAATRTspdan8DortOBNVsk1baEbybraLf4O36r8w90yriR8jD4dX2Ty3FT3Vovgzgd_ww29frR5wWc_IZenvTqF3lymhiIVlgT2HFC5K76FG4ruwQl7EjXUxilsvaGnxooJS7C5h7BHjoTUyy1xf0ee3gLpztRS6tYv6A0MOx9Lo9M9RnKZcJT_-zrV_Zc0nz2Ht-DCTcbXxAMEsqftPNPTVGMDxM3T_Y")`,
                    }}
                  ></div>
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">Gorras Personalizadas</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Estilo único con bordados o estampados para tu marca.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 group cursor-pointer">
                <div className="w-full bg-slate-200 rounded-xl overflow-hidden aspect-[16/10] shadow-sm">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4kXf04GvtTkjT_46aDVcO4909CtSnzQgMNhjthKBwFPTkLps0gGl_WgqEPbQmp2csIqXkkNYWKYqxh8fq-Tet-EAhmBEqSGWu-rfPgs--QUzVlXT6e8wQUP6cey36vTNkFhNEWyVU9ZznYLaVxEaLnEPODJYMcfbh87tGWLJDjIWMI47BU5RAmoCLV_fhOZUPwOEHn0uFeM-TpyrtiFW-QElYeR8NDx6GHGHtbKgW6Zyzw-oBAV_VSPrpSJ1AgUC00ljTEstrpe4")`,
                    }}
                  ></div>
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
              <Image
                width={150}
                height={40}
                alt="Client Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3emsY4lBNr1yqarGKV3rvx9fYmXEXxb9Yk603FobSlfS9V7zy7J4EPTVMfXD9VH7HVeT8TI6akXW_YabpF4-YY4QUNHHbb6F1_pvDPZZ1Wd1-WytYKhHi9AntYTO9YpddWyV68lEOgMeU6Nqa5IDtCYlH2aRrb1kOv8-qqfhbh6PNa6q2DU6FdSO2YQ5mQFzX7XlT_wFy9F7aAEICUxAsW3VeitKwknQIf8x9YNkzSrMHnons848u-cylZNp7AJfQFujy-ursVLM"
                className="h-8 md:h-10 object-contain"
              />
              <Image
                width={150}
                height={40}
                alt="Client Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrON91xhkk6R4pw7QVF9uftO1MY1-fHa7eFOYpJ9pvJm0jfPG9WkOJWeqIQWJ-_Kid61ie7N1j1xuZVLBf86UJe84aWaF-JwAvkRrDpAt70sUcyQmGrTpXACEIZhU_st0hRX-CcTkxM0BOEz-SxXs1oZ-MTaWopWhsweEdnOawbfAzClimUO6VW8no8Xl5BgaVBxHmN8A_gGAhSx140U6enGZ4ad9XN5FWBRzri3FX25VQTLtVoSNZxnsd1ZVhSbPBb5O1ctvEPd8"
                className="h-8 md:h-10 object-contain"
              />
              <Image
                width={150}
                height={40}
                alt="Client Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9LqJMN4nR_zfG5Ce9Sx10M3Ba3_jfxO7BOfTKm-AP4iWKgTa5RrUctm2HDLwctb9NkARLZZai6R7rn0USv_yeGSwc-o2EZG9kNMS0IT0BOds8D3wiGYNxF9nGDXD3X8QVIrJUDCwSUWrhc1VepBDLLW8mJXgIxvFG5RFmui1QdWy06cyk0vxYvfFQJOhp7FXCgBcSyX4sRLAyiMh_13cFV0U44JLxhC_dsCQu69sDR6UYq26YmVTjnrS9_goA1I6gxpll7D1sNpw"
                className="h-8 md:h-10 object-contain"
              />
              <Image
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

"use client";

import Link from "next/link";

const Home = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="@container">
                <div className="@[480px]:p-4">
                  <div
                    className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10 rounded-xl overflow-hidden"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNvBGQFcs78d2ZoldSkkBGjbKSKk0XcjZet_eQoMCAPqI7EOzYpqxawSD2D03jgDkC8KJH2ZLmFWZdJTksNIWNZaZ4WXjW5Wnilmuva16l_Dw9f1ufQVojo6vQx9f44CSI9o_fJ7-3HSBRyTrxUlnJlaFXgAveAO3fthinJtKrFR9O0iKkyKXRO9ydqmWLKH3RXrC3BiA6xvSEj41ArZGR9yCiSiqFyAWLxNqg2V1Q3JZje3DrWMYFKD4hYtzg_ME_azRaVJBpqVQ")',
                    }}
                  >
                    <div className="flex flex-col gap-2 text-left max-w-2xl">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        Personalizamos tus Ideas en Tela
                      </h1>
                      <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        Calidad superior, rapidez en la entrega y atención
                        personalizada para cada proyecto.
                      </h2>
                    </div>
                    <Link href="/tienda">
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary/90 transition-colors">
                        <span className="truncate">Empezar mi Pedido</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center sm:text-3xl">
                Nuestros Servicios Principales
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 p-4">
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnxStq18NJ7wAIDiSFoL5gn24j5HCTb84f9qlA7lBDiWrgMEtTsBJ23YdnDue9wRST2PBsKkdpnsYoBLhBYQAPiQp2LsK45kz33BUT684kh6I-WWrdPn7hu_Gt6AEyAOmgM3acjz_r8h5gckG2BvMVnMifPv80gGPbShkVNZb3ppPJtdMN8zB4coMBu1IhCkdJYZvLfpuOHlcmEpxvFJ3I2YQJR8jPKf8-QrMXo5jc5rIwCgzxMg3hZfx4H6Usr3-de4Mo3Wb4pNE")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                      Impresión de Remeras
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                      Diseños vibrantes y duraderos en remeras de alta calidad.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnRaP9yvD6Em36XeRVHuPQRpSgvOI7irAA_aqVZH8sRXUAATRTspdan8DortOBNVsk1baEbybraLf4O36r8w90yriR8jD4dX2Ty3FT3Vovgzgd_ww29frR5wWc_IZenvTqF3lymhiIVlgT2HFC5K76FG4ruwQl7EjXUxilsvaGnxooJS7C5h7BHjoTUyy1xf0ee3gLpztRS6tYv6A0MOx9Lo9M9RnKZcJT_-zrV_Zc0nz2Ht-DCTcbXxAMEsqftPNPTVGMDxM3T_Y")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                      Gorras Personalizadas
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                      Dale un estilo único a tu marca con nuestras gorras
                      bordadas o estampadas.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBwrz5dNbt2NaQ6vMfqzndRZIKHMqfX1cZvNgAxKYsxitcXDjKbIOL_WWvzpfWy9h9JPlYKhQqaaHWX0_Qy9-4qrWbDxkqx-zqF4bo9qBe2me_FImBpWZ_QtaQX0xQPaF7e8Ed7hfZFrWQKiJtXevf04GmIu5LbsOK7WwOT7r9G0aNQiqm4drAV5sP3eS4JnTw810x39nF9qepRNXAfhgKEl3OENG1DtcInemrlnqfYLbJBlHhorgMteC5Im84webVVx3ybtRSYZW4")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                      Buzos Estampados
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                      Comodidad y estilo con buzos personalizados para tu equipo
                      o evento.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4kXf04GvtTkjT_46aDVcO4909CtSnzQgMNhjthKBwFPTkLps0gGl_WgqEPbQmp2csIqXkkNYWKYqxh8fq-Tet-EAhmBEqSGWu-rfPgs--QUzVlXT6e8wQUP6cey36vTNkFhNEWyVU9ZznYLaVxEaLnEPODJYMcfbh87tGWLJDjIWMI47BU5RAmoCLV_fhOZUPwOEHn0uFeM-TpyrtiFW-QElYeR8NDx6GHGHtbKgW6Zyzw-oBAV_VSPrpSJ1AgUC00ljTEstrpe4")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                      Indumentaria Corporativa
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                      Uniformes profesionales que reflejan la identidad de tu
                      empresa.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmxVk643s8uDDhgjRbXDrgH0jHjHHwprx0KLG0HU50JSkbmhZMWoX5RyrhsD1k5yDikXyDbJjRtUdbMYRQ0CDrTkxQBXO_IQXIPx8BpDeQcgWItvfI_maL4-CPcUmSWsh7u4_bSLfWQjJ6n6PLRv9F_YPpv9bvSGn6QtEPmDJs78xC0aOXIz84UUN180ybVjLk6tzEPW9HZLsZFlO6mN2ZB6HcEkx8-JID5_C9DNoOT-Oj90RQcxRwWQpwjURSIXfGSVwP_bY9SqI")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                      Bolsas de Friselina
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                      Soluciones ecológicas y personalizadas para promocionar tu
                      negocio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Us Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-10 @container">
                <div className="flex flex-col gap-4 text-center">
                  <h1 className="text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                    ¿Por qué elegirnos?
                  </h1>
                  <p className="text-slate-800 dark:text-slate-200 text-base font-normal leading-normal max-w-[720px] mx-auto">
                    Nos comprometemos a ofrecerte la mejor calidad y servicio en
                    cada pedido.
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-0">
                  <div className="flex flex-1 gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 flex-col">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">
                        palette
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                        Calidad de Impresión
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                        Utilizamos tecnología de punta para asegurar acabados
                        nítidos y duraderos.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 flex-col">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">
                        checkroom
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                        Materiales Premium
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                        Seleccionamos los mejores textiles para garantizar
                        comodidad y resistencia.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 flex-col">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">
                        groups
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                        Asesoramiento Personalizado
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                        Nuestro equipo te guía en cada paso para que tu proyecto
                        sea un éxito.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 flex-col">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">
                        schedule
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                        Entregas a Tiempo
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                        Cumplimos con los plazos acordados para que tengas tus
                        productos cuando los necesitas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trusted By Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                  Confían en Nosotros
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Estamos orgullosos de trabajar con empresas líderes en su
                  sector.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-70">
                <img
                  className="h-8 md:h-10 transition-transform hover:scale-110"
                  alt="Logo de la empresa TechCorp"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3emsY4lBNr1yqarGKV3rvx9fYmXEXxb9Yk603FobSlfS9V7zy7J4EPTVMfXD9VH7HVeT8TI6akXW_YabpF4-YY4QUNHHbb6F1_pvDPZZ1Wd1-WytYKhHi9AntYTO9YpddWyV68lEOgMeU6Nqa5IDtCYlH2aRrb1kOv8-qqfhbh6PNa6q2DU6FdSO2YQ5mQFzX7XlT_wFy9F7aAEICUxAsW3VeitKwknQIf8x9YNkzSrMHnons848u-cylZNp7AJfQFujy-ursVLM"
                />
                <img
                  className="h-8 md:h-10 transition-transform hover:scale-110"
                  alt="Logo de la empresa InnovateX"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrON91xhkk6R4pw7QVF9uftO1MY1-fHa7eFOYpJ9pvJm0jfPG9WkOJWeqIQWJ-_Kid61ie7N1j1xuZVLBf86UJe84aWaF-JwAvkRrDpAt70sUcyQmGrTpXACEIZhU_st0hRX-CcTkxM0BOEz-SxXs1oZ-MTaWopWhsweEdnOawbfAzClimUO6VW8no8Xl5BgaVBxHmN8A_gGAhSx140U6enGZ4ad9XN5FWBRzri3FX25VQTLtVoSNZxnsd1ZVhSbPBb5O1ctvEPd8"
                />
                <img
                  className="h-8 md:h-10 transition-transform hover:scale-110"
                  alt="Logo de la empresa QuantumLeap"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9LqJMN4nR_zfG5Ce9Sx10M3Ba3_jfxO7BOfTKm-AP4iWKgTa5RrUctm2HDLwctb9NkARLZZai6R7rn0USv_yeGSwc-o2EZG9kNMS0IT0BOds8D3wiGYNxF9nGDXD3X8QVIrJUDCwSUWrhc1VepBDLLW8mJXgIxvFG5RFmui1QdWy06cyk0vxYvfFQJOhp7FXCgBcSyX4sRLAyiMh_13cFV0U44JLxhC_dsCQu69sDR6UYq26YmVTjnrS9_goA1I6gxpll7D1sNpw"
                />
                <img
                  className="h-8 md:h-10 transition-transform hover:scale-110"
                  alt="Logo de la empresa FutureNet"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo-vYzOZBx0UGJCNCXXATa3K10NjaDkU6V7DYHxOoCANM9yBlCKpX4WkuyGQRoQLHgvwgQxhkKdNUc1bUNE83yGU4Yg4tQ-u_bMFt_62n2il6bkSkqZGsK0fM-fRvWJjq3udnGLRUeqpxLpUcxmximIsuapWyZfA8L0gKa-vE9kIKVSfIH6tYLO2yYm-5-QQk1xa8rabFm0SyjqoNlusMfeQfjXaYQLsQHRU0QHEQ-4HNkt1Gz0b-oIXAflSndUnhTU_MVnLy-KKA"
                />
                <img
                  className="h-8 md:h-10 transition-transform hover:scale-110"
                  alt="Logo de la empresa Visionary Inc."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgQgukBa6H8U71u7rY44Ux3KVq6qkEu0wTFgHYDqd54x6sjiX3TXVGXBygwh5E0XVJX_7cQmTzsgdnStKCRyb2ur2lmnR2XMENMT74wZFZD8tEHP8KUkOcwjC-3452di36ponIG7bwPZuZE3hiMVF1KxF6p3F1G_wjteGaDqah9_Uospzy5M5MraM4ndbD3XZ3Mly71JOuuHDv0RkRbzhZ4GwGT3G11pHtA_iWG1QZLpSN7JIdfdW8FqwI8kPGo7zGiCYYI9QgktM"
                />
                <img
                  className="h-8 md:h-10 transition-transform hover:scale-110"
                  alt="Logo de la empresa Apex Solutions"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGTyHFpHPCxmfSbeHHdP0BU0-1HQfV0pWJC-iZb7OONJcZlQ4jlerzRsYX9c5IBrofIyr1lueuxrFZHwHBoFk7E1-Q_DDRC7qtvsiSlWS7EM8MsreN9eBRzcO-tb44Y1TB3JEUZSJnCBlrf665WoDE5ZaCBRLtZdzjgTo96Jl7LdbgUvN6s55RMtO_pRidSnAuJIEvujTADCez3SXKJqdtLICTRWGG2C9_DqsmzcfZGN0CmqEWZuFj5IJAShy7dgkAL-v7n5jLA50"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;

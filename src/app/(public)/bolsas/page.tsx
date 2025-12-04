import React from "react";

const BagsPage = () => {
    return (
        <div className="flex-grow">
            {/* HeroSection */}
            <div className="mt-5 @container">
                <div className="@[480px]:p-4">
                    <div
                        className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-start justify-end px-4 pb-10 @[480px]:px-10 shadow-lg"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4xA2OVOdliw9PM4dw_CiQMVFWT79sjmE9z2pJ0EiZLDS3GY4QVLWHEUvmDmmBtoCC4kdwWCatn3x_oPP11vmYmaBT5phUNxrHvglsweTJpdZBaX2mRAphv8RSriYFdyoZHYiNYL5A6vmIKTsBbRVVeHDoEBPJeQiOiwHxGkqesY91UDpfd2El-BUNeoACg6Vr9V54gJjbZMvNlMqcFxettYHbhesNc7HiwSu9IcVZoV4XHujIlo0dnaGcfNgOFxW4D9Vo8tufMD4")',
                        }}
                    >
                        <div className="flex flex-col gap-2 text-left">
                            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                                Bolsas de Friselina Personalizadas
                            </h1>
                            <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                                Duraderas, reutilizables y perfectamente impresas con tu logo.
                            </h2>
                        </div>
                        <a
                            href="#cotizacion"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary/90 transition-colors"
                        >
                            <span className="truncate">Solicitar Cotización</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* FeatureSection */}
            <div className="flex flex-col gap-10 px-4 py-10 @container text-[#111418] dark:text-white max-w-screen-xl mx-auto">
                <div className="flex flex-col gap-4">
                    <h1 className="tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                        ¿Por qué elegir nuestras bolsas?
                    </h1>
                    <p className="text-base font-normal leading-normal max-w-[720px] text-[#637288] dark:text-[#aeb8c4]">
                        Ofrecemos soluciones sostenibles y de alta calidad para elevar la
                        visibilidad de tu marca.
                    </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 p-0">
                    <div className="flex flex-1 gap-3 rounded-lg border border-[#dce0e5] dark:border-[#2c3a4a] bg-white dark:bg-zinc-900 p-4 flex-col">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-3xl">eco</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-base font-bold leading-tight">
                                Material Ecológico
                            </h2>
                            <p className="text-[#637288] dark:text-[#aeb8c4] text-sm font-normal leading-normal">
                                Hechas de polipropileno no tejido reciclable para una elección
                                sostenible.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-3 rounded-lg border border-[#dce0e5] dark:border-[#2c3a4a] bg-white dark:bg-zinc-900 p-4 flex-col">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-3xl">
                                verified
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-base font-bold leading-tight">
                                Calidad Duradera
                            </h2>
                            <p className="text-[#637288] dark:text-[#aeb8c4] text-sm font-normal leading-normal">
                                Construcción fuerte y resistente al desgarro diseñada para uso
                                repetido.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-3 rounded-lg border border-[#dce0e5] dark:border-[#2c3a4a] bg-white dark:bg-zinc-900 p-4 flex-col">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-3xl">
                                palette
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-base font-bold leading-tight">
                                Totalmente Personalizable
                            </h2>
                            <p className="text-[#637288] dark:text-[#aeb8c4] text-sm font-normal leading-normal">
                                Tu logo, tus colores. Damos vida a la visión de tu marca.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section (Simplified for now) */}
            <div className="py-10 max-w-screen-xl mx-auto">
                <div className="pb-3">
                    <div className="flex border-b border-[#dce0e5] dark:border-[#2c3a4a] px-4 gap-8">
                        <div className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-[13px] pt-4 cursor-pointer">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                                Material y Colores
                            </p>
                        </div>
                        {/* Additional tabs can be interactive later */}
                    </div>
                </div>
                {/* DescriptionList */}
                <div className="p-4 grid grid-cols-[30%_1fr] gap-x-6 text-[#111418] dark:text-white">
                    <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce0e5] dark:border-t-[#2c3a4a] py-5">
                        <p className="text-[#637288] dark:text-[#aeb8c4] text-sm font-normal leading-normal">
                            Tipo de Tela
                        </p>
                        <p className="text-sm font-normal leading-normal">
                            Polipropileno No Tejido (Friselina)
                        </p>
                    </div>
                    <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce0e5] dark:border-t-[#2c3a4a] py-5">
                        <p className="text-[#637288] dark:text-[#aeb8c4] text-sm font-normal leading-normal">
                            Gramaje
                        </p>
                        <p className="text-sm font-normal leading-normal">
                            Estándar 80 gsm para un equilibrio óptimo entre durabilidad y
                            flexibilidad.
                        </p>
                    </div>
                    <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dce0e5] dark:border-t-[#2c3a4a] py-5">
                        <p className="text-[#637288] dark:text-[#aeb8c4] text-sm font-normal leading-normal">
                            Colores Disponibles
                        </p>
                        <p className="text-sm font-normal leading-normal">
                            Ofrecemos una amplia paleta de más de 20 colores vibrantes para
                            coincidir con la identidad de tu marca.
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <section className="flex flex-col gap-10 px-4 py-10 text-[#111418] dark:text-white max-w-screen-xl mx-auto">
                <div className="flex flex-col gap-4">
                    <h2 className="tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                        Nuestro Trabajo
                    </h2>
                    <p className="text-base font-normal leading-normal max-w-[720px] text-[#637288] dark:text-[#aeb8c4]">
                        Ejemplos inspiradores de bolsas personalizadas que hemos creado para
                        nuestros clientes.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <img
                        className="aspect-square w-full rounded-lg object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2b58FhCNfI0_MAnPMTFgK8H2vijRNsgDjj2AxdptlI9KNyVisHrhN_erKrtHT0eMhx3e8tyM78ajfA6p39r5_r6eqIUbzEU3MXADt2QT3U5luaJOVGTtmnbdKAz83GHsn_HuITnQ7rF4m98BqgGtlH2IPI7HIujhsI3pG4-aUE58wz5eYc2_2oP75f_QiCfHhnkhLKFwfzy4H3egykMFYjvJutSZP-TMyeE-PYGPvlA3LnO8Ufdg5D2SXyFwOeUW1sAwwBQb8a5o"
                        alt="Bolsa blanca con logo negro"
                    />
                    <img
                        className="aspect-square w-full rounded-lg object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdW0xOWWSFyjneK_9WIWPQmUVahXs7vAllmKU_l8yxjSxXhPNbUy2xV-TanOqgja8tyDtXCUK7xwVrGnm3o48GAbdrZ9U7AxJ17DDMtdj3bHfnyqsn8sGwPGgch4K6CXOTYW3ho6FSl-zpelse26UoXlWQJvNuK5vAW4trtuZrdlU9VWGJ6mPm0xMmR5k0c45N6yQQXcGTo6UcI32yuU0V9BQfrb4qF0w2islWP6tj2nIsGFF9NZZ6-ZCK_xV8fz3JoOiPfbkNNGk"
                        alt="Persona llevando bolsa beige"
                    />
                    <img
                        className="aspect-square w-full rounded-lg object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBimgg7ymU5b8Kl_UFGd6qkCKb-GVCYT1YwgHpyRPXyTHI0tUZ1L-liiDODwL_CCVatKDtxoMT0bSN91xer-C-Ha1sW4eCA_efC6XX5EGbAMrfiGG4X1RnuGsxRpRldbBVu4kGgBxJ0pyzMvSiQ9Ugj_qqEul7WbSF3RQqptD381AYj1iyMxkMkV_zuFte_MKuXQsAVR5ZYrzx3tyOBI2qWolGmp6EccdOz9SevTHDE-zhxpFgcgbTCyZ61FhIcvkJQJaFjNETpleg"
                        alt="Bolsa azul con logo blanco"
                    />
                    <img
                        className="aspect-square w-full rounded-lg object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp0AvggFtXzyeeVsX27n8vbOhDcrBOVEvu8jCRSFpnbsRaGn9eJFRpUH8iPV3Rdz58nzfBW21uEXeX18Iq5aYX1yg_xBbyAusjtTZkSYFqW_eYPnKGkPhbqgpb_581sldyt76Xue6l0DcROwHXjSTPgf_8FtkK3Q1LO640zsjH1A_VvJdDUWLLHDdpd9J7do38vICawmpJdYFvTKLTbRglqjtvTVUJkhPQJ4xyjF1WRWp5e9WmYEkF089NROVd5tFAljZKPSzgH3s"
                        alt="Bolsas de colores apiladas"
                    />
                    <img
                        className="aspect-square w-full rounded-lg object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVoMNm0EfjvovnqeJyyNxM9Tp5Yx9Ae8yqBVF50YdXUei9nEep4EHAN2P4XWqE9csrGmpKTCQb_RrB6o9ng10mXHiFVhSCM-zITPOFGS7vc8NyCTCwNHXvaHAcIj5RmsjJDJoaXYcf42ljAVEQJAjygf9qQ9AgpVmzd34nOJiK9J0mZGkanmAx5eNyAY85DTzg7TmM0bj9Lb37PloCda4hseLqRsu93WNtz-1HT-BpGn3TDaS3RAL-fggnfWdpAd_szx0r96p4V94"
                        alt="Textura de bolsa negra"
                    />
                    <img
                        className="aspect-square w-full rounded-lg object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs5BQ0jwF6AUI60u1FBXBA6voABDlWDIebHVv7hSTPEPSFTAL_1ahQgc0NQc3b0ogOPtqqKWPI2RQdBckI2R1Hohc2UrDef7PkIE7A0SIDfMBbPtjeB1WkqNwyNNail00W6jT5n-ZgUftTbQDUUHsmBgDeh_p_fpQcW1K3hbbcrJAfIS9f4wKGkXlKkqmu5b8ID1QINq11bKM9ENq7jC1WMBE5oh4zGXz-3MSG2MMnF16A9mK4Iu0BQpPX-yQ8Ht3GXC0lxhRmug4"
                        alt="Bolsa roja personalizada"
                    />
                </div>
            </section>

            {/* Quotation Form Section */}
            <section
                className="flex flex-col gap-10 px-4 py-10 bg-white dark:bg-zinc-900 rounded-lg my-10 border border-[#dce0e5] dark:border-[#2c3a4a] max-w-screen-xl mx-auto"
                id="cotizacion"
            >
                <div className="flex flex-col gap-4 text-center items-center">
                    <h2 className="text-[#111418] dark:text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                        Obtén tu Cotización Personalizada
                    </h2>
                    <p className="text-[#637288] dark:text-[#aeb8c4] text-base font-normal leading-normal max-w-[720px]">
                        Completa el formulario y nuestro equipo te contactará pronto con un
                        presupuesto a medida.
                    </p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[#111418] dark:text-white text-sm font-medium"
                            htmlFor="name"
                        >
                            Nombre
                        </label>
                        <input
                            className="h-10 px-3 rounded-md border border-[#dce0e5] dark:border-[#2c3a4a] bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            id="name"
                            placeholder="Tu Nombre"
                            type="text"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[#111418] dark:text-white text-sm font-medium"
                            htmlFor="company"
                        >
                            Empresa
                        </label>
                        <input
                            className="h-10 px-3 rounded-md border border-[#dce0e5] dark:border-[#2c3a4a] bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            id="company"
                            placeholder="Nombre de tu Empresa"
                            type="text"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[#111418] dark:text-white text-sm font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="h-10 px-3 rounded-md border border-[#dce0e5] dark:border-[#2c3a4a] bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            id="email"
                            placeholder="tu@email.com"
                            type="email"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            className="text-[#111418] dark:text-white text-sm font-medium"
                            htmlFor="quantity"
                        >
                            Cantidad
                        </label>
                        <input
                            className="h-10 px-3 rounded-md border border-[#dce0e5] dark:border-[#2c3a4a] bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            id="quantity"
                            placeholder="ej., 500"
                            type="number"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label
                            className="text-[#111418] dark:text-white text-sm font-medium"
                            htmlFor="bag-size"
                        >
                            Tamaño y Modelo de Bolsa
                        </label>
                        <select
                            className="h-10 px-3 rounded-md border border-[#dce0e5] dark:border-[#2c3a4a] bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            id="bag-size"
                        >
                            <option>Selecciona un tamaño...</option>
                            <option>Estándar (30x40 cm)</option>
                            <option>Grande (40x50 cm con fuelle)</option>
                            <option>Pequeña (20x30 cm)</option>
                            <option>Tamaño personalizado</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label
                            className="text-[#111418] dark:text-white text-sm font-medium"
                            htmlFor="message"
                        >
                            Detalles de Impresión y Mensaje
                        </label>
                        <textarea
                            className="px-3 py-2 rounded-md border border-[#dce0e5] dark:border-[#2c3a4a] bg-background-light dark:bg-background-dark text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            id="message"
                            placeholder="Describe tus necesidades de impresión (ej., logo, cantidad de colores) y cualquier otro detalle."
                            rows={4}
                        ></textarea>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                            type="submit"
                        >
                            <span className="truncate">Enviar Solicitud</span>
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default BagsPage;

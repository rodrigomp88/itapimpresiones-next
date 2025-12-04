import React from "react";

const ApparelPage = () => {
    return (
        <div className="flex-grow">
            {/* HeroSection */}
            <div className="mt-5 @container">
                <div className="@[480px]:p-0">
                    <div
                        className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-start justify-center text-center px-4 py-10 @[480px]:px-10 shadow-lg"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkf8ftoyMDQFE4hvxVQRbUHtg3KFAwua69-VWr6O8dQ8UampxOJbkrKMx8vY1G8x6lmGKFxnEGih7GeiAL4vOF2Z_hSA8XV0lp7yQGzzVtVhjv3saJ0ohrWGBiSH0V0efgVuIy2rDtcoRLLbcVI-xT_8DveDm3BMlX7r9jXMmj2ne6mybgZI5Ev64kxH34pwqxsZt2ptcLYzUsuczCmkWJvpLZxHv-dSV1jmfqsPEjJCmAGbURuM5bO3-kZC49QQzIfFjEAZ5mOxE")',
                        }}
                    >
                        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                                Indumentaria Personalizada para tu Empresa
                            </h1>
                            <h2 className="text-white/90 text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal">
                                Potencia la identidad de tu marca con indumentaria de alta
                                calidad diseñada exclusivamente para tu equipo.
                            </h2>
                        </div>
                        <a
                            href="#quote-form"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 @[480px]:h-14 @[480px]:px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] mx-auto hover:bg-primary/90 transition-colors"
                        >
                            <span className="truncate">Solicitar Cotización</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <section className="py-16 sm:py-24 max-w-screen-xl mx-auto">
                <h2 className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-12 dark:text-white">
                    Nuestro Proceso Simplificado
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined !text-4xl">chat</span>
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">
                            Paso 1: Contacto y Cotización
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Contáctanos con tu idea. Te enviaremos una cotización detallada en
                            menos de 24 horas.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined !text-4xl">draw</span>
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">
                            Paso 2: Diseño y Aprobación
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Nuestro equipo creará una muestra digital. Podrás solicitar
                            ajustes hasta que estés 100% conforme.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined !text-4xl">
                                precision_manufacturing
                            </span>
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">
                            Paso 3: Producción
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Una vez aprobado el diseño, comenzamos la producción con
                            materiales de primera calidad.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined !text-4xl">
                                local_shipping
                            </span>
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">
                            Paso 4: Entrega
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Enviamos tu pedido a cualquier parte del país, listo para que tu
                            equipo lo estrene.
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900 rounded-xl max-w-screen-xl mx-auto">
                <h2 className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-12 dark:text-white">
                    Nuestros Productos Destacados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white dark:bg-black shadow-md">
                        <img
                            className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAmvhVck4lDxwMCbFP-IPHWYdza5aShcYHy_jByZWCWzYhc133NEsuJBV2Zn7H6G2ROzOocQL02LjXTEROBAqOAFQuw2IvMBYFfUfY8zPL3S0Uv1Ral5p6TWKRcGhTiDDihoav7mdZCeGXO6v1XagNdgdKX31BEA-Qs3IHdtYTImiGt_2_1tV8fqFcoM6IPeYabdUN2sZDvGtsFUHdhdu-CzdGS_VbFjQeyOpaF_yXdnGr81IW150b00xbU5s3u78qbjKl5IVFecM"
                            alt="Remeras"
                        />
                        <div className="p-5">
                            <h3 className="text-lg font-bold dark:text-white">Remeras</h3>
                        </div>
                    </div>
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white dark:bg-black shadow-md">
                        <img
                            className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4U8uDz0vt-WbZ-WWGtiKqYx1iZdEJa2XyLt9LvVkPJOntMfOv2ol7R0rEEcpo898afdYqE9BNplAwBpqxb-wRy7bk3dEeAgvCxxJZqasTAhGE6SAzq1LpdJFAzxIeahEm6Z6UPWiiJZ-RLBv7GwWcXGU3GVmIFVnKqlIvLlamw56w-lBklelQ9I5KvkeCAqtugOHiOgOLxEhLoPLWb7D3smxQRNjf-LQNrRuTbSbnTKo1z-49azak6cWKfoxtSJiM5SN-N9pKhSk"
                            alt="Buzos"
                        />
                        <div className="p-5">
                            <h3 className="text-lg font-bold dark:text-white">Buzos</h3>
                        </div>
                    </div>
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white dark:bg-black shadow-md">
                        <img
                            className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpGuTw7vyMolfWb1viDtCr-nx28jBjtQPzmw4IBRz52MQO7_9j7ypdQ19h0gvQ7sVlEv6-Ci_CQ79TZUkyZqiHtGmJwXGntqbJRveFe8mytLHAqrMqqH84o7z2lMo4BnBNQm1VTw9QzsEGbeQNiI2QUfkgDF6h0dYOzMoFoFRhv0jekyQV7tTD6SXg9-qfFxK5ATDY-t8rntqFK6qt4i1srd7sH7OEsa7Zdr3JaUE0aFxbrVM3f1FvsaCiiwKzAWKLtUREghGepS0"
                            alt="Gorras"
                        />
                        <div className="p-5">
                            <h3 className="text-lg font-bold dark:text-white">Gorras</h3>
                        </div>
                    </div>
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white dark:bg-black shadow-md">
                        <img
                            className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt2ChQ0XNhEF6wLzEs2FRT5L0iJVsVm8LfR2-kzI_-oI96zjH88SwujsZYesvhEx99vi7cE6yHlhiwqLgXTHtIT5Ft7BxneWkMgZFC0bDI_tFsoFIQk33z_wCg6bIIfGA_WnyI_7Fbyphmn5n2vJvuubSSvZJsudV0CmOV42Z7tnUzGdsGGV3V2Ey9bP9NUMm0a1sj0E3Tl9ED-49wwcdc5HKsmAHtgpQB6YwI2j7T_fnzZJgyLqcLfRIIys3xPNf5UMsQ_e9Z7wo"
                            alt="Bolsas"
                        />
                        <div className="p-5">
                            <h3 className="text-lg font-bold dark:text-white">
                                Bolsas de Friselina
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="py-16 sm:py-24 max-w-screen-xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] dark:text-white">
                        Clientes que Confían en Nosotros
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400">
                        Nos enorgullece haber colaborado con empresas de todos los tamaños.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-0.5 md:grid-cols-4 lg:mt-16">
                    <div className="col-span-1 flex justify-center bg-zinc-50 dark:bg-zinc-800 py-8 px-8">
                        <img
                            className="max-h-12"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe4qQ852WcmQjkxji5Z3xGiEMqzO0RFe3t_M4mem81wX5KOgAf8bgVFGTh2sllG0jfpMPuXZos6fbHlJwwY3VZhksOai1TSzMi018jbfO8TMNZJTfeFuhEZB1cNOU48pnshpNH_JRMFJgzP3M18UH1Q3nV2VjdOPNT33x-UMvsnfs0KDKxxi9V_QSJi4Rok4Ip86blMagWFfRne4Uk9fcRUbt_rK34K9l-HihmmGRkAQtsZ5s-BtQVgU5cfjScSWLd9Uj5e97knrE"
                            alt="Logo Empresa A"
                        />
                    </div>
                    <div className="col-span-1 flex justify-center bg-zinc-50 dark:bg-zinc-800 py-8 px-8">
                        <img
                            className="max-h-12"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxp8TvvdzRCtTlNqc5yu0-Jujxe3TAllSDvPO8IvwUFpvgyaEGE7SeWBLxssKKOHl5sHXMQX1szrmaBKmvs59LOKzMbgNBvLOpz7fiNMt1K8CetXpm0W55ebSvWhwIqzlIpDOWJbZB2hhs8haFIdouGwC6zDhM_pXRkQeiKu5yAwgQ7q8cxJ5nSFNKoZzScIXjzBYqQTUZq1PlxnNJdHlVXN1ItdTXBsVg7Y21_0QyMX9UqY6lQKO3aU95hrEwSM3PcyPIAjSllOg"
                            alt="Logo Empresa B"
                        />
                    </div>
                    <div className="col-span-1 flex justify-center bg-zinc-50 dark:bg-zinc-800 py-8 px-8">
                        <img
                            className="max-h-12"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzZnfkeGDQQRH7WBGjcqZkj8dy0WjBkrKeXr90LwJWY3VActmr9G7MDrPHyDRPOslXR6BNGDTF1axQPDD7qz-SOoR9WR8yulWZNfVgBEbaQRHtEdCF9qG2jxOgaH_RY9SnTonXOMpCOllshNxdMIjMyIIauAQTCs6dj7FdbTGK_njeHKO2HavOACC0FetndVlwSzZyG__HOlLms18J4Ffs3SgDqcdhz4gkjJE9DD0i2IZh5Pt7GKlcfkAAW0No8emkzX3ZcRkK71A"
                            alt="Logo Empresa C"
                        />
                    </div>
                    <div className="col-span-1 flex justify-center bg-zinc-50 dark:bg-zinc-800 py-8 px-8">
                        <img
                            className="max-h-12"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEZqtitHnFCLk-41Liw2Ey1c9wfZPN04bPu7FeaiVjRgUbT6I7i80VkdfLUuqTk7ygtfzWxJd1pPMGxnUQPKDacT2uWh1qJIbXSrodKLO3gVbPHRFXbuDsQiPNGPcymx1DfQ-NdIwmUMLqNXr9bx3WbBYQ2tBmZtniMU2YpAJHMPvHT7A1LDgwlvnLr8jPWnXWJAwd3XUbMCtuTPr3lE_2Cv0Nv7j3WmoXWW3fyPluMgSoFOL2LszscL08uOs5-K1GVsX-ktTd_uw"
                            alt="Logo Empresa D"
                        />
                    </div>
                </div>
            </section>

            {/* Quote Form & FAQ Section */}
            <section
                className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900 rounded-xl max-w-screen-xl mx-auto"
                id="quote-form"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-8">
                    {/* Quote Form */}
                    <div>
                        <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] mb-2 dark:text-white">
                            ¿Listo para empezar?
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                            Completa el formulario y nos pondremos en contacto a la brevedad.
                        </p>
                        <form className="space-y-6">
                            <div>
                                <label
                                    className="block text-sm font-medium dark:text-white"
                                    htmlFor="company-name"
                                >
                                    Nombre de la Empresa
                                </label>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-black shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                    id="company-name"
                                    type="text"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-medium dark:text-white"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-black shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                        id="email"
                                        type="email"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium dark:text-white"
                                        htmlFor="phone"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-black shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                        id="phone"
                                        type="tel"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-medium dark:text-white"
                                        htmlFor="product-type"
                                    >
                                        Tipo de Producto
                                    </label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-black shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                        id="product-type"
                                    >
                                        <option>Remeras</option>
                                        <option>Buzos</option>
                                        <option>Gorras</option>
                                        <option>Bolsas</option>
                                        <option>Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium dark:text-white"
                                        htmlFor="quantity"
                                    >
                                        Cantidad Estimada
                                    </label>
                                    <input
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-black shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                        id="quantity"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium dark:text-white"
                                    htmlFor="logo-upload"
                                >
                                    Adjuntar logo (opcional)
                                </label>
                                <input
                                    className="mt-1 block w-full text-sm text-zinc-600 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    id="logo-upload"
                                    type="file"
                                />
                            </div>
                            <button
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer"
                                type="submit"
                            >
                                Enviar Solicitud
                            </button>
                        </form>
                    </div>
                    {/* FAQ */}
                    <div>
                        <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] mb-8 dark:text-white">
                            Preguntas Frecuentes
                        </h2>
                        <div className="space-y-4">
                            <details className="group rounded-lg bg-white dark:bg-black p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <summary className="flex cursor-pointer list-none items-center justify-between font-medium dark:text-white">
                                    ¿Cuál es la cantidad mínima de pedido?
                                    <span className="transition group-open:rotate-180">
                                        <span className="material-symbols-outlined">
                                            expand_more
                                        </span>
                                    </span>
                                </summary>
                                <p className="group-open:animate-fadeIn mt-3 text-zinc-600 dark:text-zinc-400">
                                    La cantidad mínima varía según el producto y la técnica de
                                    estampado. Generalmente, es de 20 unidades para serigrafía y
                                    no hay mínimo para otras técnicas. ¡Consúltanos por tu caso!
                                </p>
                            </details>
                            <details className="group rounded-lg bg-white dark:bg-black p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <summary className="flex cursor-pointer list-none items-center justify-between font-medium dark:text-white">
                                    ¿Cuánto tiempo tardan en producir el pedido?
                                    <span className="transition group-open:rotate-180">
                                        <span className="material-symbols-outlined">
                                            expand_more
                                        </span>
                                    </span>
                                </summary>
                                <p className="group-open:animate-fadeIn mt-3 text-zinc-600 dark:text-zinc-400">
                                    El tiempo de producción estándar es de 7 a 10 días hábiles una
                                    vez aprobado el diseño y recibido el pago. Ofrecemos servicios
                                    urgentes con un costo adicional.
                                </p>
                            </details>
                            <details className="group rounded-lg bg-white dark:bg-black p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <summary className="flex cursor-pointer list-none items-center justify-between font-medium dark:text-white">
                                    ¿Qué formato de archivo necesitan para el logo?
                                    <span className="transition group-open:rotate-180">
                                        <span className="material-symbols-outlined">
                                            expand_more
                                        </span>
                                    </span>
                                </summary>
                                <p className="group-open:animate-fadeIn mt-3 text-zinc-600 dark:text-zinc-400">
                                    Para obtener la mejor calidad, preferimos archivos vectoriales
                                    (.ai, .eps, .svg). También aceptamos imágenes de alta
                                    resolución (.png, .psd, .jpg) de al menos 300 DPI. Si no
                                    tienes un archivo de alta calidad, nuestro equipo de diseño
                                    puede ayudarte.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApparelPage;

import React from "react";

const ServicesPage = () => {
    return (
        <div className="flex-grow">
            {/* HeroSection */}
            <section className="container mx-auto px-4 py-16 sm:py-24">
                <div className="@container">
                    <div className="flex flex-col gap-8 @[864px]:flex-row-reverse items-center">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full shadow-lg"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5PY7LV3YqwD2BxvMqektS007AbbWRbhvceeMS_pv4TT9SSniZNV3Zy718c-ZwhHAMTg5sccxIjGX2eyxin0wUEH9dkY2JNf-P9qnFaLFP3LLtHby4zqF1FJc-9T8QBLy1Z0NMZO-aGuHQlZLy_xnmfvxsQ8zPYqTRTsQP4JU_3RzOrm-kKJrmZ0sMpUAUOoI_N1dVOjc7BkQBkhKEj1VYq2AwMDXsw__MygX4hFyLkRBWik4aO1dupf9PFKsVN8S8fRhjv-6zzfg")',
                            }}
                        ></div>
                        <div className="flex flex-col gap-6 text-center @[864px]:text-left @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl dark:text-white">
                                    Impresión Textil Profesional: Serigrafía y DTF de Alta Calidad
                                </h1>
                                <h2 className="text-base font-normal leading-normal @[480px]:text-lg text-gray-600 dark:text-gray-300">
                                    Damos vida a tus diseños en remeras, buzos, gorras y más.
                                </h2>
                            </div>
                            <a
                                className="flex self-center @[864px]:self-start min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                                href="#contacto"
                            >
                                <span className="truncate">Solicitar Cotización</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section
                className="container mx-auto px-4 py-16 sm:py-24 bg-white dark:bg-gray-900 rounded-xl"
                id="servicios"
            >
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] dark:text-white">
                        Nuestros Servicios de Impresión
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Ofrecemos las mejores técnicas para cada tipo de proyecto. Elige la
                        que mejor se adapte a tus necesidades.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Serigrafía Feature */}
                        <div className="flex-1 flex flex-col gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
                            <h3 className="text-2xl font-bold tracking-tight dark:text-white">
                                Serigrafía
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Técnica tradicional ideal para diseños con colores planos y
                                grandes cantidades. Ofrece una durabilidad excepcional y colores
                                vibrantes.
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
                        <div className="flex-1 flex flex-col gap-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
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
            <section className="container mx-auto px-4 py-16 sm:py-24" id="portfolio">
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
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYChaR5Bn0-GYEi6ED0NXD6UBMngCpfCU5szu3l8UQedn_fNlkKTig5B9nXgbQz_JTl9V-fUIBl768Fja8yTCP4DxDSf3IxEWBHc7kX4xiKXPj67Esni2_KzJSPQ1jL91wRlG4jRVV6Sw7Jvc0oQWsC7gjhWbx2PrGvOqslpk-DKtJZnTZUiwxdmDDnF_x4ULbQIeINIxoeNIouhy6lSDiH1kZRWfH26VXUr9mj-W5-_Es_uQAdohbgPM1479WZEfiMO4kxoFkXlU"
                            alt="Remeras para Evento"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Remeras para Evento</p>
                        </div>
                    </div>
                    <div className="group aspect-square overflow-hidden rounded-lg relative">
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPIG4ysf45_RxdSJDKGFA4daVosJKjX-1N5TahDo62MhzKT6FNjCWtPdEHwl4LgEEsSP6TdMmg9X5u4jfI0JthkbM9vk5yCxnpwllcS1ODgN7-Bww-_bZttCH0pF4QKhP56XEA_pv08VmhyRYfVyDF_ga5ZiJCduOhAH26b7R7DUiVuzhIZBbQDtN1Py8irDAjL-e9vLXH73ZmLZC2kkMwCVvjzYeXf2_feWZBVAs0DkOC7S-hdjNZBsFde_rHpPajwCtZBlzy2T4"
                            alt="Buzos para Empresas"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Buzos para Empresas</p>
                        </div>
                    </div>
                    <div className="group aspect-square overflow-hidden rounded-lg relative">
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQABuFXf2NA4nQdOmp4ymkRjDK7vgY2j_AeTXS5tdeE5df3VL5lpKz3nuhnNw-RWbyjSorDrPm-S_yhQrvEGm1ggX3F-bkazSTbkw1mlER9sEBKMkqGu20JaYQ-bFhZnqgfI-x6MR9bj1zPlPzw2DIgSp1Ffmxoowy-GgQLToEGNoLCK3ydoYDGIx2F0i9wn3ar3vFGVo4caYxgFwgHk2W9KOWRkzvC-HUCwGRViuWkxjoFuhl5egb4_2pJfWc9jZO4DKDdHrogg"
                            alt="Gorras Personalizadas"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Gorras Personalizadas</p>
                        </div>
                    </div>
                    <div className="group aspect-square overflow-hidden rounded-lg relative">
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYwftHXYU33GbhuhagiLOldZ--J-KYE4jCw5BNgeWOVKf1KILwevCieGADOQcIDASi5shxfsc3aesRG8ixyt5SVrQO-bugzCY53LXvrBe6nABxtrDxBojX7UHnTX_n31-AYXaGtHlv47wY1IaQPaYWr4Ash-8GBNac4Fk7tT68XdVoPgQ43mbzHtOGFBqv5ll1lpkLbp0Cp0PEyiP_Tn-c62jLUsaSq8zltWVTK8CHdC4hFunU5RtxHsgiX-PwVTL25_k0ZFB4Gvs"
                            alt="Bolsas de Friselina"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Bolsas de Friselina</p>
                        </div>
                    </div>
                    <div className="group aspect-square overflow-hidden rounded-lg relative">
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7hCduA6Gw6qep84N216yIsvMLphfgJT6cZzsLnHb7qiXYLCEmQtvtqvjpyXJlg1OVAPPfXPLNi6cKGQcC4eW5cCsu1izx4OGZqe9C0UUNAbWBtJ0Fuj22Zg0pFjCp4F0y5vZlJjtes1yeU_gh-fqCCw1cg1A6lQbR-AQgoRft_-2zvBcVzlM1xhMnYeXQOW0AeBeDKf4bNIBBx3uA4MIt2RnNcj6YY4INRwujj0GLv2dbWKwfIeqAD3FgpyfVH3jNo43axfVWY4o"
                            alt="Indumentaria Promocional"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Indumentaria Promocional</p>
                        </div>
                    </div>
                    <div className="group aspect-square overflow-hidden rounded-lg relative">
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZIPQm_Ju2khKHi-NQSF5Ptvx_XGCVlgiZ0pWCXdtiWVyUMDxwJkZ1pognfg8-kB0PfUF-ngSOi_s89FgiE2pfDe2ypv8NYcHGjo_G6sK_vGXswPiiWkytDLgVNy3PmiRrQk4ET_8lCRtePUw97tXR7QNdtpCLLPloM_8GkxdC0mXzAeYsUKUUV26q7Iy7QqtnF517cab1272a1e8qXH6xinnNtrs5hD-w-S0b4GuHbFbH8_8YvOMbi-i9twT6sQE-NO79cUo_xHQ"
                            alt="Diseños a Todo Color"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-end p-4">
                            <p className="text-white font-semibold">Diseños a Todo Color</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section className="container mx-auto px-4 py-16 sm:py-24 bg-white dark:bg-gray-900 rounded-xl">
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
            <section className="container mx-auto px-4 py-16 sm:py-24" id="contacto">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] dark:text-white">
                        Solicita tu Cotización Personalizada
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Cuéntanos sobre tu proyecto y nuestro equipo se pondrá en contacto a
                        la brevedad.
                    </p>
                </div>
                <form className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="sm:col-span-2">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="name"
                        >
                            Nombre
                        </label>
                        <input
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="name"
                            name="name"
                            type="text"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="email"
                            name="email"
                            type="email"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="phone"
                        >
                            Teléfono
                        </label>
                        <input
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="phone"
                            name="phone"
                            type="tel"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="service"
                        >
                            Tipo de Servicio
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="service"
                            name="service"
                        >
                            <option>Serigrafía</option>
                            <option>DTF</option>
                            <option>No estoy seguro</option>
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="quantity"
                        >
                            Cantidad (aprox.)
                        </label>
                        <input
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="quantity"
                            name="quantity"
                            type="number"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="message"
                        >
                            Describe tu proyecto
                        </label>
                        <textarea
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="message"
                            name="message"
                            rows={4}
                        ></textarea>
                    </div>
                    <div className="sm:col-span-2">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="file-upload"
                        >
                            Adjuntar archivo (opcional)
                        </label>
                        <input
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            id="file-upload"
                            name="file-upload"
                            type="file"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <button
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer"
                            type="submit"
                        >
                            Cotizar mi Proyecto
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ServicesPage;

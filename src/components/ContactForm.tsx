"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

interface ContactFormProps {
    formType: "services" | "bags" | "apparel";
}

const ContactForm: React.FC<ContactFormProps> = ({ formType }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data.formType = formType;

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitStatus("success");
                if (e.currentTarget) {
                    e.currentTarget.reset();
                }
            } else {
                setSubmitStatus("error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700"
        >
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
                    required
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
                    required
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
            {formType === "services" && (
                <>
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
                </>
            )}
            {formType === "bags" && (
                <>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="quantity"
                        >
                            Cantidad
                        </label>
                        <input
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="quantity"
                            name="quantity"
                            type="number"
                            placeholder="ej., 500"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="bagSize"
                        >
                            Tamaño de Bolsa
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="bagSize"
                            name="bagSize"
                        >
                            <option>Selecciona un tamaño...</option>
                            <option>Estándar (30x40 cm)</option>
                            <option>Grande (40x50 cm con fuelle)</option>
                            <option>Pequeña (20x30 cm)</option>
                            <option>Tamaño personalizado</option>
                        </select>
                    </div>
                </>
            )}
            {formType === "apparel" && (
                <>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="productType"
                        >
                            Tipo de Producto
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="productType"
                            name="productType"
                        >
                            <option>Remeras</option>
                            <option>Buzos</option>
                            <option>Gorras</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            htmlFor="quantity"
                        >
                            Cantidad
                        </label>
                        <input
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary p-2"
                            id="quantity"
                            name="quantity"
                            type="number"
                        />
                    </div>
                </>
            )}
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
                    required
                ></textarea>
            </div>
            {formType === "services" && (
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
            )}
            {submitStatus === "success" && (
                <div className="sm:col-span-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                        ✓ Formulario enviado con éxito. Nos pondremos en contacto pronto.
                    </p>
                </div>
            )}
            {submitStatus === "error" && (
                <div className="sm:col-span-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                        ✗ Error al enviar el formulario. Por favor, intenta nuevamente.
                    </p>
                </div>
            )}
            <div className="sm:col-span-2">
                <motion.button
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? "Enviando..." : "Cotizar mi Proyecto"}
                </motion.button>
            </div>
        </form>
    );
};

export default ContactForm;

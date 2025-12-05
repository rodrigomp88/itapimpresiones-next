"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaWhatsapp, FaFilter, FaSearch } from "react-icons/fa";
import { MdOutlineInventory2, MdDesignServices, MdShoppingBag } from "react-icons/md";

interface ContactSubmission {
    id: string;
    formType: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    service?: string;
    quantity?: string;
    bagSize?: string;
    productType?: string;
    status: string;
    createdAt: string;
}

interface SubmissionsClientProps {
    initialSubmissions: ContactSubmission[];
}

const SubmissionsClient: React.FC<SubmissionsClientProps> = ({ initialSubmissions }) => {
    const [filter, setFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSubmissions = initialSubmissions.filter((sub) => {
        const matchesFilter = filter === "all" || sub.formType === filter;
        const matchesSearch =
            sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getFormTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            services: "Servicios",
            bags: "Bolsas",
            apparel: "Indumentaria",
        };
        return labels[type] || type;
    };

    const getFormTypeIcon = (type: string) => {
        switch (type) {
            case "services":
                return <MdDesignServices className="text-blue-500" />;
            case "bags":
                return <MdShoppingBag className="text-green-500" />;
            case "apparel":
                return <MdOutlineInventory2 className="text-purple-500" />;
            default:
                return <FaFilter className="text-gray-500" />;
        }
    };

    const getFormTypeColor = (type: string) => {
        switch (type) {
            case "services":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
            case "bags":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
            case "apparel":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Fecha no disponible";
        return new Date(dateString).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Cotizaciones
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Gestiona las solicitudes de tus clientes
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: "all", label: "Todas", icon: null },
                    { id: "services", label: "Servicios", icon: <MdDesignServices /> },
                    { id: "bags", label: "Bolsas", icon: <MdShoppingBag /> },
                    { id: "apparel", label: "Indumentaria", icon: <MdOutlineInventory2 /> },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === item.id
                                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg scale-105"
                                : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                            }`}
                    >
                        {item.icon}
                        {item.label}
                        {filter === item.id && (
                            <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                                {item.id === "all"
                                    ? initialSubmissions.length
                                    : initialSubmissions.filter(s => s.formType === item.id).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Submissions Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredSubmissions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-full mb-4">
                                <FaFilter className="text-4xl text-zinc-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                No se encontraron cotizaciones
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                                Intenta cambiar los filtros o tu búsqueda
                            </p>
                        </motion.div>
                    ) : (
                        filteredSubmissions.map((submission) => (
                            <motion.div
                                layout
                                key={submission.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 flex flex-col"
                            >
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${getFormTypeColor(submission.formType)} bg-opacity-20`}>
                                            {getFormTypeIcon(submission.formType)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-1">
                                                {submission.name}
                                            </h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                                {formatDate(submission.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getFormTypeColor(submission.formType)}`}>
                                        {getFormTypeLabel(submission.formType)}
                                    </span>
                                </div>

                                {/* Card Content */}
                                <div className="space-y-3 flex-grow">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {submission.service && (
                                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Servicio</p>
                                                <p className="font-medium text-zinc-900 dark:text-zinc-200 truncate">{submission.service}</p>
                                            </div>
                                        )}
                                        {submission.quantity && (
                                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Cantidad</p>
                                                <p className="font-medium text-zinc-900 dark:text-zinc-200">{submission.quantity}</p>
                                            </div>
                                        )}
                                        {submission.bagSize && (
                                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Tamaño</p>
                                                <p className="font-medium text-zinc-900 dark:text-zinc-200">{submission.bagSize}</p>
                                            </div>
                                        )}
                                        {submission.productType && (
                                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Tipo</p>
                                                <p className="font-medium text-zinc-900 dark:text-zinc-200">{submission.productType}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl">
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Mensaje</p>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3 italic">
                                            "{submission.message}"
                                        </p>
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                                    <a
                                        href={`mailto:${submission.email}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                                    >
                                        <FaEnvelope />
                                        Email
                                    </a>
                                    {submission.phone && (
                                        <a
                                            href={`https://wa.me/${submission.phone.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-colors"
                                        >
                                            <FaWhatsapp className="text-lg" />
                                            WhatsApp
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default SubmissionsClient;

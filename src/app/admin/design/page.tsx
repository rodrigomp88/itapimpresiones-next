"use client";

import React, { useState, useEffect } from "react";
import { db, storage, auth } from "@/firebase/config";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    orderBy,
    query,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { Banner } from "@/types";
import { FaTrash, FaEdit, FaPlus, FaImage, FaCloudDownloadAlt } from "react-icons/fa";
import Image from "next/image";
import Notiflix from "notiflix";
import { sliderData } from "@/components/Carousel/data";

const AdminDesignPage = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [heading, setHeading] = useState("");
    const [desc, setDesc] = useState("");
    const [ctaLink, setCtaLink] = useState("");
    const [ctaLinkType, setCtaLinkType] = useState("custom");
    const [customUrl, setCustomUrl] = useState("");
    const [ctaText, setCtaText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedBanners: Banner[] = [];
            querySnapshot.forEach((doc) => {
                fetchedBanners.push({ id: doc.id, ...doc.data() } as Banner);
            });
            setBanners(fetchedBanners);
        } catch (error) {
            console.error("Error fetching banners:", error);
            Notiflix.Notify.failure("Error al cargar banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setHeading("");
        setDesc("");
        setCtaLink("");
        setCtaLinkType("custom");
        setCustomUrl("");
        setCtaText("");
        setImageFile(null);
    };

    const handleLoadDefaults = async () => {
        Notiflix.Confirm.show(
            "Cargar Banners por Defecto",
            "¿Estás seguro? Esto agregará los 4 banners originales a la base de datos.",
            "Sí, cargar",
            "Cancelar",
            async () => {
                try {
                    setLoading(true);
                    const batchPromises = sliderData.map((slide) => {
                        return addDoc(collection(db, "banners"), {
                            ...slide,
                            createdAt: serverTimestamp(),
                        });
                    });
                    await Promise.all(batchPromises);
                    Notiflix.Notify.success("Banners por defecto cargados");
                    fetchBanners();
                } catch (error) {
                    console.error("Error loading defaults:", error);
                    Notiflix.Notify.failure("Error al cargar defaults");
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            Notiflix.Notify.failure("Por favor selecciona una imagen");
            return;
        }

        try {
            setUploading(true);

            // 1. Upload Image
            const storageRef = ref(storage, `banners/${Date.now()}-${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save Metadata to Firestore
            await addDoc(collection(db, "banners"), {
                heading,
                desc,
                ctaLink,
                ctaText,
                image: downloadURL,
                createdAt: serverTimestamp(),
            });

            Notiflix.Notify.success("Banner agregado correctamente");
            setIsModalOpen(false);
            resetForm();
            fetchBanners();
        } catch (error) {
            console.error("Error adding banner:", error);
            Notiflix.Notify.failure("Error al guardar el banner");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (banner: Banner) => {
        if (!banner.id) return;

        Notiflix.Confirm.show(
            "Eliminar Banner",
            "¿Estás seguro de eliminar este banner? Esta acción no se puede deshacer.",
            "Sí, eliminar",
            "Cancelar",
            async () => {
                try {
                    // 1. Delete Logic
                    await deleteDoc(doc(db, "banners", banner.id!));

                    // Optionally delete from storage if we parsed the ref properly, 
                    // but for now keeping it simple to avoid deleting wrong files if URL format changes

                    Notiflix.Notify.success("Banner eliminado");
                    fetchBanners();
                } catch (error) {
                    console.error("Error deleting banner:", error);
                    Notiflix.Notify.failure("Error al eliminar");
                }
            }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Diseño de Página
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Gestiona los banners y elementos visuales de la portada.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium"
                >
                    <FaPlus />
                    <span>Agregar Banner</span>
                </button>
                {banners.length === 0 && (
                    <button
                        onClick={handleLoadDefaults}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium border border-gray-300"
                    >
                        <FaCloudDownloadAlt />
                        <span>Cargar Defaults</span>
                    </button>
                )}
            </div>

            {/* Banners Grid */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        Banners del Carrusel Principal
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-zinc-500">Cargando...</div>
                ) : banners.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400">
                            <FaImage className="text-xl" />
                        </div>
                        <p className="text-zinc-500">No hay banners activos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className="group relative bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Image Preview */}
                                <div className="relative h-48 w-full bg-gray-200">
                                    <Image
                                        src={banner.image}
                                        alt={banner.heading}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-2">
                                    <h3 className="font-bold text-zinc-900 dark:text-white truncate">
                                        {banner.heading}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 h-10">
                                        {banner.desc}
                                    </p>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">
                                            {banner.ctaText || "Sin botón"}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(banner)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            title="Eliminar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Banner Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-lg shadow-2xl p-6 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                                Nuevo Banner
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Imagen (Recomendado: Horizontal, Alta Calidad)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                    required
                                />
                            </div>

                            {/* Heading */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Título Principal
                                </label>
                                <input
                                    type="text"
                                    value={heading}
                                    onChange={(e) => setHeading(e.target.value)}
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                    placeholder="Ej: Oferta de Invierno"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none h-20 resize-none"
                                    placeholder="Ej: Descuentos increíbles en todas las gorras..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* CTA Reference */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                        Enlace del Botón
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <select
                                            value={ctaLinkType}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setCtaLinkType(val);
                                                if (val !== "custom") setCtaLink(val);
                                                else setCtaLink(customUrl);
                                            }}
                                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                                        >
                                            <option value="/tienda">Tienda (General)</option>
                                            <option value="/tienda?category=Remeras">Tienda - Remeras</option>
                                            <option value="/tienda?category=Buzos">Tienda - Buzos</option>
                                            <option value="/tienda?category=Gorras">Tienda - Gorras</option>
                                            <option value="/tienda?category=Bolsas">Tienda - Bolsas</option>
                                            <option value="/servicios">Servicios</option>
                                            <option value="/contacto">Contacto</option>
                                            <option value="custom">Otro (URL Personalizada)</option>
                                        </select>
                                        {ctaLinkType === "custom" && (
                                            <input
                                                type="text"
                                                value={customUrl}
                                                onChange={(e) => {
                                                    setCustomUrl(e.target.value);
                                                    setCtaLink(e.target.value);
                                                }}
                                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                                placeholder="Ej: https://google.com o /ruta-interna"
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* CTA Text */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                        Texto del Botón
                                    </label>
                                    <input
                                        type="text"
                                        value={ctaText}
                                        onChange={(e) => setCtaText(e.target.value)}
                                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                        placeholder="Ej: Ver Ofertas"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Guardando...</span>
                                        </>
                                    ) : (
                                        <span>Guardar Banner</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDesignPage;

"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { Coupon, CouponType } from "@/types/coupon";
import {
  NotiflixSuccess,
  NotiflixFailure,
} from "@/components/Notiflix/Notiflix";

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as CouponType,
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 0,
    validFrom: "",
    validUntil: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const snapshot = await getDocs(collection(db, "coupons"));
      const couponsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        validFrom: doc.data().validFrom?.toDate() || new Date(),
        validUntil: doc.data().validUntil?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Coupon[];
      setCoupons(couponsData);
    } catch {
      NotiflixFailure("Error al cargar cupones");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.code ||
      !formData.value ||
      !formData.validFrom ||
      !formData.validUntil
    ) {
      NotiflixFailure("Completá todos los campos requeridos");
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: Number(formData.value),
        minPurchase: Number(formData.minPurchase) || null,
        maxDiscount: Number(formData.maxDiscount) || null,
        usageLimit: Number(formData.usageLimit) || null,
        usageCount: editingCoupon?.usageCount || 0,
        validFrom: Timestamp.fromDate(new Date(formData.validFrom)),
        validUntil: Timestamp.fromDate(new Date(formData.validUntil)),
        description: formData.description,
        isActive: formData.isActive,
        categories: [],
        updatedAt: Timestamp.now(),
      };

      if (editingCoupon) {
        await updateDoc(doc(db, "coupons", editingCoupon.id), couponData);
        NotiflixSuccess("Cupón actualizado");
      } else {
        await addDoc(collection(db, "coupons"), {
          ...couponData,
          createdAt: Timestamp.now(),
        });
        NotiflixSuccess("Cupón creado");
      }

      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error("Error guardando cupón:", error);
      NotiflixFailure("Error al guardar cupón");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar este cupón?")) return;

    try {
      await deleteDoc(doc(db, "coupons", id));
      NotiflixSuccess("Cupón eliminado");
      fetchCoupons();
    } catch (error) {
      console.error("Error eliminando cupón:", error);
      NotiflixFailure("Error al eliminar cupón");
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      validFrom: coupon.validFrom.toISOString().split("T")[0],
      validUntil: coupon.validUntil.toISOString().split("T")[0],
      description: coupon.description || "",
      isActive: coupon.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: 0,
      minPurchase: 0,
      maxDiscount: 0,
      usageLimit: 0,
      validFrom: "",
      validUntil: "",
      description: "",
      isActive: true,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await updateDoc(doc(db, "coupons", coupon.id), {
        isActive: !coupon.isActive,
        updatedAt: Timestamp.now(),
      });
      NotiflixSuccess(coupon.isActive ? "Cupón desactivado" : "Cupón activado");
      fetchCoupons();
    } catch {
      NotiflixFailure("Error al cambiar estado");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-prussian-blue dark:text-white">
          🎟️ Cupones de Descuento
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {showForm ? "Cancelar" : "+ Nuevo Cupón"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-prussian-blue dark:text-white">
            {editingCoupon ? "Editar Cupón" : "Crear Nuevo Cupón"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Código *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Ej: VERANO20"
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Tipo *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as CouponType,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Valor * ({formData.type === "percentage" ? "%" : "$"})
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
                min="0"
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Compra mínima ($)
              </label>
              <input
                type="number"
                value={formData.minPurchase}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minPurchase: Number(e.target.value),
                  })
                }
                min="0"
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Válido desde *
              </label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) =>
                  setFormData({ ...formData, validFrom: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Válido hasta *
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Límite de usos (0 = ilimitado)
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: Number(e.target.value),
                  })
                }
                min="0"
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Descuento máximo ($) - Solo para %
              </label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDiscount: Number(e.target.value),
                  })
                }
                min="0"
                disabled={formData.type !== "percentage"}
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white disabled:opacity-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ej: Descuento de verano 2025"
                className="w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-prussian-blue dark:text-white"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  Cupón activo
                </span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-prussian-blue dark:hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {editingCoupon ? "Actualizar" : "Crear Cupón"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de cupones */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Descuento
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Validez
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Usos
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No hay cupones creados
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-prussian-blue dark:text-white">
                      {coupon.code}
                    </span>
                    {coupon.description && (
                      <p className="text-xs text-zinc-500">
                        {coupon.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-prussian-blue dark:text-white">
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : `$${coupon.value.toLocaleString()}`}
                    {coupon.minPurchase && (
                      <p className="text-xs text-zinc-500">
                        Mín: ${coupon.minPurchase.toLocaleString()}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                    {coupon.validFrom.toLocaleDateString()} -{" "}
                    {coupon.validUntil.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-prussian-blue dark:text-white">
                    {coupon.usageCount}
                    {coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(coupon)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        coupon.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {coupon.isActive ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-primary hover:text-primary-dark mr-3 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

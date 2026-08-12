import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { Coupon, CouponValidationResult } from "@/types/coupon";

interface ValidateRequest {
  code: string;
  cartTotal: number;
  userId?: string;
  categories?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequest = await request.json();
    const { code, cartTotal, categories = [] } = body;

    if (!code || code.trim() === "") {
      return NextResponse.json<CouponValidationResult>({
        isValid: false,
        message: "Ingresá un código de cupón",
      });
    }

    // Buscar cupón por código
    const couponsRef = collection(db, "coupons");
    const q = query(couponsRef, where("code", "==", code.toUpperCase().trim()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json<CouponValidationResult>({
        isValid: false,
        message: "El código de cupón no existe",
      });
    }

    const couponDoc = snapshot.docs[0];
    const couponData = couponDoc.data();

    const coupon: Coupon = {
      id: couponDoc.id,
      code: couponData.code,
      type: couponData.type,
      value: couponData.value,
      minPurchase: couponData.minPurchase,
      maxDiscount: couponData.maxDiscount,
      usageLimit: couponData.usageLimit,
      usageCount: couponData.usageCount || 0,
      userLimit: couponData.userLimit,
      validFrom: couponData.validFrom?.toDate() || new Date(),
      validUntil: couponData.validUntil?.toDate() || new Date(),
      isActive: couponData.isActive,
      categories: couponData.categories || [],
      description: couponData.description,
      createdAt: couponData.createdAt?.toDate() || new Date(),
      updatedAt: couponData.updatedAt?.toDate() || new Date(),
    };

    // Validar si está activo
    if (!coupon.isActive) {
      return NextResponse.json<CouponValidationResult>({
        isValid: false,
        message: "Este cupón ya no está activo",
      });
    }

    // Validar fechas
    const now = new Date();
    if (now < coupon.validFrom) {
      return NextResponse.json<CouponValidationResult>({
        isValid: false,
        message: "Este cupón aún no está disponible",
      });
    }

    if (now > coupon.validUntil) {
      return NextResponse.json<CouponValidationResult>({
        isValid: false,
        message: "Este cupón ha expirado",
      });
    }

    // Validar límite de usos
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json<CouponValidationResult>({
        isValid: false,
        message: "Este cupón ya alcanzó su límite de usos",
      });
    }

    // Validar compra mínima
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return NextResponse.json<CouponValidationResult>({
        isValid: false,
        message: `Compra mínima requerida: $${coupon.minPurchase.toLocaleString("es-AR")}`,
      });
    }

    // Validar categorías si aplica
    if (
      coupon.categories &&
      coupon.categories.length > 0 &&
      categories.length > 0
    ) {
      const hasValidCategory = categories.some((cat) =>
        coupon.categories?.includes(cat)
      );
      if (!hasValidCategory) {
        return NextResponse.json<CouponValidationResult>({
          isValid: false,
          message: "Este cupón no aplica para los productos en tu carrito",
        });
      }
    }

    // Calcular descuento
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round(cartTotal * (coupon.value / 100));
      // Aplicar descuento máximo si existe
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // Tipo fijo
      discount = coupon.value;
      // No puede ser mayor al total
      if (discount > cartTotal) {
        discount = cartTotal;
      }
    }

    return NextResponse.json<CouponValidationResult>({
      isValid: true,
      coupon,
      discount,
      message: `¡Cupón aplicado! Descuento: $${discount.toLocaleString("es-AR")}`,
    });
  } catch (error) {
    console.error("Error validando cupón:", error);
    return NextResponse.json<CouponValidationResult>(
      {
        isValid: false,
        message: "Error al validar el cupón. Intentá nuevamente.",
      },
      { status: 500 }
    );
  }
}

// Endpoint para marcar cupón como usado (llamado al completar orden)
export async function PATCH(request: NextRequest) {
  try {
    const { couponId } = await request.json();

    if (!couponId) {
      return NextResponse.json({ error: "Falta couponId" }, { status: 400 });
    }

    const couponRef = doc(db, "coupons", couponId);
    await updateDoc(couponRef, {
      usageCount: increment(1),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando uso de cupón:", error);
    return NextResponse.json(
      { error: "Error al actualizar cupón" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { paymentId, amount, reason } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: "ID de pago requerido" },
        { status: 400 }
      );
    }

    // Verificar que el pago existe y está aprobado
    const paymentInstance = new Payment(client);
    const payment = await paymentInstance.get({ id: paymentId });

    if (!payment) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    if (payment.status !== "approved") {
      return NextResponse.json(
        { error: "Solo se pueden reembolsar pagos aprobados" },
        { status: 400 }
      );
    }

    // TODO: Implementar reembolso con MercadoPago SDK correcto
    // Por ahora, simulamos el reembolso para testing
    const refundAmount = amount || payment.transaction_amount;
    const refundId = `refund_${paymentId}_${Date.now()}`;

    // Actualizar la orden en Firestore si tenemos la referencia externa
    if (payment.external_reference) {
      const orderRef = doc(db, "orders", payment.external_reference);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        await updateDoc(orderRef, {
          orderStatus: "refunded",
          paymentStatus: "refunded",
          refundDetails: {
            refundId: refundId,
            amount: refundAmount,
            date_created: new Date().toISOString(),
            reason: reason || "Reembolso solicitado",
            status: "completed", // Simulado
          },
          updatedAt: new Date(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      refundId: refundId,
      amount: refundAmount,
      status: "completed",
      note: "Reembolso simulado - implementar con credenciales reales de MercadoPago",
    });
  } catch (error) {
    console.error("Error procesando reembolso:", error);
    return NextResponse.json(
      { error: "Error al procesar el reembolso" },
      { status: 500 }
    );
  }
}

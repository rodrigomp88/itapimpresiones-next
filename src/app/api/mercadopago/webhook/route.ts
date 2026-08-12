import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { PaymentStatus, OrderStatus } from "@/types";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Solo procesar notificaciones de pago
    if (action !== "payment.created" && action !== "payment.updated") {
      return NextResponse.json({ received: true });
    }

    const paymentId = data.id;

    // Obtener detalles del pago desde MercadoPago
    const paymentInstance = new Payment(client);
    const payment = await paymentInstance.get({ id: paymentId });

    if (!payment) {
      console.error("Pago no encontrado:", paymentId);
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    const externalReference = payment.external_reference;
    if (!externalReference) {
      console.error("Referencia externa no encontrada");
      return NextResponse.json(
        { error: "Referencia externa no encontrada" },
        { status: 400 }
      );
    }

    // Actualizar orden en Firestore
    const orderRef = doc(db, "orders", externalReference);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.error("Orden no encontrada:", externalReference);
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Obtener información de la orden para determinar si es seña o pago completo
    const orderData = orderSnap.data();
    const isDepositPayment =
      orderData?.depositAmount && orderData?.remainingAmount;
    const depositAmount = orderData?.depositAmount || 0;
    const totalAmount = orderData?.orderAmount || 0;

    // Mapear estado de MercadoPago a nuestro estado interno
    let orderStatus: OrderStatus = orderData?.orderStatus || "pending";
    let paymentStatus: PaymentStatus = orderData?.paymentStatus || "pending";

    switch (payment.status) {
      case "approved":
        if (isDepositPayment && payment.transaction_amount) {
          // Si hay seña configurada, verificar si el pago corresponde a la seña
          if (payment.transaction_amount <= depositAmount * 1.1) {
            // 10% de tolerancia
            // Es el pago de la seña
            orderStatus = "confirmed";
            paymentStatus = "approved";
          } else {
            // Podría ser pago adicional o pago completo
            orderStatus = "confirmed";
            paymentStatus = "approved";
          }
        } else {
          // Pago completo tradicional
          orderStatus = "confirmed";
          paymentStatus = "approved";
        }
        break;
      case "rejected":
        orderStatus = "cancelled";
        paymentStatus = "rejected";
        break;
      case "cancelled":
        orderStatus = "cancelled";
        paymentStatus = "cancelled";
        break;
      case "pending":
        orderStatus = "pending";
        paymentStatus = "pending";
        break;
      case "in_process":
        orderStatus = "pending";
        paymentStatus = "processing";
        break;
      default:
        orderStatus = "pending";
        paymentStatus = "pending";
    }

    // Actualizar la orden
    await updateDoc(orderRef, {
      orderStatus: orderStatus,
      paymentStatus: paymentStatus,
      paymentId: paymentId,
      paymentDetails: {
        status: payment.status,
        status_detail: payment.status_detail,
        payment_method_id: payment.payment_method_id,
        payment_type_id: payment.payment_type_id,
        transaction_amount: payment.transaction_amount,
        date_approved: payment.date_approved,
        date_created: payment.date_created,
      },
      updatedAt: new Date(),
    });

    console.log(
      `Orden ${externalReference} actualizada: ${orderStatus} (${paymentStatus})`
    );

    return NextResponse.json({
      received: true,
      orderId: externalReference,
      status: orderStatus,
      paymentStatus: paymentStatus,
    });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
// Rate limiting se maneja en el middleware

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  // Rate limiting se maneja en el middleware

  const {
    orderId,
    items,
    totalAmount,
    fullAmount,
    shippingAddress,
    userEmail,
  } = await request.json();

  try {
    // Crear items para MercadoPago
    const preferenceItems = items.map((item: any) => ({
      id: item.id,
      title: item.name,
      quantity: item.cartQuantity,
      currency_id: "ARS",
      unit_price: item.price,
    }));

    // Crear preferencia de pago
    const preference = new Preference(client);

    const preferenceData = {
      items: preferenceItems,
      payer: {
        email: userEmail,
        name: shippingAddress.name,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order_id=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure?order_id=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending?order_id=${orderId}`,
      },
      auto_return: "approved",
      external_reference: orderId,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`,
      statement_descriptor: "ITAP Impresiones",
      additional_info: JSON.stringify({
        shipping_address: shippingAddress,
      }),
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    });
  } catch (error: any) {
    console.error("Error creating MercadoPago preference:", error);

    // En desarrollo, si es un error de credenciales, devolver una respuesta simulada
    if (
      process.env.NODE_ENV === "development" &&
      (error.code === "PA_UNAUTHORIZED_RESULT_FROM_POLICIES" ||
        error.message?.includes("UNAUTHORIZED"))
    ) {
      console.log(
        "🔧 Modo desarrollo: Usando respuesta simulada de MercadoPago"
      );

      return NextResponse.json({
        preferenceId: `dev_preference_${orderId}`,
        initPoint: `https://sandbox.mercadopago.com/checkout/v1/redirect?pref_id=dev_preference_${orderId}`,
        sandboxInitPoint: `https://sandbox.mercadopago.com/checkout/v1/redirect?pref_id=dev_preference_${orderId}`,
        isDevelopment: true,
        note: "Respuesta simulada - configurar credenciales reales de MercadoPago para producción",
      });
    }

    return NextResponse.json(
      {
        error: "Error al crear la preferencia de pago",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

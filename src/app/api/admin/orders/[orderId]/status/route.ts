import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatusAction } from "@/app/admin/orders/actions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Estado requerido" }, { status: 400 });
    }

    const result = await updateOrderStatusAction(orderId, status);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

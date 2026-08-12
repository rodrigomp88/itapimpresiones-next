import { NextRequest, NextResponse } from "next/server";
import { contactLimiter } from "@/utils/rate-limit";
import { logError, logSecurity } from "@/utils/logger";
import { captureError } from "@/utils/sentry";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 🛡️ Aplicar rate limiting para formularios de contacto
    const rateLimitResult = await new Promise((resolve) => {
      contactLimiter(request as unknown as Parameters<typeof contactLimiter>[0], {} as Parameters<typeof contactLimiter>[1], () => resolve("allowed"));
    });

    // Si es un error de rate limit, devolver la respuesta apropiada
    if (rateLimitResult !== "allowed") {
      const clientIp =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      logSecurity("CONTACT_RATE_LIMIT_EXCEEDED", {
        ip: clientIp,
        userAgent: request.headers.get("user-agent"),
      });
      return NextResponse.json(
        {
          error: "Demasiados intentos. Intente nuevamente más tarde.",
          retryAfter: "1 hora",
        },
        {
          status: 429,
          headers: { "Retry-After": "3600" },
        }
      );
    }

    const body = await request.json();

    // Validación básica de los campos requeridos
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error: "Todos los campos son requeridos",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validación de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Email inválido",
          success: false,
        },
        { status: 400 }
      );
    }

    // Import Firestore dynamically to avoid SSR issues
    const { db } = await import("@/firebase/config");
    const { collection, addDoc, serverTimestamp } =
      await import("firebase/firestore");

    // Preparar datos para guardar
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const submissionData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      status: "new",
      ip: clientIp,
      userAgent: request.headers.get("user-agent") || "unknown",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(
      collection(db, "contact_submissions"),
      submissionData
    );

    // Log successful submission
    logSecurity("CONTACT_FORM_SUBMITTED", {
      submissionId: docRef.id,
      email: submissionData.email,
      ip: submissionData.ip,
    });

    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        message: "Formulario enviado con éxito",
        success: true,
        submissionId: docRef.id,
        processingTime: `${duration}ms`,
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error
    const errorIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    logError(error as Error, {
      endpoint: "/api/contact",
      method: "POST",
      processingTime: `${duration}ms`,
      ip: errorIp,
    });

    // Report to Sentry
    captureError(error as Error, {
      endpoint: "/api/contact",
      method: "POST",
      ip: errorIp,
    });

    return NextResponse.json(
      {
        message: "Error al enviar el formulario",
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

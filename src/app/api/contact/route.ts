import { NextResponse } from "next/server";
import { applyRateLimit } from "@/utils/rate-limit";

export async function POST(request: Request) {
    try {
        // 🛡️ Rate limit: 3 mensajes por hora por IP para contacto
        const rateLimitResponse = await applyRateLimit(request, 3, 60 * 60 * 1000);
        if (rateLimitResponse) return rateLimitResponse;

        const body = await request.json();

        // Import Firestore dynamically to avoid SSR issues
        const { db } = await import("@/firebase/config");
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

        // Save to Firestore
        const docRef = await addDoc(collection(db, "contact_submissions"), {
            ...body,
            status: "new",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log("Form submission saved to Firestore with ID:", docRef.id);

        return NextResponse.json(
            {
                message: "Formulario enviado con éxito",
                success: true,
                submissionId: docRef.id
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing form submission:", error);
        return NextResponse.json(
            {
                message: "Error al enviar el formulario",
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

import { adminDb } from "@/firebase/admin";
import SubmissionsClient from "./SubmissionsClient";

export const dynamic = "force-dynamic";

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

async function getSubmissions() {
    if (!adminDb) {
        console.error("Admin SDK not initialized");
        return [];
    }

    try {
        const snapshot = await adminDb
            .collection("contact_submissions")
            .orderBy("createdAt", "desc")
            .get();

        const submissions = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                formType: data.formType || "",
                name: data.name || "",
                email: data.email || "",
                phone: data.phone,
                message: data.message || "",
                service: data.service,
                quantity: data.quantity,
                bagSize: data.bagSize,
                productType: data.productType,
                status: data.status || "pending",
                createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            } as ContactSubmission;
        });

        return submissions;
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
}

export default async function SubmissionsPage() {
    const submissions = await getSubmissions();

    return <SubmissionsClient initialSubmissions={submissions} />;
}

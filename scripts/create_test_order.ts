
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Admin SDK
// Note: This relies on GOOGLE_APPLICATION_CREDENTIALS or default credentials being set up
// inside the environment where this runs. If running locally with 'firebase login', 
// we might need a service account or use the Emulator.
// However, since we are in the user's environment, we might use the client SDK for a more "real" simulation
// OR use Admin SDK if available.

// Let's use the Client SDK logic to simulate exactly what the frontend does, 
// using 'firebase/firestore' instead of admin, if possible. 
// But commonly scripts run with Admin privileges.
// Let's stick to Admin SDK to ensure write, simulating a "server action" style or direct DB verify.

// Wait, the user wants "End-to-End".
// Adding to DB via Admin SDK bypasses security rules.
// But it DOES trigger Cloud Functions.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : require('../functions/service-account.json'); // Fallback/Placeholder

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = getFirestore();

async function createTestOrder() {
    console.log("🚀 Creating Simulation Order...");

    const orderData = {
        userID: "simulation_script_user",
        userEmail: "simulation@test.com",
        shippingAddress: {
            name: "Simulated User",
            mail: "simulation@test.com",
            phone: "555-0123"
        },
        orderItems: [
            {
                id: "sim_item_1",
                name: "Producto de Simulación (Gorra)",
                price: 5000,
                cartQuantity: 1,
                imageURL: "https://via.placeholder.com/150"
            }
        ],
        orderAmount: 5000,
        orderStatus: "Orden Recibida",
        createdAt: new Date(),
        lastUpdatedBy: "simulation_script",
        hasUnreadAdminMessage: true,
        hasUnreadClientMessage: false,
    };

    try {
        const docRef = await db.collection("orders").add(orderData);
        console.log(`✅ Order created successfully! ID: ${docRef.id}`);
        console.log("🔔 Cloud Function 'onNewOrderCreated' should trigger now.");
        console.log("👉 Check your Admin Dashboard bells/notifications.");
    } catch (error) {
        console.error("❌ Error creating order:", error);
    }
}

createTestOrder();

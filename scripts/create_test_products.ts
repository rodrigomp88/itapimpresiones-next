import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuración de Firebase (usa las mismas variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testProducts = [
  {
    name: "Gorra Trucker Clásica",
    slug: "gorra-trucker-clasica",
    price: 17000,
    description: "Gorra trucker sublimada a colores, impresa en DTF. Perfecta para promociones corporativas.",
    images: [
      {
        url: "/images/carousel0.png",
        color: "Negro"
      },
      {
        url: "/images/carousel1.png",
        color: "Blanco"
      }
    ],
    pause: false,
    unity: 1,
    size: "Única",
    category: "gorras",
    createdAt: new Date(),
    stock: 100,
    stockType: "physical" as const,
  },
  {
    name: "Remera Premium Algodón",
    slug: "remera-premium-algodon",
    price: 18000,
    description: "Remeras de algodón peinado premium con estampa personalizada. Confort y calidad garantizada.",
    images: [
      {
        url: "/images/carousel1.png",
        color: "Blanco"
      }
    ],
    pause: false,
    unity: 1,
    size: "M",
    category: "remeras",
    createdAt: new Date(),
    stock: 50,
    stockType: "physical" as const,
  },
  {
    name: "Bolsa Ecológica 40x40",
    slug: "bolsa-ecologica-40x40",
    price: 700,
    description: "Bolsa reutilizable ecológica con estampado personalizado. Ideal para merchandising sostenible.",
    images: [
      {
        url: "/images/carousel2.png",
        color: "Todos"
      }
    ],
    pause: false,
    unity: 1,
    size: "40x40",
    category: "bolsas",
    createdAt: new Date(),
    stock: 200,
    stockType: "physical" as const,
  }
];

async function createTestProducts() {
  try {
    console.log("Creando productos de prueba...");

    for (const product of testProducts) {
      const docRef = await addDoc(collection(db, "products"), product);
      console.log(`Producto creado con ID: ${docRef.id} - ${product.name}`);
    }

    console.log("✅ Todos los productos de prueba creados exitosamente!");
  } catch (error) {
    console.error("❌ Error creando productos de prueba:", error);
  }
}

createTestProducts();

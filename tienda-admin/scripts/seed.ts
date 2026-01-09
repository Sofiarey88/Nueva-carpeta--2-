import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://sofiarey02:sofirey2013@clusterispsofirey.zlkouxx.mongodb.net/?appName=ClusterISPSofiRey";
const MONGODB_DB = "Página";
const COLLECTION = "página";

const products = [
  {
    name: "Samsung Galaxy A06 64GB",
    description: "Teléfono inteligente con pantalla AMOLED de 6.5 pulgadas",
    price: 209999,
    originalPrice: 331999,
    discount: 36,
    stock: 15,
    category: "Smartphones",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=640&auto=format&fit=crop",
    colors: ["Azul", "Negro", "Blanco"],
    freeShipping: true,
  },
  {
    name: "Motorola Moto E15 64GB",
    description: "Smartphone con batería de larga duración",
    price: 189999,
    originalPrice: 268999,
    discount: 29,
    stock: 22,
    category: "Smartphones",
    brand: "Motorola",
    imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29c920?w=640&auto=format&fit=crop",
    colors: ["Púrpura", "Negro"],
    freeShipping: true,
    accessories: true,
  },
  {
    name: "Samsung Galaxy A15 128GB",
    description: "Pantalla FHD+ de 6.5 pulgadas, procesador MediaTek",
    price: 309999,
    originalPrice: 503999,
    discount: 38,
    stock: 18,
    category: "Smartphones",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1526925712134-d91b99b8bada?w=640&auto=format&fit=crop",
    colors: ["Rosa", "Azul", "Negro"],
    freeShipping: true,
  },
  {
    name: "iPhone 15 128GB",
    description: "Procesador A17 Pro, cámara dual de 12MP",
    price: 799999,
    originalPrice: 999999,
    discount: 20,
    stock: 8,
    category: "Smartphones",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1592286927505-1def25e5e4be?w=640&auto=format&fit=crop",
    colors: ["Negro", "Blanco", "Rojo"],
    freeShipping: true,
  },
  {
    name: "Tablet Samsung Galaxy Tab A9",
    description: "Pantalla de 8.7 pulgadas, procesador MediaTek",
    price: 249999,
    originalPrice: 349999,
    discount: 28,
    stock: 12,
    category: "Tablets",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=640&auto=format&fit=crop",
    colors: ["Gris", "Plata"],
    freeShipping: true,
  },
  {
    name: "AirPods Pro 2",
    description: "Auriculares con cancelación de ruido activa",
    price: 449999,
    originalPrice: 599999,
    discount: 25,
    stock: 30,
    category: "Accesorios",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&auto=format&fit=crop",
    colors: ["Blanco"],
    freeShipping: true,
  },
  {
    name: "Samsung Galaxy Buds2",
    description: "Auriculares inalámbricos con cancelación de ruido",
    price: 199999,
    originalPrice: 349999,
    discount: 43,
    stock: 25,
    category: "Accesorios",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=640&auto=format&fit=crop",
    colors: ["Negro", "Blanco", "Violeta"],
    freeShipping: true,
  },
  {
    name: "Cargador rápido 65W USB-C",
    description: "Compatible con múltiples dispositivos",
    price: 29999,
    originalPrice: 59999,
    discount: 50,
    stock: 50,
    category: "Accesorios",
    brand: "Genérico",
    imageUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=640&auto=format&fit=crop",
    colors: ["Negro", "Blanco"],
    freeShipping: false,
  },
  {
    name: "Funda protectora Samsung",
    description: "Funda resistente a caídas y golpes",
    price: 19999,
    originalPrice: 39999,
    discount: 50,
    stock: 100,
    category: "Accesorios",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=640&auto=format&fit=crop",
    colors: ["Negro", "Azul", "Rojo"],
    freeShipping: false,
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const collection = db.collection(COLLECTION);

    // Clear existing products (optional)
    await collection.deleteMany({});
    console.log(`✓ Cleared ${COLLECTION} collection`);

    // Insert products
    const result = await collection.insertMany(products);
    console.log(`✓ Inserted ${Object.keys(result.insertedIds).length} products`);

    // Show results
    const count = await collection.countDocuments();
    console.log(`✓ Total products in collection: ${count}`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.close();
  }
}

seed();

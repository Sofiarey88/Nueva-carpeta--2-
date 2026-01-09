import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "tienda";

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  const conn = await clientPromise;
  return conn.db(dbName);
}

export async function getProductsCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection("página");
}

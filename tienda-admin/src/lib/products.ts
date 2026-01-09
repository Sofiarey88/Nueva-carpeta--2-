import { ObjectId } from "mongodb";
import { getProductsCollection } from "./mongodb";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  imageUrl: string;
  category?: string;
  brand?: string;
  colors?: string[];
  freeShipping?: boolean;
  accessories?: boolean;
};

export type ProductInput = Omit<Product, "id">;

function mapDocToProduct(doc: any): Product {
  return {
    id: doc._id?.toString() ?? doc.id,
    name: doc.name,
    description: doc.description,
    price: Number(doc.price),
    stock: Number(doc.stock),
    imageUrl: doc.imageUrl,
  };
}

export async function getProducts(): Promise<Product[]> {
  const col = await getProductsCollection();
  const docs = await col.find({}).sort({ _id: -1 }).toArray();
  return docs.map(mapDocToProduct);
}

export async function addProduct(input: ProductInput): Promise<Product> {
  const col = await getProductsCollection();
  const result = await col.insertOne({
    name: input.name,
    description: input.description,
    price: input.price,
    stock: input.stock,
    imageUrl: input.imageUrl,
  });
  return { id: result.insertedId.toString(), ...input };
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product | null> {
  const col = await getProductsCollection();
  const _id = new ObjectId(id);
  const result = await col.findOneAndUpdate(
    { _id },
    { $set: input },
    { returnDocument: "after" }
  );
  const doc = result.value;
  return doc ? mapDocToProduct(doc) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const col = await getProductsCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapDocToProduct(doc) : null;
}

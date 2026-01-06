import { NextRequest, NextResponse } from "next/server";
import { addProduct, getProducts, type ProductInput } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ProductInput>;
    if (!body.name || !body.description || body.price === undefined || body.stock === undefined || !body.imageUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const price = Number(body.price);
    const stock = Number(body.stock);
    if (Number.isNaN(price) || Number.isNaN(stock)) {
      return NextResponse.json({ message: "Price and stock must be numbers" }, { status: 400 });
    }

    const newProduct = addProduct({
      name: body.name,
      description: body.description,
      price,
      stock,
      imageUrl: body.imageUrl,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

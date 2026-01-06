import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, type ProductInput } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as Partial<ProductInput>;
    const price = body.price !== undefined ? Number(body.price) : undefined;
    const stock = body.stock !== undefined ? Number(body.stock) : undefined;
    if ((body.price !== undefined && Number.isNaN(price)) || (body.stock !== undefined && Number.isNaN(stock))) {
      return NextResponse.json({ message: "Price and stock must be numbers" }, { status: 400 });
    }

    const updated = updateProduct(params.id, {
      ...body,
      price: price ?? undefined,
      stock: stock ?? undefined,
    });

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

import { getProducts } from "@/lib/products";
import StorefrontClient from "@/app/StorefrontClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products = await getProducts();
  
  // Si no hay productos, intenta hacer seed
  if (products.length === 0) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/seed`, {
        method: 'POST',
        cache: 'no-store',
      });
      products = await getProducts();
    } catch (err) {
      console.log('Seed no disponible aún');
    }
  }
  
  return <StorefrontClient products={products} />;
}

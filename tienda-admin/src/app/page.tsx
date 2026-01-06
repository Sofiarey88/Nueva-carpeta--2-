import { getProducts } from "@/lib/products";
import StorefrontClient from "@/app/StorefrontClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = getProducts();
  return <StorefrontClient products={products} />;
}

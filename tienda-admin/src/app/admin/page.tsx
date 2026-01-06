import { getProducts } from "@/lib/products";
import AdminClient from "@/app/admin/AdminClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const initialProducts = getProducts();
  return <AdminClient initialProducts={initialProducts} />;
}

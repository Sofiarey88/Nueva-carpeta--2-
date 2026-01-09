import { getProducts } from "@/lib/products";
import AdminClient from "@/app/admin/AdminClient";
import EmployeeClient from "@/app/admin/EmployeeClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value as 'admin' | 'employee' | undefined;
  
  const initialProducts = await getProducts();
  
  if (userRole === 'employee') {
    return <EmployeeClient initialProducts={initialProducts} />;
  }
  
  return <AdminClient initialProducts={initialProducts} role={userRole || 'admin'} />;
}

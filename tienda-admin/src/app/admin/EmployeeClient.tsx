'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

type EmployeeClientProps = {
  initialProducts: Product[];
};

export default function EmployeeClient({ initialProducts }: EmployeeClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const loadProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = (await res.json()) as Product[];
    setProducts(data);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Empleado</p>
            <h1 className="text-3xl font-semibold">Vista de inventario</h1>
            <p className="text-sm text-slate-400">Acceso de solo lectura.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40"
          >
            Cerrar sesión
          </button>
        </header>

        <section>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-300/80">Inventario</p>
                <h2 className="text-xl font-semibold">Productos ({products.length})</h2>
              </div>
              <button
                onClick={loadProducts}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Refrescar
              </button>
            </div>
            <div className="space-y-3">
              {products.map((product: Product) => (
                <article
                  key={product.id}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{product.id}</p>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-slate-300">{product.description}</p>
                    <div className="flex gap-3 text-sm text-blue-200">
                      <span>${product.price.toFixed(2)}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                    {product.imageUrl && (
                      <a
                        href={product.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Ver imagen
                      </a>
                    )}
                  </div>
                </article>
              ))}
              {products.length === 0 && (
                <p className="text-sm text-slate-400">No hay productos disponibles.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

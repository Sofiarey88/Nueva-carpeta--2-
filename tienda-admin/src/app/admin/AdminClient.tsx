'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "0",
  stock: "0",
  imageUrl: "",
};

type AdminClientProps = {
  initialProducts: Product[];
};

export default function AdminClient({ initialProducts }: AdminClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const formModeLabel = useMemo(() => (editingId ? "Actualizar" : "Crear"), [editingId]);

  const loadProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = (await res.json()) as Product[];
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim(),
    };

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setMessage(err.message ?? "Error al guardar");
      setLoading(false);
      return;
    }

    await loadProducts();
    setForm(emptyForm);
    setEditingId(null);
    setMessage(editingId ? "Producto actualizado" : "Producto creado");
    setLoading(false);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
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
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin</p>
            <h1 className="text-3xl font-semibold">Panel de productos</h1>
            <p className="text-sm text-slate-400">Acceso protegido por clave de administrador.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40"
          >
            Cerrar sesión
          </button>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">{formModeLabel}</p>
                <h2 className="text-xl font-semibold">Producto</h2>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Nombre</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Descripción</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-slate-200">Precio</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-200">Stock</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">URL de imagen</label>
                <input
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/60"
                />
              </div>

              {message && <p className="text-sm text-amber-300/90">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:opacity-60"
              >
                {loading ? "Guardando..." : `${formModeLabel} producto`}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">Inventario</p>
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
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{product.id}</p>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-slate-300">{product.description}</p>
                    <div className="flex gap-3 text-sm text-amber-200">
                      <span>${product.price.toFixed(2)}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="rounded-full border border-amber-300/60 px-3 py-1 text-sm text-amber-200 transition hover:bg-amber-300 hover:text-slate-900"
                    >
                      Editar
                    </button>
                  </div>
                </article>
              ))}
              {products.length === 0 && (
                <p className="text-sm text-slate-400">No hay productos. Crea el primero.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

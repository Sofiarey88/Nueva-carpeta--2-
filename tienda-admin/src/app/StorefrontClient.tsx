'use client';

import type { Product } from "@/lib/products";
import { useCart } from "@/app/CartProvider";

type Props = {
  products: Product[];
};

export default function StorefrontClient({ products }: Props) {
  const { add, getQty } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50 text-slate-900">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <section className="grid gap-6 rounded-3xl bg-white/80 p-10 shadow-xl ring-1 ring-amber-100 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-500">Colección</p>
            <h1 className="text-4xl font-semibold leading-tight">Bebidas y sabores artesanales</h1>
            <p className="max-w-xl text-lg text-slate-600">
              Catálogo listo para tu cliente. Añade al carrito y envía el pedido directo por WhatsApp.
            </p>
            <div className="flex gap-3">
              <a
                href="#productos"
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-amber-400"
              >
                Ver productos
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-white p-6">
            <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-white/70 blur-2xl" />
            <div className="absolute left-6 bottom-6 h-16 w-16 rounded-full bg-amber-300/50 blur-2xl" />
            <div className="relative flex flex-col gap-2 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-amber-100">
              <p className="text-sm font-medium text-amber-700">Entrega rápida</p>
              <p className="text-2xl font-semibold">Stock actualizado</p>
              <p className="text-sm text-slate-600">Productos gestionados desde el panel de administración con API en memoria.</p>
            </div>
          </div>
        </section>

        <section id="productos" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Tienda</p>
              <h2 className="text-2xl font-semibold">Productos destacados</h2>
            </div>
            <p className="text-sm text-slate-500">Suma ítems y envía el mensaje a WhatsApp.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const qty = getQty(product.id);
              return (
                <article
                  key={product.id}
                  className="group flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 via-white to-amber-50">
                    <div
                      className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-[1.02]"
                      style={{ backgroundImage: `url(${product.imageUrl})` }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{product.id}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-600">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                    <span>${product.price.toFixed(2)}</span>
                    <span className="text-amber-700">Stock: {product.stock}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    {qty > 0 && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        En carrito: {qty}
                      </span>
                    )}
                    <button
                      className="ml-auto inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-amber-100"
                      onClick={() => add(product)}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

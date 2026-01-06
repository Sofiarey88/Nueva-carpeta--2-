'use client';

import { useCart } from '@/app/CartProvider';

export default function HeaderCart() {
  const { totalItems, totalAmount, openWhatsApp } = useCart();

  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full bg-amber-200 px-2 py-1 text-xs font-semibold text-amber-900">
        Carrito: {totalItems}
      </span>
      <button
        onClick={openWhatsApp}
        disabled={totalItems === 0}
        className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-60"
        title={totalItems > 0 ? `Total $${totalAmount.toFixed(2)}` : 'Añade productos'}
      >
        Finalizar compra
      </button>
    </div>
  );
}

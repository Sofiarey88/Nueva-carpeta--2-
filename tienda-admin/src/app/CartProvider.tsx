'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Product } from '@/lib/products';

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '3498401394';

type CartItem = {
  product: Product;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  getQty: (id: string) => number;
  add: (product: Product) => void;
  clear: () => void;
  totalItems: number;
  totalAmount: number;
  openWhatsApp: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itemsMap, setItemsMap] = useState<Record<string, CartItem>>({});

  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);
  const totalItems = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((s, it) => s + it.product.price * it.qty, 0), [items]);

  const add = (product: Product) => {
    setItemsMap((prev) => {
      const existing = prev[product.id];
      const nextQty = (existing?.qty ?? 0) + 1;
      return {
        ...prev,
        [product.id]: { product, qty: nextQty },
      };
    });
  };

  const clear = () => setItemsMap({});
  const getQty = (id: string) => itemsMap[id]?.qty ?? 0;

  const openWhatsApp = () => {
    if (items.length === 0) return;
    const lines = items.map((it) => {
      const subtotal = (it.product.price * it.qty).toFixed(2);
      return `- ${it.product.name} x${it.qty} ($${it.product.price.toFixed(2)}) = $${subtotal}`;
    });
    const message = [
      'Hola, quiero hacer este pedido:',
      ...lines,
      `Total: $${totalAmount.toFixed(2)}`,
      'Gracias!',
    ].join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const value: CartContextValue = {
    items,
    getQty,
    add,
    clear,
    totalItems,
    totalAmount,
    openWhatsApp,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

'use client';

import { useMemo, useState } from 'react';
import type { Product } from "@/lib/products";
import { useCart } from "@/app/CartProvider";

type Props = {
  products: Product[];
};

type SortOption = 'recomendado' | 'precio-asc' | 'precio-desc' | 'nombre';

export default function StorefrontClient({ products: initialProducts }: Props) {
  const { add, getQty } = useCart();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<SortOption>('recomendado');
  const [loading, setLoading] = useState(false);

  // Get unique categories and brands
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))), [products]);
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 1000000), [products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        // Reload products
        const res2 = await fetch('/api/products');
        const newProducts = await res2.json();
        setProducts(newProducts);
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
    setLoading(false);
  };

  // Filter and sort products
  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesBrand = !selectedBrand || p.brand === selectedBrand;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort
    if (sortBy === 'precio-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'precio-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'nombre') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Promoción Personal</h1>
            <p className="mt-2 text-slate-600">Descubre nuestro catálogo de smartphones, tablets y accesorios</p>
          </div>
          {products.length === 0 && (
            <button
              onClick={loadProducts}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Cargar Productos'}
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar - Filtros */}
          <aside className="lg:col-span-1">
            <div className="rounded-lg border border-slate-200 bg-white p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
                {(searchTerm || selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setPriceRange([0, maxPrice]);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">🔍 Buscar Producto</label>
                <input
                  type="text"
                  placeholder="Samsung, iPhone, Auriculares..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-300 px-3 py-2 text-sm text-slate-900 bg-blue-50 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Categorías */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Categorías</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-slate-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Marcas */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Marcas</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand === selectedBrand ? null : brand)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-slate-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Precio</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-1/2 rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 placeholder-slate-500"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-1/2 rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 placeholder-slate-500"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Productos */}
          <div className="lg:col-span-3">
            {/* Ordenamiento */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-600">Resultados: <strong>{filtered.length}</strong></p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="recomendado">Ordenar por: Recomendado</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre">Nombre: A-Z</option>
              </select>
            </div>

            {/* Grid de productos */}
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => {
                  const qty = getQty(product.id);
                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden transition hover:shadow-lg hover:border-slate-300"
                    >
                      {/* Imagen con descuento */}
                      <div className="relative aspect-square overflow-hidden bg-slate-100">
                        <div
                          className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
                          style={{ backgroundImage: `url(${product.imageUrl})` }}
                        />
                        {product.discount && (
                          <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {product.discount}% OFF
                          </div>
                        )}
                        {product.freeShipping && (
                          <div className="absolute bottom-3 left-3 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                            📦 Envío gratis
                          </div>
                        )}
                        {product.accessories && (
                          <div className="absolute bottom-3 right-3 bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-semibold">
                            Incluye accesorios
                          </div>
                        )}
                      </div>

                      {/* Info producto */}
                      <div className="flex flex-col flex-1 p-4">
                        <p className="text-xs uppercase text-slate-500 mb-1">{product.brand}</p>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">{product.name}</h3>
                        {product.colors && product.colors.length > 0 && (
                          <p className="text-xs text-slate-500 mb-3">{product.colors.length} colores</p>
                        )}

                        {/* Precios */}
                        <div className="mb-3">
                          {product.originalPrice && (
                            <p className="text-xs text-slate-500 line-through">${product.originalPrice.toLocaleString()}</p>
                          )}
                          <p className="text-lg font-bold text-slate-900">${product.price.toLocaleString()}</p>
                          {product.originalPrice && (
                            <p className="text-xs text-blue-600 font-medium">Conexión Total: ${(product.price * 1.1).toLocaleString()}*</p>
                          )}
                        </div>

                        {/* Carrito */}
                        <div className="mt-auto space-y-2">
                          {qty > 0 && (
                            <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded text-center font-medium">
                              En carrito: {qty}
                            </p>
                          )}
                          <button
                            onClick={() => add(product)}
                            className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg font-medium text-sm transition hover:bg-blue-700"
                          >
                            Añadir al carrito
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No se encontraron productos con los filtros seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

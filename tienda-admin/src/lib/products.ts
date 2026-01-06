export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export type ProductInput = Omit<Product, "id">;

let products: Product[] = [
  {
    id: "p-1001",
    name: "Café de Especialidad",
    description: "Tueste medio, notas de chocolate y caramelo.",
    price: 12.5,
    stock: 34,
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=640&auto=format&fit=crop",
  },
  {
    id: "p-1002",
    name: "Matcha Premium",
    description: "Polvo de té verde japonés grado ceremonial.",
    price: 18,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&auto=format&fit=crop",
  },
  {
    id: "p-1003",
    name: "Cacao Orgánico",
    description: "85% cacao, origen único Perú.",
    price: 9.75,
    stock: 42,
    imageUrl: "https://images.unsplash.com/photo-1528838060457-5ec95f249a63?w=640&auto=format&fit=crop",
  },
];

const generateId = () => `p-${Date.now().toString(36)}`;

export function getProducts(): Product[] {
  return products;
}

export function addProduct(input: ProductInput): Product {
  const newProduct: Product = { ...input, id: generateId() };
  products = [newProduct, ...products];
  return newProduct;
}

export function updateProduct(id: string, input: Partial<ProductInput>): Product | null {
  let updated: Product | null = null;
  products = products.map((prod) => {
    if (prod.id !== id) return prod;
    updated = { ...prod, ...input };
    return updated;
  });
  return updated;
}

export function getProductById(id: string): Product | null {
  return products.find((p) => p.id === id) ?? null;
}

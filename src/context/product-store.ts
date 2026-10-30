import type { Product } from "@/types/product";

const STORAGE_KEY = "marble-city-products";

const initialProducts: Product[] = [
  {
    id: "calacatta-oro",
    name: "Calacatta Oro",
    type: "Marble",
    price: 185,
    color: "Warm white",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "nero-marquina",
    name: "Nero Marquina",
    type: "Marble",
    price: 145,
    color: "Deep black",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "silver-cloud",
    name: "Silver Cloud",
    type: "Granite",
    price: 92,
    color: "Soft grey",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "ivory-travertine",
    name: "Ivory Travertine",
    type: "Marble",
    price: 118,
    color: "Ivory",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "alpine-white",
    name: "Alpine White",
    type: "Quartzite",
    price: 210,
    color: "White",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    type: "Granite",
    price: 128,
    color: "Forest green",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
];

export interface ProductSnapshot {
  products: Product[];
  storageError: string | null;
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;

  const product = value as Record<string, unknown>;
  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    (product.type === "Marble" ||
      product.type === "Granite" ||
      product.type === "Quartzite") &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    typeof product.color === "string" &&
    typeof product.image === "string"
  );
}

function isProductList(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

const serverSnapshot: ProductSnapshot = {
  products: initialProducts,
  storageError: null,
};

function loadInitialSnapshot(): ProductSnapshot {
  if (typeof window === "undefined") return serverSnapshot;

  try {
    const savedProducts = window.localStorage.getItem(STORAGE_KEY);
    if (savedProducts === null) return serverSnapshot;

    const parsedProducts: unknown = JSON.parse(savedProducts);
    if (!isProductList(parsedProducts)) {
      throw new Error("Saved product data has an invalid format.");
    }

    return { products: parsedProducts, storageError: null };
  } catch (error) {
    console.error("Unable to load the saved product catalog.", error);
    return {
      products: initialProducts,
      storageError:
        "Your saved catalog could not be loaded. Changes may not be saved in this browser.",
    };
  }
}

let snapshot = loadInitialSnapshot();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function saveProducts(products: Product[]): string | null {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return null;
  } catch (error) {
    console.error("Unable to save the product catalog.", error);
    return "Your catalog could not be saved in this browser. Check your browser storage settings.";
  }
}

function updateProducts(updater: (products: Product[]) => Product[]) {
  const products = updater(snapshot.products);
  const storageError = snapshot.storageError ?? saveProducts(products);

  snapshot = { products, storageError };
  notify();
}

export const getProductSnapshot = () => snapshot;
export const getServerProductSnapshot = () => serverSnapshot;
export const subscribeToProducts = subscribe;

export function addProduct(product: Omit<Product, "id">) {
  updateProducts((products) => [
    { ...product, id: crypto.randomUUID() },
    ...products,
  ]);
}

export function updateProduct(id: string, product: Omit<Product, "id">) {
  updateProducts((products) =>
    products.map((item) => (item.id === id ? { ...product, id } : item)),
  );
}

export function deleteProduct(id: string) {
  updateProducts((products) =>
    products.filter((product) => product.id !== id),
  );
}

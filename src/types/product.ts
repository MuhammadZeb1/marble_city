export type StoneType = "Marble" | "Granite" | "Quartzite";

export interface Product {
  id: string;
  name: string;
  type: StoneType;
  price: number;
  color: string;
  image: string;
}

export interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
}

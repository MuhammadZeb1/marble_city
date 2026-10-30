"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import {
  addProduct,
  deleteProduct,
  getProductSnapshot,
  getServerProductSnapshot,
  subscribeToProducts,
  updateProduct,
} from "@/context/product-store";
import type { ProductContextType, StoneType } from "@/types/product";

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToProducts,
    getProductSnapshot,
    getServerProductSnapshot,
  );

  return (
    <ProductContext.Provider
      value={{
        products: snapshot.products,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {snapshot.storageError && (
        <p className="storage-notice" role="status">
          {snapshot.storageError}
        </p>
      )}
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextType {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider.");
  }
  return context;
}

export const stoneTypes: StoneType[] = ["Marble", "Granite", "Quartzite"];

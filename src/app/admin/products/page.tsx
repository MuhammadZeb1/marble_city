"use client";

import { useMemo, useState, type FormEvent } from "react";
import { stoneTypes, useProducts } from "@/context/product-context";
import type { Product, StoneType } from "@/types/product";

type ProductFields = Omit<Product, "id">;

const emptyProduct: ProductFields = {
  name: "",
  type: "Marble",
  price: 0,
  color: "",
  image: "",
};

function ProductForm({
  initialProduct,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialProduct: ProductFields;
  submitLabel: string;
  onSubmit: (product: ProductFields) => void;
  onCancel?: () => void;
}) {
  const [fields, setFields] = useState(initialProduct);
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = fields.name.trim();
    const color = fields.color.trim();
    if (!name || !color) {
      setFormError("Product name and color are required.");
      return;
    }

    setFormError(null);
    onSubmit({ ...fields, name, color });
    if (!onCancel) setFields(emptyProduct);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Product name
        <input
          onChange={(event) => setFields({ ...fields, name: event.target.value })}
          required
          value={fields.name}
        />
      </label>
      <label>
        Stone type
        <select
          onChange={(event) => {
            const type = stoneTypes.find(
              (stoneType) => stoneType === event.target.value,
            );
            if (type) setFields({ ...fields, type });
          }}
          value={fields.type}
        >
          {stoneTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <label>
        Price per sq. ft. ($)
        <input
          min="0.01"
          onChange={(event) =>
            setFields({ ...fields, price: Number(event.target.value) })
          }
          required
          step="0.01"
          type="number"
          value={fields.price || ""}
        />
      </label>
      <label>
        Color
        <input
          onChange={(event) => setFields({ ...fields, color: event.target.value })}
          required
          value={fields.color}
        />
      </label>
      <label className="form-span">
        Image URL
        <input
          onChange={(event) => setFields({ ...fields, image: event.target.value })}
          placeholder="https://example.com/stone.jpg"
          required
          type="url"
          value={fields.image}
        />
      </label>
      {formError && (
        <p className="form-error form-span" role="alert">
          {formError}
        </p>
      )}
      <div className="form-actions form-span">
        <button className="button button-dark" type="submit">{submitLabel}</button>
        {onCancel && (
          <button className="button button-outline" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const averagePrice = useMemo(
    () =>
      products.length
        ? products.reduce((sum, product) => sum + product.price, 0) /
          products.length
        : 0,
    [products],
  );

  return (
    <main className="admin-page section-wrap">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">MANAGEMENT HUB</p>
          <h1>Your stone collection.</h1>
          <p className="section-copy">
            Add, edit and manage the materials shown in your public collection.
          </p>
        </div>
        <span className="admin-access">PUBLIC DEMO · NO SIGN-IN</span>
      </div>

      <section className="admin-stats" aria-label="Inventory summary">
        <article><span>IN THE COLLECTION</span><strong>{products.length}</strong></article>
        <article><span>STONE TYPES</span><strong>{new Set(products.map((p) => p.type)).size}</strong></article>
        <article><span>AVERAGE PRICE / SQ. FT.</span><strong>${averagePrice.toFixed(2)}</strong></article>
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{editingId ? "UPDATE A STONE" : "ADD SOMETHING NEW"}</p>
            <h2>{editingId ? "Edit product" : "Add a product"}</h2>
          </div>
        </div>
        <ProductForm
          key={editingId ?? "new-product"}
          initialProduct={
            editingId
              ? (() => {
                  const product = products.find((item) => item.id === editingId);
                  return product
                    ? {
                        name: product.name,
                        type: product.type,
                        price: product.price,
                        color: product.color,
                        image: product.image,
                      }
                    : emptyProduct;
                })()
              : emptyProduct
          }
          onCancel={editingId ? () => setEditingId(null) : undefined}
          onSubmit={(product) => {
            if (editingId) {
              updateProduct(editingId, product);
              setEditingId(null);
            } else {
              addProduct(product);
            }
          }}
          submitLabel={editingId ? "Save changes" : "Add to collection"}
        />
      </section>

      <section className="inventory-section">
        <div className="inventory-heading">
          <div>
            <p className="eyebrow">CURRENT INVENTORY</p>
            <h2>All products <span>({products.length})</span></h2>
          </div>
          <p>Changes appear on the public collection and save in this browser.</p>
        </div>
        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th scope="col">STONE</th>
                <th scope="col">TYPE</th>
                <th scope="col">COLOR</th>
                <th scope="col">PRICE / SQ. FT.</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="inventory-product">
                      <div
                        aria-label={product.name}
                        className="inventory-thumb"
                        role="img"
                        style={{ backgroundImage: `url("${product.image}")` }}
                      />
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.type}</td>
                  <td>{product.color}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action"
                        onClick={() => setEditingId(product.id)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="table-action delete-action"
                        onClick={() => {
                          deleteProduct(product.id);
                          if (editingId === product.id) setEditingId(null);
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td className="empty-inventory" colSpan={5}>Your collection is empty. Add a product above to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

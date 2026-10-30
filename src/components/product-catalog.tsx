"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProducts } from "@/context/product-context";
import type { StoneType } from "@/types/product";

const filters: Array<"All stone" | StoneType> = [
  "All stone",
  "Marble",
  "Granite",
  "Quartzite",
];

export default function ProductCatalog() {
  const { products } = useProducts();
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All stone");
  const visibleProducts = useMemo(
    () =>
      activeFilter === "All stone"
        ? products
        : products.filter((product) => product.type === activeFilter),
    [activeFilter, products],
  );

  return (
    <section className="collection section-wrap" id="collection">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE COLLECTION</p>
          <h2>Stone with a story to tell.</h2>
          <p className="section-copy">
            Each slab is one of a kind. Find the natural character that feels
            like yours.
          </p>
        </div>
        <Link className="text-link" href="/about">
          Our approach <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="filter-list" role="group" aria-label="Filter by stone type">
        {filters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter}
            className={`filter-button${activeFilter === filter ? " active" : ""}`}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      {visibleProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={product.id}>
              <Link
                aria-label={`Ask us about ${product.name}`}
                className="product-image"
                href="/contact"
                style={{ backgroundImage: `url("${product.image}")` }}
              >
                <span className="product-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="product-inquire">Enquire about this stone ↗</span>
              </Link>
              <div className="product-details">
                <div>
                  <p className="product-type">{product.type} · {product.color}</p>
                  <h3>{product.name}</h3>
                </div>
                <p className="product-price">
                  ${product.price.toFixed(2)}
                  <span> / sq. ft.</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-catalog">
          No {activeFilter.toLowerCase()} currently in the collection.{" "}
          <Link href="/admin/products">Add a stone to the collection ↗</Link>
        </p>
      )}
    </section>
  );
}

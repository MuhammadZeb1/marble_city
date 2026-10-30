import Link from "next/link";
import ProductCatalog from "@/components/product-catalog";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-image" role="img" aria-label="Warm, natural stone interior" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">NATURAL STONE · BEAUTIFULLY CONSIDERED</p>
          <h1>Made by nature.<br /><em>Chosen by you.</em></h1>
          <p className="hero-copy">
            A collection of honest, extraordinary stone for the places you call
            home.
          </p>
          <Link className="button button-light" href="#collection">
            Explore the collection <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <span className="hero-caption">01 / MATERIALS WITH MEANING</span>
      </section>

      <div className="intro-band section-wrap">
        <p>STONE IS NEVER JUST A SURFACE.</p>
        <p>
          It&apos;s the cool touch of a morning countertop. The gathering place
          for friends. The detail that makes a room yours.
        </p>
        <span aria-hidden="true">✳</span>
      </div>

      <ProductCatalog />

      <section className="craft-banner">
        <div className="craft-image" role="img" aria-label="Detailed natural stone in a refined interior" />
        <div className="craft-content">
          <p className="eyebrow">FROM FIRST SLAB TO FINAL DETAIL</p>
          <h2>Good things take<br /><em>a little shaping.</em></h2>
          <p>
            Thoughtfully sourced, expertly cut, and finished with care. We&apos;re
            with you through every decision.
          </p>
          <Link className="text-link text-link-light" href="/about">
            Get to know us <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

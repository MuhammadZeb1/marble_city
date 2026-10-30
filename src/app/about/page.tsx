import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <section className="page-intro section-wrap">
        <p className="eyebrow">A LITTLE ABOUT US</p>
        <h1>Good stone.<br />Good people.</h1>
        <p className="intro-copy">
          We believe the best spaces begin with materials that have already
          lived a little. We bring beautiful natural stone, thoughtful craft,
          and people-first service together, from the first slab to the final
          fitting.
        </p>
      </section>

      <section className="about-image section-wrap" aria-label="A calm, stone-finished interior">
        <div
          className="editorial-image"
          role="img"
          aria-label="Sunlit interior with natural stone finishes"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85")',
          }}
        />
      </section>

      <section className="about-story section-wrap">
        <div>
          <p className="eyebrow">FROM THE EARTH, WITH CARE</p>
          <h2>Considered at every step.</h2>
        </div>
        <div className="story-copy">
          <p>
            Every stone has its own landscape of colour and movement. We work
            with trusted quarry partners to source slabs with integrity and
            traceability, choosing pieces for their character as much as their
            quality.
          </p>
          <p>
            In our workshop, skilled hands shape each piece with precise
            cutting and beautifully finished edges. From a quiet vanity to a
            statement kitchen island, our team helps bring the details together
            and coordinates custom installation for a considered finish.
          </p>
          <Link className="button button-dark" href="/contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="values-strip">
        <div className="section-wrap values-grid">
          <article>
            <span>01</span>
            <h3>Thoughtful sourcing</h3>
            <p>Distinctive natural stone, chosen with care and sourced responsibly.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Made by hand</h3>
            <p>Careful cutting and edge polishing by people who know their craft.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Made to fit</h3>
            <p>Custom fabrication and installation, planned around your project.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

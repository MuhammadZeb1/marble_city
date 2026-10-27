"use client";

import {
  FormEvent,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  finish: string;
  image: string;
  imagePosition?: string;
};

const products: Product[] = [
  {
    id: "calacatta-oro",
    name: "Calacatta Oro",
    category: "White marble",
    finish: "Polished",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "nero-marquina",
    name: "Nero Marquina",
    category: "Black marble",
    finish: "Honed",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "ivory-travertine",
    name: "Ivory Travertine",
    category: "Travertine",
    finish: "Filled & honed",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "silver-cloud",
    name: "Silver Cloud",
    category: "Grey marble",
    finish: "Brushed",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    imagePosition: "center 58%",
  },
];

const categories = [
  "All stone",
  "White marble",
  "Black marble",
  "Travertine",
  "Grey marble",
];

const collections = [
  {
    name: "Quiet whites",
    note: "Soft veining, lasting calm",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Dramatic darks",
    note: "Depth in every detail",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Warm neutrals",
    note: "Natural texture, warm tone",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
  },
];

type QuoteListSnapshot = {
  items: string[];
  storageWarning: boolean;
};

const emptyQuoteListSnapshot: QuoteListSnapshot = {
  items: [],
  storageWarning: false,
};
let quoteListSnapshot = emptyQuoteListSnapshot;
let quoteListInitialized = false;
const quoteListListeners = new Set<() => void>();

function getQuoteListSnapshot() {
  return quoteListSnapshot;
}

function getServerQuoteListSnapshot() {
  return emptyQuoteListSnapshot;
}

function subscribeToQuoteList(listener: () => void) {
  quoteListListeners.add(listener);
  if (!quoteListInitialized) {
    quoteListInitialized = true;
    try {
      const saved = window.localStorage.getItem("marble-city-quote-list");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          !Array.isArray(parsed) ||
          !parsed.every((item): item is string => typeof item === "string")
        ) {
          throw new Error("Saved quote list has an unexpected format.");
        }
        quoteListSnapshot = {
          items: parsed.filter((id) =>
            products.some((product) => product.id === id),
          ),
          storageWarning: false,
        };
      }
    } catch (error) {
      console.error("Could not restore the saved quote list.", error);
      quoteListSnapshot = { items: [], storageWarning: true };
    }
    quoteListListeners.forEach((notify) => notify());
  }
  return () => quoteListListeners.delete(listener);
}

function updateQuoteList(items: string[]) {
  let storageWarning = quoteListSnapshot.storageWarning;
  try {
    window.localStorage.setItem("marble-city-quote-list", JSON.stringify(items));
  } catch (error) {
    console.error("Could not save the quote list in this browser.", error);
    storageWarning = true;
  }
  quoteListSnapshot = { items, storageWarning };
  quoteListListeners.forEach((notify) => notify());
}

function dismissStorageWarning() {
  quoteListSnapshot = { ...quoteListSnapshot, storageWarning: false };
  quoteListListeners.forEach((notify) => notify());
}

export default function Storefront() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All stone");
  const quoteListSnapshot = useSyncExternalStore(
    subscribeToQuoteList,
    getQuoteListSnapshot,
    getServerQuoteListSnapshot,
  );
  const quoteList = quoteListSnapshot.items;
  const [quoteListOpen, setQuoteListOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const storageWarning = quoteListSnapshot.storageWarning;
  const [formMessage, setFormMessage] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "All stone" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.category} ${product.finish}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  function addToQuoteList(product: Product) {
    if (quoteList.includes(product.id)) {
      setNotice(`${product.name} is already in your enquiry list.`);
      return;
    }
    updateQuoteList([...quoteList, product.id]);
    setNotice(`${product.name} added to your enquiry list.`);
  }

  function handleEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
    if (!email) {
      setFormMessage(
        "Enquiries are not connected yet. Configure NEXT_PUBLIC_CONTACT_EMAIL to enable email requests.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const subject = encodeURIComponent("Marble City material enquiry");
    const body = encodeURIComponent(
      [
        `Name: ${formData.get("name")}`,
        `Email: ${formData.get("email")}`,
        `Project details: ${formData.get("message")}`,
        `Materials of interest: ${
          quoteList
            .map((id) => products.find((product) => product.id === id)?.name)
            .filter(Boolean)
            .join(", ") || "Not specified"
        }`,
      ].join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setFormMessage("Your email app should open with the enquiry details.");
  }

  return (
    <>
      <div className="announcement">
        <span>Natural stone, thoughtfully considered</span>
        <a href="#enquire">Start a project enquiry <span aria-hidden="true">↗</span></a>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Marble City home">
          <span className="wordmark-icon" aria-hidden="true">M</span>
          <span>MARBLE CITY<small>STONE, IN ITS ELEMENT</small></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav
          className={`primary-navigation${menuOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#studio" onClick={() => setMenuOpen(false)}>Our approach</a>
          <a href="#enquire" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <button
          className="quote-list-button"
          type="button"
          onClick={() => setQuoteListOpen(true)}
          aria-label={`Open enquiry list, ${quoteList.length} items`}
        >
          Enquiry list <span className="quote-count">{quoteList.length}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow light-eyebrow">A MATERIAL WITH A MILLION STORIES</p>
            <h1>Make room<br />for the <em>remarkable.</em></h1>
            <p className="hero-description">
              Discover the quiet character of natural stone, selected for
              considered spaces and made to be lived with.
            </p>
            <div className="hero-actions">
              <a className="button button-light" href="#shop">Explore the stone <span aria-hidden="true">↗</span></a>
              <a className="text-link light-link" href="#studio">Our approach <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="hero-caption"><span>01 / 03</span><span>Natural stone. No two pieces alike.</span></div>
        </section>

        <div className="demo-banner" role="note">
          <span className="demo-dot" aria-hidden="true" />
          <p>
            Storefront preview — product names and imagery are illustrative.
            Availability, origin, pricing and specifications are not yet connected.
          </p>
        </div>

        <section className="section collections-section" id="collections">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR FINISH</p>
              <h2>Stone for every <em>point of view.</em></h2>
            </div>
            <a className="text-link" href="#shop">Browse the collection <span aria-hidden="true">→</span></a>
          </div>
          <div className="collection-grid">
            {collections.map((collection, index) => (
              <a
                className={`collection-card collection-card-${index + 1}`}
                href="#shop"
                key={collection.name}
                style={{ backgroundImage: `url("${collection.image}")` }}
              >
                <span className="collection-content">
                  <span className="collection-note">{collection.note}</span>
                  <span className="collection-name">{collection.name}<span aria-hidden="true"> ↗</span></span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section shop-inner">
            <div className="section-heading shop-heading">
              <div>
                <p className="eyebrow">THE MATERIAL LIBRARY</p>
                <h2>Meet your <em>next favourite.</em></h2>
                <p className="section-intro">
                  A small preview of the stones we can help you explore. Ask us
                  for verified details and current availability.
                </p>
              </div>
              <span className="demo-label">DEMO COLLECTION</span>
            </div>

            <div className="catalogue-controls">
              <label className="search-field">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <span className="visually-hidden">Search materials</span>
                <input
                  type="search"
                  placeholder="Search stone or finish"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <div className="category-filters" aria-label="Filter by material">
                {categories.map((item) => (
                  <button
                    className={category === item ? "filter-chip is-selected" : "filter-chip"}
                    type="button"
                    key={item}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length ? (
              <div className="product-grid">
                {filteredProducts.map((product, index) => (
                  <article className="product-card" key={product.id}>
                    <div
                      className={`product-image product-image-${index + 1}`}
                      role="img"
                      aria-label={`Illustrative interior featuring ${product.name} stone`}
                      style={{
                        backgroundImage: `url("${product.image}")`,
                        backgroundPosition: product.imagePosition ?? "center",
                      }}
                    >
                      <span className="product-demo-tag">DEMO</span>
                    </div>
                    <div className="product-info">
                      <div>
                        <p className="product-category">{product.category}</p>
                        <h3>{product.name}</h3>
                        <p className="product-finish">{product.finish} finish · details on request</p>
                      </div>
                      <button
                        className="add-to-list"
                        type="button"
                        aria-label={`Add ${product.name} to enquiry list`}
                        onClick={() => addToQuoteList(product)}
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" role="status">
                <p>No demo stones match that search.</p>
                <button
                  className="text-link"
                  type="button"
                  onClick={() => { setQuery(""); setCategory("All stone"); }}
                >
                  Clear search and filters <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
            <p className="catalogue-footnote">
              All catalogue entries shown here are sample content only; no
              pricing or stock is implied.
            </p>
          </div>
        </section>

        <section className="studio-section section" id="studio">
          <div className="studio-image" role="img" aria-label="Warm stone interior detail" />
          <div className="studio-copy">
            <p className="eyebrow">A LITTLE MORE PERSONAL</p>
            <h2>Good stone starts with <em>good questions.</em></h2>
            <p>
              Every project has its own light, scale and rhythm. Begin with the
              feeling you want to create; the right material details can follow.
            </p>
            <a className="text-link" href="#enquire">Explore your project <span aria-hidden="true">→</span></a>
            <div className="studio-detail">
              <span>01</span>
              <p>Request a sample, confirm the finish, and verify dimensions and availability before ordering.</p>
            </div>
          </div>
        </section>

        <section className="applications-section">
          <div className="section applications-inner">
            <p className="eyebrow">A NATURAL FIT</p>
            <h2>Where will it <em>take you?</em></h2>
            <div className="application-grid">
              {[
                ["01", "Kitchen", "A hardworking surface with its own character."],
                ["02", "Bathroom", "A softer start and finish to the day."],
                ["03", "Living spaces", "Texture and warmth, from floor to wall."],
                ["04", "Details", "Shelves, hearths, steps and the little things."],
              ].map(([number, title, description]) => (
                <article className="application-card" key={title}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="enquiry-section section" id="enquire">
          <div className="enquiry-copy">
            <p className="eyebrow light-eyebrow">LET&apos;S TALK MATERIALS</p>
            <h2>Your project.<br />Your <em>kind of stone.</em></h2>
            <p>
              Tell us a little about what you are planning. We will help you
              understand what to confirm before choosing a natural stone.
            </p>
            <p className="enquiry-note">No order is placed and no payment is collected on this preview site.</p>
          </div>
          <form className="enquiry-form" onSubmit={handleEnquiry}>
            <label>
              Your name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Tell us about your project
              <textarea name="message" rows={3} required />
            </label>
            <button className="button button-light" type="submit">Prepare enquiry <span aria-hidden="true">↗</span></button>
            <p className="form-message" aria-live="polite">{formMessage}</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">
          <span className="wordmark-icon" aria-hidden="true">M</span>
          <span>MARBLE CITY<small>STONE, IN ITS ELEMENT</small></span>
        </a>
        <p>Natural stone, thoughtfully considered.</p>
        <div className="footer-links">
          <a href="#collections">Collections</a>
          <a href="#shop">Material library</a>
          <a href="#enquire">Enquiries</a>
        </div>
        <span className="copyright">© {new Date().getFullYear()} Marble City · Storefront preview</span>
      </footer>

      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">×</button>
        </div>
      )}

      {storageWarning && (
        <div className="storage-warning" role="status">
          Your browser could not save the enquiry list. It may not be available after refresh.
          <button type="button" onClick={dismissStorageWarning} aria-label="Dismiss storage warning">×</button>
        </div>
      )}

      {quoteListOpen && (
        <div className="drawer-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setQuoteListOpen(false);
        }}>
          <aside className="quote-drawer" role="dialog" aria-modal="true" aria-labelledby="quote-title">
            <div className="drawer-heading">
              <div>
                <p className="eyebrow">SAVE FOR LATER</p>
                <h2 id="quote-title">Your enquiry list</h2>
              </div>
              <button className="drawer-close" type="button" onClick={() => setQuoteListOpen(false)} aria-label="Close enquiry list">×</button>
            </div>
            {quoteList.length ? (
              <>
                <ul className="quote-items">
                  {quoteList.map((id) => {
                    const product = products.find((item) => item.id === id);
                    if (!product) return null;
                    return (
                      <li key={id}>
                        <span><strong>{product.name}</strong><small>{product.category} · demo entry</small></span>
                        <button
                          type="button"
                          onClick={() => updateQuoteList(quoteList.filter((item) => item !== id))}
                          aria-label={`Remove ${product.name}`}
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <a className="button button-dark drawer-cta" href="#enquire" onClick={() => setQuoteListOpen(false)}>
                  Continue to enquiry <span aria-hidden="true">→</span>
                </a>
              </>
            ) : (
              <p className="drawer-empty">Your list is empty. Add a demo stone from the material library to keep it here.</p>
            )}
            <p className="drawer-footnote">This list is for enquiries only. It is not a cart or an order.</p>
          </aside>
        </div>
      )}
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import "./home-page.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LiveStatusPill } from "@/components/LiveStatusPill";
import { Marquee } from "@/components/Marquee";
import { WeekGrid } from "@/components/WeekGrid";

import {
  about,
  menu,
  news,
  site,
  tonight,
  seoFor,
} from "@/lib/content";
import { restaurantSchema, jsonLd } from "@/lib/schemaOrg";

export const metadata: Metadata = (() => {
  const s = seoFor("/");
  return {
    title: s.title,
    description: s.description,
    openGraph: {
      title: s.title,
      description: s.description,
      siteName: s.siteName,
      images: [{ url: s.ogImage }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.ogImage] },
  };
})();

/**
 * Home (/) — lifted from design-handoff/Home.html.
 *
 * Sections: hero (with Tonight strip aside) → marquee → squiggle →
 * "This Week" week grid → squiggle → "What You Came For" food strip →
 * squiggle → heritage (three generations) → squiggle → news → footer.
 *
 * Featured menu items pulled from menu.sections[].items where featured=true,
 * matching SLOT_RECONCILIATION mapping signatureDishes -> menu.featured.
 */

function pickFeatured() {
  const out: { name: string; price?: string; image: string; kicker: string }[] = [];

  const burger = menu.sections.find((s) => s.id === "burgers")?.items.find((i) => i.name === "The Belly Buster");
  if (burger) {
    out.push({
      name: "The Belly\nBuster",
      kicker: "★ Terry's Favorite",
      image: "/assets/photo-staff-burger-wings.jpg",
      price: `1lb USDA Angus chuck · crisp bacon · Swiss + American · $${burger.price?.toFixed(2)}`,
    });
  }

  const wings = menu.sections.find((s) => s.id === "chicken")?.items.find((i) => i.name === "Terry's Original Chicken Wings");
  if (wings && wings.pricing) {
    const ten = wings.pricing.find((p) => p.size === "10");
    const fifty = wings.pricing.find((p) => p.size === "50");
    out.push({
      name: "Original\nWings",
      kicker: "House Specialty",
      image: "/assets/photo-wings-cocktails.jpg",
      price:
        ten && fifty
          ? `10 for $${ten.price.toFixed(2)} · 50 for $${fifty.price.toFixed(2)}`
          : "Hand-tossed in 11 flavors",
    });
  }

  const steak = menu.sections.find((s) => s.id === "dinners")?.items.find((i) => i.name === "Ribeye Steak");
  if (steak) {
    out.push({
      name: "Steak\nNight",
      kicker: "Cooked to Order",
      image: "/assets/photo-steak.jpg",
      price: `Char-grilled, mushrooms & onions · $${steak.price?.toFixed(2)}`,
    });
  }
  return out;
}

export default function HomePage() {
  const featured = pickFeatured();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(restaurantSchema()) }}
      />
      <Header />

      <section className="hero" aria-label="Welcome">
        <div className="hero-bg" role="presentation"></div>
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow-row">
              <LiveStatusPill />
              <span className="t-eyebrow">Ocala, Florida · Est. {site.estYear}</span>
            </div>
            <h1 className="hero-headline">
              Ocala&rsquo;s <span className="green">Sports Bar</span>
              <br />
              &amp; Grill
            </h1>
            <p className="hero-lede">
              For more than forty years, {site.name} has been Ocala&rsquo;s sports bar &amp; grill —
              king-size portions, a lively room, and three generations of homegrown hospitality.
            </p>
            <div className="hero-cta-row">
              <Link href="/menu" className="t-btn t-btn--primary">See the Menu</Link>
              <Link href="/specials" className="t-btn t-btn--ghost">What&rsquo;s on tonight</Link>
            </div>
          </div>

          {tonight.cells.length > 0 && (
            <aside className="hero-status" aria-label="Tonight at Terry's">
              <div className="label">Tonight at Terry&rsquo;s</div>
              <div className="strip">
                {tonight.cells.map((c, i) => (
                  <div className="strip-cell" key={i}>
                    <div className="tag">{c.tag}</div>
                    <div>
                      <div className="title">{c.title}</div>
                      {c.meta && <span className="meta">{c.meta}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </section>

      <Marquee />

      <div className="t-container" style={{ paddingBlock: "var(--space-8)" }}>
        <div className="t-squiggle" role="presentation"></div>
      </div>

      <section className="events-section t-container" id="events" aria-label="This week at Terry's">
        <header className="events-header">
          <div>
            <p className="t-eyebrow">This Week at Terry&rsquo;s</p>
            <h2 className="t-display title">Always Something Going On.</h2>
          </div>
          <p className="sub">
            Game days, trivia, karaoke, and the lunch crowd that&rsquo;s been here for forty years. Drop in.
          </p>
        </header>
        <WeekGrid />
      </section>

      <div className="t-container" style={{ paddingBlock: "var(--space-6)" }}>
        <div className="t-squiggle" role="presentation"></div>
      </div>

      <section className="food-strip t-container" id="menu" aria-label="What you came for">
        <header className="events-header">
          <div>
            <p className="t-eyebrow">What You Came For</p>
            <h2 className="t-display title">
              King-Size Portions.<br />
              <span style={{ color: "var(--green)" }}>Cooked to Order.</span>
            </h2>
          </div>
          <p className="sub">
            Half-pound burgers. Hand-tossed wings. Steaks that hang off the plate. Nothing pre-cooked, ever.
          </p>
        </header>

        <div className="food-grid">
          {featured.map((f, i) => (
            <article className={`food-card ${i === 0 ? "tall" : ""}`} key={f.kicker}>
              <div className="img" style={{ backgroundImage: `url('${f.image}')` }}></div>
              <div className="body">
                <div className="kicker">{f.kicker}</div>
                <h3 className="name">
                  {f.name.split("\n").map((line, idx) => (
                    <span key={idx} style={{ display: "block" }}>{line}</span>
                  ))}
                </h3>
                <p className="price">{f.price}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: "var(--space-8)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/menu" className="t-btn t-btn--primary">See the Full Menu</Link>
          <a href={site.menuPdf} target="_blank" rel="noopener noreferrer" className="t-btn t-btn--ghost">Download PDF</a>
          <span className="t-mono t-mono--caps" style={{ color: "var(--on-dark-3)" }}>
            Updated {new Date(menu.lastUpdated).toLocaleString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </section>

      <div className="t-container" style={{ paddingBlock: "var(--space-8)" }}>
        <div className="t-squiggle" role="presentation"></div>
      </div>

      <section className="heritage t-container" id="about" aria-label="Three generations">
        <div className="heritage-grid">
          <div
            className="heritage-photo"
            role="img"
            aria-label={about.groupPhoto.alt}
          />
          <div>
            <p className="t-eyebrow t-eyebrow--red">Three Generations</p>
            <h2 className="t-display" style={{ color: "var(--on-dark)" }}>
              Family-Run<br />
              Since <span className="pop">{site.estYear}</span>.
            </h2>
            {about.story.split("\n\n").map((para, i) => (
              <p
                key={i}
                className={i === 0 ? "t-body t-body--lg" : "t-body"}
                style={{
                  color: i === 0 ? "var(--on-dark-2)" : undefined,
                  maxWidth: "50ch",
                  marginTop: i === 0 ? "var(--space-5)" : "var(--space-4)",
                }}
              >
                {para}
              </p>
            ))}
            <div className="heritage-stat">
              {about.stats.map((s, i) => (
                <div key={i}>
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="t-container" style={{ paddingBlock: "var(--space-8)" }}>
        <div className="t-squiggle" role="presentation"></div>
      </div>

      <section className="news t-container" aria-label="Latest news">
        <header className="events-header">
          <div>
            <p className="t-eyebrow">Get the Latest News</p>
            <h2 className="t-display title">From the Bar.</h2>
          </div>
        </header>

        <div className="news-grid">
          {news.recent.map((n) => (
            <article className="news-card" key={n.id}>
              <div className="img" style={{ backgroundImage: `url('${n.image}')` }}></div>
              <div className="body">
                <div className="date">
                  {new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" })} · {n.readMins} min read
                </div>
                <h3>{n.title}</h3>
                <p className="t-body">{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

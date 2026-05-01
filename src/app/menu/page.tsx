import Link from "next/link";
import type { Metadata } from "next";
import "./menu-page.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuRow } from "@/components/MenuRow";
import { menu, site, seoFor, type MenuSection } from "@/lib/content";
import { menuSchema, jsonLd } from "@/lib/schemaOrg";

export const metadata: Metadata = (() => {
  const s = seoFor("/menu");
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/menu" },
    openGraph: { title: s.title, description: s.description, siteName: s.siteName, images: [{ url: s.ogImage }], type: "website" },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.ogImage] },
  };
})();

/**
 * /menu — Menu.html lifted. Anchor nav below sticky header. Sections render
 * from menu.sections; items split into two columns visually; anchor IDs match
 * section.id so the sticky nav links work.
 */

function chunkInTwo<T>(arr: T[]): [T[], T[]] {
  const half = Math.ceil(arr.length / 2);
  return [arr.slice(0, half), arr.slice(half)];
}

function MenuSectionBlock({ section }: { section: MenuSection }) {
  const [left, right] = chunkInTwo(section.items);
  return (
    <section className="menu-section t-container" id={section.id}>
      <div className="menu-section-head">
        <h2>{section.title}</h2>
        {section.intro && <p className="intro">{section.intro}</p>}
      </div>
      <div className="menu-cols">
        <div>
          {left.map((item, i) => <MenuRow key={`${section.id}-l-${i}`} item={item} />)}
        </div>
        <div>
          {right.map((item, i) => <MenuRow key={`${section.id}-r-${i}`} item={item} />)}
          {section.id === "chicken" && (
            <div className="menu-sauce-callout">
              <strong>EACH ADDITIONAL SAUCE</strong> · $0.75 each
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function MenuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(menuSchema()) }}
      />
      <Header />

      <section className="menu-hero">
        <div className="t-container">
          <div className="menu-hero-grid">
            <div>
              <p className="t-eyebrow">
                The Menu · Updated {new Date(menu.lastUpdated).toLocaleString("en-US", { month: "long", year: "numeric" })}
              </p>
              <h1>
                King-Size <span className="green">Portions</span>.<br />
                Cooked to Order.
              </h1>
              <p className="lede">
                All burgers are 1/2 lb USDA Angus, ground fresh daily. Wings hand-tossed in your choice of 11 flavors. Nothing pre-cooked — ever.
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-6)" }}>
                <a href={site.menuPdf} className="t-btn t-btn--primary" target="_blank" rel="noopener noreferrer">
                  Download PDF Menu
                </a>
                <a href={`tel:${site.phone}`} className="t-btn t-btn--ghost">
                  Call to Order · {site.phoneDisplay}
                </a>
              </div>
            </div>
            <aside className="menu-hero-aside">
              <span className="price-flag">${menu.lunchSpecial.price.toFixed(2)}</span>
              <h3>Daily Lunch</h3>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--on-dark-3)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 var(--space-4)" }}>
                {menu.lunchSpecial.window}
              </p>
              <ul>
                {menu.lunchSpecial.days.map((d) => (
                  <li key={d.day}>
                    <span className="day">{d.day.slice(0, 3).toUpperCase()}</span> · {d.item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <nav className="anchor-nav" aria-label="Menu sections">
        <div className="anchor-nav-inner">
          {menu.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.title}</a>
          ))}
        </div>
      </nav>

      <div className="t-container" style={{ paddingBlock: "var(--space-6)" }}>
        <div className="t-squiggle" aria-hidden="true" />
      </div>

      {menu.sections.map((section, i) => (
        <div key={section.id}>
          <MenuSectionBlock section={section} />
          {i < menu.sections.length - 1 && (
            <div className="t-container">
              <div className="t-squiggle" aria-hidden="true" />
            </div>
          )}
        </div>
      ))}

      <div className="cta-strip" id="lunch">
        <div className="cta-strip-inner">
          <div>
            <p style={{ fontFamily: "var(--font-cond)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 var(--space-2)" }}>
              ${menu.lunchSpecial.price.toFixed(2)} lunch · {menu.lunchSpecial.window}
            </p>
            <h2>Daily Lunch<br />Hits Different.</h2>
          </div>
          <div className="actions">
            <a href={site.menuPdf} className="t-btn" target="_blank" rel="noopener noreferrer">Full PDF Menu</a>
            <a href={`tel:${site.phone}`} className="t-btn">Call to Order</a>
          </div>
        </div>
      </div>

      <section className="menu-section t-container" id="drinks">
        <div className="menu-section-head">
          <h2>Drinks &amp; <span className="green">Bar</span></h2>
          <p className="intro">{menu.drinks.draft}</p>
        </div>
        <div className="menu-drinks-card">
          <p className="t-body t-body--lg" style={{ color: "var(--on-dark)", margin: "0 0 var(--space-4)" }}>
            🍺 <strong style={{ color: "var(--green)" }}>Happy Hour</strong> · Mon–Fri · 3pm–7pm
          </p>
          <p className="t-body" style={{ margin: 0 }}>
            <strong>Wines:</strong> {menu.drinks.wine}
          </p>
          <p className="t-body" style={{ margin: "var(--space-3) 0 0" }}>
            <strong>Liquor:</strong> {menu.drinks.liquor}
          </p>
          <p className="t-body" style={{ margin: "var(--space-3) 0 0" }}>
            <strong>Non-alcoholic:</strong> {menu.drinks.non_alcoholic}
          </p>
          <p className="t-body" style={{ margin: "var(--space-5) 0 0", color: "var(--on-dark-3)", fontSize: "13px" }}>
            Pitcher of beer + 20 jumbo wings is $29.99 every Sunday during football.
          </p>
        </div>
      </section>

      <section className="t-container" style={{ paddingBlock: "var(--space-8)" }}>
        <p className="t-mono" style={{ color: "var(--on-dark-3)", textAlign: "center", maxWidth: "65ch", margin: "0 auto" }}>
          {menu.consumerNotice}
        </p>
        <p className="t-mono t-mono--caps" style={{ color: "var(--on-dark-3)", textAlign: "center", marginTop: "var(--space-3)" }}>
          {menu.footnote}
        </p>
      </section>

      <Footer />
    </>
  );
}

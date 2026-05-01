import Link from "next/link";
import type { Metadata } from "next";
import "../inner-pages.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { specials, menu, seoFor } from "@/lib/content";

export const metadata: Metadata = (() => {
  const s = seoFor("/specials");
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/specials" },
    openGraph: { title: s.title, description: s.description, siteName: s.siteName, images: [{ url: s.ogImage }], type: "website" },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.ogImage] },
  };
})();

/**
 * /specials — Inner Pages.html § /specials.
 *
 * 6-card grid: 5 weekday lunches + 1 hot Sunday Football. Reads from
 * specials.weekday + specials.weekend; the per-day "desc" lines below
 * are lifted from the comp because the schema doesn't carry rich descs
 * (those are Design copy, not data).
 */

const WEEKDAY_DESC: Record<string, string> = {
  Monday:    "Half-pound USDA Angus on a homemade bun, skin-on fries. The lunch that started it all.",
  Tuesday:   "Hand-breaded boneless breast, lettuce, tomato, pickle, mayo. Switch the bread for a wrap, no charge.",
  Wednesday: "Italian, turkey, ham, roast beef, meatball, or veggie. Toasted on the panini press.",
  Thursday:  "Three jumbo strips, hand-breaded. Honey mustard, BBQ, ranch, or any of the 11 wing sauces.",
  Friday:    "Beer-battered cod or 8 medium gulf shrimp on a hoagie, with fries. Goes fast.",
};

export default function SpecialsPage() {
  return (
    <>
      <Header />

      <main>

      <section className="specials-bg">
        <div className="t-container" style={{ paddingBlock: "var(--space-12)" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "var(--space-6)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
            <div>
              <p className="t-eyebrow">This week</p>
              <h1 className="inner-display">
                Daily <span className="green">Specials</span>
              </h1>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "var(--on-dark-2)", maxWidth: "40ch" }}>
              Updated every week. The kitchen runs the specials Mon–Fri 11am–3pm, then weekend events take over.
            </p>
          </div>

          <div className="specials-grid">
            {specials.weekday.days.map((d) => (
              <article key={d.day} className="special-card">
                <p className="day">{d.day}</p>
                <h3>{d.item}</h3>
                <p className="price">${specials.weekday.days.length ? menu.lunchSpecial.price.toFixed(2) : "—"}</p>
                <p className="desc">{WEEKDAY_DESC[d.day] ?? ""}</p>
                <span className="when">{specials.weekday.window.replace("Mon–Fri · ", "")}</span>
              </article>
            ))}

            <article className="special-card hot">
              <p className="day">Sunday</p>
              <h3>Pitcher + 20 Wings</h3>
              <p className="price">${specials.weekend.items[0]?.price?.toFixed(2) ?? "29.99"}</p>
              <p className="desc">
                Domestic pitcher and 20 jumbo wings, any flavor. Football all day, every Sunday during season.
              </p>
              <span className="when">All day</span>
            </article>
          </div>
        </div>
      </section>

      <section className="t-container" style={{ paddingBlock: "var(--space-12)" }}>
        <p className="t-eyebrow">Happy Hour</p>
        <h2 className="inner-display">
          {specials.happyHour.label.replace(" · ", " · ")}
        </h2>
        <p className="t-body t-body--lg" style={{ maxWidth: "55ch" }}>
          Drop in for the weekday wind-down. Drink specials, half-priced apps in select windows — ask your server.
        </p>
        <p className="t-body" style={{ maxWidth: "55ch", marginTop: "var(--space-3)", color: "var(--on-dark-3)", fontStyle: "italic" }}>
          Detailed bar program coming once we confirm the actual pour list with the team.
        </p>

        <div style={{ marginTop: "var(--space-8)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link href="/menu" className="t-btn t-btn--primary">Full Menu</Link>
          <Link href="/contact?topic=Catering" className="t-btn t-btn--ghost">Catering &amp; Parties</Link>
        </div>
      </section>

      </main>

      <Footer />
    </>
  );
}

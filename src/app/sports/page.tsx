import Link from "next/link";
import type { Metadata } from "next";
import "../inner-pages.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sports, site, seoFor } from "@/lib/content";

export const metadata: Metadata = (() => {
  const s = seoFor("/sports");
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/sports" },
    openGraph: { title: s.title, description: s.description, siteName: s.siteName, images: [{ url: s.ogImage }], type: "website" },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.ogImage] },
  };
})();

/**
 * /sports — Inner Pages.html § /sports.
 *
 * Hero copy + TV list (or empty-state placeholder) + rooms grid.
 * The lineup table is empty by default; it renders the comp's static
 * sample only when sports.lineup is populated.
 */

export default function SportsPage() {
  return (
    <>
      <Header />

      <section className="t-container" style={{ paddingBlock: "var(--space-12)" }}>
        <div className="sports-row">
          <div>
            <p className="t-eyebrow">{sports.tagline}</p>
            <h1 className="inner-display">
              On the <span className="green">Screens.</span>
            </h1>
            <p className="t-body t-body--lg">
              If it&rsquo;s a game, it&rsquo;s on. NFL Sunday Ticket, ESPN+, Big Ten, SEC, MLB Extra Innings — the whole package. Tell us what you want to watch and we&rsquo;ll put it on the screen by your seat.
            </p>
            <ul className="t-body" style={{ marginTop: "var(--space-5)", paddingLeft: "var(--space-5)" }}>
              {sports.highlights.map((h, i) => (
                <li key={i} style={{ marginBottom: "var(--space-2)" }}>{h}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-6)", flexWrap: "wrap" }}>
              <a href={`tel:${site.phone}`} className="t-btn t-btn--primary">Call to Reserve a Booth</a>
              <Link href="/contact?topic=Private+Event" className="t-btn t-btn--ghost">Private Game-Day Bookings</Link>
            </div>
          </div>

          <div className="tv-list">
            <h4>{sports.lineupHeadline ?? "This Week's Lineup"}</h4>
            {sports.lineup.length > 0 ? (
              <>
                {sports.lineup.map((g, i) => (
                  <div key={i} className="tv-row">
                    <span className="time">{g.time}</span>
                    <span className="matchup">{g.matchup}</span>
                    <span className="channel">{g.league}</span>
                  </div>
                ))}
                {sports.lineup.some((g) => g._placeholder) && (
                  <p className="empty" style={{ marginTop: "var(--space-4)" }}>
                    Sample lineup — actual schedule posted weekly during football season. Call ahead to confirm what&rsquo;s on the big screens.
                  </p>
                )}
              </>
            ) : (
              <p className="empty">
                Lineup posted weekly during football season. Call ahead to confirm what&rsquo;s on the big screens tonight.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="t-container" style={{ paddingBlock: "var(--space-8) var(--space-12)" }}>
        <p className="t-eyebrow">Four rooms</p>
        <h2 className="inner-display">
          Pick the <span className="green">Room</span>.
        </h2>
        <div className="rooms-grid">
          {sports.rooms.map((r) => (
            <article key={r.name} className="room-card">
              <h4>{r.name}</h4>
              <p>{r.note}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import "../inner-pages.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site, hours, seoFor } from "@/lib/content";

export const metadata: Metadata = (() => {
  const s = seoFor("/visit");
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/visit" },
    openGraph: { title: s.title, description: s.description, siteName: s.siteName, images: [{ url: s.ogImage }], type: "website" },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.ogImage] },
  };
})();

/**
 * /visit — Inner Pages.html § /visit.
 *
 * Embedded Google map + address/phone/hours block. Hours table renders from
 * content/hours.json with today highlighted client-side via a small inline
 * script (the "today" class on the right tr).
 *
 * The map iframe URL uses Google Maps' free q= search parameter, no API key.
 */

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function fmt12(hm: string): string {
  const [h, m] = hm.split(":").map(Number);
  const wraps = h >= 24 ? h - 24 : h;
  const period = wraps >= 12 ? "pm" : "am";
  const hh = wraps === 0 ? 12 : wraps > 12 ? wraps - 12 : wraps;
  return m === 0 ? `${hh}${period}` : `${hh}:${m.toString().padStart(2, "0")}${period}`;
}

export default function VisitPage() {
  const mapQuery = encodeURIComponent(
    `${site.name}, ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postal}`
  );
  const mapEmbed = `https://maps.google.com/maps?q=${mapQuery}&t=m&z=14&output=embed&iwloc=near`;

  return (
    <>
      <Header />

      <main>

      <section className="t-container" style={{ paddingBlock: "var(--space-12)" }}>
        <p className="t-eyebrow">Find us</p>
        <h1 className="inner-display" style={{ marginBottom: "var(--space-7)" }}>
          Come <span className="green">Through.</span>
        </h1>

        <figure className="visit-exterior">
          <Image
            src="/assets/photo-exterior.jpg"
            alt="The side of Terry's Place — yellow building with a hand-painted Terry's mural in green and red graffiti style, a tropical cocktail with '5 5 5' running down it, palm trees, and the words 'It's 5 o'clock here!' painted in teal."
            width={1015}
            height={878}
            sizes="(max-width: 800px) 100vw, 1136px"
            priority
          />
          <figcaption>
            <span className="t-mono t-mono--caps">{site.address.street} · {site.address.city}, {site.address.region}</span>
          </figcaption>
        </figure>

        <div className="visit-grid">
          <div>
            <iframe
              className="map-embed"
              src={mapEmbed}
              loading="lazy"
              title={`Map to ${site.name}`}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)", flexWrap: "wrap" }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="t-btn t-btn--primary"
              >
                Get Directions
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="t-btn t-btn--ghost"
              >
                Open in Maps
              </a>
            </div>
          </div>

          <div className="info-list">
            <div className="info-block">
              <h4>Address</h4>
              <p className="big">{site.address.street}</p>
              <p>{site.address.city}, {site.address.region} {site.address.postal}</p>
            </div>

            <div className="info-block">
              <h4>Phone</h4>
              <p className="big" style={{ color: "var(--green)" }}>
                <a href={`tel:${site.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {site.phoneDisplay}
                </a>
              </p>
              <p>Call ahead for to-go orders or large parties.</p>
            </div>

            <div className="info-block">
              <h4>Hours</h4>
              <table className="hours-table">
                <tbody>
                  {DOW.map((d, i) => {
                    const slot = hours[String(i) as "0" | "1" | "2" | "3" | "4" | "5" | "6"];
                    return (
                      <tr key={d} data-dow={i}>
                        <td className="day">{d}</td>
                        <td className="hrs">
                          {slot ? `${fmt12(slot.open)} – ${fmt12(slot.close)}` : "Closed"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(){
                      try {
                        var fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short' });
                        var wd = fmt.format(new Date());
                        var idx = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(wd);
                        if (idx >= 0) {
                          var row = document.querySelector('tr[data-dow="' + idx + '"]');
                          if (row) row.className = 'today';
                        }
                      } catch(e) {}
                    })();
                  `,
                }}
              />
              <p style={{ marginTop: "var(--space-4)", color: "var(--green)", fontFamily: "var(--font-cond)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Happy Hour · {hours.happyHour.label}
              </p>
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  );
}

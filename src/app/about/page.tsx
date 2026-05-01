import Image from "next/image";
import type { Metadata } from "next";
import "../inner-pages.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DraftField } from "@/components/DraftField";
import { about, site, seoFor } from "@/lib/content";

export const metadata: Metadata = (() => {
  const s = seoFor("/about");
  return {
    title: s.title,
    description: s.description,
    openGraph: { title: s.title, description: s.description, siteName: s.siteName, images: [{ url: s.ogImage }], type: "website" },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.ogImage] },
  };
})();

/**
 * /about — Inner Pages.html § PAGE · /about.
 *
 * Lifts: about-hero (right-rail group photo), story-section (two flipped rows
 * with body + pull quote on row 1), and a family row showing the three
 * generations. Family names render as DraftField pending pills until client
 * confirms (Design retracted the agency-drafted placeholder names 2026-05-01;
 * the storyRow bodies were rewritten to remove fabricated personal references).
 */

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="about-hero">
        <div className="t-container">
          <div className="about-hero-grid">
            <div>
              <p className="t-eyebrow">About {site.name}</p>
              <h1>
                Three <span className="green">Generations</span> Strong.
              </h1>
              <p className="t-lede">{about.lede}</p>
              <p className="est">EST. {site.estYear}</p>
            </div>
            <Image
              src={about.groupPhoto.src}
              alt={about.groupPhoto.alt}
              width={800}
              height={1000}
              priority
            />
          </div>
        </div>
      </section>

      <section className="story-section t-container">
        {about.storyRows.map((row, i) => (
          <div key={i} className={`story-row ${row.flip ? "flip" : ""}`}>
            <div>
              <p className="t-eyebrow">{row.kicker}</p>
              <h2 dangerouslySetInnerHTML={{ __html: row.title }} />
              <div className="body">
                {row.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
              {row.pullQuote && <p className="story-pull">&ldquo;{row.pullQuote}&rdquo;</p>}
            </div>
            <Image
              src={row.image}
              alt={row.imageAlt}
              width={900}
              height={675}
            />
          </div>
        ))}
      </section>

      <section className="t-container" style={{ paddingBlock: "var(--space-12)" }}>
        <p className="t-eyebrow t-eyebrow--red">The Three Terrys</p>
        <h2 className="inner-display">
          One <span className="green">Family</span>, One Recipe Box.
        </h2>
        <p className="t-body t-body--lg" style={{ maxWidth: "55ch" }}>
          Same kitchen. Same bread recipe. Same approach to a steak. Forty-five years on, the names on the door still answer the phone.
        </p>

        <div className="family-row">
          {about.family.map((member, i) => (
            <article key={i} className="family-card">
              <DraftField
                as="block"
                item={`Portrait — ${member.role}`}
                value={member.photo ? <div className="photo" style={{ backgroundImage: `url('${member.photo}')` }} /> : undefined}
              >
                <div className="photo" />
              </DraftField>
              <p className="role">{member.role}</p>
              <h3 className="name">
                {member.name ?? <DraftField item={member._pendingLabel ?? `Family member ${i + 1} name`} />}
              </h3>
              <p className="since">{member.since != null ? `Since ${member.since}` : <DraftField item="Year pending" />}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

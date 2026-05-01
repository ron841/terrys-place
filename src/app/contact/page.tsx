import { Suspense } from "react";
import type { Metadata } from "next";
import "../inner-pages.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { DraftField } from "@/components/DraftField";
import { ContactTopicReader } from "./ContactTopicReader";
import { site, forms, seoFor } from "@/lib/content";

export const metadata: Metadata = (() => {
  const s = seoFor("/contact");
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/contact" },
    openGraph: { title: s.title, description: s.description, siteName: s.siteName, images: [{ url: s.ogImage }], type: "website" },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: [s.ogImage] },
  };
})();

/**
 * /contact — Inner Pages.html § /contact.
 *
 * Two-column layout: copy left, form right. The form posts to Static Forms
 * (key in env). Recipient is currently NEXT_PUBLIC_CONTACT_RECIPIENT
 * (placeholder pending@terrys.place). DraftField surfaces this status so
 * Eli sees the pending state in preview.
 *
 * `?topic=Catering` sets the dropdown via the small client-only reader.
 */

export default function ContactPage() {
  const recipient = process.env.NEXT_PUBLIC_CONTACT_RECIPIENT ?? "pending@terrys.place";
  const recipientPending = recipient === "pending@terrys.place";

  return (
    <>
      <Header />

      <section className="t-container" style={{ paddingBlock: "var(--space-12)" }}>
        <div className="contact-grid">
          <div>
            <p className="t-eyebrow">Drop a line</p>
            <h1 className="inner-display">
              Got a <span className="green">Question?</span>
            </h1>
            <p className="t-body t-body--lg">
              For a fast answer, just call — we pick up the phone. For private parties, catering, or anything that needs a paper trail, drop a note and we&rsquo;ll reply by email within a day.
            </p>
            <p className="t-hand" style={{ marginTop: "var(--space-6)" }}>
              Or just walk in. We&rsquo;re not hard to find.
            </p>

            <div style={{ marginTop: "var(--space-8)" }}>
              <p className="t-eyebrow t-eyebrow--ink" style={{ color: "var(--on-dark-2)" }}>Or call us</p>
              <a href={`tel:${site.phone}`} className="t-btn t-btn--primary" style={{ marginTop: "var(--space-3)" }}>
                {site.phoneDisplay}
              </a>
            </div>

            {recipientPending && (
              <p style={{ marginTop: "var(--space-6)" }}>
                <DraftField item="Real contact recipient email" />
              </p>
            )}
          </div>

          <Suspense fallback={<ContactForm />}>
            <ContactTopicReader topics={forms.contact.topics} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </>
  );
}

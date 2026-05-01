import type { Metadata } from "next";
import "./audit-page.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { audit } from "@/lib/content";

export const metadata: Metadata = {
  title: "Audit · Terry's Place — INTERNAL",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * /audit — internal review artifact.
 *
 * Renders content/audit.json into a long-scroll review page Design + Ron
 * can walk together. Wrapped in the site Header/Footer chrome so it doesn't
 * feel detached, but with a clear "INTERNAL REVIEW" treatment so nobody
 * confuses it with public content.
 *
 * noindex via Metadata.robots; the route is also added to robots.txt
 * disallow.
 */

type Note = { kind: "ok" | "drift" | "added"; text: string };
type Route = { name: string; label: string; compSource: string; notes: Note[] };
type PhotoItem = {
  filename: string;
  dimensions: string;
  bytes: number;
  judgment: "strong" | "adequate" | "weak" | "ok";
  use: string;
  notes: string;
};
type Wishlist = { rank: number; subject: string; why: string; ref: string };
type ContentItem = {
  route: string;
  section: string;
  field: string;
  currentValue: string;
  source: string;
  question: string;
};
type LhResult = {
  route: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  lcp: string;
  cls: string;
  tbt: string;
  verdict: string;
};
type SeoEntry = {
  route: string;
  title: string;
  description: string;
  ogImage: string;
  canonical: string | null;
  h1: string;
  jsonLd: string[];
};
type DriftItem = { what: string; compSpec: string; shipped: string; why: string };

const v = audit as unknown as {
  meta: {
    version: string;
    capturedAt: string;
    buildSha: string;
    previewUrl: string;
    tooling: Record<string, string>;
  };
  visualFidelity: { _note: string; routes: Route[] };
  photoAudit: {
    inventory: PhotoItem[];
    halfDayShootWishlist: Wishlist[];
    filenameContentNote: string;
  };
  contentStatus: { items: ContentItem[] };
  technical: {
    lighthouse: { _note: string; results: LhResult[]; worstRoute: string; summary: string };
    schemaOrg: {
      emitted: { route: string; types: string[]; validates: string; note: string }[];
      missing: { type: string; route: string; rationale: string }[];
    };
    consoleErrors: { perRoute: { route: string; errors: number; warnings: number; details: string }[] };
    linkCrawl: { totalChecked: number; non200: unknown[]; verdict: string };
    contactFormTest: { submittedAt: string; payload: string; response: string; verdict: string };
  };
  seo: {
    perRoute: SeoEntry[];
    fixesNeeded: string[];
    aiCitationPosture: {
      thesis: string;
      winnableQueries: { q: string; rationale: string }[];
      needsClientWork: string[];
      v1_1_recommendations: string[];
      wpSiteDiff: string;
    };
  };
  editorialDrift: DriftItem[];
};

function verdictClass(verdict: string): string {
  if (verdict.startsWith("PASS")) return "verdict-pass";
  if (verdict.startsWith("PARTIAL")) return "verdict-partial";
  return "verdict-fail";
}

function fmtKb(b: number): string {
  return `${(b / 1024).toFixed(0)} KB`;
}

function ScreenshotPair({ name, label }: { name: string; label: string }) {
  return (
    <>
      <h4>{label} — desktop (1280)</h4>
      <div className="audit-pair">
        <a href={`/audit/screenshots/comp/${name}-desktop.jpeg`} target="_blank" rel="noopener noreferrer">
          <figure>
            <figcaption>Comp</figcaption>
            <img src={`/audit/screenshots/comp/${name}-desktop.jpeg`} alt={`${label} comp desktop`} loading="lazy" />
          </figure>
        </a>
        <a href={`/audit/screenshots/build/${name}-desktop.jpeg`} target="_blank" rel="noopener noreferrer">
          <figure>
            <figcaption>Build · {label}</figcaption>
            <img src={`/audit/screenshots/build/${name}-desktop.jpeg`} alt={`${label} build desktop`} loading="lazy" />
          </figure>
        </a>
      </div>
      <h4>{label} — mobile (375)</h4>
      <div className="audit-pair">
        <a href={`/audit/screenshots/comp/${name}-mobile.jpeg`} target="_blank" rel="noopener noreferrer">
          <figure>
            <figcaption>Comp</figcaption>
            <img src={`/audit/screenshots/comp/${name}-mobile.jpeg`} alt={`${label} comp mobile`} loading="lazy" />
          </figure>
        </a>
        <a href={`/audit/screenshots/build/${name}-mobile.jpeg`} target="_blank" rel="noopener noreferrer">
          <figure>
            <figcaption>Build · {label}</figcaption>
            <img src={`/audit/screenshots/build/${name}-mobile.jpeg`} alt={`${label} build mobile`} loading="lazy" />
          </figure>
        </a>
      </div>
    </>
  );
}

function FeedbackBlock({ section }: { section: string }) {
  return (
    <p className="audit-feedback">
      <strong>Design feedback for §{section}:</strong> paste in next chat turn with Ron, prefixed{" "}
      <code style={{ background: "var(--navy)", padding: "2px 6px", borderRadius: 3 }}>§{section}</code> ·{" "}
      route or row, then the note.
    </p>
  );
}

export default function AuditPage() {
  return (
    <>
      <div className="audit-stripe">Internal Review · Not For Client · noindex,nofollow</div>
      <Header />

      <main className="audit-page">
        <div className="audit-container">
          <h1 className="audit-h1">
            <span className="green">Audit</span> · v1 Build, Pass 1
          </h1>
          <div className="audit-meta">
            <dl>
              <dt>Preview URL</dt>
              <dd><a href={v.meta.previewUrl} style={{ color: "var(--on-dark)" }}>{v.meta.previewUrl}</a></dd>
              <dt>Build SHA</dt>
              <dd>{v.meta.buildSha}</dd>
              <dt>Captured at</dt>
              <dd>{v.meta.capturedAt}</dd>
              <dt>Audit version</dt>
              <dd>{v.meta.version}</dd>
            </dl>
            <details className="audit-collapse" style={{ marginTop: "var(--space-4)" }}>
              <summary>Capture methodology (tools, viewports, throttling)</summary>
              <dl style={{ marginTop: "var(--space-3)" }}>
                {Object.entries(v.meta.tooling).map(([k, val]) => (
                  <span key={k} style={{ display: "block", marginBottom: "var(--space-2)" }}>
                    <strong style={{ color: "var(--green)" }}>{k}:</strong>{" "}
                    <span style={{ color: "var(--on-dark-2)" }}>{val}</span>
                  </span>
                ))}
              </dl>
            </details>
          </div>

          {/* TOC */}
          <nav className="audit-toc" aria-label="Sections">
            <a href="#visual">§1 Visual Fidelity</a>
            <a href="#photos">§2 Photos</a>
            <a href="#content">§3 Content</a>
            <a href="#technical">§4 Technical</a>
            <a href="#seo">§5 SEO/GEO</a>
            <a href="#drift">§6 Editorial Drift</a>
          </nav>

          {/* §1 Visual Fidelity */}
          <section id="visual" className="audit-section">
            <h2><span className="num">1</span>Visual Fidelity</h2>
            <p className="sub">{v.visualFidelity._note}</p>

            {v.visualFidelity.routes.map((route) => (
              <div key={route.name} className="audit-route">
                <div className="label">{route.label}</div>
                <div className="source">comp source: {route.compSource}</div>

                <ScreenshotPair name={route.name} label={route.label} />

                <ul className="audit-notes">
                  {route.notes.map((n, i) => (
                    <li key={i}>
                      <span className={`tag ${n.kind}`}>{n.kind}</span>
                      <span>{n.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <FeedbackBlock section="1" />
          </section>

          {/* §2 Photo Audit */}
          <section id="photos" className="audit-section">
            <h2><span className="num">2</span>Photo Audit</h2>
            <p className="sub">
              Inventory of every photo currently used. Strong / adequate / weak ratings. Half-day shoot wishlist for
              the photos that would meaningfully lift the site if Eli does one shoot.
            </p>

            <h3>Inventory</h3>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Dimensions</th>
                  <th>Size</th>
                  <th>Verdict</th>
                  <th>Use</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {v.photoAudit.inventory.map((p) => (
                  <tr key={p.filename}>
                    <td><code>{p.filename}</code></td>
                    <td>{p.dimensions}</td>
                    <td>{fmtKb(p.bytes)}</td>
                    <td><span className={`judgment-${p.judgment}`}>{p.judgment}</span></td>
                    <td>{p.use}</td>
                    <td>{p.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="audit-callout">
              <strong>Filename-vs-content fix:</strong> {v.photoAudit.filenameContentNote}
            </div>

            <h3>Half-day shoot wishlist (priority order)</h3>
            <ol className="audit-wishlist">
              {v.photoAudit.halfDayShootWishlist.map((w) => (
                <li key={w.rank}>
                  <span className="rank">{w.rank}</span>
                  <div>
                    <p className="subject">{w.subject}</p>
                    <p className="why">{w.why}</p>
                    <p className="ref">{w.ref}</p>
                  </div>
                </li>
              ))}
            </ol>

            <FeedbackBlock section="2" />
          </section>

          {/* §3 Content Status */}
          <section id="content" className="audit-section">
            <h2><span className="num">3</span>Content Status</h2>
            <p className="sub">
              Every <code>&lt;DraftField&gt;</code>, every <code>_placeholder: true</code>, every analogous fill —
              consolidated into one checklist. Goal: Eli has a sequence of yes/no answers, not a scavenger hunt.
            </p>

            <table className="audit-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Section</th>
                  <th>Field</th>
                  <th>Current</th>
                  <th>Source</th>
                  <th>Eli question</th>
                </tr>
              </thead>
              <tbody>
                {v.contentStatus.items.map((item, i) => (
                  <tr key={i}>
                    <td><code>{item.route}</code></td>
                    <td>{item.section}</td>
                    <td>{item.field}</td>
                    <td>{item.currentValue}</td>
                    <td>{item.source}</td>
                    <td>{item.question}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <FeedbackBlock section="3" />
          </section>

          {/* §4 Technical */}
          <section id="technical" className="audit-section">
            <h2><span className="num">4</span>Technical</h2>
            <p className="sub">Lighthouse, schema, console, links, form. {v.technical.lighthouse._note}</p>

            <h3>Lighthouse · mobile</h3>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Perf (≥90)</th>
                  <th>A11y (≥95)</th>
                  <th>BP (≥95)</th>
                  <th>SEO (=100)</th>
                  <th>LCP</th>
                  <th>CLS</th>
                  <th>TBT</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {v.technical.lighthouse.results.map((r) => (
                  <tr key={r.route}>
                    <td><code>{r.route}</code></td>
                    <td>{r.performance}</td>
                    <td>{r.accessibility}</td>
                    <td>{r.bestPractices}</td>
                    <td>{r.seo}</td>
                    <td>{r.lcp}</td>
                    <td>{r.cls}</td>
                    <td>{r.tbt}</td>
                    <td><span className={verdictClass(r.verdict)}>{r.verdict}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="audit-callout">
              <strong>Worst route:</strong> {v.technical.lighthouse.worstRoute}. {v.technical.lighthouse.summary}
            </p>

            <h3>Schema.org</h3>
            <h4>Emitted</h4>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Types</th>
                  <th>Validation</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {v.technical.schemaOrg.emitted.map((s) => (
                  <tr key={s.route}>
                    <td><code>{s.route}</code></td>
                    <td>{s.types.join(", ")}</td>
                    <td style={{ fontSize: 12 }}>{s.validates}</td>
                    <td>{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Missing — recommended for v1.1</h4>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Route</th>
                  <th>Rationale</th>
                </tr>
              </thead>
              <tbody>
                {v.technical.schemaOrg.missing.map((s, i) => (
                  <tr key={i}>
                    <td><code>{s.type}</code></td>
                    <td>{s.route}</td>
                    <td>{s.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Console errors per route</h3>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Errors</th>
                  <th>Warnings</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {v.technical.consoleErrors.perRoute.map((c) => (
                  <tr key={c.route}>
                    <td><code>{c.route}</code></td>
                    <td>{c.errors}</td>
                    <td>{c.warnings}</td>
                    <td>{c.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Internal-link crawl</h3>
            <p className="audit-callout">
              <strong>{v.technical.linkCrawl.verdict}</strong> · {v.technical.linkCrawl.totalChecked} hrefs checked
              across the 7 routes.
            </p>

            <h3>Contact-form end-to-end test</h3>
            <p className="audit-callout">
              <strong>{v.technical.contactFormTest.verdict}</strong>
              <br />
              Submitted at {v.technical.contactFormTest.submittedAt}.
              <br />
              Payload: <code>{v.technical.contactFormTest.payload}</code>
              <br />
              Response: <code>{v.technical.contactFormTest.response}</code>
            </p>

            <FeedbackBlock section="4" />
          </section>

          {/* §5 SEO/GEO */}
          <section id="seo" className="audit-section">
            <h2><span className="num">5</span>SEO/GEO Posture</h2>
            <p className="sub">
              Per-route metadata, schema coverage, and a candid read on AI-citation surfaces — restaurants are a
              different game than the contractor sites GRM has been shipping.
            </p>

            <h3>Per-route metadata</h3>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>OG image</th>
                  <th>Canonical</th>
                  <th>H1</th>
                  <th>JSON-LD</th>
                </tr>
              </thead>
              <tbody>
                {v.seo.perRoute.map((r) => (
                  <tr key={r.route}>
                    <td><code>{r.route}</code></td>
                    <td>{r.title}</td>
                    <td style={{ maxWidth: 320 }}>{r.description}</td>
                    <td style={{ width: 80 }}>
                      <img src={r.ogImage} alt="" style={{ width: 60, height: "auto", borderRadius: 2, border: "1px solid var(--navy-line)" }} loading="lazy" />
                    </td>
                    <td>{r.canonical || <span style={{ color: "var(--red)" }}>(none)</span>}</td>
                    <td>{r.h1}</td>
                    <td>{r.jsonLd.length > 0 ? r.jsonLd.join(", ") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>SEO fixes needed</h3>
            <ul style={{ paddingLeft: "var(--space-5)", color: "var(--on-dark-2)", fontSize: 14, lineHeight: 1.6 }}>
              {v.seo.fixesNeeded.map((f, i) => (<li key={i} style={{ marginBottom: "var(--space-2)" }}>{f}</li>))}
            </ul>

            <h3>AI-citation posture (candid)</h3>
            <p className="audit-callout">
              <strong>Thesis vs. reality:</strong> {v.seo.aiCitationPosture.thesis}
            </p>

            <h4>Queries terrys.place can plausibly compete on</h4>
            <table className="audit-table">
              <thead>
                <tr><th>Query</th><th>Rationale</th></tr>
              </thead>
              <tbody>
                {v.seo.aiCitationPosture.winnableQueries.map((q, i) => (
                  <tr key={i}>
                    <td><code>{q.q}</code></td>
                    <td>{q.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Needs client-side work (outside this build's scope)</h4>
            <ul style={{ paddingLeft: "var(--space-5)", color: "var(--on-dark-2)", fontSize: 14, lineHeight: 1.6 }}>
              {v.seo.aiCitationPosture.needsClientWork.map((w, i) => (<li key={i} style={{ marginBottom: "var(--space-2)" }}>{w}</li>))}
            </ul>

            <h4>Recommended for v1.1</h4>
            <ul style={{ paddingLeft: "var(--space-5)", color: "var(--on-dark-2)", fontSize: 14, lineHeight: 1.6 }}>
              {v.seo.aiCitationPosture.v1_1_recommendations.map((r, i) => (<li key={i} style={{ marginBottom: "var(--space-2)" }}>{r}</li>))}
            </ul>

            <h4>Existing WP terrys.place — replacement diff</h4>
            <p className="audit-callout">{v.seo.aiCitationPosture.wpSiteDiff}</p>

            <FeedbackBlock section="5" />
          </section>

          {/* §6 Editorial Drift */}
          <section id="drift" className="audit-section">
            <h2><span className="num">6</span>Editorial Drift</h2>
            <p className="sub">
              Every place Code made a judgment call beyond literal lift-from-comp. Each is an explicit ask for Design
              to keep, revise, or override.
            </p>

            <ol className="audit-drift">
              {v.editorialDrift.map((d, i) => (
                <li key={i}>
                  <p className="what">{d.what}</p>
                  <dl>
                    <dt>Comp/spec said</dt>
                    <dd>{d.compSpec}</dd>
                    <dt>Shipped</dt>
                    <dd>{d.shipped}</dd>
                    <dt>Why</dt>
                    <dd>{d.why}</dd>
                  </dl>
                </li>
              ))}
            </ol>

            <FeedbackBlock section="6" />
          </section>

          <p className="audit-footer">
            Build {v.meta.buildSha} · captured {v.meta.capturedAt} · {v.meta.previewUrl}
            <br />
            Internal review only — `&lt;meta name=&quot;robots&quot; content=&quot;noindex,nofollow&quot;&gt;` on this route, plus disallow in /robots.txt.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

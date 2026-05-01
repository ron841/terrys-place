import Image from "next/image";
import Link from "next/link";
import { site, hours, legal } from "@/lib/content";

/**
 * Site footer — 4-column grid with brand mark, visit, hours, menu/more.
 *
 * Lifted from Home.html § .footer. Hours rendered from content/hours.json
 * via tiny formatHours helper to keep one source of truth.
 */

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function fmt12(hm: string): string {
  const [h, m] = hm.split(":").map(Number);
  const wraps = h >= 24 ? h - 24 : h;
  const period = wraps >= 12 ? "p" : "a";
  const hh = wraps === 0 ? 12 : wraps > 12 ? wraps - 12 : wraps;
  return m === 0 ? `${hh}${period}` : `${hh}:${m.toString().padStart(2, "0")}${period}`;
}

function hoursLines(): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  // Group consecutive identical hour ranges.
  type Run = { start: number; end: number; open: string; close: string };
  const runs: Run[] = [];
  for (let i = 0; i < 7; i++) {
    const dayKey = String(i) as "0" | "1" | "2" | "3" | "4" | "5" | "6";
    const slot = hours[dayKey];
    if (!slot) continue;
    const last = runs.at(-1);
    if (last && last.open === slot.open && last.close === slot.close && last.end === i - 1) {
      last.end = i;
    } else {
      runs.push({ start: i, end: i, open: slot.open, close: slot.close });
    }
  }
  for (const r of runs) {
    const label = r.start === r.end ? DOW[r.start] : `${DOW[r.start]} – ${DOW[r.end]}`;
    out.push({ label, value: `${fmt12(r.open)}–${fmt12(r.close)}` });
  }
  return out;
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="t-container">
        <div className="footer-grid">
          <div>
            <Image
              src={site.logo.primary}
              alt={site.name}
              width={429}
              height={136}
              className="footer-mark"
            />
            <p className="t-body" style={{ color: "var(--on-dark-2)", maxWidth: "32ch" }}>
              {site.footerTagline}
            </p>
          </div>

          <div>
            <h3>Visit</h3>
            <ul>
              <li>{site.address.street}</li>
              <li>{site.address.city}, {site.address.region} {site.address.postal}</li>
              <li><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></li>
              <li><Link href="/visit">Get directions</Link></li>
            </ul>
          </div>

          <div>
            <h3>Hours</h3>
            <ul>
              {hoursLines().map((l, i) => (
                <li key={i}>{l.label} · {l.value}</li>
              ))}
              <li style={{ color: "var(--green)", marginTop: "var(--space-3)" }}>
                Happy Hour {hours.happyHour.label.replace(/^Mon–Fri\s+/, "Mon–Fri ")}
              </li>
            </ul>
          </div>

          <div>
            <h3>Menu &amp; More</h3>
            <ul>
              <li><Link href="/menu">Full Menu</Link></li>
              <li><a href={site.menuPdf} target="_blank" rel="noopener noreferrer">PDF Menu</a></li>
              <li><Link href="/specials">Daily Lunch ($10.50)</Link></li>
              <li><Link href="/contact?topic=Catering">Catering &amp; Parties</Link></li>
              {site.social.facebook && (
                <li>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook ↗
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{legal.copyright}</span>
          <span>
            <a href={legal.creditUrl} style={{ color: "var(--green)" }}>{legal.credit}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

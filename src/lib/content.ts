/**
 * Typed loaders for the content/*.json files. Static imports — resolved at
 * build time, no runtime IO. Each export is the parsed JSON typed against
 * the shape we ship in CMS_SCHEMA.json.
 *
 * If you find a field here that disagrees with CMS_SCHEMA, CMS_SCHEMA wins
 * and this file should be patched. See SLOT_RECONCILIATION.md.
 */

import siteJson from "@content/site.json";
import hoursJson from "@content/hours.json";
import tonightJson from "@content/tonight.json";
import menuJson from "@content/menu.json";
import aboutJson from "@content/about.json";
import eventsJson from "@content/events.json";
import specialsJson from "@content/specials.json";
import sportsJson from "@content/sports.json";
import newsJson from "@content/news.json";
import formsJson from "@content/forms.json";
import seoJson from "@content/seo.json";
import legalJson from "@content/legal.json";
import auditJson from "@content/audit.json";

// ---------- Types ---------------------------------------------------

export type Site = {
  name: string;
  tagline: string;
  footerTagline: string;
  estYear: number;
  phone: string;
  phoneDisplay: string;
  address: {
    street: string;
    city: string;
    region: string;
    postal: string;
    geo: { lat: number; lng: number };
  };
  email: { general: string | null; events: string | null; press: string | null };
  social: { facebook: string | null; instagram: string | null; tiktok: string | null };
  timezone: string;
  menuPdf: string;
  logo: { primary: string; mobile: string; favicon: string };
};

export type DayHours = { open: string; close: string } | null;
export type Hours = {
  /** keyed by Date.getDay() integer 0=Sun..6=Sat */
  [k in "0" | "1" | "2" | "3" | "4" | "5" | "6"]: DayHours;
} & {
  happyHour: { days: number[]; label: string; open: string; close: string };
  kitchenClosesBeforeBar: string;
};

export type TonightCell = {
  tag: "Tonight" | "This Week" | "Kitchen" | "Bar";
  title: string;
  meta?: string;
};

export type MenuItem = {
  name: string;
  note?: string;
  price?: number;
  pricing?: { size: string; price: number }[];
  tags?: ("GF" | "VG" | "V" | "spicy" | "house-favorite" | "new")[];
  featured?: boolean;
};

export type MenuSection = {
  id: string;
  title: string;
  intro?: string;
  items: MenuItem[];
  addons?: MenuItem[];
};

export type Menu = {
  lastUpdated: string;
  source: string;
  sections: MenuSection[];
  lunchSpecial: {
    price: number;
    window: string;
    days: { day: string; item: string }[];
  };
  drinks: { draft: string; wine: string; liquor: string; non_alcoholic: string };
  footnote: string;
  consumerNotice: string;
  steakTemperatures: { label: string; desc: string }[];
};

export type FamilyMember = {
  name: string | null;
  role: string;
  photo: string | null;
  since: number | null;
  /** True when the name + meta are placeholders pending client confirmation. */
  _placeholder?: boolean;
  /** Label used inside the DraftField pill when name is null, e.g. "[OWNER NAME PENDING]". */
  _pendingLabel?: string;
};

export type StoryRow = {
  kicker: string;
  /** Title with inline HTML (e.g. <span class="green">…</span>). Renders with dangerouslySetInnerHTML. */
  title: string;
  body: string[];
  image: string;
  imageAlt: string;
  pullQuote?: string;
  flip: boolean;
};

export type About = {
  lede: string;
  story: string;
  pullQuote: string;
  storyRows: StoryRow[];
  timeline: { year: number; what: string }[];
  stats: { num: string; label: string }[];
  family: FamilyMember[];
  groupPhoto: { src: string; alt: string };
};

export type Event = {
  day: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  title: string;
  kind: string;
  time: string;
  note: string;
  hot: boolean;
};

export type Events = {
  weekly: Event[];
  specialDates: { date: string; title: string; note: string }[];
  marquee: string[];
};

export type Specials = {
  weekday: { label: string; window: string; days: { day: string; item: string }[] };
  weekend: {
    label: string;
    window: string;
    items: { name: string; price?: number; note?: string }[];
    image: string;
  };
  happyHour: { label: string; window: string };
};

export type Sports = {
  tagline: string;
  tvCount: number;
  highlights: string[];
  rooms: { name: string; note: string }[];
  lineup: { time: string; matchup: string; league: string; _placeholder?: boolean }[];
  lineupHeadline?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readMins: number;
  url: string | null;
};

export type Forms = {
  contact: {
    endpoint: string;
    recipientEnvVar: string;
    accessKeyEnvVar: string;
    topics: string[];
    fields: string[];
    successRedirect: string;
    errorRedirect: string;
  };
};

export type SeoEntry = {
  title: string;
  description: string;
  ogImage?: string;
};

export type Seo = {
  _defaults: { ogImage: string; twitterCard: string; siteName: string };
  routes: Record<string, SeoEntry>;
};

export type Legal = { copyright: string; credit: string; creditUrl: string };

// ---------- Exports -------------------------------------------------

export const site = siteJson as unknown as Site;
export const hours = hoursJson as unknown as Hours;
export const tonight = tonightJson as unknown as { cells: TonightCell[] };
export const menu = menuJson as unknown as Menu;
export const about = aboutJson as unknown as About;
export const events = eventsJson as unknown as Events;
export const specials = specialsJson as unknown as Specials;
export const sports = sportsJson as unknown as Sports;
export const news = newsJson as unknown as { recent: NewsItem[] };
export const forms = formsJson as unknown as Forms;
export const seo = seoJson as unknown as Seo;
export const legal = legalJson as unknown as Legal;

// Audit content is structured but the shape is flat/data-y — typed loosely
// to keep the audit page rendering free-form without dragging the whole
// shape into the type system.
export const audit = auditJson as unknown as {
  meta: Record<string, unknown>;
  visualFidelity: { _note?: string; routes: unknown[] };
  photoAudit: { _note?: string; inventory: unknown[]; halfDayShootWishlist: unknown[]; filenameContentNote: string };
  contentStatus: { _note?: string; items: unknown[] };
  technical: Record<string, unknown>;
  seo: Record<string, unknown>;
  editorialDrift: unknown[];
};

/** SEO entry helper with merge to defaults. */
export function seoFor(route: string): SeoEntry & {
  ogImage: string;
  siteName: string;
  twitterCard: string;
} {
  const entry = seo.routes[route] ?? {
    title: site.name,
    description: site.footerTagline,
  };
  return {
    ...entry,
    ogImage: entry.ogImage ?? seo._defaults.ogImage,
    siteName: seo._defaults.siteName,
    twitterCard: seo._defaults.twitterCard,
  };
}

/**
 * Schema.org JSON-LD builders for Terry's Place.
 *
 * - Restaurant on the home page (LocalBusiness with full hours, geo, etc.)
 * - Menu on /menu (with MenuSection + MenuItem)
 *
 * Renders inline via <script type="application/ld+json"> tags in each page.
 */

import { site, hours, menu } from "./content";

const BASE = "https://terrys.place";
const DAY_KEYS = ["0", "1", "2", "3", "4", "5", "6"] as const;
const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
] as const;

function clipPastMidnight(close: string): string {
  const [h, m] = close.split(":").map(Number);
  if (h >= 24) {
    const wraps = h - 24;
    return `${wraps.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
  return close;
}

export function restaurantSchema(): object {
  const openingHoursSpec = DAY_KEYS.flatMap((k, i) => {
    const slot = (hours as unknown as Record<string, { open: string; close: string } | null>)[k];
    if (!slot) return [];
    return [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_NAMES[i],
      opens: slot.open,
      closes: clipPastMidnight(slot.close),
    }];
  });

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${BASE}/#restaurant`,
    name: site.name,
    alternateName: `${site.name} ${site.tagline}`,
    description: `Family-run sports bar and grill in Ocala, FL since ${site.estYear}.`,
    url: BASE,
    telephone: site.phone,
    image: [`${BASE}/assets/photo-room-hero.jpg`],
    logo: `${BASE}${site.logo.primary}`,
    priceRange: "$$",
    servesCuisine: ["American", "Pub Food", "Bar Food"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    openingHoursSpecification: openingHoursSpec,
    hasMenu: `${BASE}/menu`,
    menu: `${BASE}${site.menuPdf}`,
    foundingDate: `${site.estYear}-01-01`,
    sameAs: [site.social.facebook, site.social.instagram, site.social.tiktok].filter(Boolean) as string[],
    paymentAccepted: "Cash, Credit Card",
    smokingAllowed: false,
  };
}

export function menuSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${BASE}/menu#menu`,
    name: `${site.name} Menu`,
    inLanguage: "en-US",
    hasMenuSection: menu.sections.map((section) => ({
      "@type": "MenuSection",
      "@id": `${BASE}/menu#${section.id}`,
      name: section.title,
      description: section.intro,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.note,
        offers: typeof item.price === "number"
          ? { "@type": "Offer", price: item.price.toFixed(2), priceCurrency: "USD" }
          : item.pricing
            ? item.pricing.map((p) => ({
                "@type": "Offer",
                name: p.size,
                price: p.price.toFixed(2),
                priceCurrency: "USD",
              }))
            : undefined,
      })),
    })),
  };
}

/** Drop into a JSX page: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(obj) }} /> */
export function jsonLd(obj: object): string {
  return JSON.stringify(obj);
}

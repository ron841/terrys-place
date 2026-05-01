# Terry's Place — Engineer Handoff

> **You are the engineer. This doc gets you productive in 60 seconds.** For data shapes go to `SLOTS.md`. For "what photo goes where" go to `CONTENT-INVENTORY.md`. For visual reference open the `.html` files in any browser.

---

## TL;DR

- **Client:** Terry's Place — sports bar & grill, Ocala FL, est. 1980, family-run, 3 generations.
- **Stack:** WordPress + custom theme (replacing the existing terrys.place site).
- **Brand colors:** Navy `#1E193D` (page surface), Green `#49E26D` (CTAs, brand), Red `#E04040` (emphasis only).
- **Display type:** Luckiest Guy (CAPS only — matches the wordmark face). **Body:** Open Sans. **Mono:** JetBrains Mono. **Hand:** Indie Flower.
- **Source of truth for tokens:** `css/terrys.css`. Drop it into the theme as-is.
- **Source of truth for data:** `SLOTS.md`. Every dynamic slot has a shape, source, and fallback.

---

## What's in the package

```
terrys-handoff/
├── Index.html              ← cover + reading order for this pack
├── Home.html               ← /index comp (1440 desktop)
├── Menu.html                ← /menu comp, real items + prices
├── Inner Pages.html         ← /about, /specials, /sports, /visit, /contact stacked
├── Components.html          ← visual + class-name library
├── css/terrys.css           ← tokens + semantic classes (drop into theme)
├── assets/                  ← real photos + logo + menu PDF
├── SLOTS.md                 ← data contracts
├── CONTENT-INVENTORY.md     ← what's real / placeholder / missing
├── CMS_SCHEMA.json          ← proposed CPT + ACF structure
└── _archive/                ← earlier (cream) design direction, ignore
```

---

## Audit of the live site (terrys.place)

The live site uses the same Luckiest Guy + Open Sans + Indie Flower stack and a navy/green palette — we are **not** changing the brand, we're rebuilding it cleanly. What's broken on the live site:

- **No live status** — the site doesn't tell you if Terry's is open right now.
- **Events buried** — weekly events (karaoke, trivia, football) live on the Facebook page, not the site.
- **Menu hard to scan** — currently just a PDF link. We're rendering it as native HTML for SEO + mobile.
- **No clear path to call** — phone is in the topbar but not prominent on mobile. We made it a green pill in the nav.
- **Sports schedule absent** — 22 TVs is a selling point that's invisible.

The new build inverts these: live status pill in the hero, weekly grid on the home page, native HTML menu, sticky phone CTA, sports/TV section.

---

## Token map (theme integration)

```css
/* Surfaces */
--navy:        #1E193D;   /* page bg */
--navy-2:      #15112B;   /* footer / inset */
--navy-3:      #2A2452;   /* card / hover */
--navy-line:   #3A3270;

/* Brand */
--green:       #49E26D;   /* CTAs */
--green-2:     #2FBF52;   /* hover */
--red:         #E04040;   /* emphasis only */

/* Type */
--font-display: "Luckiest Guy", system-ui;     /* CAPS, headlines */
--font-body:    "Open Sans", system-ui;         /* body, UI */
--font-cond:    "Open Sans Condensed";          /* eyebrows */
--font-mono:    "JetBrains Mono";                /* hours, prices */
--font-hand:    "Indie Flower";                   /* pull quotes */
```

Self-host the fonts in production. The CDN `@import` in `css/terrys.css` is for preview only.

---

## Component classes (semantic, prefixed `t-`)

| Class | Purpose |
|---|---|
| `t-hero` / `t-display` / `t-h1`–`t-h3` | Type scale (Luckiest Guy + Open Sans) |
| `t-lede` / `t-body` / `t-eyebrow` / `t-mono` / `t-hand` | Body roles |
| `t-btn` `.t-btn--primary` `.t-btn--ghost` `.t-btn--hot` | CTAs |
| `t-live` `.t-live--lastcall` `.t-live--closed` | Live status pill |
| `t-sticker` `.t-sticker--green` | Comic-book label chips |
| `t-menu-row` | Dot-leader menu row |
| `t-marquee` `.t-marquee-track` | News ticker |
| `t-squiggle` | Section divider (uses `assets/divider-swoosh.png`) |
| `t-card` `.t-card--bordered` | Lifted surface on navy |
| `t-container` / `t-section` | Layout |

Full reference + states: `Components.html`.

---

## Data — read SLOTS.md

Every page has dynamic slots that need wiring. Don't guess — `SLOTS.md` has the JSON shape, source, and fallback for each one. Highlights:

- **`hours`** — single source of truth, drives the live status pill, footer hours, and "Tonight" card.
- **`events`** — WordPress CPT, queried by current week. Drives the Home week grid + marquee.
- **`menuItems`** — initial seed parsed from `assets/menu-2025.pdf`, then editable via WP CPT. Drives `/menu` page + Home signature picks.
- **`tonight`** — single CMS field, fallback to "Kitchen open till Xpm" if empty.
- **`news`** — latest 3 posts, auto-queried.

---

## Build sequence

1. Spin up the WP theme. Drop `css/terrys.css` in as the theme's base CSS. Self-host the fonts.
2. Build the **header + footer** components — they're the same on every page (see all `.html` comps).
3. Build the **CPTs** per `CMS_SCHEMA.json`: `event`, `menu_item`, `menu_section`, `special`, `news_post`. Plus a settings panel for `hours`, `tonight`, address/phone.
4. Build **`/index`** (Home.html) — hardest page. Live status pill, week grid, marquee all wire to data.
5. Build **`/menu`** — anchor nav + menu rows, fed by `menuItems`.
6. Build **`/about`, `/specials`, `/sports`, `/visit`, `/contact`** — patterns are all in `Inner Pages.html`.
7. Wire **forms** — contact form posts to email + saves to WP. Topic dropdown values fixed.
8. **QA against `CONTENT-INVENTORY.md`** — make sure every "real" asset is in place and every "placeholder" is flagged for the client to fill.

---

## Things the client owes us

See `CONTENT-INVENTORY.md` for the full list. Critical-path items:

- Real photos of: dining room (current photo is OK but better lighting wanted), exterior storefront, owner family portrait.
- Confirmed hours JSON (the comp uses what's on the live site — verify with Terry Jr.).
- A first batch of events for week 1 of launch.

---

## Out of scope (v1)

- Online ordering (link to ChowNow / Toast in v2 if they pick a vendor)
- Reservations system (party-of-6+ via phone for now)
- Newsletter signup (we'll add it post-launch)
- E-commerce (merch hats are sold in-store only)

---

## Open questions for design (me)

If during build you find a slot that's not in `SLOTS.md`, or a state I didn't draw (empty list, error fetching events, etc.), kick it back and I'll either spec it or tell you to ship a sensible default. Don't invent visuals — flag and we'll resolve.

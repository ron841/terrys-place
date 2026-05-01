# Terry's Place — Slots Manifest

**Purpose:** every dynamic slot in the design, with the data shape, source-of-truth, what it feeds, and what to render when empty. This is the bridge between design and code.

**Reading order:** start at "Globals" (used everywhere). Then per-page slots. Then "Backlog / not yet wired."

**Notation:** `// inline comments` are notes for Code; they are not part of the JSON.

---

## Globals — used on every page

### `siteSettings`
Hard-coded site identity. Lives in WP options or a single JSON file.

```jsonc
{
  "name":     "Terry's Place",
  "tagline":  "Sports Bar & Grill",
  "established": 1980,
  "address": {
    "street": "4121 NE 36th Ave",
    "city":   "Ocala",
    "state":  "FL",
    "zip":    "34479",
    "geo":    { "lat": 29.2417, "lng": -82.0719 } // approx — verify
  },
  "phone":    "+13527323820",     // E.164, single source of truth
  "phoneDisplay": "(352) 732-3820",
  "email":    null,                // none on live site — confirm w/ client
  "social": {
    "facebook":  null,             // live site has href="#" — needs real URL
    "instagram": null,
    "tiktok":    null
  },
  "menuPdf":  "/assets/menu-2025.pdf",
  "logo": {
    "primary":  "/assets/logo-wordmark.png",       // 858×272, transparent
    "mobile":   "/assets/logo-wordmark-mobile.png",
    "favicon":  "/assets/favicon-32.png"
  }
}
```

**Owner:** client provides social URLs + email; everything else is locked at handoff.

### `hours`
The single source of truth for every time-related render: live status pill, footer, "Tonight at Terry's", schema.org markup.

```jsonc
{
  "hours": {
    "sun": [{ "open": "11:00", "close": "21:00" }],
    "mon": [{ "open": "11:00", "close": "21:00" }],
    "tue": [{ "open": "11:00", "close": "24:00" }],
    "wed": [{ "open": "11:00", "close": "22:00" }],
    "thu": [{ "open": "11:00", "close": "22:00" }],
    "fri": [{ "open": "11:00", "close": "25:00" }], // 1am next day
    "sat": [{ "open": "11:00", "close": "24:00" }]  // MISSING on live site, confirm w/ client
  },
  "happyHour": { "days": ["mon","tue","wed","thu","fri"], "open": "15:00", "close": "19:00" },
  "kitchenCloses": "30min before close", // confirm — live site doesn't say
  "timezone": "America/New_York"
}
```

**Feeds:** `liveStatusPill`, `footerHours`, `tonightCard`, `schema.org/OpeningHoursSpecification`.
**Owner:** client confirms Saturday + kitchen-close offset. Code computes "Open Now / Closing Soon / Closed" from this + browser time.

### `liveStatusPill`
Computed, not stored. Logic:

```
let now = current time in America/New_York
let today = hours[dow(now)]
if no today: render "Closed Today"
if now < today.open: render "Opens at HH:MM"
if now > today.close: render "Closed · Opens [next day name] at HH:MM"
if (today.close - now) < 60min: render "Last Call · Closes HH:MM" + class .t-live--lastcall
else: render "Open Now · Closes HH:MM"
```

**Renders in:** hero, every page header (mobile collapses to dot indicator only).

---

## Page: Home

### `heroCard` ("Tonight at Terry's")
The right-rail card under the hero. Manually curated by the client weekly — surfaces the *one thing* that's most relevant tonight.

```jsonc
{
  "label": "Tonight at Terry's",       // static label
  "leadLine":  "🏈 NFL Sunday Ticket on every screen", // primary line, with optional emoji
  "supportLine": "Wings & pitcher special $29.99. Kitchen open till 9pm.",
  "rows": [                            // 4 metadata rows, computed where possible
    { "label": "Now",       "value": "auto" },        // computed from clock
    { "label": "Crowd",     "value": "Steady · ~30 min wait" }, // manual or omit
    { "label": "Last call", "value": "auto" },        // computed
    { "label": "Hours",     "value": "auto" }         // computed
  ]
}
```

**Source:** WP CPT `tonight_card`, single record, edited by client.
**Fallback when empty:** hide the card, expand the hero text column to full width.
**Owner:** client (weekly update); fallback so the page never looks broken.

### `marquee`
The yellow-green ticker under the hero. 4–8 short items.

```jsonc
{
  "items": [
    "Sunday Football Special",
    "$10.50 lunch Mon–Fri",
    "Happy Hour 3–7 daily",
    "Karaoke Friday Night",
    "Trivia Tuesday 7pm",
    "King-size portions since 1980"
  ]
}
```

**Source:** WP options field, repeater, max 8.
**Fallback when empty:** hide the marquee strip.
**Owner:** client. Code duplicates the array for seamless CSS animation loop.

### `weekEvents`
The 7-day grid. The whole point of the homepage refresh.

```jsonc
{
  "events": [
    {
      "id": "uuid",
      "date": "2026-05-04",            // ISO date — Code derives dow + display from this
      "kind": "Lunch Special",         // short tag, drives color
      "name": "Cheeseburger & Fries",  // short headline
      "when": "11am–3pm · $10.50",     // free-form supporting line
      "hot": false,                    // if true, render kind in red
      "url": null                      // optional link to event detail
    }
    // ...one per day, ideally 7
  ]
}
```

**Source:** WP CPT `event`, queried for the current Mon–Sun week.
**Sort:** by date ascending. Today's row highlighted automatically.
**Fallback when empty:**
- If 0 events for the week: render the "always-on" defaults (lunch specials Mon–Fri, Happy Hour daily, Football Sunday) hard-coded as static fallback.
- If <7 events: empty days render with "—" treatment, opacity 0.55, no card.

**Owner:** client adds events weekly; agency seeds the recurring "always-on" defaults at launch.

### `signatureDishes`
The 3 dish cards on the homepage. NOT auto from the menu — manually curated.

```jsonc
{
  "picks": [
    {
      "menuItemId": "belly-buster",
      "displayName": "The Belly Buster",   // can override the menu name
      "kicker":      "★ Terry's Favorite",
      "image":       "/assets/photo-staff-burger-wings.jpg",
      "priceLine":   "1lb USDA Angus chuck · crisp bacon · Swiss + American · **$10.29**" // markdown allowed
    },
    { "menuItemId": "original-wings", ... },
    { "menuItemId": "steak-night",    ... }
  ]
}
```

**Source:** WP options, 3 picks selected from `menuItems` (see Menu page).
**Fallback when empty:** hide section. Don't auto-pick — feels worse than absent.
**Owner:** agency at launch; client can swap quarterly.

### `latestNews`
The 3 news cards. Auto-pull, no curation.

```jsonc
{
  "query": "wp-posts where post_status=publish ORDER BY date DESC LIMIT 3",
  "card": {
    "image":   "post.featured_image OR fallback to default-news-hero",
    "date":    "ISO date, formatted 'Posted {Mmm} {dd} · {readingTime} read'",
    "title":   "post.title",
    "excerpt": "post.excerpt OR first 28 words of post.content"
  }
}
```

**Source:** WordPress posts.
**Fallback when fewer than 3 posts:** render only what exists; don't show empty cards.
**Reading time:** simple words/200 estimate.
**Owner:** client writes posts; code wires the query.

---

## Page: Menu

### `menuItems`
The full menu, structured. Source-of-truth replaces the PDF for on-page rendering. PDF stays as a download.

```jsonc
{
  "sections": [
    {
      "id": "appetizers",
      "name": "Appetizers",
      "intro": "Start the meal off right with one of our delicious appetizers.",
      "items": [
        {
          "id": "fried-mushrooms",
          "name": "Fried Mushrooms",
          "desc": "Fresh whole button mushrooms battered and fried golden brown, served with ranch dressing or horsey sauce.",
          "price": 9.29,
          "badges": []                // ["popular", "spicy", "terrys-favorite", "new"]
        },
        // ...
      ]
    },
    { "id": "salads",   "name": "Salads",   "items": [...] },
    { "id": "burgers",  "name": "Burgers",  "items": [...] },
    { "id": "chicken",  "name": "Chicken",  "items": [...] },
    { "id": "specials", "name": "Daily Specials", "items": [...] }
  ]
}
```

**Source:** WP CPT `menu_item` with taxonomy `menu_section`. Initial data parsed from `Terrys-Place-MENU-2025.pdf` at launch.
**Fallback:** raster of menu page 1 (`/assets/menu-page-1.jpg`) + PDF download link, if CPT is empty for any reason.
**Owner:** client maintains; agency parses initial data from PDF.

### `dailyLunch`
The $10.50 lunch program. Mon–Fri, 11–3.

```jsonc
{
  "price": 10.50,
  "window": "Mon–Fri · 11am–3pm",
  "days": [
    { "day": "Monday",    "item": "Cheeseburger & French Fries" },
    { "day": "Tuesday",   "item": "Chicken Sandwich & French Fries" },
    { "day": "Wednesday", "item": "Any Small Sub & Fries" },
    { "day": "Thursday",  "item": "Chicken Tenders & Fries" },
    { "day": "Friday",    "item": "Fish or Shrimp Po Boy & Fries" }
  ]
}
```

**Source:** WP options, single record. Hard-coded fine — changes maybe yearly.

---

## Page: Specials / Events / Sports

### `recurringPrograms`
The "always-on" weekly programs (trivia, karaoke, etc.).

```jsonc
{
  "programs": [
    { "id": "trivia",      "name": "Pub Trivia w/ Big Mike", "day": "tuesday", "time": "19:00", "kind": "trivia", "image": null },
    { "id": "karaoke",     "name": "Karaoke Night",          "day": "friday",  "time": "20:00", "kind": "karaoke", "image": null },
    { "id": "happy-hour",  "name": "Happy Hour",             "day": "weekdays","time": "15:00–19:00", "kind": "happy-hour", "image": null },
    { "id": "sun-football","name": "Sunday Football Special","day": "sunday",  "time": "all day", "kind": "football", "image": "/assets/photo-sunday-football.jpg" }
  ]
}
```

**Source:** WP CPT `program`. Edits rare. Drives the "Always-on" section + seeds `weekEvents` fallback.

### `gameSchedule`
Optional — what's on the TVs tonight.

```jsonc
{
  "tonight": [
    { "time": "13:00", "matchup": "Bucs vs. Falcons", "league": "NFL" },
    { "time": "16:25", "matchup": "Cowboys vs. Eagles", "league": "NFL" }
  ]
}
```

**Source:** could pull from a sports API at v2; v1 is manual. Treat as optional.
**Fallback:** hide if empty.

---

## Page: Visit / Contact

### `directions`
Embedded map block.

```jsonc
{
  "embedSrc": "https://www.google.com/maps/embed?pb=...",  // Code generates from address
  "directions": {
    "fromI75":   "Take exit 354 (Ocala/Silver Springs Blvd), east 6 mi, left on NE 36th Ave.",
    "fromOcala": "From downtown, take Silver Springs Blvd east, left on NE 36th Ave."
  }
}
```

**Owner:** agency writes directions; code embeds map.

### `contactForm`
Live site uses Gravity Forms. Recommend: Gravity Forms continues, or ship native form posting to client email.

```jsonc
{
  "fields": ["name", "email", "phone", "message", "topic"],
  "topics": ["General", "Catering", "Private Event", "Press"],
  "destination": "[client-email]" // client provides
}
```

---

## Page: About

### `heritageCopy`
The three-generations story. Static.

**Source:** hard-coded in template OR a single WP post with slug `about-our-story`.
**No CMS field needed at launch** — content rarely changes.

### `aboutPhotos`
3–6 photos for the about page. Curated, not a feed.

**Source:** WP options, file picker x6.
**Fallback:** the gallery photos shipped in `/assets/photo-*.jpg` rotate in.

---

## Backlog / not yet wired (call out at handoff)

| Slot | Status | Why parked |
|---|---|---|
| Online ordering | Not in scope v1 | Live site doesn't have it; out of phase 1 |
| Reservation booking | Not in scope v1 | They don't take reservations |
| Newsletter signup | Not in scope v1 | No platform yet — confirm w/ client |
| Live game ticker | Not in scope v1 | Manual only at launch |
| Loyalty / rewards | Not in scope v1 | Future phase |

---

## How Code should consume this

1. Stand up the WP CPTs and options listed above.
2. Seed initial data from `/seed/*.json` (agency provides at launch).
3. Wire each slot in the template per the "Source" line.
4. For each slot, implement the fallback so the page never looks broken when the CMS field is empty.
5. Validate the `liveStatusPill` logic matches the spec — that's the only piece with computed UI logic.

That's it. No design questions should reach the client; only content questions.

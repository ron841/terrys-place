# Terry's Place — v1 Walkthrough

> **For Design.** Here's the build, end to end, at desktop and mobile. One scroll. No need to render anything live.

The site is at **https://terrys-place.vercel.app** if you can reach it. If not, this file shows you everything inline.

| | |
|---|---|
| **Live preview** | https://terrys-place.vercel.app |
| **Captured** | 2026-05-01 |
| **State** | post all rounds: comp lift → Design feedback pass → menu rework → exterior banner → final review fixes |

---

## What you're looking at

Seven routes — `/`, `/menu`, `/about`, `/specials`, `/sports`, `/visit`, `/contact`. Each route below has a desktop screenshot (1280) and a mobile screenshot (375), plus a few notes on what's worth pointing out — the spots where we picked an angle, restored something from your comp that initially got dropped, or shipped a real photo where we'd been faking it.

The screenshots are full-page captures, so a long scroll within each cell is the whole route. Click any image to open it 1:1 in a new tab.

---

## /  ·  Home

| Desktop (1280) | Mobile (375) |
|---|---|
| [![Home desktop](public/walkthrough/screenshots/home-desktop.jpeg)](public/walkthrough/screenshots/home-desktop.jpeg) | [![Home mobile](public/walkthrough/screenshots/home-mobile.jpeg)](public/walkthrough/screenshots/home-mobile.jpeg) |

**What to look at:**

- **Hero** — wordmark photo behind the navy/green wash, the live-status pill animating top-left ("OPEN NOW · CLOSES 1:00 AM" right now because it's Friday past 11am and Friday closes at 1am Saturday), Tonight at Terry's strip on the right pulling four cells from the CMS.
- **Marquee** — "$10.50 LUNCH MON–FRI · HAPPY HOUR 3–7 DAILY · KARAOKE FRIDAY · TRIVIA TUESDAY 7PM..." running across in the green band with red ★ separators. Auto-loops via CSS.
- **This Week grid** — seven day-cells, today (Friday) highlighted with the green TODAY chip top-right. Each cell pulls the recurring weekly event from `events.json` so client edits roll through.
- **What You Came For** — three signature dishes. **First card is a `<DraftField>` placeholder** ("Belly Buster product shot pending") because we don't have a clean burger product shot yet — the rest of the staff/wings/steak photos are real Terry's content.
- **Sunday Football promo** — the dedicated two-up section restored after your feedback pass: pink promo on the left (links to `/specials`), "SUNDAY FOOTBALL, SERVED LOUD." headline on the right with the pitcher + 20 wings $29.99 line and a tel-CTA. This was missing in the first build because the comp's HTML didn't have it as a separate section — it was carried by a mis-labeled photo file. Fixed by giving it its own slot.
- **Three Generations** — staff group photo on the left, `FAMILY-RUN SINCE 1980.` on the right with the 45 / 3 / 7-day stat tiles in carded green-top-bordered containers.
- **News strip** — three cards. Agency-drafted entries for v1; Eli writes real ones at v1.5.

---

## /menu

| Desktop (1280) | Mobile (375) |
|---|---|
| [![Menu desktop](public/walkthrough/screenshots/menu-desktop.jpeg)](public/walkthrough/screenshots/menu-desktop.jpeg) | [![Menu mobile](public/walkthrough/screenshots/menu-mobile.jpeg)](public/walkthrough/screenshots/menu-mobile.jpeg) |

**What to look at:**

- **Hero** — single-column now (the Daily Lunch aside that originally lived on the right was dropped per Ron's call; lunch already shouts on the green CTA strip below and on `/specials`). No more purple gap; headline starts at the top.
- **Anchor nav** — sticky, jumps to each section. Click APPETIZERS / SALADS / BURGERS / etc. and the section title lands cleanly below the sticky bars (`scroll-margin-top` reserved 150px so titles aren't buried).
- **Menu rows — the leader pattern.** Single-priced items: `[Bold Name] [.....dots fill.....] [$9.29]` with the italic description hanging full-width below. Tier-priced items (wings 10/20/30/50, subs Sm/Lg, fish 2pc/3pc): name + dots on row 1, tier pairs in mono on row 2 (`10 $14   20 $28   30 $42   50 $70`), description below. This restructured the original `t-menu-row` so descriptions don't squeeze the dots into orphan ticks at the right edge.
- **Section count** — the comp had 4 sections; we lifted **all 7** from the actual PDF (Sandwiches, Subs, Dinners added — about 50 items total, all parsed from `Terrys-Place-MENU-2025.pdf`).
- **Daily Lunch CTA strip** — green band with the $10.50 callout halfway through the page, anchored as `#lunch`.
- **Drinks & Bar** — the wines list, draft beer mention, and Happy Hour callout, plus the consumer-notice and cash-discount footnotes from the printed menu.

---

## /about

| Desktop (1280) | Mobile (375) |
|---|---|
| [![About desktop](public/walkthrough/screenshots/about-desktop.jpeg)](public/walkthrough/screenshots/about-desktop.jpeg) | [![About mobile](public/walkthrough/screenshots/about-mobile.jpeg)](public/walkthrough/screenshots/about-mobile.jpeg) |

**What to look at:**

- **Hero** — `THREE GENERATIONS STRONG.` with the green/red wordmark stack treatment, real staff group photo on the right (the 8-staff portrait with the brushed-metal `Terry's` wall sign behind them).
- **Story rows.** Two flipped rows — `HOW IT STARTED.` and `NOW IN ROUND THREE.` Per Ron's pre-walk ruling, the agency-drafted **fabricated family names were retracted** ("Terry Sr.", "Jr.", "III (Tre)") because inventing names for a real family business reads worse than blank. The story rows now end with `[pending]` retraction lines where a named anecdote would have been; the pull quote "If a guy can't eat it all, you cooked it right." stays (no name attached).
- **Family row hidden.** The "ONE FAMILY ONE RECIPE BOX" three-portrait section was added during build but **renders only when at least one family member has both name AND photo confirmed** — currently all three are pending, so the section hides entirely. Eli's preview drops to the two story rows + footer, no red-dashed grid below the fold. Once Eli supplies a name + portrait, the section lights up automatically.

---

## /specials

| Desktop (1280) | Mobile (375) |
|---|---|
| [![Specials desktop](public/walkthrough/screenshots/specials-desktop.jpeg)](public/walkthrough/screenshots/specials-desktop.jpeg) | [![Specials mobile](public/walkthrough/screenshots/specials-mobile.jpeg)](public/walkthrough/screenshots/specials-mobile.jpeg) |

**What to look at:**

- **Six-card grid.** Five weekday lunches (Mon–Fri, $10.50, green top border) + Sunday Football (red "hot" top border, $29.99). All one-line names now ("Cheeseburger & Fries" not "& French Fries" — copy edit landed cleanly).
- **Happy Hour section.** Standalone block below the cards, mirrors the hours pattern from `/visit`. Pour list + actual pricing flagged as pending — Eli supplies.

---

## /sports

| Desktop (1280) | Mobile (375) |
|---|---|
| [![Sports desktop](public/walkthrough/screenshots/sports-desktop.jpeg)](public/walkthrough/screenshots/sports-desktop.jpeg) | [![Sports mobile](public/walkthrough/screenshots/sports-mobile.jpeg)](public/walkthrough/screenshots/sports-mobile.jpeg) |

**What to look at:**

- **`ON THE SCREENS.`** — the "22 TVs · sound on the Gators" tagline + body + a four-bullet highlights list + two CTAs (Reserve a Booth / Private Game-Day Bookings).
- **Sample lineup.** Five-row table on the right: **Florida vs. Georgia at 12pm CBS** as the marquee (the iconic Gators rivalry), then Alabama vs. Ole Miss, LSU vs. Texas A&M, Ohio State vs. Texas, Tennessee vs. Auburn. Every entry flagged `_placeholder: true`; a "Sample lineup — actual schedule posted weekly" disclaimer at the bottom of the card.
- **Pick the Room.** Four-card grid below — Bar / Dining / Billiards / Patio — with a one-line vibe note for each. This was a build add (the comp didn't have it), but it's faithful to the establishment copy on the live legacy site that emphasizes the four rooms.

---

## /visit

| Desktop (1280) | Mobile (375) |
|---|---|
| [![Visit desktop](public/walkthrough/screenshots/visit-desktop.jpeg)](public/walkthrough/screenshots/visit-desktop.jpeg) | [![Visit mobile](public/walkthrough/screenshots/visit-mobile.jpeg)](public/walkthrough/screenshots/visit-mobile.jpeg) |

**What to look at:**

- **`COME THROUGH.`** with the green stack treatment.
- **Real exterior photo** as the hero banner above the map+address grid. Mural-side of the building — yellow stucco with the hand-painted `Terry's` wordmark in green/red graffiti, tropical cocktail with `5 5 5` clock face, palm trees, "It's 5 o'clock here!" in teal. The mural's color palette literally matches the site's brand colors — feels like the brand walked off the wall onto the page.
- **Functional stack below.** Real Google Maps embed with a pin on Terry's, Get Directions / Open in Maps CTAs underneath. Address card · Phone card · Hours card on the right, with the **green TODAY pill** chipping out today's row (Friday at capture time).

---

## /contact

| Desktop (1280) | Mobile (375) |
|---|---|
| [![Contact desktop](public/walkthrough/screenshots/contact-desktop.jpeg)](public/walkthrough/screenshots/contact-desktop.jpeg) | [![Contact mobile](public/walkthrough/screenshots/contact-mobile.jpeg)](public/walkthrough/screenshots/contact-mobile.jpeg) |

**What to look at:**

- **`GOT A QUESTION?`** + the warm-and-direct copy + the hand-drawn green line ("Or just walk in. We're not hard to find.") preserved exactly from the comp.
- **OR CALL US** CTA — green pill with the phone number, build add per your feedback. The phone is the fastest path for most questions; the form covers catering / private events / press / general.
- **Pending DraftField.** Below the call CTA, the red-dashed `REAL CONTACT RECIPIENT EMAIL` pill flags that the form currently posts to a placeholder address — Eli replaces with the real catering email before launch.
- **Form** — Name, Email, Phone (optional), Topic dropdown (General / Catering / Private Event / Press), Message, Send. Honeypot + Static Forms on the wire.

---

## Things you'd recognize as faithful to your spec

- The chunky comic-book wordmark face (Luckiest Guy) and the green-and-red text-shadow stack treatment
- The lime-green CTA buttons, the dashed-dotted leaders, the green swoosh squiggle dividers, the comic-style sticker pills (`★ FAV`, `NEW`, `SPICY`)
- The deep navy room with the green/red brand accents, white body type, italic Open Sans for ledes
- The polaroid-style heritage photo treatment, the news cards with green dates, the live-status pill animating
- The marquee ticker, the dot-leader menu rows, the carded family-stat tiles, the squiggle dividers between sections

---

## Things we picked an angle on (and would love your call if any of these read off)

- **Sunday Football promo** restored as its own dedicated two-up between the food strip and the heritage row (was originally being carried by a mis-labeled photo file; we gave it its own slot)
- **`/sports` adds a "Pick the Room" 4-card grid** below the hero (faithful to live-site establishment copy, but not in the comp)
- **`/visit` adds Get Directions / Open in Maps CTAs** below the map (mobile users want to launch in Maps app, not zoom an iframe)
- **Menu hero is single-column** (Daily Lunch aside dropped — ron's call — lunch already hits hard via the CTA strip and `/specials`)
- **`/contact` is a single Name field**, not First/Last split (cleaner mobile, same data shape)

---

## What's still pending content (not blocking visual review, blocking launch)

Eli supplies seven things before production cutover: real family names + portraits for the three generations, contact form recipient email, Saturday hours confirmation, real Facebook URL (or "no FB" decision), trivia / karaoke / live-music host names, Happy Hour pour list, original SVG wordmark (or accept retina PNGs). Detailed checklist lives in [AUDIT.md § 3](AUDIT.md#3-content-status).

---

## What we'd love your eyes on

Anything that catches your eye that doesn't feel right. The pass before this one [(here in the audit)](AUDIT.md) was structured for "find what's wrong" review and you came back with feedback that improved the build a lot — Belly Buster placeholder, Sunday Football restoration, family-row hide-when-pending all came from your read. This walkthrough is the "here's what we made" version; if anything still looks off, the same `§N · route · note` format works.

Otherwise: thanks for the comp. It's a strong system.

— Code, on the build · Ron, on the show

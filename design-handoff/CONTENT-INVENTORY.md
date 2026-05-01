# Terry's Place — Content Inventory

**Purpose:** for every piece of content the new site needs, what we have, what's missing, who provides it. Read this in pair with `SLOTS.md`.

**Statuses:**
- ✅ **Have it** — shipped in `/assets/` or hard-coded
- 🟡 **Have placeholder** — stand-in shipped; client provides real before launch
- 🔴 **Missing — blocking** — must have before launch
- ⚪ **Missing — non-blocking** — site works without it; chase post-launch
- 🛠 **Code generates** — derived/computed at runtime

---

## Logo & Brand Assets

| Item | Status | File / Source | Notes |
|---|---|---|---|
| Wordmark — full color | ✅ | `assets/logo-wordmark.png` (858×272) | Pulled from live site. PNG only — no SVG exists. |
| Wordmark — mobile | ✅ | `assets/logo-wordmark-mobile.png` | |
| Favicon | ✅ | `assets/favicon-32.png` | |
| **SVG wordmark** | 🔴 | — | Need original AI/EPS from owner OR redraw. Required for clean scaling. **Owner: client to ask designer who made original.** |
| Brushed-metal "Terry's" sub-mark | ⚪ | seen in photos only | Wall-cut sign at the restaurant. Not a digital asset. Could be photographed and cut out. |
| Round badge ("Est. 1980" stamp) | ⚪ | seen on staff t-shirts | Could redraw at v2. Not needed v1. |
| Green swoosh divider | ✅ | `assets/divider-swoosh.png` | The recurring brand motif. |

---

## Photography

### Have (shipped)
| File | What it is | Best use |
|---|---|---|
| `photo-room-hero.jpg` | Interior wide shot, dim warm light | Home hero background ✅ already used |
| `photo-staff-poboy.jpg` | Server holding fish po-boy + fries | News card or food strip |
| `photo-wings-cocktails.jpg` | Wings basket + 3 cocktails | Food strip ✅ already used |
| `photo-merch-hats.jpg` | Hats on shelf | About / merch story |
| `photo-staff-group.jpg` | 8 staff in front of metal "Terry's" wordmark | Heritage section ✅ already used |
| `photo-sunday-football.jpg` | Sunday Football promo graphic | Specials / events page |
| `photo-staff-burger-wings.jpg` | Server holding loaded burger + wings | Food strip ✅ already used |
| `photo-chicken-sandwich.jpg` | Chicken sandwich + fries in basket | Menu page |
| `photo-steak.jpg` | Steak with mushrooms + onion rings | Food strip ✅ already used |
| `photo-camo-hats.jpg` | Two camo trucker hats with leather patch | News card |
| `photo-pool-room.jpg` | Pool tables + air hockey, blue light | News card / amenities |
| `screenshot-current-mobile.jpeg` | Reference of live site mobile | Internal — handoff context |
| `screenshot-current-desktop.jpeg` | Reference of live site desktop | Internal — handoff context |

### Missing — flagged in original README
| Subject | Status | Why we need it | Owner |
|---|---|---|---|
| **Owner / family portrait** ("three generations") | 🔴 | The whole heritage angle hinges on a real face. Currently using staff group photo as stand-in. | client + on-site shoot |
| **Three Terrys, named** | 🔴 | If three generations is true, surface the names. Live site never says them. | client |
| **Cocktail / drinks photography** | 🟡 | Have one shot (`photo-wings-cocktails.jpg`) — bar program deserves its own. | on-site shoot |
| **Trivia night / karaoke / live music** | 🟡 | The events grid ships with cards but no atmosphere photo per category. | on-site shoot, one per program |
| **Game-day room shot** | 🟡 | Sunday Football is the v1 hero moment; need a packed-room game-day photo. | on-site shoot, one Sunday |
| **Burgers + wings, hero-quality** | 🟡 | Staff-holding photos work but real food-photography elevates the menu page. | optional pro shoot |
| **Exterior / sign at dusk** | 🟡 | Anchors the "find us" / map section. | drive-by shoot |

### Photography priorities if budget is tight
1. **Owner / family portrait** — biggest content gap, biggest payoff
2. **Game-day Sunday room shot** — drives the marketing angle
3. **Exterior at dusk** — for Visit page + Google Business Profile
4. Everything else is nice-to-have

---

## Copy

| Section | Status | Source | Notes |
|---|---|---|---|
| Hero headline ("Ocala's Sports Bar & Grill") | ✅ | from live site | Locked. |
| Hero lede | 🟡 | Code-style writeup, agency drafted | Confirm w/ client (Eli). |
| Three-generations story | 🟡 | Agency-drafted in Home.html About section | Need real family names + real founding story from client interview. **30-min phone call w/ owner.** |
| Tonight at Terry's card | 🛠 | Manual weekly | Client owns ongoing. Agency seeds template at launch. |
| Menu items + descriptions | ✅ | Parsed from `assets/menu-2025.pdf` | Need to convert PDF → JSON; agency does this. |
| Menu prices | ✅ | From PDF (April 2025) | Confirm w/ client they're current. |
| Lunch special schedule | ✅ | From PDF + live site | Locked. |
| Happy Hour details | 🟡 | Have window (3–7 weekdays) | Need actual specials list (drinks, prices, food). Client supplies. |
| Trivia / Karaoke / Live music details | 🔴 | Currently agency-drafted | Need: hosts, frequency, cover, age policy. **Confirm w/ client.** |
| Catering / private events copy | 🔴 | Agency draft | Need: do they cater? minimums? menu options? Client confirms. |
| Newsroom posts (3 sample) | 🟡 | Agency draft for layout | Client writes 3 real posts at launch (or migrate from old WP). |
| Address / phone / hours | ✅ | from live site | Saturday hours added (live site missing). Confirm w/ client. |

---

## Data sources

| Data | Status | Source | Notes |
|---|---|---|---|
| Operating hours JSON | 🟡 | `SLOTS.md` § hours | Confirm Saturday hours. Confirm kitchen-close offset. |
| Menu items JSON | 🔴 | Need PDF → JSON conversion | **Agency action item:** parse `Terrys-Place-MENU-2025.pdf` to structured JSON per `SLOTS.md` § menuItems shape. |
| Events seed | 🟡 | `SLOTS.md` § recurringPrograms | Client confirms recurring programs and times. |
| Reviews | ⚪ | None on live site | Could pull Google reviews via API at v2. |

---

## Integrations / accounts

| What | Status | Notes |
|---|---|---|
| Domain (`terrys.place`) | ✅ | Active, redirects in place needed at cutover |
| WordPress hosting | 🟡 | Existing host — client confirms credentials |
| Google Business Profile | 🟡 | Exists; needs claim + update |
| Facebook page | 🔴 | Live site has `href="#"` — **no real FB page is wired up.** Confirm w/ client whether one exists. |
| Instagram | 🔴 | None detected. Worth creating; not blocking. |
| Email (form destination) | 🔴 | No public email on site. Need address for contact form. |
| Newsletter platform | 🔴 | None. Recommend Mailchimp at v2. |
| Reservations platform | n/a | They don't take reservations. Skip. |
| Online ordering | n/a | Not in scope v1. |

---

## What blocks launch (the 🔴 list, consolidated)

1. **Owner / family portrait** + real generation names
2. **Email address** for the contact form
3. **Facebook page URL** (or confirmed "no FB" decision)
4. **Menu PDF → JSON** conversion (agency executes)
5. **SVG wordmark** OR confirmed decision to ship retina PNGs only
6. **Confirm Saturday hours**
7. **Trivia / karaoke / live music details** (host names, cover, frequency)

Everything else is post-launch chaseable.

---

## Recommended first 30 minutes with the client

If you only get one short call:

1. "What are your Saturday hours?" (30 sec)
2. "Family names and short story — who's the three generations?" (5 min)
3. "Give me your email for the contact form." (10 sec)
4. "Do you have a Facebook page? If yes, paste me the URL." (30 sec)
5. "Trivia — who hosts, how often, any cover?" (1 min)
6. "Karaoke — same questions." (1 min)
7. "Are the menu prices in the April 2025 PDF still current?" (1 min)
8. "Catering / private events — what should the page say?" (3 min)
9. "Any photos of you / family / staff we can use? I'd love to set up a 1-hr shoot for the Sunday football room shot + an owner portrait." (5 min)

That covers everything 🔴.

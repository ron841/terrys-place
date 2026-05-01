# Photo Fetch Prompt — Terry's Place

**For Code.** Paste this into a fresh Code session. Goal: stage a photo folder Ron can review before the half-day shoot is scheduled, so the shoot only fills real gaps.

---

You have API access to Google (Places, Maps, Search), and any image sources you're already wired to. We're rebuilding **terrys.place** (Terry's Place, an Ocala FL roadhouse / sports bar) and we need a working photo library before the shoot is booked.

## What I want you to do

1. **Pull what already exists publicly** — Google Business Profile, Yelp business page, the current terrys.place site, the restaurant's Instagram (`@terrys.ocala` if it exists; search and confirm), Facebook page. Use only photos the business has posted or that are clearly licensable for reuse.
2. **Tag and rank** every image against the three-tier hierarchy in `Terrys Place - Composition Spec.html` §04:
   - **Tier 1 — Hero**: a candid Friday-night room shot, or a hero food shot with personality. Big servings, big crowd energy, real lighting.
   - **Tier 2 — Events & people**: trivia night, karaoke, live music, the bar on a Saturday, family running the place. **This tier is the priority** — Terry's brand is "show up, run into friends," and we need photos to back it up.
   - **Tier 3 — Texture**: chalkboard specials, the polaroid wall, the bread coming out, a coaster, a tap handle.
3. **Cut hard:**
   - Anything flash-lit, anything on white, anything with a logo overlay
   - Stock-looking wing/beer photos
   - Exterior shots (we don't use exterior in any tier)
   - Crowd-from-distance shots
4. **Write a `MANIFEST.json`** in this shape:
   ```json
   [
     {
       "filename": "tier1-ribeye-01.jpg",
       "tier": 1,
       "subject": "10oz ribeye, peppered crust, plated",
       "source": "Google Business Profile",
       "source_url": "...",
       "license_note": "GBP customer-uploaded — confirm rights with Eli before launch",
       "quality": "B+",
       "use_for": "hero",
       "crops": ["1920x1080 (hero)", "1200x1500 (menu side)"],
       "gaps_remaining": "ideally a tighter, warmer-lit crop"
     }
   ]
   ```
5. **Drop everything into `terrys-handoff/assets/photos/`** in this project, sorted by tier (`tier1/`, `tier2/`, `tier3/`).
6. **Produce a gap report** at `terrys-handoff/assets/PHOTO_GAPS.md`: list which slots in `Home.html` and `Menu.html` still need a real shoot to fill, with shot specs (subject, framing, lighting note, time of day).

## Slots that need a photo (from Home.html + Menu.html)

| Slot | Tier | Aspect | Subject |
| --- | --- | --- | --- |
| Hero (Home §01) | 1 | 16:9 full-bleed | One dish, warm/low-light, the headline goes bottom-left over it |
| Short menu side (Home §03) | 2 | 4:5 portrait | A plate close-up — different from hero |
| Bread graf (Home §04) | 1 | 1:1 square | House bread, loaf or slice, warm |
| Three generations (Home §05) | 3 | 4:5 portrait | Archival family photo, ~1985 if available |
| Room gallery (Home §06) | 2 | 7 mixed | Bar Saturday, bread out, booth six, Eli pulling, chalkboard, ribeye mid-cut, room golden hour |
| About — Terry & Lou (Inner §a) | 3 | 4:5 portrait | Terry & Lou, ~1982 |
| About — Jen in kitchen (Inner §a) | 2 | 4:5 portrait | Jen working the line |
| About — Eli at bar (Inner §a) | 2 | 4:5 portrait | Eli pouring |
| Menu page hero | 2 | (background) | Could reuse Tier 2 — kitchen prep |

## Hard rules

- **Never** invent or AI-generate a photo. If a slot can't be filled from real sources, leave the placeholder in place and put it in `PHOTO_GAPS.md`.
- **Never** use stock photography. If you can't find it at Terry's, it's a gap, not a substitute.
- If a photo is great but rights are unclear, flag it `license_note: "confirm with Eli"` and stage it anyway — Ron will resolve.
- Keep originals + a `web/` subfolder with 1920px-wide JPEG @80% quality, AVIF + WebP siblings. Production code expects `<picture>` with all three.

## Sources to pull from (in priority order)

Terry's is heavy on **social** — that's the richest source, more than Google.

1. **Instagram** — `@terrys.ocala` if it exists; otherwise search "Terry's Place Ocala" on IG. Pull from the grid AND tagged photos (regulars post a lot). Also pull Stories highlights if any are saved.
2. **Facebook** — Terry's page + community-posted photos under check-ins. FB has years of event photos, karaoke nights, live music, big tables.
3. **Google Business Profile** — the curated set + customer-uploaded.
4. **Yelp** — customer-uploaded, often candid.
5. **The current terrys.place site** — gallery + any inline photos. Lower priority — these are the ones we're replacing.
6. **TikTok** — search "Terry's Place Ocala". Bar/event content sometimes lives there only.

For each social source, keep the original post URL in `source_url` so Ron can credit or DM the poster for permission.

## What done looks like

When Ron opens `terrys-handoff/assets/photos/` he sees:
- `tier1/` (1–3 hero candidates)
- `tier2/` (8–12 room/process candidates)
- `tier3/` (5–10 texture/archival)
- `MANIFEST.json` with provenance + tier + use-for
- `PHOTO_GAPS.md` listing the half-day shoot's actual scope

That gap report is what the photographer gets handed.

---

**One more thing.** While you're in there, also pull:
- The current **logo / wordmark** from terrys.place if there is one. We're keeping the name, possibly the wordmark — depends on quality.
- The **menu PDF** if it's hosted publicly. Compare to `Menu.html` and flag any items I'm missing or pricing that drifted.
- **Hours, phone, address** from Google Business Profile and confirm they match Home.html. If anything's stale in my draft, flag it in `PHOTO_GAPS.md` under "Data corrections."

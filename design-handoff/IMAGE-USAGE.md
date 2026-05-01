# Image Usage — Terry's Place

> Per-asset rules for crop, alt text, and where each image is used. Pair with `CONTENT-INVENTORY.md` for provenance + "what's missing."

---

## Conventions

- **Aspect ratios are guidance**, not law. Source files in `assets/` are the originals; resize in code.
- **Alt text** is supplied per-usage (the same photo can have different alt depending on where it appears). The defaults below are starting points — refine against actual context.
- **Cropping focus** = the subject that must remain in frame at the smallest viewport. Use `object-position` accordingly.
- All photos are **placeholder-quality** — sourced from the live site + Facebook. Treat as v1; flag for replacement in v2.

---

## Logo & brand marks

### `assets/logo-wordmark.png`
- **Source:** lifted from live site
- **Used in:** site header, footer, mobile nav, Index cover
- **Display sizes:** header 56px tall · footer 64px tall · Index 320px wide
- **Background:** must sit on white (header) or dark navy (footer/Index) — both work
- **Alt:** `"Terry's Place"`
- **Do not:** recolor, add stroke, or rotate

### `assets/logo-wordmark-mobile.png`
- **Used in:** mobile nav (under 600px)
- **Display size:** ~40px tall
- **Alt:** `"Terry's Place"`

### `assets/divider-swoosh.png`
- Decorative divider — **alt:** empty (`alt=""`)
- Already wired via `.t-squiggle` class in `css/terrys.css`
- Tints to whatever color sits behind it; original is dark + works on navy

### `assets/favicon-32.png`
- Favicon. Already linked in every comp's `<head>`.

---

## Food photos

### `assets/photo-chicken-sandwich.jpg`
- **Used in:** Home signature dishes (slot 1) · Menu /chicken section thumbnail (optional)
- **Crop:** 1:1 square — focus on sandwich center
- **Alt:** `"Hand-breaded chicken sandwich with fries"`

### `assets/photo-steak.jpg`
- **Used in:** Home signature dishes (slot 2) · About story row (kitchen photo)
- **Crop:** 4:5 portrait or 1:1 — focus on plated steak
- **Alt:** `"Sirloin steak plated with sides"`

### `assets/photo-wings-cocktails.jpg`
- **Used in:** Home signature dishes (slot 3) · Menu /chicken hero
- **Crop:** 4:3 landscape — keep both wings basket and drinks in frame
- **Alt:** `"Jumbo wings basket with cocktails on the bar"`

### `assets/menu-page-1.jpg`
- **Reference only** — used to seed menu items. Do NOT publish on the site.
- Kept in `assets/` so a future content audit can re-verify against the printed menu.

### `assets/menu-2025.pdf`
- **Used in:** "Download PDF Menu" link on Home + Menu pages
- Always link directly — do not embed inline.

---

## Room & vibe photos

### `assets/photo-room-hero.jpg`
- **Used in:** Home hero background OR Home "Inside Terry's" callout · About story (mid-section)
- **Crop:** 16:9 or 21:9 — keep bar back-wall and TVs in frame
- **Alt:** `"Inside Terry's Place — bar with TVs and dining room"`
- **Treatment:** if used as full-bleed hero, apply navy overlay at 60% opacity for type contrast

### `assets/photo-pool-room.jpg`
- **Used in:** Inner /sports page · About second row
- **Crop:** 4:3 — pool table dead center
- **Alt:** `"Pool room at Terry's Place"`

### `assets/photo-sunday-football.jpg`
- **Used in:** Inner /sports section header background · Home weekly events grid (Sunday cell, optional)
- **Crop:** 16:9 wide — keep multiple TVs visible
- **Alt:** `"Sunday football crowd watching the game on multiple TVs"`

---

## People photos

### `assets/photo-staff-group.jpg`
- **Used in:** About hero (right column) · Footer (optional)
- **Crop:** 4:5 portrait — keep all three generations in frame
- **Alt:** `"Three generations of the Terry's Place family in front of the bar"`
- **NOTE:** Confirm with client this is OK to use — request a higher-res version for v2.

### `assets/photo-staff-burger-wings.jpg`
- **Used in:** About second story row · Home "Inside" callout (optional)
- **Crop:** 4:3 — staff hands and plate must stay in frame
- **Alt:** `"Staff member with a burger and wings basket"`

### `assets/photo-staff-poboy.jpg`
- **Used in:** Inner /specials Friday card · Menu hero secondary
- **Crop:** 1:1 — sandwich and staff hand
- **Alt:** `"Friday po'boy special — fish or shrimp"`

---

## Merch & exterior

### `assets/photo-camo-hats.jpg`, `assets/photo-merch-hats.jpg`
- **Used in:** Home "Merch" callout (optional, v1.5) · Footer "More" column (optional)
- **Crop:** 1:1 — hat front centered
- **Alt:** `"Terry's Place hats — sold in store"`

### `assets/screenshot-current-desktop.jpeg`, `assets/screenshot-current-mobile.jpeg`
- **Reference only** — never published. Used for the audit section of HANDOFF.md.

---

## Missing — needs to be commissioned

| What's needed | Why | Priority | Owner |
|---|---|---|---|
| Exterior storefront photo (golden hour) | Home "Visit" callout, About hero alt | High | Agency photo day |
| Owner / family portrait (current, hi-res) | About hero — current photo is small | High | Agency photo day |
| Updated dining room (2026, lights on) | Home hero | Med | Agency photo day |
| Plate of wings (overhead, single-flavor) | Menu /chicken hero — generic | Med | Agency photo day |
| Karaoke night candid | Home "This week" Friday cell | Low | Client phone, casual |

---

## Performance & accessibility

- **Lazy-load** every photo below the fold (`loading="lazy"`).
- **Provide WebP** alongside JPG when possible — drop in via `<picture>`.
- **Always** include meaningful alt text. The only `alt=""` allowed is on `divider-swoosh.png` and other purely decorative elements.
- **Preserve aspect ratio** with CSS `aspect-ratio` to avoid CLS.
- Hero images should be **≤200KB** at 1920×1080 quality 75. Anything heavier — recompress.

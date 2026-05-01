# Asset Manifest — Terry's Place

This is the master inventory of every image, font, and binary asset the build needs. Code: treat this as the build's asset contract.

## Folder layout (target)

```
terrys-handoff/
├── css/
│   └── terrys.css            # tokens + semantic classes — source of truth
├── assets/
│   ├── photos/
│   │   ├── tier1/            # hero — see PHOTO_FETCH_PROMPT.md
│   │   ├── tier2/            # room / process
│   │   ├── tier3/            # texture / archival
│   │   ├── MANIFEST.json     # produced by Code (see PHOTO_FETCH_PROMPT)
│   │   └── PHOTO_GAPS.md     # produced by Code
│   ├── fonts/                # self-hosted Fraunces, Inter Tight, JetBrains Mono — see HANDOFF.md
│   ├── logo/                 # SVG wordmark + favicon set
│   └── menu.pdf              # current full menu, optional download
├── Home.html
├── Menu.html
├── Inner Pages.html
├── Components.html
├── Index.html
├── HANDOFF.md
├── CMS_SCHEMA.json
├── PHOTO_FETCH_PROMPT.md
└── README.md
```

## Photo slots (where each photo plugs in)

| Slot ID | File | Section | Tier | Aspect | Min size | Subject |
| --- | --- | --- | --- | --- | --- | --- |
| `hero-dish` | Home.html §01 | Hero | 1 | 16:9 | 2400×1350 | One dish, warm, low light, shallow DOF |
| `menu-plate` | Home.html §03 | Short menu | 2 | 4:5 | 1200×1500 | Plate close-up, different from hero |
| `bread-loaf` | Home.html §04 | Bread graf | 1 | 1:1 | 1600×1600 | House bread, warm, close |
| `family-archival` | Home.html §05 | History | 3 | 4:5 | 1200×1500 | Archival, ~1985 if available |
| `room-1` | Home.html §06 | Gallery | 2 | wide | 1600×1200 | Bar, Saturday, ~9pm |
| `room-2` | Home.html §06 | Gallery | 2 | wide | 1600×1200 | Bread coming out |
| `room-3` | Home.html §06 | Gallery | 2 | wide | 1200×1200 | Booth six, regulars |
| `room-4` | Home.html §06 | Gallery | 2 | wide | 1200×1200 | Eli pulling a draft |
| `room-5` | Home.html §06 | Gallery | 3 | wide | 1200×1200 | Chalkboard specials |
| `room-6` | Home.html §06 | Gallery | 1 | wide | 1600×1200 | 10oz ribeye mid-cut |
| `room-7` | Home.html §06 | Gallery | 2 | wide | 1600×1200 | Room, golden hour |
| `about-terry-lou` | Inner §a | About | 3 | 4:5 | 1200×1500 | Terry & Lou, ~1982 |
| `about-jen` | Inner §a | About | 2 | 4:5 | 1200×1500 | Jen in the kitchen |
| `about-eli` | Inner §a | About | 2 | 4:5 | 1200×1500 | Eli at the bar |

## Logo / brand

- **Wordmark**: Fraunces 900 italic "Terry's" rendered live in CSS for now. If a custom wordmark exists or gets commissioned, drop SVG at `assets/logo/terrys-wordmark.svg` and replace `.nav-mark` / `.foot-mark` text with `<img>`.
- **Favicon set**: 32, 192, 512 + Apple touch + maskable. Generate from wordmark on white paper.

## Fonts (self-host in production)

| Family | Weights | Source | Notes |
| --- | --- | --- | --- |
| Fraunces | 400, 500, 700, 900 + 400/500 italic | Google Fonts | Variable axis SOFT, WONK — keep the variable file (`Fraunces[SOFT,WONK,opsz,wght].woff2`) |
| Inter Tight | 400, 500, 600, 700 | Google Fonts | Static is fine |
| JetBrains Mono | 400, 500 | JetBrains.com | Static is fine |

License: all three are OFL — free for self-host.

## Integrations (placeholders to replace)

- **Map**: `<div class="visit-map">` — replace with Google Maps embed iframe (current site uses one — keep that pattern) pinned at **4121 NE 36th Ave, Ocala FL 34479**.
- **Phone**: `tel:+13527323820` — confirm vs Google Business Profile.
- **Email**: `hello@terrys.place`, `events@terrys.place`, `press@terrys.place` — provision before launch.
- **Social**: Instagram + Facebook URLs — confirm handles, replace `#` in footer.

## Out of pack (Ron / business-side)

- Final hours table (today's reflects spec)
- Final menu prices (used last-known)
- Gift card platform decision
- Online ordering platform decision (was deferred per spec §09)

import type { MenuItem } from "@/lib/content";

/**
 * Menu row with proper dot-leader pattern.
 *
 * Layout — three shapes:
 *
 *   Single-priced:
 *     [Bold Name] [.....dots fill.....] [$9.29]
 *     italic description hangs full-width below
 *
 *   Tier-priced (wings 10/20/30/50, subs Sm/Lg, fish 2pc/3pc):
 *     [Bold Name] [.....dots fill.....]
 *     [10 $14] [20 $28] [30 $42] [50 $70]   ← tier row, mono, wrapping
 *     italic description hangs full-width below
 *
 *   No-price (rare; fallback):
 *     [Bold Name] [.....dots fill.....]
 *     italic description below
 *
 * The `paper` variant flips colors for a printable / light-surface menu.
 *
 * Why this restructure: the previous shape (name+desc all in one
 * 1fr grid cell with price+dots in auto cells) made the dot leaders
 * look like orphan ticks at the right edge of long descriptions, and on
 * mobile the long tier-pricing string ("10 14 · 20 28 · 30 42 · 50 70")
 * pushed the name column to ~15-char wide and tall-narrow. Splitting
 * description and tier-pricing into their own rows below the name+price
 * row gives the classic menu-leader look at every viewport.
 */

type Props = {
  item: MenuItem;
  paper?: boolean;
};

function formatSimplePrice(price: number): string {
  return price.toFixed(2).replace(/\.00$/, "");
}

export function MenuRow({ item, paper = false }: Props) {
  const isHouseFavorite = item.tags?.includes("house-favorite");
  const isNew = item.tags?.includes("new");
  const isSpicy = item.tags?.includes("spicy");

  const hasTiered = !!(item.pricing && item.pricing.length > 0);
  const hasSinglePrice = typeof item.price === "number";

  return (
    <div className={`t-menu-row ${paper ? "t-menu-row--paper" : ""}`}>
      <div className="t-menu-row-head">
        <span className="name">
          {item.name}
          {isHouseFavorite && (
            <span className="badge badge--fav" aria-label="House favorite">★</span>
          )}
          {isNew && <span className="badge">New</span>}
          {isSpicy && <span className="badge">Spicy</span>}
        </span>
        <span className="dots" aria-hidden="true" />
        {hasSinglePrice && (
          <span className="price">{formatSimplePrice(item.price as number)}</span>
        )}
      </div>

      {hasTiered && (
        <div className="t-menu-row-tiers" role="group" aria-label={`${item.name} prices`}>
          {item.pricing!.map((p) => (
            <span key={p.size} className="tier">
              <span className="tier-size">{p.size}</span>
              <span className="tier-price">{formatSimplePrice(p.price)}</span>
            </span>
          ))}
        </div>
      )}

      {item.note && <em className="t-menu-row-desc">{item.note}</em>}
    </div>
  );
}

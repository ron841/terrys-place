import type { MenuItem } from "@/lib/content";

/**
 * Menu row with dot leader. Lifted from terrys.css .t-menu-row.
 *
 * Handles three pricing shapes:
 *   - single price: $10.50
 *   - sized: Sm $9.29 / Lg $14.99
 *   - tiered: 10 / 20 / 30 / 50 quantities (wings)
 *
 * The `paper` variant flips colors for the printable / paper-surface menu.
 */

type Props = {
  item: MenuItem;
  paper?: boolean;
};

function formatPriceCell(item: MenuItem): React.ReactNode {
  if (typeof item.price === "number") {
    const display = item.price.toFixed(2).replace(/\.00$/, "");
    return <span className="price">{display}</span>;
  }
  if (item.pricing && item.pricing.length > 0) {
    return (
      <span className="price">
        {item.pricing
          .map((p) => `${p.size} ${p.price.toFixed(2).replace(/\.00$/, "")}`)
          .join(" · ")}
      </span>
    );
  }
  return null;
}

export function MenuRow({ item, paper = false }: Props) {
  const isHouseFavorite = item.tags?.includes("house-favorite");
  const isNew = item.tags?.includes("new");
  const isSpicy = item.tags?.includes("spicy");

  return (
    <div className={`t-menu-row ${paper ? "t-menu-row--paper" : ""}`}>
      <div>
        <div className="name">
          {item.name}
          {isHouseFavorite && <span className="badge" style={{ background: "var(--green)", color: "var(--ink)" }}>★</span>}
          {isNew && <span className="badge">New</span>}
          {isSpicy && <span className="badge">Spicy</span>}
          {item.note && <em>{item.note}</em>}
        </div>
      </div>
      <div className="dots" aria-hidden="true" />
      {formatPriceCell(item)}
    </div>
  );
}

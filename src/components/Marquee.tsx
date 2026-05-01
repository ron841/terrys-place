import { events } from "@/lib/content";

/**
 * The lime-green ticker under the hero.
 * Items doubled for seamless CSS animation loop (per terrys.css .t-marquee).
 */

export function Marquee({ items }: { items?: string[] }) {
  const list = items ?? events.marquee ?? [];
  if (list.length === 0) return null;
  const doubled = [...list, ...list];
  return (
    <div className="ticker t-marquee" aria-label="What's happening this week">
      <div className="t-marquee-track">
        {doubled.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}

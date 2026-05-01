"use client";

/**
 * LiveStatusPill — client component, recomputes every minute.
 *
 * Renders the t-live pill from terrys.css with the correct variant class:
 *   default (green pulse) — open
 *   .t-live--lastcall (red) — within 60min of close
 *   .t-live--closed (muted) — closed
 *
 * On the server, render a placeholder ("…") so SSR doesn't lock in a stale
 * value. After hydration, the real status replaces it.
 */

import { useEffect, useState } from "react";
import { hours } from "@/lib/content";
import { computeLiveStatus, liveStatusLabel, type LiveStatus } from "@/lib/liveStatus";

type Props = {
  /** Compact mobile rendering — dot indicator only, no text. */
  compact?: boolean;
};

export function LiveStatusPill({ compact = false }: Props) {
  const [status, setStatus] = useState<LiveStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(computeLiveStatus(hours));
    tick();
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) {
    // SSR / pre-hydration placeholder — keeps layout stable, no flash.
    return <span className="t-live" aria-hidden="true">&hellip;</span>;
  }

  const variant =
    status.state === "lastcall"
      ? "t-live t-live--lastcall"
      : status.state === "closed"
        ? "t-live t-live--closed"
        : "t-live";

  if (compact) {
    return <span className={variant} aria-label={liveStatusLabel(status)} />;
  }

  return <span className={variant}>{liveStatusLabel(status)}</span>;
}

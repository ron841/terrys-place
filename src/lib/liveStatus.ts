/**
 * Live-status pill computation. Implements the spec from SLOTS.md § liveStatusPill.
 *
 * Behaviors:
 * - "Open Now · Closes HH:MM" — open and >60min before close
 * - "Last Call · Closes HH:MM" — open and ≤60min before close (red variant)
 * - "Closed · Opens [day] at HH:MM" — closed; finds next open period
 * - "Opens at HH:MM" — closed today, but opens later today
 *
 * Past-midnight closes (close > 24:00, e.g. Friday "25:00" = 1am Sat):
 * the close time still belongs to the original day. So at 12:30am Sat,
 * we're still considered "Friday open" until 1:00am wall-clock.
 *
 * Timezone: America/New_York. Computed on the client (the pill renders
 * after hydration), so we can use the user's clock and convert.
 */

import type { Hours, DayHours } from "./content";

const DOW_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type LiveStatus =
  | { state: "open"; closesAt: string; closesAtMinutesFromNow: number }
  | { state: "lastcall"; closesAt: string; closesAtMinutesFromNow: number }
  | { state: "closed"; opensIn: string; opensDay: string; opensAt: string };

/** Parse "HH:MM" (allowing HH up to 25) into minutes-from-midnight. */
function parseHM(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

/** Render minutes-from-midnight as "h:mm AM/PM" (wraps past 24h to next-day). */
function fmtTime(minutes: number): string {
  const hh24 = Math.floor((minutes % (24 * 60)) / 60);
  const mm = minutes % 60;
  const period = hh24 >= 12 ? "PM" : "AM";
  const hh12 = hh24 === 0 ? 12 : hh24 > 12 ? hh24 - 12 : hh24;
  return `${hh12}:${mm.toString().padStart(2, "0")} ${period}`;
}

/** Get a Date representing "now" in the America/New_York wall clock. */
function nyNow(): { date: Date; dow: number; minutes: number } {
  const now = new Date();
  // Use Intl to get NY parts, then synthesize.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hh = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const mm = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const dow = DOW_SHORT.indexOf(wd as (typeof DOW_SHORT)[number]);
  return { date: now, dow: dow < 0 ? now.getDay() : dow, minutes: hh * 60 + mm };
}

/** Convert hours[dow] (DayHours) to a numeric open/close pair, or null. */
function rangeFor(h: Hours, dow: number): { open: number; close: number } | null {
  const slot = (h as unknown as Record<string, DayHours>)[String(dow)];
  if (!slot) return null;
  return { open: parseHM(slot.open), close: parseHM(slot.close) };
}

/** Find the next day (offset from today) that has an open period and return it. */
function nextOpenDay(
  h: Hours,
  fromDow: number,
): { dow: number; offset: number; open: number; close: number } | null {
  for (let i = 1; i <= 7; i++) {
    const dow = (fromDow + i) % 7;
    const r = rangeFor(h, dow);
    if (r) return { dow, offset: i, open: r.open, close: r.close };
  }
  return null;
}

const LASTCALL_THRESHOLD_MIN = 60;

export function computeLiveStatus(h: Hours): LiveStatus {
  const { dow, minutes } = nyNow();
  const today = rangeFor(h, dow);
  const yesterdayDow = (dow + 6) % 7;
  const yesterday = rangeFor(h, yesterdayDow);

  // Case 1: yesterday's close extends past midnight, and we're still in that window.
  if (yesterday && yesterday.close > 24 * 60) {
    const carryClose = yesterday.close - 24 * 60; // minutes into TODAY
    if (minutes < carryClose) {
      const remaining = carryClose - minutes;
      const closesAtFmt = fmtTime(carryClose);
      if (remaining <= LASTCALL_THRESHOLD_MIN) {
        return { state: "lastcall", closesAt: closesAtFmt, closesAtMinutesFromNow: remaining };
      }
      return { state: "open", closesAt: closesAtFmt, closesAtMinutesFromNow: remaining };
    }
  }

  // Case 2: closed all day today.
  if (!today) {
    const next = nextOpenDay(h, dow);
    if (!next) {
      return { state: "closed", opensIn: "later", opensDay: "soon", opensAt: "" };
    }
    return {
      state: "closed",
      opensIn: next.offset === 1 ? "tomorrow" : `in ${next.offset} days`,
      opensDay: DOW_NAMES[next.dow],
      opensAt: fmtTime(next.open),
    };
  }

  // Case 3: today is open at some point. Where are we vs. the open window?
  if (minutes < today.open) {
    return {
      state: "closed",
      opensIn: "later today",
      opensDay: "today",
      opensAt: fmtTime(today.open),
    };
  }

  if (minutes >= today.close) {
    // closed already, find next open
    const next = nextOpenDay(h, dow);
    if (!next) {
      return { state: "closed", opensIn: "later", opensDay: "soon", opensAt: "" };
    }
    return {
      state: "closed",
      opensIn: next.offset === 1 ? "tomorrow" : `in ${next.offset} days`,
      opensDay: DOW_NAMES[next.dow],
      opensAt: fmtTime(next.open),
    };
  }

  // Open right now.
  const remaining = today.close - minutes;
  const closesAtFmt = fmtTime(today.close);
  if (remaining <= LASTCALL_THRESHOLD_MIN) {
    return { state: "lastcall", closesAt: closesAtFmt, closesAtMinutesFromNow: remaining };
  }
  return { state: "open", closesAt: closesAtFmt, closesAtMinutesFromNow: remaining };
}

/** Compact label for the pill body. */
export function liveStatusLabel(s: LiveStatus): string {
  switch (s.state) {
    case "open":
      return `Open Now · Closes ${s.closesAt}`;
    case "lastcall":
      return `Last Call · Closes ${s.closesAt}`;
    case "closed":
      return s.opensAt ? `Closed · Opens ${s.opensDay} at ${s.opensAt}` : "Closed";
  }
}

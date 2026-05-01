"use client";

import { useEffect, useState } from "react";
import { events as eventsContent, type Event } from "@/lib/content";

/**
 * 7-day week grid for Home § "This Week at Terry's".
 *
 * Today is highlighted (computed client-side from America/New_York wall clock).
 * Source: events.weekly[] is the recurring baseline. specialDates[] would
 * override for a given Mon–Sun if populated (v2). Cells with no event for the
 * day render as quiet empty cells (per SLOTS.md fallback spec).
 *
 * Date labels for the cells are computed at render time from "this Monday."
 */

const DOW_TO_INDEX: Record<Event["day"], number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};
const ORDER: Event["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getNYToday(): { dow: number; date: Date } {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  });
  const wd = fmt.format(now);
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
  return { dow: dow < 0 ? now.getDay() : dow, date: now };
}

function dateForOffset(today: Date, offset: number): Date {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d;
}

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function WeekGrid() {
  const [todayDow, setTodayDow] = useState<number | null>(null);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const { dow, date } = getNYToday();
    setTodayDow(dow);
    setToday(date);
  }, []);

  const eventByDay = new Map<Event["day"], Event>();
  for (const e of eventsContent.weekly) eventByDay.set(e.day, e);

  // The week shown starts on Monday. Compute the Monday-of-this-week from today.
  // If today is Mon (1) → offset 0; Tue (2) → -1; ... Sun (0) → -6.
  const monOffset =
    todayDow === null ? 0 : todayDow === 0 ? -6 : -(todayDow - 1);

  return (
    <div className="week-grid">
      {ORDER.map((d, i) => {
        const dayIdx = DOW_TO_INDEX[d];
        const isToday = todayDow !== null && dayIdx === todayDow;
        const dateLabel =
          today === null ? "" : fmtDate(dateForOffset(today, monOffset + i));
        const ev = eventByDay.get(d);
        return (
          <div key={d} className={`day ${isToday ? "is-today" : ""}`}>
            <div className="dow">{d}</div>
            <div className="date">{dateLabel || " "}</div>
            {ev ? (
              <div className="event">
                <div className={`kind ${ev.hot ? "is-hot" : ""}`}>{ev.kind}</div>
                <div className="name">{ev.title}</div>
                <div className="when">{ev.time}{ev.note ? ` · ${ev.note}` : ""}</div>
              </div>
            ) : (
              <div className="event event--quiet">
                <div className="kind">—</div>
                <div className="name">No event scheduled</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

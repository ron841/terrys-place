/**
 * DraftField — visible-and-pending placeholder for blocked content.
 *
 * Three modes:
 * 1. Inline (default): renders a red dashed pill containing the item label.
 * 2. With `value`: collapses to render the value (one-line swap to remove).
 * 3. With `as="block"`: renders a block container with the same treatment,
 *    used for photo/portrait fallbacks.
 *
 * The item label is rendered verbatim (no "Pending: " prefix). The red
 * dashed styling carries the pending signal; bracketed labels like
 * "[OWNER NAME PENDING]" read cleanly without a prefix.
 *
 * Visible in dev AND production preview so Ron can show Eli what's waiting.
 */

import type { ReactNode } from "react";

type Props = {
  item: string;
  value?: ReactNode;
  as?: "inline" | "block";
  className?: string;
  children?: ReactNode;
};

export function DraftField({ item, value, as = "inline", className = "", children }: Props) {
  if (value !== undefined && value !== null && value !== "") {
    return <>{value}</>;
  }

  if (as === "block") {
    return (
      <div className={`t-draftfield t-draftfield--block ${className}`} data-pending={item}>
        <span className="t-draftfield-label">{item}</span>
        {children}
      </div>
    );
  }

  return (
    <span className={`t-draftfield ${className}`} data-pending={item}>
      {item}
    </span>
  );
}

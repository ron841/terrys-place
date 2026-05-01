import type { Metadata } from "next";
import {
  Luckiest_Guy,
  Open_Sans,
  JetBrains_Mono,
  Indie_Flower,
} from "next/font/google";
// Open Sans Condensed isn't in next/font's Google catalog (Google deprecated
// it as a separate family in favor of the variable Open Sans width axis,
// which next/font doesn't expose). Self-host via @fontsource instead — it
// registers @font-face with family "Open Sans Condensed", which the CSS
// variable --font-cond in terrys.css then resolves to naturally.
import "@fontsource/open-sans-condensed/700.css";
import "./globals.css";

/**
 * Self-hosted via next/font/google. The `variable` names below match the
 * font-role variable names terrys.css consumes (--font-display etc.).
 *
 * next/font applies these as a higher-specificity class selector on <html>,
 * which overrides terrys.css's :root-level definitions. The terrys.css
 * declarations remain as a documentation-and-fallback layer, but the
 * actually-loaded families come from these next/font calls.
 */
const display = Luckiest_Guy({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const body = Open_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const hand = Indie_Flower({
  variable: "--font-hand",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terry's Place — Ocala's Sports Bar & Grill Since 1980",
  description:
    "Family-run sports bar and grill in Ocala, FL since 1980. Half-pound burgers, hand-cut steaks, daily-baked bread. Wall-to-wall TVs, NFL Sunday Ticket, four rooms, three generations.",
  metadataBase: new URL("https://terrys.place"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${hand.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

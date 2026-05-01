/**
 * Walkthrough capture — 14 fresh full-page screenshots (7 routes × 2 viewports)
 * against the live preview. Output lands in public/walkthrough/screenshots/.
 *
 * This is the "show Design what we built" capture. Different from
 * scripts/audit-capture.mjs (which also captures comp HTML for diff).
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT = resolve(__dirname, "..");
const PREVIEW = "https://terrys-place.vercel.app";

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
};

const ROUTES = [
  { name: "home",     path: "/" },
  { name: "menu",     path: "/menu" },
  { name: "about",    path: "/about" },
  { name: "specials", path: "/specials" },
  { name: "sports",   path: "/sports" },
  { name: "visit",    path: "/visit" },
  { name: "contact",  path: "/contact" },
];

const OUT = `${PROJECT}/public/walkthrough/screenshots`;
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const route of ROUTES) {
  console.log(`\n=== ${route.name} ===`);
  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    try {
      await page.goto(PREVIEW + route.path, { waitUntil: "networkidle", timeout: 30_000 });
      await page.waitForTimeout(1000); // let fonts settle + LiveStatusPill resolve
      const path = `${OUT}/${route.name}-${vpName}.jpeg`;
      await page.screenshot({ path, fullPage: true, type: "jpeg", quality: 85 });
      console.log(`  ${route.name}-${vpName}.jpeg`);
    } catch (e) {
      console.warn(`  ! ${route.name}-${vpName}: ${e.message}`);
    }
    await ctx.close();
  }
}

await browser.close();
console.log("\nDone.");

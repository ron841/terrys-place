/**
 * One-shot screenshot capture for the /audit page.
 *
 * Captures, for each of the 7 routes, at desktop (1280×800) and mobile (375×812):
 *   - The deployed build at https://terrys-place.vercel.app/<route>
 *   - The Design comp at file:///path/to/Home.html (or per-section anchor for inner pages)
 *
 * Also captures console errors per route (build only) into public/audit/console/.
 *
 * All output lands in public/audit/screenshots/{build,comp}/<route>-<vp>.jpeg
 * and public/audit/console/<route>.json.
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT = resolve(__dirname, "..");
const HANDOFF = resolve(PROJECT, "design-handoff");

const PREVIEW = "https://terrys-place.vercel.app";

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
};

// Each route: a build URL + a comp source.
// Comp source can be a full file (Home.html, Menu.html) or an Inner-Pages anchor.
const ROUTES = [
  { name: "home",     build: "/",         compFile: "Home.html",         anchor: null },
  { name: "menu",     build: "/menu",     compFile: "Menu.html",         anchor: null },
  { name: "about",    build: "/about",    compFile: "Inner Pages.html",  anchor: "about" },
  { name: "specials", build: "/specials", compFile: "Inner Pages.html",  anchor: "specials" },
  { name: "sports",   build: "/sports",   compFile: "Inner Pages.html",  anchor: "sports" },
  { name: "visit",    build: "/visit",    compFile: "Inner Pages.html",  anchor: "visit" },
  { name: "contact",  build: "/contact",  compFile: "Inner Pages.html",  anchor: "contact" },
];

await mkdir(`${PROJECT}/public/audit/screenshots/build`, { recursive: true });
await mkdir(`${PROJECT}/public/audit/screenshots/comp`, { recursive: true });
await mkdir(`${PROJECT}/public/audit/console`, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function shotBuild(route, vpName, vp) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  const consoleEntries = [];
  page.on("console", (msg) => {
    consoleEntries.push({ type: msg.type(), text: msg.text() });
  });
  page.on("pageerror", (err) => {
    consoleEntries.push({ type: "pageerror", text: err.message });
  });
  await page.goto(PREVIEW + route.build, { waitUntil: "networkidle", timeout: 30_000 });
  // Brief settle for fonts + lazy work
  await page.waitForTimeout(800);
  const path = `${PROJECT}/public/audit/screenshots/build/${route.name}-${vpName}.jpeg`;
  await page.screenshot({ path, fullPage: true, type: "jpeg", quality: 80 });
  console.log(`  build/${route.name}-${vpName}.jpeg`);
  if (vpName === "desktop") {
    await writeFile(
      `${PROJECT}/public/audit/console/${route.name}.json`,
      JSON.stringify(consoleEntries, null, 2),
    );
  }
  await ctx.close();
}

async function shotComp(route, vpName, vp) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  const url = `file://${HANDOFF}/${encodeURIComponent(route.compFile)}${route.anchor ? "#" + route.anchor : ""}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 15_000 });
  await page.waitForTimeout(500);

  const path = `${PROJECT}/public/audit/screenshots/comp/${route.name}-${vpName}.jpeg`;

  if (route.anchor) {
    // Inner Pages: scroll to anchor and screenshot from that section through the next page-divider.
    await page.evaluate((anchor) => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ block: "start" });
    }, route.anchor);
    await page.waitForTimeout(300);
    // Capture from the page-divider through to just before the next .page-divider, or end-of-doc.
    const clip = await page.evaluate((anchor) => {
      const el = document.getElementById(anchor);
      if (!el) return null;
      // Find the next .page-divider sibling at the document level.
      let n = el.nextElementSibling;
      let bottom = document.body.scrollHeight;
      while (n) {
        if (n.classList && n.classList.contains("page-divider")) {
          const rect = n.getBoundingClientRect();
          bottom = window.scrollY + rect.top;
          break;
        }
        n = n.nextElementSibling;
      }
      const top = el.getBoundingClientRect().top + window.scrollY;
      return { top, bottom };
    }, route.anchor);
    if (clip && clip.bottom > clip.top) {
      const height = Math.min(clip.bottom - clip.top, 8000);
      // Render full-page first, then crop programmatically
      const buf = await page.screenshot({ fullPage: true, type: "jpeg", quality: 80 });
      // Sharp would be ideal here but we don't have it; just pass through full-page if we can't crop.
      // Instead, set page viewport to (vp.width × height) and fullPage:false won't work because of scroll.
      // Practical solution: re-take a clip-style screenshot using clip option in fullPage mode? Not allowed.
      // Workaround: use the CDP-equivalent clip via page.screenshot({ clip }). That works WITHOUT fullPage.
      await page.screenshot({
        path,
        type: "jpeg",
        quality: 80,
        clip: { x: 0, y: clip.top, width: vp.width, height },
      });
      void buf; // unused — we used clip on a fresh shot
    } else {
      await page.screenshot({ path, fullPage: true, type: "jpeg", quality: 80 });
    }
  } else {
    await page.screenshot({ path, fullPage: true, type: "jpeg", quality: 80 });
  }
  console.log(`  comp/${route.name}-${vpName}.jpeg`);
  await ctx.close();
}

for (const route of ROUTES) {
  console.log(`\n=== ${route.name} ===`);
  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    try { await shotBuild(route, vpName, vp); }
    catch (e) { console.warn(`  build/${route.name}-${vpName}: ${e.message}`); }
    try { await shotComp(route, vpName, vp); }
    catch (e) { console.warn(`  comp/${route.name}-${vpName}: ${e.message}`); }
  }
}

await browser.close();
console.log("\nDone.");

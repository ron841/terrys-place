/**
 * Re-shoot inner-page comp screenshots: take a fullPage screenshot of
 * Inner Pages.html, then crop per anchor using sharp. The "comp" image
 * for each inner route is the slice between its .page-divider and the
 * next one (or the document footer for /contact).
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT = resolve(__dirname, "..");
const HANDOFF = resolve(PROJECT, "design-handoff");

const SECTIONS = ["about", "specials", "sports", "visit", "contact"];

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
};

await mkdir(`${PROJECT}/public/audit/screenshots/comp`, { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  const url = `file://${HANDOFF}/${encodeURIComponent("Inner Pages.html")}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForTimeout(800);

  // Get the y-offset of each section's .page-divider; use the next divider as the bottom.
  const offsets = await page.evaluate((ids) => {
    const out = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      out[id] = el ? el.offsetTop : null;
    }
    out.__docHeight = document.body.scrollHeight;
    return out;
  }, SECTIONS);

  console.log(`\n=== ${vpName} (vp ${vp.width}×${vp.height}) ===`);
  console.log("offsets:", offsets);

  // Capture full page as a buffer (no path), then crop slices.
  const fullBuf = await page.screenshot({ type: "jpeg", quality: 80, fullPage: true });
  const meta = await sharp(fullBuf).metadata();
  console.log(`fullPage size: ${meta.width}×${meta.height}`);

  // Page may render at devicePixelRatio>1; scaleY = capturedHeight / docHeight.
  const scaleY = meta.height / offsets.__docHeight;

  for (let i = 0; i < SECTIONS.length; i++) {
    const id = SECTIONS[i];
    const top = offsets[id];
    if (top == null) {
      console.log(`  ! ${id}: missing in DOM`);
      continue;
    }
    const next =
      i + 1 < SECTIONS.length
        ? offsets[SECTIONS[i + 1]]
        : offsets.__docHeight;
    const cropTop = Math.floor(top * scaleY);
    const cropHeight = Math.min(
      Math.floor((next - top) * scaleY),
      meta.height - cropTop,
    );
    if (cropHeight <= 0) {
      console.log(`  ! ${id}: cropHeight ${cropHeight}`);
      continue;
    }
    const out = `${PROJECT}/public/audit/screenshots/comp/${id}-${vpName}.jpeg`;
    await sharp(fullBuf)
      .extract({ left: 0, top: cropTop, width: meta.width, height: cropHeight })
      .jpeg({ quality: 80 })
      .toFile(out);
    console.log(`  comp/${id}-${vpName}.jpeg  (${meta.width}×${cropHeight})`);
  }

  await ctx.close();
}

await browser.close();
console.log("\nDone.");

/**
 * Renders public/images/og-cover.svg to the PNG that the OG/Twitter tags point
 * at. Run it after editing the SVG:
 *
 *   npm i -D playwright --ignore-scripts
 *   node scripts/og-image.mjs
 *   npm remove playwright
 *
 * Playwright is deliberately not a saved dependency: this script runs a few
 * times in the life of the site, and installing it normally pulls ~500MB of
 * browser binaries this script never uses. `--ignore-scripts` skips that
 * download; the render drives the Edge already on the machine.
 *
 * Why a PNG at all: LinkedIn, Facebook and X do not render SVG link previews —
 * they show a bare text link instead — so the SVG is the source and the PNG is
 * what ships in the meta tags.
 *
 * Uses the installed Edge rather than a downloaded Chromium, and inlines the
 * real Inter and JetBrains Mono faces from node_modules, so the render matches
 * the site instead of falling back to whatever fonts the machine happens to
 * have installed.
 */

import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. See the header of this file for the two commands.");
  process.exit(1);
}

const asDataURI = (path) =>
  `url(data:font/woff2;base64,${readFileSync(join(root, path)).toString("base64")}) format(`;

const inter = asDataURI("node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2");
const mono = asDataURI("node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2");
const svg = readFileSync(join(root, "public/images/og-cover.svg"), "utf8");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Inter Variable"; src: ${inter}"woff2-variations"); font-weight: 100 900; }
@font-face { font-family: "JetBrains Mono"; src: ${mono}"woff2"); font-weight: 400; }
html, body { margin: 0; padding: 0; background: #05070A; }
svg { display: block; }
svg text { font-family: "Inter Variable", sans-serif; }
svg text:last-of-type { font-family: "JetBrains Mono", monospace; }
</style></head><body>${svg}</body></html>`;

const scratch = join(root, "public/images/.og-render.html");
writeFileSync(scratch, html);

const browser = await chromium.launch({ channel: "msedge" });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`file://${scratch.replace(/\\/g, "/")}`);
  await page.evaluate(() => document.fonts.ready);
  // The faces are already inlined; this is just a frame for layout to settle.
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(root, "public/images/og-cover.png") });
  console.log("wrote public/images/og-cover.png (1200x630)");
} finally {
  await browser.close();
  unlinkSync(scratch);
}

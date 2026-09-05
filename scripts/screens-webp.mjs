#!/usr/bin/env node
/**
 * Converts captured PNGs to WebP and rewrites the manifests to match.
 *
 *   node scripts/screens-webp.mjs            # convert, keep PNGs
 *   node scripts/screens-webp.mjs --replace  # convert and delete the PNGs
 *
 * Encoding runs through Chrome's own canvas encoder rather than sharp: adding a
 * native image dependency to this repo for a job the browser already does well
 * is not worth the install surface, and the bundled-binary download on this
 * machine is unreliable anyway.
 *
 * Quality is deliberately high. These are screenshots of small UI text, where
 * WebP's chroma handling shows first - 0.92 keeps 4px stroke weights legible
 * while still cutting roughly two thirds of the bytes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const QUALITY = 0.92;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const ROOT = path.join(REPO, 'static', 'img', 'screens');
const REPLACE = process.argv.includes('--replace');

const pngs = [];
for (const sec of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, sec);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.png')) pngs.push(path.join(dir, f));
  }
}

if (!pngs.length) {
  console.log('no PNGs to convert');
  process.exit(0);
}

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.setContent('<canvas id="c"></canvas>');

let before = 0;
let after = 0;
const map = {};

for (const png of pngs) {
  const buf = fs.readFileSync(png);
  before += buf.length;

  const dataUrl = await page.evaluate(
    async ({ b64, quality }) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const c = document.getElementById('c');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      return c.toDataURL('image/webp', quality);
    },
    { b64: buf.toString('base64'), quality: QUALITY }
  );

  if (!dataUrl.startsWith('data:image/webp')) {
    console.error(`  FAIL ${path.basename(png)} — browser did not return WebP`);
    continue;
  }

  const out = png.replace(/\.png$/, '.webp');
  const outBuf = Buffer.from(dataUrl.split(',')[1], 'base64');
  fs.writeFileSync(out, outBuf);
  after += outBuf.length;

  const relPng = path.relative(REPO, png).split('\\').join('/');
  const relWebp = path.relative(REPO, out).split('\\').join('/');
  map[relPng] = relWebp;

  if (REPLACE) fs.unlinkSync(png);
  console.log(
    `  ${path.basename(out).padEnd(34)} ${kb(buf.length).padStart(8)} -> ${kb(outBuf.length).padStart(8)}  (${pct(buf.length, outBuf.length)})`
  );
}

await browser.close();

// Keep the manifests truthful: they are what the docs read dimensions from.
for (const name of ['manifest.desktop.json', 'manifest.mobile.json']) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) continue;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const row of data) {
    if (row.file && map[row.file]) row.file = map[row.file];
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

console.log(`\n  ${pngs.length} images: ${kb(before)} -> ${kb(after)}  (${pct(before, after)})`);
console.log(REPLACE ? '  PNGs removed.' : '  PNGs kept — rerun with --replace to remove them.');

function kb(n) {
  return n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB';
}
function pct(a, b) {
  return `-${Math.round((1 - b / a) * 100)}%`;
}

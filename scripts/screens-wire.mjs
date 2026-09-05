#!/usr/bin/env node
/**
 * Wires captured screenshots into the docs.
 *
 *   node scripts/screens-wire.mjs --dry   # report only
 *   node scripts/screens-wire.mjs         # generate data + rewrite markers
 *
 * Two jobs:
 *
 *  1. Generate src/data/screenshots.json from the capture manifests, so the
 *     <Screenshot> component gets real dimensions and never guesses.
 *
 *  2. Replace `{@literal /*} SCREENSHOT: id | ... {@literal *}/` markers in docs/ with
 *     <Screenshot id="..." />, but ONLY where an image actually exists. A
 *     marker with no capture is left exactly as it is: a marker is a visible
 *     to-do, whereas an embed pointing at a missing file is a broken page.
 *
 * Most files in this repo are CRLF. Every read normalises to \n and every write
 * restores the file's original ending, or the replacements silently fail to
 * match.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shots } from './screens.manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const SCREENS = path.join(REPO, '.screens', 'img');
const ARTIFACTS = path.join(REPO, '.screens');
const DOCS = path.join(REPO, 'docs');
const DRY = process.argv.includes('--dry');

/**
 * Marker ids that predate the register and name a shot we already have.
 * Mapped rather than recaptured: the guide pages want the same image the
 * feature page uses, and duplicating a capture doubles the bytes and the
 * chance of the two drifting apart.
 */
const ALIASES = {
  'guide-deposit-picker': 'deposit-picker',
  'guide-tv-webhook-url': 'webhook-urls',
  'signal-trace': 'webhook-history',
  'guide-tp-ladder': 'tp-ladder',
  'guide-slx-config': 'slx-setup',
  'guide-tg-connect': 'tg-channel-binding',
  'guide-tg-parse': 'tg-parse-preview',
  'tg-connect': 'tg-channel-binding',
};

// ---- 1. build the data file ------------------------------------------------
const read = (n) => {
  const p = path.join(ARTIFACTS, n);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
};
const desktop = read('manifest.desktop.json');
const mobile = read('manifest.mobile.json');
const noteById = Object.fromEntries(shots.map((s) => [s.id, s.note || '']));

const data = {};
for (const row of desktop) {
  if (!row.ok) continue;
  const file = path.join(SCREENS, cdnPath(row.file));
  if (!fs.existsSync(file)) continue;
  data[row.id] = {
    alt: (noteById[row.id] || row.id).split('.')[0],
    desktop: { src: cdnPath(row.file), width: row.width, height: row.height },
  };
}
for (const row of mobile) {
  if (!row.ok || !data[row.id]) continue;
  const file = path.join(SCREENS, cdnPath(row.file));
  if (!fs.existsSync(file)) continue;
  data[row.id].mobile = { src: cdnPath(row.file), width: row.width, height: row.height };
}

// The composed legend makes the image taller than the capture viewport, so the
// dimensions recorded at capture time are wrong for any annotated shot. Read
// the real ones out of the file header instead of trusting the manifest.
for (const [id, entry] of Object.entries(data)) {
  for (const key of ['desktop', 'mobile']) {
    if (!entry[key]) continue;
    const dim = webpSize(path.join(SCREENS, entry[key].src));
    if (dim) {
      entry[key].width = dim.width;
      entry[key].height = dim.height;
    }
  }
}

const dataDir = path.join(REPO, 'src', 'data');
if (!DRY) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'screenshots.json'), JSON.stringify(data, null, 2));
}
console.log(`screenshots.json: ${Object.keys(data).length} ids`);

// ---- 2. rewrite markers ----------------------------------------------------
const MARKER = /^([ \t]*)\{\/\*\s*SCREENSHOT:\s*([a-z0-9-]+)\s*\|([^*]*)\*\/\}[ \t]*$/gim;

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.mdx?$/.test(e.name)) files.push(p);
  }
})(DOCS);

let wired = 0;
let left = 0;
const unresolved = new Map();

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const crlf = raw.includes('\r\n');
  const text = raw.split('\r\n').join('\n');

  let changed = false;
  const next = text.replace(MARKER, (whole, indent, rawId) => {
    const id = ALIASES[rawId] || rawId;
    if (!data[id]) {
      left++;
      unresolved.set(rawId, (unresolved.get(rawId) || 0) + 1);
      return whole;
    }
    wired++;
    changed = true;
    // Keep the marker as a comment above the embed. It records the intended
    // framing and redaction, which is the only place that intent is written
    // down once the register is satisfied.
    return `${indent}${whole.trim()}\n${indent}<Screenshot id="${id}" />`;
  });

  if (changed && !DRY) {
    fs.writeFileSync(file, crlf ? next.split('\n').join('\r\n') : next);
  }
}

console.log(`markers wired: ${wired}`);
console.log(`markers left as-is (no capture): ${left}`);
if (unresolved.size) {
  console.log('\nstill outstanding:');
  for (const [id, n] of [...unresolved].sort()) {
    console.log(`  ${id.padEnd(24)} x${n}`);
  }
}
if (DRY) console.log('\n(dry run — nothing written)');

/**
 * Paths are stored relative to the screens root (<section>/<file>.webp), not
 * as repo paths. The images are hosted on brand-assets and served by jsDelivr,
 * so a repo-relative path would bake this repo's layout into every embed and
 * break the moment the CDN prefix changes.
 */
function cdnPath(file) {
  return file.split('static/img/screens/').pop();
}

/** Minimal WebP header reader: VP8X, lossy VP8 and lossless VP8L. */
function webpSize(file) {
  if (!fs.existsSync(file)) return null;
  const b = fs.readFileSync(file);
  if (b.length < 30 || b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }
  const fourcc = b.toString('ascii', 12, 16);
  if (fourcc === 'VP8X') {
    return {
      width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
      height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
    };
  }
  if (fourcc === 'VP8 ') {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (fourcc === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

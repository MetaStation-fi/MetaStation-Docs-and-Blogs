#!/usr/bin/env node
/**
 * Phase 3 screenshot capture.
 *
 *   node scripts/capture-screens.mjs --viewport desktop
 *   node scripts/capture-screens.mjs --viewport mobile
 *   node scripts/capture-screens.mjs --viewport desktop --only orderbook,webhook-urls
 *   node scripts/capture-screens.mjs --viewport desktop --dry
 *
 * Requires:
 *   - the app running locally (default http://localhost:3000, --base to change)
 *   - a Playwright storageState JSON from a real logged-in session, path in
 *     SCREENS_STATE (default: the scratchpad copy)
 *
 * Deliberately NOT wired into CI. It needs an authenticated session against the
 * live backend; putting that in CI would mean parking a real trading session in
 * a secret. It is a local, human-triggered run.
 *
 * Chrome, not bundled Chromium: the bundled download for Playwright 1.63 times
 * out on this network, and the installed Chrome is a newer build of the same
 * engine. channel:'chrome' is a deliberate choice, not a fallback.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { shots, VIEWPORTS } from './screens.manifest.mjs';
import { redactInPage, stabiliseInPage, FORBIDDEN } from './screens.redact.mjs';
import { preps } from './screens.prep.mjs';
import { annotateInPage } from './screens.annotate.mjs';
import { composeWithLegend } from './screens.compose.mjs';

// The docs' own accent, so an annotated screenshot reads as part of the page it
// sits in rather than as a marked-up foreign object. #2dd4bf on near-black is
// the dark-mode accent from custom.css; the captures are all dark-scheme.
const ANNOTATION_THEME = { accent: '#2dd4bf', onAccent: '#04211d', ink: '#e6f7f4' };
const LEGEND_THEME = {
  accent: '#2dd4bf',
  onAccent: '#04211d',
  ink: '#dbe7e5',
  muted: '#8aa5a1',
  panel: '#0d1614',
  canvas: '#0d1614',
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
// Captures stage OUTSIDE static/. They are published to
// MetaStation-fi/brand-assets and served by jsDelivr, so anything left in
// static/ would be copied into the build and served by the origin - which
// the whole no-images-from-origin arrangement exists to prevent.
const OUT_ROOT = path.join(REPO, '.screens', 'img');

const DEFAULT_STATE =
  'C:/Users/CHANDR~1/AppData/Local/Temp/claude/E--Projects-Metastation-fi2/eb68240c-ecf0-4156-a90d-c17bfd19c451/scratchpad/storage-state.json';

// ---- args -----------------------------------------------------------------
const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const has = (name) => argv.includes('--' + name);

const viewportName = arg('viewport', 'desktop');
const base = arg('base', 'http://localhost:3000').replace(/\/$/, '');
const statePath = process.env.SCREENS_STATE || arg('state', DEFAULT_STATE);
const only = arg('only', '').split(',').map((s) => s.trim()).filter(Boolean);
const dry = has('dry');

const viewport = VIEWPORTS[viewportName];
if (!viewport) {
  console.error(`unknown viewport '${viewportName}'. Known: ${Object.keys(VIEWPORTS).join(', ')}`);
  process.exit(2);
}

const suffix = viewportName === 'desktop' ? '' : `--${viewportName}`;

// ---- session --------------------------------------------------------------
if (!fs.existsSync(statePath)) {
  console.error(`No storage state at ${statePath}`);
  console.error('Log in once in a browser, export localStorage as a Playwright storageState, and pass --state.');
  process.exit(2);
}
const storageState = JSON.parse(fs.readFileSync(statePath, 'utf8'));

// sessionStorage is NOT part of storageState and does not survive a new context.
// The app reads activeExchange/subAcc/platformmode from it (see resolveExchange
// in constant.js), so without seeding, every shot silently renders the default
// venue instead of the one that was on screen when the session was captured.
const sessionSeedPath = path.join(path.dirname(statePath), 'session-storage.json');
const sessionSeed = fs.existsSync(sessionSeedPath)
  ? JSON.parse(fs.readFileSync(sessionSeedPath, 'utf8'))
  : [];

// ---- run ------------------------------------------------------------------
const selected = shots.filter((s) => (only.length ? only.includes(s.id) : true));
const auto = selected.filter((s) => s.mode !== 'manual');
const manual = selected.filter((s) => s.mode === 'manual');

console.log(`\ncapture-screens — ${viewportName} ${viewport.width}x${viewport.height} @${viewport.deviceScaleFactor}x`);
console.log(`base=${base}  shots=${auto.length} automated, ${manual.length} manual\n`);

if (dry) {
  for (const s of selected) console.log(`  ${s.mode.padEnd(6)} ${s.id.padEnd(24)} ${s.url || '-'}`);
  process.exit(0);
}

const results = [];
const browser = await chromium.launch({ headless: true, channel: 'chrome' });

// The AppKit init failure on a localhost origin is racy: the same route lands
// on the error boundary on one run and renders fine on the next. One retry
// turns that coin-flip into a reliable result without papering over a route
// that is genuinely broken, which fails both attempts.
const ATTEMPTS = 2;

for (const shot of auto) {
 let result;
 for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const outDir = path.join(OUT_ROOT, shot.section);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${shot.id}${suffix}.png`);
  const rel = path.relative(REPO, outFile).replace(/\\/g, '/');

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: viewport.isMobile,
    hasTouch: viewport.isMobile,
    storageState: shot.anon ? undefined : storageState,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  });

  if (!shot.anon && sessionSeed.length) {
    await context.addInitScript((entries) => {
      try {
        for (const e of entries) sessionStorage.setItem(e.name, e.value);
      } catch { /* storage disabled */ }
    }, sessionSeed);
  }

  // SAFETY, non-negotiable.
  //
  // The local frontend is pointed at the PRODUCTION backend, so a prep routine
  // clicking "Withdraw" or "Regenerate Secret" would act on a real account with
  // real funds. Capturing docs must never be able to mutate state, so every
  // non-idempotent request to the API is aborted at the network layer.
  //
  // This is enforced here rather than by writing careful prep routines: a
  // careful routine is one edit away from not being careful, and the blast
  // radius is somebody's money.
  // This API reads over POST (getBalance, getOpenOrders, klineData...), so
  // "block every POST" starves the page of the data the screenshot exists to
  // show. Policy is therefore default-deny with a read allowlist: a request has
  // to look like a read to get through, and anything unrecognised is refused.
  // Erring toward blocking costs a screenshot; erring toward allowing costs
  // real money or a regenerated production secret.
  const READ_LIKE = /^(get|list|fetch|search|query|check|validate|estimate|preview|calc)/i;
  const READ_NOUNS = /(kline|markettop|ticker|history|chart|depth|orderbook|balance|assets|orders)/i;
  const blockedWrites = [];
  const allowedPosts = [];
  await context.route('**/metastationapi/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return route.continue();

    const pathname = new URL(req.url()).pathname;
    const last = pathname.split('/').filter(Boolean).pop() || '';
    const isRead = READ_LIKE.test(last) || READ_NOUNS.test(last);
    // Explicit denies win over a read-looking name, for the verbs that cost
    // something irreversible.
    const isMutation = /(create|regenerate|delete|remove|cancel|place|submit|transfer|withdraw|deposit|update|enable|disable|activate|buy|sell|pay)/i.test(last)
      && !READ_LIKE.test(last);

    if (isRead && !isMutation) {
      allowedPosts.push(`POST ${pathname}`);
      return route.continue();
    }
    blockedWrites.push(`${method} ${pathname}`);
    return route.abort('blockedbyclient');
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const runtimeErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)); });
  // An uncaught React error still renders a page, so navigation succeeding is
  // not evidence the shot is usable. Record these and surface them per shot.
  page.on('pageerror', (e) => runtimeErrors.push(e.message.split('\n')[0].slice(0, 160)));

  result = { id: shot.id, section: shot.section, viewport: viewportName, file: rel, attempt };

  try {
    await page.goto(base + shot.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // networkidle is unreachable: the venue sockets stream continuously and the
    // backend socket reconnect-loops. Settle on a timer instead.
    await page.waitForTimeout(shot.settle || 2500);

    const landed = new URL(page.url()).pathname;
    const wanted = new URL(base + shot.url).pathname;
    if (!shot.anon && /\/login$/.test(landed) && !/\/login$/.test(wanted)) {
      throw new Error(`bounced to /login — the session did not restore (wanted ${wanted})`);
    }
    result.landedOn = landed;

    // Strip the dev overlay BEFORE prep, not just before the shot: it covers
    // the viewport, so Playwright's actionability check treats every control
    // underneath as obscured and every click times out. This is what made the
    // Add Slots and API-key preps fail even though both buttons were present.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll(
        'iframe#webpack-dev-server-client-overlay, [id*="webpack-dev-server"]'
      )) el.remove();
    });

    if (shot.mode === 'prep') {
      const fn = preps[shot.prep];
      if (!fn) throw new Error(`no prep routine named '${shot.prep}'`);
      await fn(page);
      await page.waitForTimeout(800);
    }

    // Bring the point of the shot into frame. Without this a capture can be
    // technically successful and still miss the thing it exists to show - the
    // webhook URL sat just below the 900px fold on the first run.
    if (shot.scrollTo) {
      const target = page.locator(shot.scrollTo).first();
      if (await target.count()) {
        // scrollIntoViewIfNeeded treats a sliver at the bottom edge as "in
        // view" and does nothing, which is how the webhook URL stayed clipped
        // off two runs in a row. Centre it unconditionally instead.
        await target.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
        await page.waitForTimeout(700);
      } else if (!shot.scrollOptional) {
        throw new Error(`scrollTo target not found: ${shot.scrollTo}`);
      }
    }

    await page.evaluate(stabiliseInPage);
    const report = await page.evaluate(redactInPage, {
      forbidden: FORBIDDEN,
      extraSelectors: shot.redact || [],
    });

    if (report.leaks.length) {
      throw new Error(`LEAK: '${report.leaks.join(', ')}' still visible after redaction`);
    }

    // Guard against capturing a shell. A crashed route can still paint the
    // chrome - nav, sidebar - while the actual panel is gone, which produces a
    // plausible-looking but useless image.
    const substance = await page.evaluate(() => {
      const main = document.querySelector('main, #main-content, [role="main"]') || document.body;
      return (main.innerText || '').trim().length;
    });
    if (substance < 120) {
      throw new Error(`page rendered almost no content (${substance} chars) — likely a crashed route`);
    }

    // The app's error boundary renders a full, substantial-looking page, so the
    // character count above sails past it. Match its copy explicitly.
    const boundary = await page.evaluate(() =>
      /oops! something went wrong|encountered an unexpected error/i.test(document.body.innerText || '')
    );
    if (boundary) {
      throw new Error('app error boundary rendered — the route crashed');
    }

    // Annotations go on last, after redaction, so a callout can point at a
    // masked value without the masker walking over the label text.
    let annotation = null;
    const annotations = shot.annotate?.[viewportName] ?? shot.annotate?.all ?? shot.annotate;
    const wantLegend = Array.isArray(annotations) && annotations.length > 0;
    if (wantLegend) {
      annotation = await page.evaluate(annotateInPage, {
        annotations,
        ...ANNOTATION_THEME,
        withLabels: false,
      });
      if (annotation.missing.length) {
        throw new Error(`annotation target(s) not found: ${annotation.missing.join(', ')}`);
      }
    }

    if (wantLegend && annotation.labels.some(Boolean)) {
      const raw = await page.screenshot({ fullPage: !!shot.fullPage });
      const composed = await composeWithLegend({
        browser,
        pngBuffer: raw,
        labels: annotation.labels,
        cssWidth: viewport.width,
        deviceScaleFactor: viewport.deviceScaleFactor,
        theme: LEGEND_THEME,
        title: shot.legendTitle,
      });
      fs.writeFileSync(outFile, composed);
    } else {
      await page.screenshot({ path: outFile, fullPage: !!shot.fullPage });
    }
    const { width, height } = viewport;
    Object.assign(result, {
      ok: true,
      width: width * viewport.deviceScaleFactor,
      height: height * viewport.deviceScaleFactor,
      cssWidth: width,
      cssHeight: height,
      masked: [...new Set(report.masked)],
      maskCount: report.masked.length,
      hiddenForbidden: report.hidden,
      consoleErrors: consoleErrors.length,
      runtimeErrors: [...new Set(runtimeErrors)],
      blockedWrites: [...new Set(blockedWrites)],
      annotations: annotation ? annotation.drawn.length : 0,
    });
    const flags = [
      report.masked.length ? `masked ${report.masked.length}` : '',
      report.hidden ? `hid ${report.hidden} venue node(s)` : '',
      runtimeErrors.length ? `⚠ ${runtimeErrors.length} runtime error(s)` : '',
      blockedWrites.length ? `🛑 blocked ${blockedWrites.length} write(s)` : '',
      annotation ? `✎ ${annotation.drawn.length} annotation(s)` : '',
    ].filter(Boolean).join(', ');
    console.log(`  ok    ${shot.id.padEnd(24)} ${rel}${flags ? '  [' + flags + ']' : ''}`);
  } catch (err) {
    result.ok = false;
    result.error = err.message.split('\n')[0];
    // Delete any image left by an earlier run. A failing shot that leaves a
    // stale PNG behind is worse than no image: the doc still renders, nobody
    // notices, and the page shows a screenshot of a state that no longer
    // captures cleanly. Failure must be visible.
    if (attempt === ATTEMPTS) {
      try {
        if (fs.existsSync(outFile)) {
          fs.unlinkSync(outFile);
          result.removedStale = true;
        }
      } catch { /* nothing to remove */ }
    }
    console.log(`  FAIL  ${shot.id.padEnd(24)} ${result.error}`);
  }

  await context.close();
  if (result.ok) break;
  if (attempt < ATTEMPTS) console.log(`  retry ${shot.id.padEnd(22)} after: ${result.error}`);
 }
 results.push(result);
}

await browser.close();

for (const s of manual) {
  results.push({ id: s.id, section: s.section, viewport: viewportName, ok: false, manual: true, error: s.note });
  console.log(`  skip  ${s.id.padEnd(24)} manual — ${s.note}`);
}

// ---- manifest -------------------------------------------------------------
// Embeds need explicit width/height or they cost CLS, which feeds the Core Web
// Vitals this project exists to improve. Emit the dimensions so the MDX does
// not have to guess.
fs.mkdirSync(OUT_ROOT, { recursive: true });
// Manifests live OUTSIDE static/. They record blocked-write endpoints,
// which include the venue name and an account id - published from
// static/ they tripped the CI leak check, and a build artifact has no
// business being a site asset regardless.
const ARTIFACTS = path.join(REPO, '.screens');
fs.mkdirSync(ARTIFACTS, { recursive: true });
const manifestPath = path.join(ARTIFACTS, `manifest.${viewportName}.json`);
fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));

const ok = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok && !r.manual);
console.log(`\n  ${ok} captured, ${failed.length} failed, ${manual.length} manual`);
console.log(`  manifest: ${path.relative(REPO, manifestPath).replace(/\\/g, '/')}\n`);
process.exit(failed.length ? 1 : 0);

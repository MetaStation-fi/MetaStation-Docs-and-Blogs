#!/usr/bin/env node
/**
 * Export a Playwright session for the screenshot programme.
 *
 *   node scripts/capture-login.mjs
 *   node scripts/capture-login.mjs --base http://localhost:3000 --timeout 900
 *
 * Opens a REAL browser window, parks it on the login page, and waits for you to
 * sign in by hand. The moment it sees an authenticated session it writes both
 * halves of the state that capture-screens.mjs needs, then closes:
 *
 *   <SCREENS_STATE dir>/storage-state.json    cookies + localStorage
 *   <SCREENS_STATE dir>/session-storage.json  sessionStorage (NOT in storageState)
 *
 * sessionStorage is the half everyone forgets. Playwright's storageState does not
 * include it, and the app reads activeExchange / subAcc / platformmode from it,
 * so a session exported without it renders the wrong venue on every shot.
 *
 * Headed and human-driven on purpose: the credentials never reach this process,
 * and nothing is stored beyond the resulting token blob.
 *
 * Chrome, not bundled Chromium — same reasoning as capture-screens.mjs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const base = arg('base', 'http://localhost:3000').replace(/\/$/, '');
const timeoutSec = parseInt(arg('timeout', '900'), 10);

const DEFAULT_STATE =
  'C:/Users/CHANDR~1/AppData/Local/Temp/claude/E--Projects-Metastation-fi2/70760f8e-b222-4937-83c4-39f5cae735c2/scratchpad/storage-state.json';
const statePath = process.env.SCREENS_STATE || arg('state', DEFAULT_STATE);
const outDir = path.dirname(statePath);
const sessionPath = path.join(outDir, 'session-storage.json');

fs.mkdirSync(outDir, { recursive: true });

// The app stores its auth blob under `user`. Treat that key appearing in
// localStorage, on a page that is no longer the login screen, as "signed in".
const AUTH_KEY = 'user';

console.log(`\ncapture-login`);
console.log(`  base    : ${base}`);
console.log(`  writes  : ${statePath}`);
console.log(`            ${sessionPath}`);
console.log(`  timeout : ${timeoutSec}s\n`);

const browser = await chromium.launch({ headless: false, channel: 'chrome' });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'dark',
});
const page = await context.newPage();

await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded' }).catch(() => {});

console.log('  >> A browser window is open. Sign in there.');
console.log('  >> Pick the account and venue you want the screenshots taken on,');
console.log('  >> then leave it on any signed-in page. Detection is automatic.\n');

const deadline = Date.now() + timeoutSec * 1000;
let signedIn = false;

while (Date.now() < deadline) {
  await page.waitForTimeout(2000);
  try {
    const state = await page.evaluate((key) => ({
      href: location.href,
      hasAuth: !!window.localStorage.getItem(key),
    }), AUTH_KEY);

    if (state.hasAuth && !/\/login\b/.test(state.href)) {
      signedIn = true;
      break;
    }
  } catch {
    // Mid-navigation; the next poll picks it up.
  }
}

if (!signedIn) {
  console.error(`\n  No signed-in session detected within ${timeoutSec}s. Nothing written.`);
  await browser.close();
  process.exit(2);
}

// Let the app finish writing whatever it sets right after auth.
await page.waitForTimeout(3000);

const sessionEntries = await page.evaluate(() => {
  const out = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const name = sessionStorage.key(i);
    out.push({ name, value: sessionStorage.getItem(name) });
  }
  return out;
});

const storageState = await context.storageState();
fs.writeFileSync(statePath, JSON.stringify(storageState, null, 2));
fs.writeFileSync(sessionPath, JSON.stringify(sessionEntries, null, 2));

const origins = (storageState.origins || []).map((o) => o.origin).join(', ') || '(none)';
const lsCount = (storageState.origins || []).reduce((n, o) => n + (o.localStorage || []).length, 0);

console.log('  signed-in session captured.');
console.log(`    origins        : ${origins}`);
console.log(`    cookies        : ${(storageState.cookies || []).length}`);
console.log(`    localStorage   : ${lsCount} entries`);
console.log(`    sessionStorage : ${sessionEntries.length} entries`);
const seeded = sessionEntries.filter((e) =>
  ['activeExchange', 'subAcc', 'platformmode'].includes(e.name)
);
console.log(`    venue seed     : ${seeded.map((e) => `${e.name}=${e.value}`).join('  ') || 'MISSING — shots may render the default venue'}`);
console.log('\n  Run the captures with:');
console.log(`    SCREENS_STATE="${statePath}" node scripts/capture-screens.mjs --viewport desktop\n`);

await browser.close();

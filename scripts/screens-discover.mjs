#!/usr/bin/env node
/**
 * Target discovery for annotations.
 *
 *   node scripts/screens-discover.mjs > /tmp/targets.json
 *
 * Visits every distinct route in the manifest with the restored session and
 * dumps the elements worth pointing at - headings, buttons, tabs, field labels,
 * stat rows. Annotation targets are then written from what the page actually
 * contains rather than from a guess, which is what made the first pass fail
 * with "annotation target not found".
 *
 * Read-only: it reuses the runner's write-blocking route policy.
 */

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { shots } from './screens.manifest.mjs';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:3000';
const STATE =
  process.env.SCREENS_STATE ||
  'C:/Users/CHANDR~1/AppData/Local/Temp/claude/E--Projects-Metastation-fi2/eb68240c-ecf0-4156-a90d-c17bfd19c451/scratchpad/storage-state.json';

const storageState = JSON.parse(fs.readFileSync(STATE, 'utf8'));
const seedPath = path.join(path.dirname(STATE), 'session-storage.json');
const sessionSeed = fs.existsSync(seedPath) ? JSON.parse(fs.readFileSync(seedPath, 'utf8')) : [];

const urls = [...new Set(shots.filter((s) => s.url).map((s) => s.url))];
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const out = {};

for (const url of urls) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    storageState,
    colorScheme: 'dark',
  });
  await ctx.route('**/metastationapi/**', (route) => {
    const m = route.request().method().toUpperCase();
    const last = new URL(route.request().url()).pathname.split('/').filter(Boolean).pop() || '';
    const read = /^(get|list|fetch|search|query|check|validate|estimate|preview|calc)/i.test(last);
    if (m === 'GET' || m === 'HEAD' || m === 'OPTIONS' || read) return route.continue();
    return route.abort('blockedbyclient');
  });
  if (sessionSeed.length) {
    await ctx.addInitScript((entries) => {
      try { for (const e of entries) sessionStorage.setItem(e.name, e.value); } catch {}
    }, sessionSeed);
  }

  const page = await ctx.newPage();
  try {
    await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('iframe#webpack-dev-server-client-overlay, [id*="webpack-dev-server"]')) el.remove();
    });
    out[url] = await page.evaluate(() => {
      const seen = new Set();
      const pick = [];
      const sel = 'h1,h2,h3,h4,button,[role="tab"],label,th,legend,summary,a[class*="btn"],[class*="card"] h3,[class*="stat"],[class*="label"]';
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        if (r.top > 1800) continue;
        const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join(' ').trim().replace(/\s+/g, ' ');
        const text = (own || el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70);
        if (!text || seen.has(text)) continue;
        seen.add(text);
        const cls = (el.className || '').toString().trim().split(/\s+/).filter((c) => /^[a-z][\w-]*$/i.test(c)).slice(0, 2);
        pick.push({
          tag: el.tagName,
          text,
          cls: cls.join('.'),
          y: Math.round(r.top),
        });
      }
      return pick.sort((a, b) => a.y - b.y).slice(0, 30);
    });
  } catch (e) {
    out[url] = { error: e.message.split('\n')[0] };
  }
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 1));

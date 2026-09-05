#!/usr/bin/env node
/**
 * Cumulative Layout Shift diagnosis.
 *
 *   node scripts/cls-probe.mjs                       # default page set
 *   node scripts/cls-probe.mjs --url /docs/ --url /blogs/
 *   node scripts/cls-probe.mjs --base http://localhost:3112
 *
 * Lighthouse reports a CLS number; it does not tell you which element moved.
 * This records every layout-shift entry with its sources, so a 0.102 score
 * becomes a named list of nodes to fix.
 *
 * Deliberately throttles CPU and network: layout shift is a race between font
 * and image loading and first paint, and on an unthrottled local build the
 * race is usually won before it can be observed. An unthrottled run reporting
 * 0.000 is not evidence of a fix.
 */

import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const argAll = (name) => argv.reduce((acc, v, i) => (v === '--' + name && argv[i + 1] ? [...acc, argv[i + 1]] : acc), []);
const arg = (name, fallback) => (argAll(name)[0] ?? fallback);

const base = arg('base', 'http://localhost:3112').replace(/\/$/, '');
const urls = argAll('url').length
  ? argAll('url')
  : [
      '/docs/',
      '/docs/guides/',
      '/docs/guides/tradingview-webhook-to-binance',
      '/docs/trading/connect-exchange',
      '/docs/automation/webhook-trading',
      '/docs/developer/payload-builder',
      '/blogs/',
    ];

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const rows = [];

for (const url of urls) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  // Throttle like Lighthouse's desktop preset does, so the font swap and image
  // decode land after first paint the way they do for a real visitor.
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 40,
    downloadThroughput: (10 * 1024 * 1024) / 8,
    uploadThroughput: (10 * 1024 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__shifts.push({
          value: e.value,
          time: Math.round(e.startTime),
          sources: (e.sources || []).map((s) => ({
            node: s.node
              ? (s.node.nodeName || '') +
                (s.node.id ? '#' + s.node.id : '') +
                (s.node.className && typeof s.node.className === 'string'
                  ? '.' + s.node.className.trim().split(/\s+/).slice(0, 2).join('.')
                  : '')
              : '(detached)',
            from: s.previousRect ? `${Math.round(s.previousRect.y)}x${Math.round(s.previousRect.height)}` : '',
            to: s.currentRect ? `${Math.round(s.currentRect.y)}x${Math.round(s.currentRect.height)}` : '',
          })),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(base + url, { waitUntil: 'load', timeout: 60000 });
  // Scroll once: lazy images below the fold only shift when they enter view.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  const shifts = await page.evaluate(() => window.__shifts || []);
  const total = shifts.reduce((s, x) => s + x.value, 0);
  rows.push({ url, total, shifts });

  const flag = total > 0.1 ? 'OVER' : total > 0.05 ? 'warn' : 'ok';
  console.log(`\n${flag.padEnd(5)} ${url.padEnd(48)} CLS ${total.toFixed(4)}  (${shifts.length} shift${shifts.length === 1 ? '' : 's'})`);
  for (const s of shifts.sort((a, b) => b.value - a.value).slice(0, 5)) {
    const who = s.sources.map((x) => `${x.node} ${x.from}->${x.to}`).join(' ; ') || '(no source)';
    console.log(`        ${s.value.toFixed(4)} @${s.time}ms  ${who}`);
  }
  await ctx.close();
}

await browser.close();

const worst = rows.slice().sort((a, b) => b.total - a.total)[0];
console.log(`\nworst: ${worst.url} at ${worst.total.toFixed(4)}`);
console.log(`budget: 0.1 — ${worst.total > 0.1 ? 'EXCEEDED' : 'within budget'}`);
process.exit(0);

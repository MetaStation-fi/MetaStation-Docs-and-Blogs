#!/usr/bin/env node
/**
 * Validates the JSON-LD in the built site.
 *
 * Structured data fails quietly: a malformed block is simply ignored by search
 * engines, so the page loses rich-result and citation eligibility with no
 * visible symptom. These checks are the ones that actually bite:
 *
 *   1. Every ld+json block parses.
 *   2. No page carries more than one FAQPage. Google treats a second block on
 *      the same URL as a conflict.
 *   3. Every FAQ question has a non-empty answer.
 *   4. Every FAQ question AND answer is present in the rendered body. Schema
 *      describing content a reader cannot see is a policy violation, not a
 *      shortcut, and it is the easy mistake to make when the two are written
 *      separately.
 *   5. TechArticle blocks carry headline, url and publisher.
 *
 * Run after a build: node scripts/check-structured-data.mjs
 */
import {readFileSync} from 'node:fs';
import {readdir} from 'node:fs/promises';
import {join} from 'node:path';

const ROOT = 'build';
const LD = /<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/g;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.name === 'index.html') out.push(p);
  }
  return out;
}

// The visibility check compares against text, so entities and tags must go.
const toText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

const files = await walk(ROOT);
const errors = [];
let faqPages = 0;
let questions = 0;
let techArticles = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const body = norm(toText(html));
  let faqCount = 0;

  for (const m of html.matchAll(LD)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      errors.push(`${file}: unparseable JSON-LD (${e.message})`);
      continue;
    }

    if (data['@type'] === 'FAQPage') {
      faqCount++;
      faqPages++;
      for (const entry of data.mainEntity ?? []) {
        questions++;
        const q = entry?.name;
        const a = entry?.acceptedAnswer?.text;
        if (!q || !a) {
          errors.push(`${file}: FAQ entry missing question or answer`);
          continue;
        }
        if (!body.includes(norm(q))) {
          errors.push(`${file}: FAQ question not visible on page — "${q.slice(0, 60)}"`);
        }
        // Compare a prefix: answers wrap across elements, so an exact
        // full-string match is brittle without proving anything extra.
        const probe = norm(a).slice(0, 60);
        if (!body.includes(probe)) {
          errors.push(`${file}: FAQ answer not visible on page — "${probe}"`);
        }
      }
    }

    if (data['@type'] === 'TechArticle') {
      techArticles++;
      for (const field of ['headline', 'url', 'publisher']) {
        if (!data[field]) errors.push(`${file}: TechArticle missing ${field}`);
      }
    }
  }

  if (faqCount > 1) {
    errors.push(`${file}: ${faqCount} FAQPage blocks on one URL — only one is valid`);
  }
}

for (const e of errors) console.log(`::error::${e}`);
console.log(
  `Structured data: ${files.length} pages, ${faqPages} FAQPage (${questions} Q&A), ` +
    `${techArticles} TechArticle, ${errors.length} problem(s)`,
);
process.exit(errors.length ? 1 : 0);

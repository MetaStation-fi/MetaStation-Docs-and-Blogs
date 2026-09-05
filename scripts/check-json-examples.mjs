#!/usr/bin/env node
/**
 * Every ```json block in docs/ must parse.
 *
 * This gate exists because of a real incident: the developer docs shipped a
 * take-profit shape the backend parser rejects, and nothing caught it. Invalid
 * JSON is a weaker check than "matches the API schema", but it is cheap, has no
 * false positives, and catches the most common class of copy-paste breakage —
 * a trailing comma, a stray comment, an unquoted key.
 *
 * Blocks may contain `//` comments (we use them to annotate quantity formats)
 * and may hold several standalone objects, one per line, so both are tolerated.
 *
 * Run: node scripts/check-json-examples.mjs
 */
import {readFileSync} from 'node:fs';
import {readdir} from 'node:fs/promises';
import {join} from 'node:path';

const ROOT = 'docs';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.mdx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

const parses = (s) => {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
};

const files = await walk(ROOT);
let ok = 0;
const failures = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/```json\r?\n([\s\S]*?)```/g)) {
    const body = match[1]
      .split(/\r?\n/)
      .map((l) => l.replace(/\s*\/\/.*$/, ''))
      .join('\n')
      .trim();

    if (parses(body)) {
      ok++;
      continue;
    }

    // A block may show several independent one-line objects.
    const lines = body.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length > 1 && lines.every(parses)) {
      ok++;
      continue;
    }

    const line = text.slice(0, match.index).split(/\r?\n/).length;
    failures.push({file, line, preview: body.slice(0, 80).replace(/\s+/g, ' ')});
  }
}

for (const f of failures) {
  console.log(`::error file=${f.file},line=${f.line}::Unparseable JSON example: ${f.preview}`);
}

console.log(`JSON examples checked: ${ok + failures.length} (${ok} ok, ${failures.length} failed)`);
process.exit(failures.length ? 1 : 0);

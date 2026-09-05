#!/usr/bin/env node
/**
 * Turn published GitHub releases into changelog blog posts.
 *
 *   node scripts/changelog-from-releases.mjs                    # newest 20
 *   node scripts/changelog-from-releases.mjs --tag v1.4.0       # just this one
 *   node scripts/changelog-from-releases.mjs --repo owner/name
 *   node scripts/changelog-from-releases.mjs --dry-run
 *   node scripts/changelog-from-releases.mjs --force            # rewrite existing
 *   node scripts/changelog-from-releases.mjs --fixture x.json --dry-run
 *
 * ── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * The docs are 53 static pages. Crawlers learn how often a site changes and
 * come back at that rate, and AI answer engines skew hard toward recently
 * updated pages — so the blog is the crawl-frequency engine, and a changelog
 * is the only content line whose supply does not depend on somebody finding
 * time to write. Release notes already exist; this turns them into indexable
 * pages for free.
 *
 * ── THE THREE THINGS THAT MAKE IT SAFE ─────────────────────────────────────
 *
 * 1. MDX SANITISATION. Docusaurus 3 parses `.md` as MDX, so a release note
 *    containing `<!-- -->`, a bare `<`, or a stray `{` is a HARD BUILD ERROR
 *    on a file nobody wrote by hand. Release bodies are written by whoever cut
 *    the release, and auto-generated notes contain `@handles` and compare
 *    URLs. Everything outside code spans is escaped or converted — see
 *    sanitiseForMdx.
 *
 * 2. A LEAK GATE, BEFORE WRITING. The repo's CI checks the BUILD for the venue
 *    name, the provider name and the origin hostname. Release notes are the
 *    one content source not written under that discipline, and an internal tag
 *    naming the venue would otherwise ship a permanent leak. A match here
 *    refuses to write the file and exits non-zero, so the failure lands on the
 *    changelog job rather than as a mystery in the deploy gate.
 *
 * 3. IDEMPOTENCE. A post that already exists is left alone unless --force.
 *    Editing a release on GitHub must not silently rewrite a published post
 *    whose URL is already indexed.
 *
 * ── WHICH REPOSITORY ───────────────────────────────────────────────────────
 * Defaults to the docs repo, which is the one the team can cut releases on and
 * the one this workflow runs in. Point it elsewhere with --repo or
 * CHANGELOG_SOURCE_REPO when the product repo starts publishing releases.
 *
 * Auth is optional (public repos work unauthenticated, at 60 requests/hour).
 * GITHUB_TOKEN is used when present.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sanitiseForMdx, demoteHeadings } from './lib/mdx-safe.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'blog', 'changelog');

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const repo =
  arg('repo', process.env.CHANGELOG_SOURCE_REPO) ||
  'MetaStation-fi/MetaStation-Docs-and-Blogs';
const onlyTag = arg('tag', null);
const limit = Number(arg('limit', '20'));
const dryRun = flag('dry-run');
const force = flag('force');
const includePrerelease = flag('include-prerelease');

/* Must match the CI leak gate. Kept as one list so the two cannot drift into
   disagreeing about what a leak is. */
const FORBIDDEN = [/hyperliquid/i, /symbiosis/i, /docs-origin/i];

/* The tag must exist in blog/tags.yml and the author in blog/authors.yml —
   onInlineTags and onInlineAuthors are both 'throw', so a typo here is a build
   failure rather than a stray taxonomy page. */
const POST_TAGS = ['changelog', 'announcement'];
const POST_AUTHOR = 'metastation';

function firstSentence(body) {
  const line = body
    .split('\n')
    .map((l) => l.trim())
    .find(
      (l) =>
        l !== '' &&
        !l.startsWith('#') &&
        !l.startsWith('```') &&
        !l.startsWith('|') &&
        !l.startsWith('<'),
    );
  if (!line) return null;
  const plain = line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Leading list/quote markers only. Stripping `-` everywhere turned
    // "Take-profit ladders" into "Takeprofit ladders" in the meta description,
    // which is the one line a search result shows.
    .replace(/^[-*+>\s]+/, '')
    .replace(/[*_`]/g, '')
    .replace(/&#12[35];/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length < 20) return null;
  return plain.length > 155 ? `${plain.slice(0, 152).trimEnd()}…` : plain;
}

function slugifyTag(tag) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* JSON is a subset of YAML for double-quoted scalars, so this is a correct and
   complete escape for a title containing a colon, a quote or a backslash. */
const yamlString = (s) => JSON.stringify(String(s));

/* ── GitHub ─────────────────────────────────────────────────────────────── */

async function fetchReleases() {
  /* A local JSON file shaped like the GitHub releases response. The point is
     to be able to exercise the generator — and above all the MDX
     sanitisation — against a release note full of hazards BEFORE a real
     release exists, rather than discovering the escaping was wrong when the
     changelog workflow fires for the first time on a live tag. Combine with
     --dry-run to print what would be written without touching blog/. */
  const fixture = arg('fixture', null);
  if (fixture) {
    const json = JSON.parse(fs.readFileSync(path.resolve(fixture), 'utf8'));
    return Array.isArray(json) ? json : [json];
  }

  const headers = {
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'metastation-docs-changelog',
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;

  const url = onlyTag
    ? `https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(onlyTag)}`
    : `https://api.github.com/repos/${repo}/releases?per_page=${Math.min(limit, 100)}`;

  const res = await fetch(url, { headers });
  if (res.status === 404) {
    // A repo with no releases yet is the expected state, not a failure. The
    // workflow runs on `release: published`, so the first real release is what
    // makes this script produce anything at all.
    console.log(`No releases found for ${repo}${onlyTag ? ` tagged ${onlyTag}` : ''}.`);
    return [];
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}`);
  }
  const json = await res.json();
  return Array.isArray(json) ? json : [json];
}

/* ── Post generation ────────────────────────────────────────────────────── */

function buildPost(release) {
  const tag = release.tag_name;
  const tagSlug = slugifyTag(tag);
  const date = (release.published_at ?? release.created_at ?? '').slice(0, 10);
  const title = (release.name || '').trim() || `MetaStation ${tag}`;

  const rawBody = (release.body ?? '').replace(/\r\n/g, '\n').trim();
  const body = demoteHeadings(sanitiseForMdx(rawBody));

  const description =
    firstSentence(body) ?? `Everything that shipped in MetaStation ${tag}.`;

  // The lead paragraph sits above the truncate marker, so it is what the blog
  // index card shows. onUntruncatedBlogPosts is 'throw', so the marker is not
  // optional — without it the whole release note renders on /blogs.
  const lead = `**${title}** shipped on ${new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })}. Here is everything in this release.`;

  const frontMatter = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `slug: changelog/${tagSlug}`,
    `date: ${date}`,
    `authors: [${POST_AUTHOR}]`,
    `tags: [${POST_TAGS.join(', ')}]`,
    '---',
  ].join('\n');

  const content = [
    frontMatter,
    '',
    lead,
    '',
    '{/* truncate */}',
    '',
    body || '_No release notes were published for this tag._',
    '',
    '---',
    '',
    `[Release ${tag} on GitHub](${release.html_url})`,
    '',
  ].join('\n');

  return {
    tag,
    date,
    title,
    content,
    file: path.join(OUT_DIR, `${date}-${tagSlug}.md`),
  };
}

function assertNoLeak(post) {
  for (const pattern of FORBIDDEN) {
    const hit = post.content.match(pattern);
    if (hit) {
      throw new Error(
        `Release ${post.tag} contains "${hit[0]}", which must never reach the ` +
          `published docs. Edit the release notes on GitHub and re-run, or ` +
          `write this entry by hand. Nothing was written.`,
      );
    }
  }
}

/* ── Main ───────────────────────────────────────────────────────────────── */

const releases = (await fetchReleases())
  .filter((r) => !r.draft)
  .filter((r) => includePrerelease || !r.prerelease)
  .slice(0, limit);

if (releases.length === 0) {
  console.log('Nothing to generate.');
  process.exit(0);
}

const posts = releases.map(buildPost);
posts.forEach(assertNoLeak);

fs.mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let skipped = 0;

for (const post of posts) {
  const exists = fs.existsSync(post.file);
  if (exists && !force) {
    skipped += 1;
    console.log(`skip   ${path.relative(ROOT, post.file)} (exists)`);
    continue;
  }
  if (dryRun) {
    console.log(`would ${exists ? 'rewrite' : 'write'} ${path.relative(ROOT, post.file)}`);
    continue;
  }
  fs.writeFileSync(post.file, post.content, 'utf8');
  written += 1;
  console.log(`${exists ? 'rewrite' : 'write '} ${path.relative(ROOT, post.file)}`);
}

console.log(
  `\n${repo}: ${posts.length} release(s), ${written} written, ${skipped} already present.`,
);

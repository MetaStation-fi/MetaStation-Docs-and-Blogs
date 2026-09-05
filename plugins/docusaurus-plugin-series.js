const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Blog series — ordered multi-part posts.
 *
 * ── WHY A PLUGIN AND NOT FRONT MATTER ──────────────────────────────────────
 * A post can say "I am part 3 of the webhook series" in its own front matter,
 * but it cannot say what parts 1, 2 and 4 are — a blog post is rendered with
 * only its own metadata in scope. Series navigation is inherently cross-post
 * knowledge, and the only place that exists at build time is a plugin.
 *
 * Authoring the order in one file rather than inferring it from dates has a
 * second payoff: a series is a deliberate reading order, and dates are not.
 * Publishing part 4 as a correction two months later must not reorder the
 * series, and back-dating a post to fix the order is the kind of thing that
 * quietly corrupts <lastmod> and the RSS feed.
 *
 * ── WHY SERIES ARE NOT TAGS ────────────────────────────────────────────────
 * Tags are unordered and a post carries several; a series is ordered and a
 * post belongs to at most one. Modelling series as tags would also multiply
 * the thin tag pages that blog/tags.yml exists to prevent. Every series lives
 * on ONE hub page instead of one page each, for the same reason.
 *
 * ── WHAT IT PRODUCES ───────────────────────────────────────────────────────
 * - Global data: the resolved series list plus a permalink → position index.
 *   `src/components/SeriesNav` reads it on a post page; `SeriesIndex` renders
 *   the hub.
 * - One route, the hub, at `hubPath` — registered ONLY when at least one
 *   series exists, so an empty series.yml adds no empty page to the sitemap.
 *
 * ── THE VALIDATION IS THE POINT ────────────────────────────────────────────
 * Every slug in series.yml is resolved against a real post file and the build
 * THROWS if one does not exist. A series nav whose "Part 3" 404s is worse than
 * no series nav, and the failure mode without this check is silent: the link
 * renders, looks right, and is dead. Same for a post listed in two series.
 */

const POST_EXTENSIONS = ['.md', '.mdx'];
const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/* Front matter is parsed here rather than pulled from the blog plugin because
   plugins cannot read each other's loaded content. It is the same delimiter
   convention Docusaurus itself uses; we only need `slug` and `title`. */
function readFrontMatter(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (!raw.startsWith('---\n')) {
    return {};
  }
  const end = raw.indexOf('\n---', 3);
  if (end === -1) {
    return {};
  }
  try {
    return yaml.load(raw.slice(4, end)) ?? {};
  } catch {
    return {};
  }
}

function collectPostFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectPostFiles(full, acc);
    } else if (POST_EXTENSIONS.includes(path.extname(entry.name))) {
      acc.push(full);
    }
  }
  return acc;
}

/**
 * Mirrors how the blog plugin derives a post slug: an explicit `slug` in front
 * matter wins, otherwise the file path relative to the blog directory with the
 * date prefix and extension stripped. `index.md` inside a folder takes the
 * folder's name.
 */
function derivePostSlug(blogDir, file, frontMatter) {
  if (typeof frontMatter.slug === 'string' && frontMatter.slug.trim() !== '') {
    return frontMatter.slug.trim().replace(/^\/+/, '');
  }
  const rel = path.relative(blogDir, file).split(path.sep);
  let last = rel.pop().replace(/\.mdx?$/, '');
  if (last === 'index' && rel.length > 0) {
    last = rel.pop();
  }
  return [...rel, last.replace(DATE_PREFIX, '')].join('/');
}

function joinUrl(base, tail) {
  return `${base.replace(/\/$/, '')}/${String(tail).replace(/^\/+/, '')}`;
}

module.exports = function seriesPlugin(context, options = {}) {
  const blogBasePath = options.blogBasePath ?? '/blogs';
  const hubPath = options.hubPath ?? joinUrl(blogBasePath, 'series');
  const blogDir = path.join(context.siteDir, options.blogDir ?? 'blog');
  const seriesFile = path.join(blogDir, options.seriesFile ?? 'series.yml');

  return {
    name: 'metastation-series',

    getPathsToWatch() {
      return [seriesFile, path.join(blogDir, '**/*.{md,mdx}')];
    },

    async loadContent() {
      const empty = { blogBasePath, hubPath, seriesList: [], byPermalink: {} };

      if (!fs.existsSync(seriesFile)) {
        return empty;
      }

      const parsed =
        yaml.load(fs.readFileSync(seriesFile, 'utf8').replace(/\r\n/g, '\n')) ?? {};
      const keys = Object.keys(parsed);
      if (keys.length === 0) {
        return empty;
      }

      /* slug → post, built once from disk. */
      const posts = new Map();
      for (const file of collectPostFiles(blogDir)) {
        const frontMatter = readFrontMatter(file);
        const slug = derivePostSlug(blogDir, file, frontMatter);
        posts.set(slug, {
          slug,
          title: frontMatter.title ?? slug,
          permalink: joinUrl(blogBasePath, slug),
        });
      }

      const seriesList = [];
      const byPermalink = {};

      for (const key of keys) {
        const entry = parsed[key] ?? {};
        const label = entry.label ?? key;
        const slugs = entry.posts ?? [];

        if (!Array.isArray(slugs) || slugs.length === 0) {
          throw new Error(
            `[metastation-series] Series "${key}" in ${seriesFile} lists no posts. ` +
              `Remove the series or give it a "posts:" list — an empty series renders ` +
              `a heading with nothing under it.`,
          );
        }

        const resolved = slugs.map((slug) => {
          const clean = String(slug).replace(/^\/+/, '');
          const post = posts.get(clean);
          if (!post) {
            throw new Error(
              `[metastation-series] Series "${key}" lists post "${clean}", which does ` +
                `not exist. Known post slugs: ${[...posts.keys()].sort().join(', ') || '(none)'}.\n` +
                `A series link that 404s renders exactly like one that works, so this ` +
                `is a build failure rather than a warning.`,
            );
          }
          return post;
        });

        /* Every series is a section of the ONE hub page, addressed by anchor.
           There is deliberately no page per series: three links and a
           paragraph each is the thin near-duplicate page that blog/tags.yml
           exists to prevent, and a route that only the series nav links to
           would be the least-read page on the site. */
        const anchor = `${hubPath}#${key}`;

        seriesList.push({
          key,
          label,
          description: entry.description ?? null,
          anchor,
          posts: resolved,
        });

        resolved.forEach((post, i) => {
          const existing = byPermalink[post.permalink];
          if (existing) {
            throw new Error(
              `[metastation-series] Post "${post.slug}" is in both "${existing.key}" and ` +
                `"${key}". A post shows one series band, so it may belong to one series. ` +
                `Use a tag if it genuinely spans both.`,
            );
          }
          byPermalink[post.permalink] = {
            key,
            label,
            seriesAnchor: anchor,
            index: i,
            total: resolved.length,
            previous: i > 0 ? resolved[i - 1] : null,
            next: i < resolved.length - 1 ? resolved[i + 1] : null,
            posts: resolved,
          };
        });
      }

      return { blogBasePath, hubPath, seriesList, byPermalink };
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);

      /* No hub route when there is nothing to put on it. A published page
         listing zero series would be indexed, would sit in the sitemap, and
         would be the thinnest page on the site. */
      if (content.seriesList.length === 0) {
        return;
      }

      actions.addRoute({
        path: content.hubPath,
        component: '@site/src/components/SeriesIndex',
        exact: true,
      });
    },
  };
};

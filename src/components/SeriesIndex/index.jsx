import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import { usePluginData } from '@docusaurus/useGlobalData';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import HeroCanvas from '@site/src/components/HeroCanvas';
import { IconArrowRight } from '@site/src/components/icons';

/**
 * The series hub, mounted by plugins/docusaurus-plugin-series.js at
 * `/blogs/series` — and ONLY when at least one series exists.
 *
 * ── ONE HUB, NOT ONE PAGE PER SERIES ───────────────────────────────────────
 * A page per series would be three or four links and a paragraph each: thin,
 * near-duplicate pages, which is the same problem blog/tags.yml exists to
 * prevent. One hub carrying every series is a page with real content on it,
 * and each series still has a stable in-page anchor to link to.
 *
 * ── EVERY CARD REGISTERS ITS OWN ANCHOR ────────────────────────────────────
 * A series is addressed as /blogs/series#<key>, and Docusaurus's broken-anchor
 * check does NOT read ids out of the built HTML — it only knows the anchors a
 * component registered through useBrokenLinks().collectAnchor(), which is how
 * the theme's Heading component does it. Without the call below, every series
 * band on every post links to an anchor the build believes is broken, and with
 * DOCUSAURUS_STRICT_LINKS that is a failed build.
 *
 * ── WHY IT CARRIES ItemList JSON-LD ────────────────────────────────────────
 * A reading order is exactly what `ItemList` describes, and it is the one
 * schema that tells an answer engine these posts are a sequence rather than a
 * pile. scripts/check-structured-data.mjs parses every JSON-LD block on the
 * site, so a malformed one here fails the build rather than shipping.
 */
function SeriesCard({ series }) {
  useBrokenLinks().collectAnchor(series.key);

  return (
    <article
      id={series.key}
      className="tw:flex tw:flex-col tw:gap-3 tw:rounded-lg tw:border tw:border-border tw:bg-card tw:p-6 tw:shadow-sm"
    >
      <p className="tw:m-0 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-brand">
        {series.posts.length} parts
      </p>

      <h2 className="tw:m-0 tw:text-xl tw:font-bold tw:leading-snug tw:tracking-tight tw:text-foreground">
        {series.label}
      </h2>

      {series.description && (
        <p className="tw:m-0 tw:text-sm tw:leading-relaxed tw:text-muted-foreground">
          {series.description}
        </p>
      )}

      <ol className="tw:m-0 tw:flex tw:list-none tw:flex-col tw:gap-1.5 tw:p-0 tw:text-sm">
        {series.posts.map((post, i) => (
          <li key={post.permalink} className="tw:flex tw:items-baseline tw:gap-2">
            <span
              className="tw:w-5 tw:shrink-0 tw:text-right tw:text-xs tw:tabular-nums tw:text-muted-foreground"
              aria-hidden="true"
            >
              {i + 1}.
            </span>
            <Link
              to={post.permalink}
              className="tw:text-fg-secondary tw:no-underline tw:hover:text-brand tw:hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ol>

      <Link
        to={series.posts[0].permalink}
        className="tw:mt-1 tw:inline-flex tw:items-center tw:gap-1.5 tw:text-xs tw:font-semibold tw:text-brand tw:no-underline tw:hover:text-brand-hover tw:hover:no-underline"
      >
        Start with part one
        <IconArrowRight size={14} />
      </Link>
    </article>
  );
}

export default function SeriesIndex() {
  const { seriesList } = usePluginData('metastation-series');

  const description =
    'Multi-part MetaStation series — ordered guides that build on each other, ' +
    'from a first webhook through to a full automated strategy.';

  return (
    <Layout title="Blog series" description={description}>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'MetaStation blog series',
            description,
            itemListElement: seriesList.map((series, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: series.label,
              url: `https://metastation.fi${series.anchor}`,
            })),
          })}
        </script>
      </Head>

      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--9 col--offset-1">
            <section className="ms-hero ms-hero--blog">
              <HeroCanvas seed={20260907} intensity="soft" />
              <div className="ms-hero__inner">
                <p className="ms-hero__badge">
                  <span className="ms-hero__dot" aria-hidden="true" />
                  MetaStation Blog
                </p>
                <h1 className="ms-hero__deck">
                  Read them <em>in order</em>
                </h1>
                <p className="ms-hero__sub">{description}</p>
              </div>
            </section>

            <div className="tw:flex tw:flex-col tw:gap-6">
              {seriesList.map((series) => (
                <SeriesCard key={series.key} series={series} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

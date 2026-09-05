import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import HeroCanvas from '@site/src/components/HeroCanvas';

/**
 * SWIZZLE: BlogListPage — ejected.
 *
 * ── WHY EJECT ──────────────────────────────────────────────────────────────
 * Two things the stock page cannot give us:
 *
 * 1. THE BLOG INDEX HAD NO HEADING AT ALL. Stock renders straight into the
 *    post list, so /blogs opened on a column of cards with the page's only
 *    identity in the <title>. The band below carries the site's one marketing
 *    surface that a reader can actually reach — `/` is VPS1, not this site
 *    (see src/pages/index.js) — so /docs/ and /blogs are the whole of it.
 *
 * 2. THE LIST NEEDED A HEADING ABOVE IT. The gapped column the cards sit in
 *    is NOT here — it is in src/theme/BlogPostItems, which is the one
 *    component the index, the tag pages and the author pages all render
 *    through. Fixing the spacing here would have fixed the index only.
 *
 * ── WHAT IS DELIBERATELY REUSED ────────────────────────────────────────────
 * `BlogListPageStructuredData` emits the `Blog` + `ItemList` JSON-LD that
 * scripts/check-structured-data.mjs and the SEO gate both read. It is a
 * one-line import and reimplementing it would be a way to lose a schema
 * without noticing. `BlogLayout`, `BlogPostItems` and `BlogListPaginator` are
 * untouched for the same reason.
 *
 * ── THE h1 ─────────────────────────────────────────────────────────────────
 * DocsHero's deck is a <p> because intro.md supplies its own h1 directly
 * below it. This page has NO other h1 — every post title in the list is an h2
 * — so the deck is the h1 here. That is the opposite decision from DocsHero
 * and it is correct in both places: exactly one h1 per page, and no heading
 * level skipped (h1 band, then h2 cards), which is what the Lighthouse
 * heading-order audit checks.
 */
function BlogListPageMetadata(props) {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

/* "Same treatment, lighter" — PLACEHOLDERS.md, design register `blog-hero`.
   `intensity="soft"` is the engine's quieter field and `.ms-hero-canvas--soft`
   drops it to 0.6 opacity on top of that: the blog index is a list of things
   to read, so the band announces the section and then gets out of the way.
   Everything else about the mount — lazy behind IntersectionObserver, stopped
   on exit and on a hidden tab, static frame under prefers-reduced-motion, out
   of flow so it cannot cost CLS — is HeroCanvas's job, not this file's. */
function BlogHero({ description }) {
  return (
    <section className="ms-hero ms-hero--blog">
      <HeroCanvas seed={20260906} intensity="soft" />

      <div className="ms-hero__inner">
        <p className="ms-hero__badge">
          <span className="ms-hero__dot" aria-hidden="true" />
          MetaStation Blog
        </p>

        <h1 className="ms-hero__deck">
          Updates from the <em>trading desk</em>
        </h1>

        {description && <p className="ms-hero__sub">{description}</p>}
      </div>
    </section>
  );
}

function BlogListPageContent(props) {
  const { metadata, items, sidebar } = props;
  return (
    <BlogLayout sidebar={sidebar}>
      <BlogHero description={metadata.blogDescription} />

      <BlogPostItems items={items} />

      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}

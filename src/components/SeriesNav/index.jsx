import React from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import { IconArrowRight, IconChevronRight } from '@site/src/components/icons';

/**
 * The series band on a blog post — "Part 2 of 4", the full reading order, and
 * previous/next.
 *
 * Data comes from the metastation-series plugin's global data, which resolved
 * and validated every slug at build time (see
 * plugins/docusaurus-plugin-series.js). Nothing is inferred here.
 *
 * Renders NOTHING when the current post is not in a series, which is the
 * normal case. That is deliberate: mounting it unconditionally in
 * BlogPostItem's post branch means a post joins a series by being added to
 * series.yml, with no second edit to remember.
 *
 * The whole list is rendered, not just previous/next. A reader who lands on
 * part 3 from a search result needs to see that parts 1 and 2 exist and what
 * they cover — that is the entire reason a series is worth modelling — and it
 * gives every post in the series a link from every other, which is the
 * internal-linking shape crawlers reward.
 */
export default function SeriesNav() {
  const { byPermalink } = usePluginData('metastation-series');
  const { metadata } = useBlogPost();
  const entry = byPermalink?.[metadata.permalink];

  if (!entry) {
    return null;
  }

  const { label, seriesAnchor, index, total, previous, next, posts } = entry;

  return (
    <aside
      className="tw:my-8 tw:rounded-lg tw:border tw:border-brand-line tw:bg-brand-soft tw:p-5"
      /* A labelled region rather than a bare <aside>: with a name it appears
         in a screen reader's landmark list as the series it belongs to,
         instead of as one of several anonymous "complementary" regions. */
      aria-labelledby="ms-series-heading"
    >
      <p className="tw:m-0 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-brand">
        Part {index + 1} of {total}
      </p>

      <h2
        id="ms-series-heading"
        className="tw:mt-1 tw:mb-3 tw:text-base tw:font-bold tw:leading-snug tw:text-foreground"
      >
        <Link
          to={seriesAnchor}
          className="tw:text-foreground tw:no-underline tw:hover:text-brand tw:hover:no-underline"
        >
          {label}
        </Link>
      </h2>

      <ol className="tw:m-0 tw:flex tw:list-none tw:flex-col tw:gap-1.5 tw:p-0 tw:text-sm">
        {posts.map((post, i) => {
          const isCurrent = i === index;
          return (
            <li key={post.permalink} className="tw:flex tw:items-baseline tw:gap-2">
              <span
                className="tw:w-5 tw:shrink-0 tw:text-right tw:text-xs tw:tabular-nums tw:text-muted-foreground"
                aria-hidden="true"
              >
                {i + 1}.
              </span>
              {isCurrent ? (
                /* The current part is not a link to the page you are on.
                   aria-current says which one it is without relying on the
                   weight difference, which is colour-and-weight only. */
                <span
                  aria-current="page"
                  className="tw:font-semibold tw:text-foreground"
                >
                  {post.title}
                </span>
              ) : (
                <Link
                  to={post.permalink}
                  className="tw:text-fg-secondary tw:no-underline tw:hover:text-brand tw:hover:underline"
                >
                  {post.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {(previous || next) && (
        <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:border-t tw:border-brand-line tw:pt-3 tw:text-xs tw:font-semibold">
          {previous ? (
            <Link
              to={previous.permalink}
              className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-brand tw:no-underline tw:hover:text-brand-hover tw:hover:no-underline"
            >
              <IconChevronRight size={14} className="tw:rotate-180" />
              {/* The part title, not "Previous" — Lighthouse's link-text
                  audit reads innerText and never the accessible name, so a
                  generic label here is a scored SEO failure, not a style
                  preference. See src/theme/BlogPostItem. */}
              {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={next.permalink}
              className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-brand tw:no-underline tw:hover:text-brand-hover tw:hover:no-underline"
            >
              {next.title}
              <IconArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}

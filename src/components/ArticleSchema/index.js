import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

/**
 * Emits TechArticle structured data for a single documentation page.
 *
 * Scoped deliberately to Guides and Concepts rather than applied site-wide.
 * Those are the pages written to be *cited* — a guide answers a job-shaped
 * query end to end, and a concept page explains a mechanism an answer engine
 * can quote. Reference tables and generated API pages gain nothing from being
 * described as articles, and marking every page a TechArticle dilutes the
 * signal rather than strengthening it.
 *
 * Site-wide coverage would want a wrapped DocItem swizzle instead, which is
 * Phase 2 work; this component is the honest scope for Phase 3.
 *
 * `dateModified` is passed explicitly rather than read from git here: the
 * component renders in the browser bundle, where git metadata is not
 * available. The sitemap already derives real lastmod from commit dates.
 */
export default function ArticleSchema({
  headline,
  description,
  dateModified,
  section,
}) {
  const {siteConfig} = useDocusaurusContext();
  const {pathname} = useLocation();
  const url = `${siteConfig.url}${pathname}`;
  const cdn = siteConfig.customFields?.cdn;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url,
    mainEntityOfPage: {'@type': 'WebPage', '@id': url},
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: {'@type': 'Organization', name: 'MetaStation', url: siteConfig.url},
    publisher: {
      '@type': 'Organization',
      name: 'MetaStation',
      url: siteConfig.url,
      ...(cdn && {
        logo: {
          '@type': 'ImageObject',
          url: `${cdn}/metastation-logo.png`,
        },
      }),
    },
    ...(dateModified && {dateModified}),
    ...(section && {articleSection: section}),
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}

import React from 'react';
import { Redirect } from '@docusaurus/router';

/**
 * This page builds to `/`, which is NOT this site in production.
 *
 * The Cloudflare Snippet (vps2-config/cloudflare-snippet-docs.js) forwards
 * only these paths to VPS2:
 *
 *   /docs*  /blogs*  /assets/*  /img/*  /search*
 *   /sitemap.xml  /llms.txt  /search-index.json
 *
 * `/` is not among them — metastation.fi/ is VPS1, the trading app. So the
 * hero, the card grid and the six section icons that used to live here were
 * reachable only on localhost. Four sessions of design work on a page no
 * reader could open.
 *
 * That content now lives on /docs/ (docs/intro.md → DocsHero + SectionCards),
 * which is the page readers actually arrive on.
 *
 * What is left here is a redirect, for one reason: `npm start` and
 * `npm run serve` open at `/`, and a 404 there would be a worse local
 * experience than a bounce to the real landing page. It is also why `/` is now
 * excluded from the sitemap and from llms.txt — advertising a URL we do not
 * serve is an SEO liability, not a neutral leftover.
 *
 * If the Snippet is ever changed to route `/`, this file becomes a real
 * homepage again — but that is a routing decision about metastation.fi's root,
 * which belongs to the trading app, not to the docs.
 */
export default function Home() {
  return <Redirect to="/docs/" />;
}

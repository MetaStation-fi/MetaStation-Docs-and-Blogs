import React from 'react';
import Link from '@docusaurus/Link';
import HeroCanvas from '@site/src/components/HeroCanvas';
import { Button } from '@site/src/components/ui/button';
import { IconArrowRight } from '@site/src/components/icons';

/**
 * The docs landing band, mounted at the top of docs/intro.md — which is
 * /docs/, the page readers actually arrive on.
 *
 * ── WHY IT IS HERE AND NOT ON src/pages/index.js ───────────────────────────
 * It used to be. src/pages/index.js builds to `/`, and `/` is NOT routed to
 * this site in production: the Cloudflare Snippet forwards only /docs, /blogs,
 * /assets/, /img/, /search, /sitemap.xml, /llms.txt and /search-index.json to
 * VPS2. metastation.fi/ is VPS1, the trading app. So the homepage hero — and
 * anything mounted on it — was reachable only on localhost. See
 * vps2-config/cloudflare-snippet-docs.js for the routing list.
 *
 * ── WHY IT CARRIES NO HEADING ──────────────────────────────────────────────
 * intro.md's own `# What is MetaStation?` is the page's h1 and its SEO
 * identity, and this band sits above it. A second h1 here would compete with
 * it; an h2 above an h1 is an invalid heading order and the Lighthouse
 * heading-order audit would say so. The deck line is deliberately a <p> that
 * is merely styled large. Nothing in this band is information — every claim
 * and every destination in it also appears in the page body or the sidebar.
 */
export default function DocsHero() {
  return (
    <section className="ms-hero ms-hero--docs">
      <HeroCanvas seed={20260905} intensity="full" />

      <div className="ms-hero__inner">
        <p className="ms-hero__badge">
          <span className="ms-hero__dot" aria-hidden="true" />
          MetaStation Docs
        </p>

        <p className="ms-hero__deck">
          Everything you need to <em>trade smarter</em>
        </p>

        <p className="ms-hero__sub">
          Guides, concepts and API reference for the unified trading platform —
          social copy trading, webhook automation and Telegram-to-Trade.
        </p>

        <div className="ms-hero__actions">
          <Button asChild variant="brand" size="lg">
            <Link to="/docs/getting-started/quick-start">
              Quick Start
              <IconArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/docs/guides">Browse the guides</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

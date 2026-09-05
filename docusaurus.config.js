// @ts-check
const { themes } = require('prism-react-renderer');

/**
 * Tailwind v4 runs as a PostCSS plugin. Docusaurus exposes exactly one hook for
 * that — configurePostCss — and it applies to every stylesheet the CSS loader
 * chain touches, including src/css/tailwind.css.
 *
 * This still works under future.faster (Rspack + SWC): it swaps the
 * bundler and the CSS minifier, not postcss-loader.
 *
 * Everything that makes this integration safe — preflight off, the tw prefix,
 * unlayered utilities, source scoping — is configured in src/css/tailwind.css
 * itself, because v4 is CSS-first. There is no tailwind.config.js and adding
 * one would not be read.
 */
function tailwindPlugin() {
  return {
    name: 'metastation-tailwind',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('@tailwindcss/postcss'));
      return postcssOptions;
    },
  };
}


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MetaStation Docs',
  tagline: 'Trade Anywhere. Automate Everything.',
  favicon: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@brand-v4/brand/metastation-favicon.ico',

  url: 'https://metastation.fi',
  baseUrl: '/',

  // Locally this stays 'warn' so a work-in-progress link does not block an
  // author mid-edit. CI sets DOCUSAURUS_STRICT_LINKS=true so a broken link
  // fails the build and cannot reach main — the docs are full of deep
  // cross-links between guides, concepts and reference, and a silent 404
  // between them is exactly the kind of rot nobody notices for months.
  onBrokenLinks: process.env.DOCUSAURUS_STRICT_LINKS === 'true' ? 'throw' : 'warn',
  onBrokenAnchors: process.env.DOCUSAURUS_STRICT_LINKS === 'true' ? 'throw' : 'warn',
  // Docusaurus 3.10 is the last v3 release and exists to stage v4. Adopting the
  // flags now makes the v4 upgrade a no-op instead of a migration.
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,

      // Matters more here than on a typical site: the docs are served from
      // metastation.fi/docs, the SAME ORIGIN as the trading app, so both share
      // one localStorage bucket. Without namespacing, Docusaurus's unprefixed
      // `theme` key collides with the app's own theme storage. Namespacing
      // scopes our keys and stops the docs from fighting the product over
      // which theme the user picked.
      siteStorageNamespacing: true,

      // We author modern MDX; nothing here relies on MDX v1 compatibility.
      mdx1CompatDisabledByDefault: true,
    },
    faster: true,
  },

  // Deliberately NOT enabled yet: `useCssCascadeLayers`. It moves theme CSS
  // into cascade layers, which changes how every override in custom.css
  // resolves. That is a visual change that needs to be checked in a browser
  // across both colour schemes, not assumed — turn it on as its own change
  // with its own verification pass.

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  // Brand assets are served from MetaStation-fi/brand-assets via jsDelivr,
  // pinned to a tag. Never use @main here: it is mutable and jsDelivr caches it
  // hard, so you could not tell which version viewers are actually getting.
  // Bump the tag to ship new artwork.
  //
  // The repo was ChandravadanR/crypto-icons until 2026-09-05, when it moved to
  // the MetaStation-fi account and was renamed. GitHub redirects the old path
  // and jsDelivr follows it, but do not rely on that — every reference here is
  // the new path, verified 200 before the swap.
  customFields: {
    cdn: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@brand-v4/brand',
    // Platform screenshots, on the same asset repo under docs/screens and
    // pinned to its own tag so captures can be reshot without moving brand
    // artwork. <Screenshot> resolves every embed through this, so publishing a
    // new capture set is: copy to brand-assets, cut docs-v<n+1>, bump this line.
    screensCdn: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@docs-v1/docs/screens',
  },

  headTags: [
    // The logo is render-blocking-adjacent (it is in the navbar, above the
    // fold), and it now lives on a third-party origin. Warm the connection
    // during HTML parse so the DNS + TLS handshake does not sit in the
    // critical path. Without this, moving a small asset to a CDN can be
    // slower than serving it from our own already-connected origin.
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: 'anonymous' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
    },

    // Giscus is mounted below the fold on every doc and blog post, so the
    // handshake to its origin is guaranteed and worth warming early rather
    // than paying for it when the reader scrolls.
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://giscus.app' },
    },

    // ── Structured data ────────────────────────────────────────────────────
    // The site shipped exactly one JSON-LD block before this (BreadcrumbList,
    // from the theme). Organization + SoftwareApplication are site-wide facts,
    // so they belong in headTags rather than in a per-page component.
    //
    // This is the cheapest SEO work available to us: it is the vocabulary
    // search engines and AI answer engines actually parse when deciding what
    // this site *is* and whether to cite it. Per-page TechArticle and FAQPage
    // land with the Phase 3 content work.
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MetaStation',
        url: 'https://metastation.fi',
        logo: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@brand-v4/brand/metastation-logo.png',
        description:
          'Unified crypto trading platform with webhook automation, copy trading and Telegram-to-Trade across Binance, ByBit and KuCoin.',
        sameAs: [
          'https://x.com/MetaStation_fi',
          'https://t.me/metastation_global',
          'https://www.facebook.com/profile.php?id=61586115042698',
          'https://www.instagram.com/metastation.fi',
          'https://github.com/MetaStation-fi',
        ],
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'MetaStation',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web, iOS, Android',
        url: 'https://metastation.fi',
        description:
          'Trade spot and perpetual futures from one account. Automate TradingView alerts over webhooks, execute Telegram channel signals, and copy trade providers automatically.',
        featureList: [
          'Webhook trading from TradingView or any HTTP signal source',
          'Telegram-to-Trade signal execution',
          'Copy trading marketplace',
          'Up to 10 take-profit levels, trailing stops and SLX',
          'Cross-chain deposits from 56 blockchain networks',
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description:
            'Free MetaStation Account including every automation tool. Paid slot subscriptions unlock automation on connected exchange accounts.',
        },
      }),
    },
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    '@easyops-cn/docusaurus-search-local',
    'docusaurus-theme-openapi-docs',
  ],

  plugins: [
    tailwindPlugin,
    [
      // Generates llms.txt (an index for LLMs), llms-full.txt, and a .md
      // twin of every page at build time.
      //
      // Replaces static/llms.txt, which was hand-maintained and therefore
      // guaranteed to drift the moment anyone added a page. A stale LLM index
      // is worse than none: it teaches answer engines a site structure that no
      // longer exists.
      //
      // Note this only *produces* the surface. AI crawlers are still blocked
      // at the Cloudflare edge by deliberate decision until Phase 5, so
      // nothing consumes these files yet. Building it now means the channel
      // opens with correct content on day one instead of needing a content
      // pass at the same moment as an infra change.
      // Option shape below is v1.2.2's, read from the installed package's own
      // type definitions. Published examples show a newer `markdown` /
      // `llmsTxt` split that this version rejects outright.
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'MetaStation',
        siteDescription:
          'Unified crypto trading platform — spot and perpetual futures, webhook automation from TradingView, Telegram-to-Trade signal execution, and a copy-trading marketplace. Trade a native MetaStation Account or connect Binance, ByBit and KuCoin.',
        // Group by the second path segment, so /docs/trading/* becomes a
        // "Trading" section rather than one flat list of 40 links.
        depth: 2,
        enableDescriptions: true,
        content: {
          enableMarkdownFiles: true,
          enableLlmsFullTxt: true,
          relativePaths: false,
          includeDocs: true,
          includeBlog: true,
          includePages: true,
        },
      },
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          webhook: {
            specPath: 'openapi/webhook-api.yaml',
            outputDir: 'docs/api',
            // The webhook token IS the credential and it sits in the URL path,
            // so a generated snippet would otherwise carry a real token
            // verbatim once someone tries the console. Mask it.
            maskCredentials: true,
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
          },
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          // Required by docusaurus-theme-openapi-docs. It wraps the normal doc
          // item, so hand-written pages render exactly as before; only pages
          // generated from the OpenAPI spec pick up the API layout and the
          // Try-It console.
          docItemComponent: '@theme/ApiItem',

          // Feeds two things at once: the "Last updated" line readers see, and
          // the <lastmod> the sitemap emits. Without this the sitemap has no
          // date source and silently omits lastmod for every URL — which is
          // exactly what it was doing.
          //
          // The date comes from git commit time, so it tracks real content
          // changes. Uncommitted files fall back to filesystem mtime.
          showLastUpdateTime: true,
        },
        blog: {
          routeBasePath: 'blogs',
          showReadingTime: true,
          blogTitle: 'MetaStation Blog',
          blogDescription: 'Platform updates, guides, and news from MetaStation.',
          postsPerPage: 10,
          feedOptions: {
            type: ['rss', 'atom'],
            title: 'MetaStation Blog',
            description: 'Platform updates, guides, and news from MetaStation.',
            copyright: `Copyright © ${new Date().getFullYear()} MetaStation.`,
          },
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 10,
        },
        theme: {
          // Order matters for readability, not for correctness: Tailwind's
          // utilities are marked important in tailwind.css, so they do not
          // depend on load order to win. custom.css stays first because it
          // defines the --ms-* tokens every Tailwind colour resolves through.
          customCss: ['./src/css/custom.css', './src/css/tailwind.css'],
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          // The sitemap shipped 42 URLs and zero <lastmod>. Freshness is a real
          // crawl-scheduling input, and AI answer engines skew hard toward
          // recently-updated pages — so publishing no date at all is throwing
          // away the one signal a 42-page static site can actually send.
          //
          // 'date' emits YYYY-MM-DD from the page's git commit time, which
          // means it reflects when the content genuinely changed rather than
          // when the build ran. A build-time timestamp would mark all 42 pages
          // fresh on every deploy, which is noise a crawler learns to ignore.
          lastmod: 'date',
        },
      }),
    ],
  ],

/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    // Was 'img/metastation-social-card.png', which never existed — every docs
    // and blog page shipped a broken og:image. Now a real 1200x630 card.
    image: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@brand-v4/brand/metastation-social-card.png',

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    announcementBar: {
      id: 'launch_banner',
      content: 'Welcome to MetaStation — <a href="/docs/">explore the docs</a>',
      // No backgroundColor/textColor here on purpose: those are static hex and
      // would paint the same dark strip in light mode. The bar is themed from
      // tokens in custom.css instead, so it follows the colour scheme.
      isCloseable: true,
    },

    navbar: {
      title: '',
      logo: {
        alt: 'MetaStation',
        // 264x96 WebP, 12 KB — replaces a 4096x1488 / 3.7 MB PNG that was
        // being downscaled to a ~32px navbar slot on every page load.
        // The wordmark is a transparent knockout, so the same file works on
        // both themes: it reads white on light and near-black on dark.
        // width/height are set to reserve layout space and avoid CLS.
        src: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@brand-v4/brand/metastation-logo.webp',
        srcDark: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@brand-v4/brand/metastation-logo.webp',
        width: 132,
        height: 48,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          // Guides and Concepts are the Phase 3 growth surfaces: guides target
          // problem-shaped queries, concepts are what answer engines quote.
          // Both sit in the navbar rather than only in the sidebar so they are
          // reachable from the blog and from any generated API page.
          to: '/docs/guides',
          label: 'Guides',
          position: 'left',
        },
        {
          to: '/docs/concepts',
          label: 'Concepts',
          position: 'left',
        },
        {
          to: '/blogs',
          label: 'Blog',
          position: 'left',
        },
        {
          to: '/docs/developer/webhook-api-overview',
          label: 'Developer',
          position: 'left',
        },
        {
          to: '/docs/api/metastation-webhook-api',
          label: 'API',
          position: 'left',
        },
        {
          // Deep-links to the login screen rather than the marketing root. The
          // docs are a top-of-funnel surface; sending a reader to the home page
          // makes them find the CTA again themselves.
          href: 'https://metastation.fi/login',
          label: 'Launch App',
          position: 'right',
          className: 'navbar-launch-btn',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Quick Start', to: '/docs/getting-started/quick-start' },
            { label: 'Guides', to: '/docs/guides' },
            { label: 'Concepts', to: '/docs/concepts' },
            { label: 'Glossary', to: '/docs/glossary' },
            { label: 'Webhook API', to: '/docs/developer/webhook-api-overview' },
          ],
        },
        {
          title: 'Platform',
          items: [
            { label: 'Social Trading', to: '/docs/social-trading/browse-marketplace' },
            { label: 'Automation', to: '/docs/automation/webhook-trading' },
            { label: 'Wallet', to: '/docs/wallet/deposit' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Blog', to: '/blogs' },
            // Real handles, confirmed against the frontend source:
            // x.com/MetaStation_fi (Footer/footer.jsx + public/index.html twitter:site),
            // t.me/metastation_global (community) and t.me/MetaStationBot (Mini App bot).
            { label: 'Telegram Community', href: 'https://t.me/metastation_global' },
            { label: 'Telegram Bot', href: 'https://t.me/MetaStationBot' },
            { label: 'Twitter / X', href: 'https://x.com/MetaStation_fi' },
            { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61586115042698' },
          ],
        },
        {
          title: 'Legal',
          items: [
            { label: 'Terms of Service', href: 'https://metastation.fi/terms' },
            { label: 'Privacy Policy', href: 'https://metastation.fi/privacy' },
            { label: 'Risk Disclaimer', href: 'https://metastation.fi/disclaimer' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MetaStation. All rights reserved. Trading cryptocurrencies involves significant risk.`,
    },

    prism: {
      theme: themes.vsDark,
      darkTheme: themes.vsDark,
      additionalLanguages: ['bash', 'json', 'nginx', 'javascript', 'typescript'],
    },

    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  },
};

module.exports = config;

// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MetaStation Docs',
  tagline: 'Trade Anywhere. Automate Everything.',
  favicon: 'https://cdn.jsdelivr.net/gh/MetaStation-fi/brand-assets@brand-v4/brand/metastation-favicon.ico',

  url: 'https://metastation.fi',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
    },
    faster: true,
  },

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
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    '@easyops-cn/docusaurus-search-local',
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
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
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
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
            { label: 'Trading Guide', to: '/docs/trading/metastation-account' },
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

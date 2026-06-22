// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MetaStation Docs',
  tagline: 'Trade Anywhere. Automate Everything.',
  favicon: 'img/favicon.ico',

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
    image: 'img/metastation-social-card.png',

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    announcementBar: {
      id: 'launch_banner',
      content: '🚀 Welcome to MetaStation — <a href="/docs/intro">explore the docs</a>',
      backgroundColor: '#0d1a2e',
      textColor: '#2dd4bf',
      isCloseable: true,
    },

    navbar: {
      title: '',
      logo: {
        alt: 'MetaStation',
        src: 'img/metastation-logo.png',
        srcDark: 'img/metastation-logo.png',
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
          href: 'https://metastation.fi',
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
            { label: 'Telegram', href: 'https://t.me/metastation' },
            { label: 'Twitter / X', href: 'https://twitter.com/metastation' },
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

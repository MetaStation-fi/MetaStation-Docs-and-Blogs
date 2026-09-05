/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

// Emoji were removed from these labels in the Phase 1 design pass, for the same
// reason they were removed from the homepage cards: they render differently on
// every OS and read as unfinished. Section iconography returns in Phase 2 as
// inline SVG, via a wrapped DocSidebarItem swizzle.
//
// ── Phase 3 IA restructure ──────────────────────────────────────────────────
// The previous order was seven flat categories mirroring the internal feature
// list, which serves navigational queries only — people who already know the
// product. Guides and Concepts were added ahead of the feature sections
// because they target the problem-shaped queries that bring new readers in
// ("tradingview webhook to binance", "auto execute telegram signals") and are
// what an answer engine can actually cite.
//
// Every category now has a landing hub. Guides and Concepts get hand-written
// ones — they need editorial framing that says which page to read and why.
// The feature sections use `generated-index`, which builds a card grid from the
// child pages' own front matter, so the hub cannot drift out of sync with the
// section when a page is added.
//
// Ordering principle: what someone wants to *do* comes before the reference
// describing what things *are*.
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Getting Started with MetaStation',
        description:
          'Create an account, fund it from any chain, secure it, and place your first trade. Start with the Quick Start if you want to be trading in five minutes.',
        slug: '/getting-started',
        keywords: ['getting started', 'crypto trading account', 'quick start'],
      },
      items: [
        'getting-started/quick-start',
        'getting-started/create-account',
        'getting-started/fund-account',
        'getting-started/security-setup',
        'getting-started/platform-overview',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'guides/guides-index',
      },
      items: [
        'guides/tradingview-webhook-to-binance',
        'guides/auto-execute-telegram-signals',
        'guides/automate-with-a-script',
        'guides/secure-your-webhook',
        'guides/copy-trading-setup',
        'guides/scale-out-with-take-profits',
        'guides/risk-free-trade-with-slx',
        'guides/fund-from-any-chain',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'concepts/concepts-index',
      },
      items: [
        'concepts/account-model',
        'concepts/signal-pipeline',
        'concepts/order-execution',
        'concepts/copy-trading-mechanics',
        'concepts/risk-controls',
        'concepts/funding-and-settlement',
      ],
    },
    {
      type: 'category',
      label: 'Trading',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Trading on MetaStation',
        description:
          'The native MetaStation Account, connecting Binance, ByBit and KuCoin, spot and perpetual futures, and the full order-type reference.',
        slug: '/trading',
        keywords: ['crypto trading', 'perpetual futures', 'spot trading', 'order types'],
      },
      items: [
        'trading/metastation-account',
        'trading/connect-exchange',
        'trading/spot-trading',
        'trading/futures-trading',
        'trading/advanced-orders',
        'trading/account-slots',
        'trading/order-types-reference',
      ],
    },
    {
      type: 'category',
      label: 'Automation',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Trading Automation',
        description:
          'Execute trades from TradingView alerts, Telegram channel signals, or any HTTP signal source — the features behind the automation guides.',
        slug: '/automation',
        keywords: ['trading automation', 'tradingview webhook', 'telegram trading bot'],
      },
      items: [
        'automation/webhook-trading',
        'automation/tradingview-setup',
        'automation/telegram-to-trade',
      ],
    },
    {
      type: 'category',
      label: 'Social Trading',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Social Trading',
        description:
          'Browse the marketplace, subscribe to providers, tune how their trades replicate onto your account — or publish your own trades and earn subscription revenue.',
        slug: '/social-trading',
        keywords: ['copy trading', 'signal provider', 'social trading marketplace'],
      },
      items: [
        'social-trading/browse-marketplace',
        'social-trading/subscribe-provider',
        'social-trading/copy-settings',
        'social-trading/become-provider',
      ],
    },
    {
      type: 'category',
      label: 'Wallet',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Wallet — Deposits and Withdrawals',
        description:
          'Fund your Funding Wallet from 56 blockchain networks and withdraw back out, plus the full cross-chain network list.',
        slug: '/wallet',
        keywords: ['crypto deposit', 'crypto withdrawal', 'funding wallet'],
      },
      items: ['wallet/deposit', 'wallet/withdraw', 'wallet/cross-chain-exchange'],
    },
    {
      type: 'category',
      label: 'Security',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Account Security',
        description:
          'Two-factor authentication, how withdrawals are gated, exchange API key handling, and how account access works.',
        slug: '/security',
        keywords: ['2fa', 'account security', 'api key security', 'withdrawal security'],
      },
      items: [
        'security/two-factor-auth',
        'security/withdrawal-whitelist',
        'security/api-key-management',
        'security/session-management',
      ],
    },
    {
      type: 'category',
      label: 'Developer Reference',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Developer Reference',
        description:
          'The webhook message formats, every supported action and field, copy-paste TradingView templates, and the error codes a rejected signal returns.',
        slug: '/developer',
        keywords: ['trading api', 'webhook json format', 'tradingview alert template'],
      },
      items: [
        'developer/webhook-api-overview',
        'developer/json-format',
        'developer/natural-language-format',
        'developer/supported-actions',
        'developer/tradingview-templates',
        'developer/error-codes',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'api/metastation-webhook-api',
      },
      // Autogenerated on purpose, rather than importing docs/api/sidebar.ts.
      //
      // docusaurus-plugin-openapi-docs emits that sidebar as TypeScript, and
      // this file is CommonJS — a require() of a .ts module fails without a TS
      // loader in the chain. Autogeneration reads the same front matter the
      // generator writes (sidebar_label, sidebar_position, and the
      // sidebar_class_name that paints the method badge), so the result is
      // equivalent and it stays correct when the spec grows new paths.
      //
      // Regenerate with: npx docusaurus gen-api-docs all
      // Clean with:      npx docusaurus clean-api-docs all
      items: [
        {
          type: 'autogenerated',
          dirName: 'api',
        },
      ],
    },
    {
      type: 'doc',
      id: 'glossary',
      label: 'Glossary',
    },
  ],
};

module.exports = sidebars;

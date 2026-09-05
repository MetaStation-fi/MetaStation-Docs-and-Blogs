import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

/**
 * Inline lucide geometry, stroked with currentColor.
 *
 * These replaced an emoji set (🚀 💹 🤝 🤖 💰 👨‍💻) which rendered differently on
 * every OS and read as the loudest "unfinished" signal on the site. Inlined
 * rather than pulled from lucide-react so the homepage adds no dependency and
 * no runtime bundle — six icons do not justify a package.
 */
const Icon = ({ children, label }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={label ? undefined : 'true'}
    role={label ? 'img' : undefined}
    aria-label={label}
  >
    {children}
  </svg>
);

/* lucide: rocket */
const IconRocket = () => (
  <Icon>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </Icon>
);

/* lucide: candlestick-chart */
const IconChart = () => (
  <Icon>
    <path d="M9 5v4" />
    <rect width="4" height="6" x="7" y="9" rx="1" />
    <path d="M9 15v2" />
    <path d="M17 3v2" />
    <rect width="4" height="8" x="15" y="5" rx="1" />
    <path d="M17 13v3" />
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
  </Icon>
);

/* lucide: users */
const IconUsers = () => (
  <Icon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

/* lucide: webhook */
const IconWebhook = () => (
  <Icon>
    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
    <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
    <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
  </Icon>
);

/* lucide: wallet */
const IconWallet = () => (
  <Icon>
    <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </Icon>
);

/* lucide: terminal */
const IconTerminal = () => (
  <Icon>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </Icon>
);

const CARDS = [
  {
    Icon: IconRocket,
    title: 'Getting Started',
    desc: 'Create your account, fund it from 56 networks, and place your first trade in minutes.',
    link: '/docs/getting-started/quick-start',
    cta: 'Start here',
  },
  {
    Icon: IconChart,
    title: 'Trading',
    desc: 'Spot and futures on your MetaStation Account — a Web3 account by default — or on a connected exchange.',
    link: '/docs/trading/metastation-account',
    cta: 'Explore trading',
  },
  {
    Icon: IconUsers,
    title: 'Social Trading',
    desc: 'Copy successful traders automatically, or become a provider and monetize your strategy.',
    link: '/docs/social-trading/browse-marketplace',
    cta: 'Browse providers',
  },
  {
    Icon: IconWebhook,
    title: 'Automation',
    desc: 'Connect TradingView alerts via webhooks, or execute signals from Telegram channels.',
    link: '/docs/automation/webhook-trading',
    cta: 'Set up automation',
  },
  {
    Icon: IconWallet,
    title: 'Wallet',
    desc: 'Bridge into your Funding Wallet from 56 networks or buy with a card. Withdraw with 2FA.',
    link: '/docs/wallet/deposit',
    cta: 'Manage wallet',
  },
  {
    Icon: IconTerminal,
    title: 'Developer Reference',
    desc: 'Webhook API formats, JSON schemas, TradingView templates, and error codes.',
    link: '/docs/developer/webhook-api-overview',
    cta: 'View API docs',
  },
];

export default function Home() {
  return (
    <Layout
      title="Documentation"
      description="MetaStation documentation — get started, master trading, automate strategies, and integrate with the API."
    >
      <main>
        {/*
          EFFECT: hero-canvas — Canvas UI mounts here in Phase 2.
          Constraints (non-negotiable, from the phase plan):
            - lazy-mount behind an IntersectionObserver, never in the initial bundle
            - prefers-reduced-motion gets the static CSS wash already on .hero-section
            - must pass the Lighthouse budget gate or it does not ship
            - marketing surfaces only; never a doc content page
        */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="hero-dot" aria-hidden="true" /> MetaStation · Now Live
          </div>

          <h1 className="hero-title">
            Everything you need to <em>trade smarter</em>
          </h1>

          <p className="hero-subtitle">
            Guides, references and API docs for MetaStation — the unified trading platform with
            social copy trading, webhook automation and Telegram-to-Trade.
          </p>

          <div className="hero-actions">
            <Link className="btn-primary" to="/docs/getting-started/quick-start">
              Get Started
            </Link>
            <Link className="btn-secondary" to="/docs/">
              Browse Docs
            </Link>
          </div>
        </section>

        <section className="cards-section">
          <p className="cards-heading">Documentation Sections</p>
          <div className="cards-grid">
            {CARDS.map(({ Icon: CardIcon, title, desc, link, cta }) => (
              <Link key={title} className="doc-card" to={link}>
                <span className="doc-card-icon">
                  <CardIcon />
                </span>
                <div>
                  <p className="doc-card-title">{title}</p>
                  <p className="doc-card-desc">{desc}</p>
                </div>
                <span className="doc-card-link">
                  {cta} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}

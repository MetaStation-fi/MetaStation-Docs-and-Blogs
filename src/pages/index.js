import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const CARDS = [
  {
    icon: '🚀',
    title: 'Getting Started',
    desc: 'Create your account, fund it from 35+ networks, and place your first trade in minutes.',
    link: '/docs/getting-started/quick-start',
    cta: 'Start here →',
  },
  {
    icon: '💹',
    title: 'Trading',
    desc: 'Explore spot and futures trading on your native MetaStation Account or connected exchanges.',
    link: '/docs/trading/metastation-account',
    cta: 'Explore trading →',
  },
  {
    icon: '🤝',
    title: 'Social Trading',
    desc: 'Copy successful traders automatically, or become a provider and monetize your strategy.',
    link: '/docs/social-trading/browse-marketplace',
    cta: 'Browse providers →',
  },
  {
    icon: '🤖',
    title: 'Automation',
    desc: 'Connect TradingView alerts via webhooks, or execute signals from Telegram channels.',
    link: '/docs/automation/webhook-trading',
    cta: 'Set up automation →',
  },
  {
    icon: '💰',
    title: 'Wallet',
    desc: 'Deposit from any of 35+ networks or buy with a card. Withdraw securely with 2FA.',
    link: '/docs/wallet/deposit',
    cta: 'Manage wallet →',
  },
  {
    icon: '👨‍💻',
    title: 'Developer Reference',
    desc: 'Webhook API formats, JSON schemas, TradingView templates, and error codes.',
    link: '/docs/developer/webhook-api-overview',
    cta: 'View API docs →',
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Documentation"
      description="MetaStation documentation — get started, master trading, automate strategies, and integrate with the API."
    >
      <main>
        {/* Hero */}
        <section className="hero-section">
          <div className="hero-badge">
            <span>●</span> MetaStation · Now Live
          </div>

          <h1 className="hero-title">
            Everything you need to<br />
            <span>trade smarter</span>
          </h1>

          <p className="hero-subtitle">
            Guides, references, and API docs for MetaStation — the unified trading platform with social copy trading, webhook automation, and Telegram-to-Trade.
          </p>

          <div className="hero-actions">
            <Link className="btn-primary" to="/docs/getting-started/quick-start">
              Get Started →
            </Link>
            <Link className="btn-secondary" to="/docs/intro">
              Browse Docs
            </Link>
          </div>
        </section>

        {/* Cards grid */}
        <section className="cards-section" style={{ margin: '0 auto' }}>
          <p className="cards-heading">Documentation Sections</p>
          <div className="cards-grid">
            {CARDS.map((card) => (
              <Link key={card.title} className="doc-card" to={card.link}>
                <div className="doc-card-icon">{card.icon}</div>
                <div>
                  <p className="doc-card-title">{card.title}</p>
                  <p className="doc-card-desc">{card.desc}</p>
                </div>
                <span className="doc-card-link">{card.cta}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}

import React from 'react';
import Link from '@docusaurus/Link';
import {
  IconArrowRight,
  IconChart,
  IconRocket,
  IconTerminal,
  IconUsers,
  IconWallet,
  IconWebhook,
} from '@site/src/components/icons';

/**
 * The six section cards for the docs landing page.
 *
 * These replace the `DESIGN: intro-cards` placeholder that stood in
 * docs/intro.md — a raw <div> of styled text links whose own comment asked for
 * "real cards + lucide icons, not styled text links".
 *
 * HEADING LEVEL. The titles are h3, not h2. This grid sits under intro.md's
 * `## What's next?`, so h3 is what keeps the document outline valid — h1 →
 * h2 → h3. The theme's own DocCard (src/theme/DocCard) renders h2 because it
 * is used on `generated-index` hubs where the card IS the top-level content.
 * Same visual language, different level, on purpose. If you move this grid,
 * check the level still fits where it lands.
 *
 * The copy is not a restatement of the linked page's title — each line says
 * what the reader will be able to DO, which is the job a landing grid has and
 * a sidebar does not.
 */
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

export default function SectionCards() {
  return (
    <div className="tw:mt-6 tw:grid tw:gap-4 tw:sm:grid-cols-2">
      {CARDS.map(({ Icon: CardIcon, title, desc, link, cta }) => (
        <Link
          key={title}
          to={link}
          className="tw:group tw:flex tw:h-full tw:flex-col tw:gap-3 tw:rounded-lg tw:border tw:border-border tw:bg-card tw:p-5 tw:no-underline tw:shadow-sm tw:transition-[border-color,box-shadow,background-color,transform] tw:duration-200 tw:hover:-translate-y-0.5 tw:hover:border-brand tw:hover:bg-surface-hover tw:hover:no-underline tw:hover:shadow-md"
        >
          <span
            className="tw:inline-flex tw:size-9 tw:items-center tw:justify-center tw:rounded-sm tw:border tw:border-brand-line tw:bg-brand-soft tw:text-brand"
            aria-hidden="true"
          >
            <CardIcon size={18} />
          </span>

          <h3 className="tw:m-0 tw:text-base tw:font-semibold tw:text-foreground tw:before:hidden">
            {title}
          </h3>

          <p className="tw:m-0 tw:flex-1 tw:text-sm tw:leading-relaxed tw:text-muted-foreground">
            {desc}
          </p>

          <span className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-xs tw:font-semibold tw:text-brand">
            {cta}
            <IconArrowRight
              size={14}
              className="tw:transition-transform tw:duration-200 tw:group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}

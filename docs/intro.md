---
id: intro
title: What is MetaStation?
sidebar_label: Introduction
# slug "/" makes this the index of the docs section, so /docs/ resolves instead
# of 404ing. /docs is the natural hub URL — shorter, more linkable, and the page
# every inbound "the docs" link points at. /docs/intro 301s here (nginx).
slug: /
---

import FAQ from '@site/src/components/FAQ';

# What is MetaStation?

MetaStation is a **unified crypto trading platform** that gives every user a native trading account at registration — plus the ability to connect Binance, ByBit, and KuCoin from a single interface.

It combines professional trading tools, social copy trading, and full automation in one place.

---

## Core Capabilities

| Capability | What it means |
|---|---|
| **Native MetaStation Account** | A ready-to-trade account created automatically when you register. **Web3 by default** — it settles on-chain in USDC. No exchange setup needed. |
| **Fund from 56 Networks** | Bridge assets from 56 blockchain networks into your **Funding Wallet** — automatically converted and credited. |
| **Multi-Exchange Trading** | Connect Binance, ByBit, and KuCoin via API keys and trade them from one terminal. |
| **Social Trading** | Follow top traders and copy their positions automatically. |
| **Webhook Automation** | Execute trades from TradingView alerts or any HTTP signal source. |
| **Telegram-to-Trade** | Parse Telegram channel signals and execute them instantly. |
| **Advanced Orders** | Up to 10 Take Profits, trailing stops, and Stop Loss X (SLX). |

---

## Who is MetaStation for?

**New traders** — Start with your native MetaStation Account, fund it from any chain, copy experienced traders, and learn as you earn.

**Active traders** — Trade across Binance, ByBit, and KuCoin from one screen with advanced order management.

**Algo traders and developers** — Automate strategies via webhook or Telegram signals with JSON or natural language inputs.

**Signal providers** — Monetize your trading skills by publishing to the marketplace and earning subscription revenue.

---

## What's next?

{/* DESIGN: intro-cards | this raw div is a placeholder for the Phase 2 DocCard grid (swizzled, shadcn). Replace with real cards + lucide icons, not styled text links */}

<div className="cards-grid" style={{marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px'}}>

Get started in 5 minutes → [Quick Start](/docs/getting-started/quick-start)

Explore your native account → [MetaStation Account](/docs/trading/metastation-account)

Set up automation → [Webhooks](/docs/automation/webhook-trading)

</div>

---

## Ready?

Create an account at **[metastation.fi/register](https://metastation.fi/register)** — it takes a
minute and needs no KYC to start.

<FAQ
  title="Common questions"
  items={[
    {
      question: 'What is MetaStation?',
      answer:
        'MetaStation is a crypto trading platform that gives every user a native trading account at registration and also connects Binance, ByBit and KuCoin through your own API keys, so several exchanges are traded from one interface. It adds webhook automation from TradingView or any HTTP source, Telegram signal execution, a copy-trading marketplace, and advanced order management with up to 10 take-profit levels.',
    },
    {
      question: 'Do I need to connect an exchange to use MetaStation?',
      answer:
        'No. A native MetaStation Account is created for you at registration and is ready to trade without any external exchange. It is a Web3 account that settles on-chain in USDC, and it includes every automation tool free. Connecting Binance, ByBit or KuCoin is optional and only needed to trade balances you already hold there.',
    },
    {
      question: 'Is MetaStation free to use?',
      answer:
        'Your MetaStation Account is free and includes webhook automation, Telegram-to-Trade, copy trading and advanced orders at no cost. Each connected exchange also gets one free manual slot. Paid slot subscriptions from the Store unlock automation on those connected exchange slots, and additional MetaStation Account slots are also available there.',
    },
    {
      question: 'Does MetaStation require KYC?',
      answer:
        'Creating an account and starting to trade does not require KYC. Registration takes about a minute, and a MetaStation Account is available immediately afterwards.',
    },
    {
      question: 'Which exchanges does MetaStation support?',
      answer:
        'Binance, ByBit and KuCoin can be connected using API keys you generate at each exchange, alongside the native MetaStation Account. Your funds stay at the exchange when you connect one — MetaStation places orders and never needs withdrawal permission.',
    },
    {
      question: 'Can I automate TradingView alerts with MetaStation?',
      answer:
        'Yes. Each trading slot has a webhook URL you paste into a TradingView alert, and the alert message carries a JSON or plain-language payload describing the trade. Webhook automation is free on the MetaStation Account slot and requires a slot subscription on connected exchange slots.',
    },
  ]}
/>

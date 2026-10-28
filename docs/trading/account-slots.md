---
id: account-slots
title: Account Slots
sidebar_label: Account Slots
---

# Account Slots

Account slots are the unit of account management in MetaStation. Each slot is an independent trading configuration with its own balance, settings, and automation rules.

---

## Slot types

| Slot | Source | Cost | Automation |
|---|---|---|---|
| MetaStation Account | Native — your first is created at registration | Free; activated by its first deposit (one-time activation fee) | ✅ Included, free |
| Binance | Your own Binance API keys | Free for manual trading | Needs a Store plan |
| ByBit | Your own ByBit API keys | Free for manual trading | Needs a Store plan |
| KuCoin | Your own KuCoin API keys | Free for manual trading | Needs a Store plan |

There is **no cap** on the number of slots of either kind. Two rules apply when you add one:

- **Another MetaStation Account** — every MetaStation Account you already have must be activated
  first: deposit made, activation fee paid, **Enable Trading** done
- **Another exchange slot** — every slot you already have on that exchange must have working API
  keys

---

## What "manual" means

An exchange slot without a plan lets you:
- Trade from the MetaStation terminal
- Follow providers (copy trading as a follower)
- View positions and history

It **does not** include:
- Webhook automation
- Telegram-to-Trade

---

## Unlocking automation on an exchange slot

Buy an automation plan for the slot in the **Store** ([metastation.fi/store](https://metastation.fi/store)):

1. Open **Store** in the sidebar
2. Pick the **Slot** the plan is for
3. Under **Pay with**, pick the MetaStation Account whose wallet pays — the Store charges **USDC**
   from a MetaStation Account
4. Tick **Renew automatically** if you want the plan to renew at the end of its term
5. Confirm

The slot's row then reads **Automation plan active**. Plans, their terms and prices are listed in
the Store.

:::note
When a plan expires, automation on that slot stops: Telegram channels copying to it are paused, and
webhook signals are refused. Renewing does not resume a paused channel — resume it in
**Automation**.
:::

---

## MetaStation Account slots

Every MetaStation Account slot is free and includes all automation tools. Add more to run
separate strategies in parallel, each with its own balance and webhook URL.

---

## Managing slots

{/* SCREENSHOT: slots-overview | Trading Slots table with mixed slot types | 1440x900 | redact: account ids */}
<Screenshot id="slots-overview" />
{/* SCREENSHOT: store-slots | Store slot purchase screen | 1440x900 | redact: none */}
<Screenshot id="store-slots" />

Open **Account Management** in the sidebar
([metastation.fi/social-trade/account-management](https://metastation.fi/social-trade/account-management)) to:
- View all your slots
- Add a slot with **Add Trading Slot** — pick the exchange and give it a nickname
- Add, or remove, a slot's API keys
- Delete a slot

Each slot's webhook URL and **Trade Setting** (leverage and size caps) live on the **Automation**
page.

---
id: connect-exchange
title: Connect an Exchange
sidebar_label: Connect an Exchange
---

# Connect an Exchange

In addition to your native MetaStation Account, you can connect Binance, ByBit, and KuCoin using your own API keys.

---

## Supported exchanges

| Exchange | Spot | Futures | Leverage |
|---|---|---|---|
| Binance | ✅ | ✅ | Up to each market's maximum |
| ByBit | ✅ | ✅ | Up to each market's maximum |
| KuCoin | ✅ | ✅ | Up to each market's maximum |

KuCoin spot slots also support **margin trading** — borrow, repay and cross or isolated margin.

---

## Where slots live

Connected exchanges are managed on the **Account Management** page —
[metastation.fi/social-trade/account-management](https://metastation.fi/social-trade/account-management),
reachable from **Account Management** in the sidebar.

{/* SCREENSHOT: account-management | Account Management -> Trading Slots table | 1440x900 | redact: account ids */}
<Screenshot id="account-management" />
{/* SCREENSHOT: add-slots | Add Slots dialog | 1440x900 | redact: none */}
<Screenshot id="add-slots" />
{/* SCREENSHOT: api-key-form | per-exchange API key form | 1440x900 | redact: key, secret, passphrase */}

Connecting is two steps:

1. **Add Slots** — in the **Add Trading Slot** dialog, pick the exchange under **Select Exchange**
   and give the slot a **Nickname**
2. **Add API Keys** on the new slot — enter the credentials and **Save API Keys**

MetaStation checks the keys with the exchange when you save them. Keys the exchange rejects are
not saved, and the dialog says why.

---

## How to create the keys

### Binance

1. Log in to Binance and go to **API Management**
2. Create a new API key — enable **Futures Trading** and **Spot Trading** permissions. **Do not enable withdrawals.**
3. Copy the **API Key** and **Secret Key**
4. In MetaStation: **Add Slots → Binance**, then **Add API Keys** — paste the key and secret

### ByBit

1. Log in to ByBit and go to **API** under your profile
2. Create a new key — enable **Read-Write** for trading. Disable withdrawals.
3. Copy the **API Key** and **API Secret**, and note your **Bybit User ID** (shown on your ByBit profile)
4. In MetaStation: **Add Slots → ByBit**, then **Add API Keys** — paste the key, the secret and your **Bybit User ID**

### KuCoin

1. Log in to KuCoin and go to **API Management**
2. Create a new key with **General** and **Futures** permissions. Set a passphrase.
3. Copy the **API Key**, **Secret** and **Passphrase**
4. In MetaStation: **Add Slots → KuCoin**, then **Add API Keys** — enter all three values

---

## Security

:::warning
**Never enable withdrawal permissions on API keys you give to MetaStation.** Enable trading only. Your funds stay in your exchange account — MetaStation routes orders via the API, and withdrawals from an exchange are made on the exchange itself.
:::

API keys are encrypted at rest. MetaStation never stores them in plain text.

---

## Manual slot vs. paid automation

An exchange slot, without a plan, allows:
- Manual trading from the terminal
- Following providers (copy trading as a follower)

To unlock automation tools (Telegram-to-Trade, webhooks) on a Binance, ByBit, or KuCoin slot, buy a
plan for that slot in the **Store**.

The native **MetaStation Account** includes all automation tools free — no Store purchase required.

→ [Account Slots](/docs/trading/account-slots)

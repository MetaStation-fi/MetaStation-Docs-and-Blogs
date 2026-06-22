---
id: connect-exchange
title: Connect an Exchange
sidebar_label: Connect an Exchange
---

# Connect an Exchange

In addition to your native MetaStation Account, you can connect Binance, ByBit, and KuCoin using your own API keys.

---

## Supported exchanges

| Exchange | Spot | Futures | Max Leverage |
|---|---|---|---|
| Binance | ✅ | ✅ | 125x |
| ByBit | ✅ | ✅ | 125x |
| KuCoin | ✅ | ✅ | 100x |

---

## How to connect

### Binance

1. Log in to Binance and go to **API Management**
2. Create a new API key — enable **Futures Trading** and **Spot Trading** permissions. **Do not enable withdrawals.**
3. Copy the API Key and Secret Key
4. In MetaStation, go to **Settings → Account Slots → Add Slot → Binance**
5. Paste your API Key and Secret, name the slot, and save

### ByBit

1. Log in to ByBit and go to **API** under your profile
2. Create a new key — enable **Read-Write** for trading. Disable withdrawals.
3. Copy the API Key and API Secret
4. In MetaStation, go to **Settings → Account Slots → Add Slot → ByBit**
5. Paste credentials and save

### KuCoin

1. Log in to KuCoin and go to **API Management**
2. Create a new key with **General** and **Futures** permissions. Set a passphrase.
3. Copy the API Key, Secret, and Passphrase
4. In MetaStation, go to **Settings → Account Slots → Add Slot → KuCoin**
5. Enter all three values and save

---

## Security

:::warning
**Never enable withdrawal permissions on API keys you give to MetaStation.** Enable trading only. Your funds stay in your exchange account — MetaStation routes orders via the API.
:::

API keys are encrypted at rest. MetaStation never stores them in plain text.

---

## Free slot vs. paid automation

Each connected exchange comes with **1 free slot** that allows:
- Manual trading from the terminal
- Following marketplace providers (copy trading as a follower)

To unlock automation tools (Telegram-to-Trade, Webhooks) on a Binance, ByBit, or KuCoin slot, purchase an **account slot subscription** from the Store.

The native **MetaStation Account** includes all automation tools free — no Store purchase required.

→ [Account Slots](/docs/trading/account-slots)

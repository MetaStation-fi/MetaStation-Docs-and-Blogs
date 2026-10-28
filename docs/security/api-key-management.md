---
id: api-key-management
title: API Key Management
sidebar_label: API Key Management
---

# API Key Management

This page covers exchange API keys you connect to MetaStation — not MetaStation's own webhook tokens.

---

## How MetaStation handles your exchange API keys

- Keys are **checked with the exchange when you save them** — keys the exchange rejects are not saved
- What each key is allowed to do is read from the exchange and recorded
- Keys are **encrypted at rest** and never stored in plain text
- Keys are used only to place and manage orders and read balances on your exchange account
- MetaStation never withdraws from an exchange with your keys. Withdrawals from a connected
  exchange are made on the exchange itself

---

## Required permissions per exchange

Only grant the permissions MetaStation needs. Never grant withdrawal permissions.

| Exchange | Required permissions | Never grant |
|---|---|---|
| Binance | Spot Trading, Futures Trading, Read | Withdrawals, Universal Transfer |
| ByBit | Read-Write (trading) | Withdrawals |
| KuCoin | General, Futures | Withdrawal |

ByBit also asks for your **Bybit User ID**; KuCoin asks for the **API Passphrase** you set when
creating the key.

---

## Adding API keys

→ See [Connect an Exchange](/docs/trading/connect-exchange) for full setup instructions per exchange.

---

## Rotating API keys

If you suspect your API keys have been compromised:

1. Go to your exchange and **immediately delete the compromised key**
2. Create a new API key with the correct permissions
3. In MetaStation, open **Account Management**
   ([metastation.fi/social-trade/account-management](https://metastation.fi/social-trade/account-management))
4. On the affected slot, press **Remove keys** and confirm
5. Press **Add API Keys** on the same slot, enter the new credentials and **Save API Keys**

---

## Removing keys vs deleting a slot

| Action | What it does |
|---|---|
| **Remove keys** | Deletes the stored API key and secret from MetaStation. The slot stays, without keys, until you add new ones |
| **Delete slot** | Hides the slot from your accounts. Remove the keys first if you want them gone from MetaStation |

Neither affects your exchange account or any open positions on it — close those on the exchange or
from MetaStation before you remove the keys.

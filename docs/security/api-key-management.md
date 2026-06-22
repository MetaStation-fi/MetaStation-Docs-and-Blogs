---
id: api-key-management
title: API Key Management
sidebar_label: API Key Management
---

# API Key Management

This page covers exchange API keys you connect to MetaStation — not MetaStation's own webhook tokens.

---

## How MetaStation handles your exchange API keys

- Keys are **encrypted at rest** using industry-standard encryption
- Keys are **never stored in plain text**
- Keys are used only to route orders to your exchange account
- MetaStation never uses your keys for any action outside of explicit user-initiated trades

---

## Required permissions per exchange

Only grant the permissions MetaStation needs. Never grant withdrawal permissions.

| Exchange | Required permissions | Never grant |
|---|---|---|
| Binance | Spot Trading, Futures Trading, Read | Withdrawals, Universal Transfer |
| ByBit | Read-Write (trading) | Withdrawals |
| KuCoin | General, Futures | Withdrawal |

---

## Adding API keys

→ See [Connect an Exchange](/docs/trading/connect-exchange) for full setup instructions per exchange.

---

## Rotating API keys

If you suspect your API keys have been compromised:

1. Go to your exchange and **immediately delete the compromised key**
2. Create a new API key with correct permissions
3. In MetaStation, go to **Settings → Account Slots**
4. Select the affected slot → **Edit** → enter the new API key credentials
5. Save

---

## Deleting a slot

Deleting an account slot from MetaStation removes the stored keys from the system. It does not affect your exchange account or any open positions on the exchange — you must manage those directly.

1. Go to **Settings → Account Slots**
2. Click the slot → **Delete Slot**
3. Confirm

Any open positions on that exchange remain open and must be closed from the exchange directly.

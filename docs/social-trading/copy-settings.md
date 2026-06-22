---
id: copy-settings
title: Copy Trading Settings
sidebar_label: Copy Settings
---

# Copy Trading Settings

Fine-tune how trades are replicated from a provider to your account.

---

## Accessing copy settings

Go to **Marketplace → My Subscriptions** and click **Settings** next to a provider.

---

## Position size multiplier

Controls the size of each copied trade relative to the provider's trade.

| Setting | Effect |
|---|---|
| `1.0x` | Copy exact same size as provider |
| `0.5x` | Copy half the provider's size |
| `2.0x` | Copy double the provider's size |

**Recommended formula:**

```
multiplier = your_balance / provider_balance
```

This scales the provider's trades proportionally to your account size.

---

## Maximum position size cap

Sets a hard limit on any single copied position, regardless of multiplier.

**Example:** Cap set to $2,000 — even if the multiplier would result in a $5,000 position, it is capped at $2,000.

Prevents over-concentration in any single trade.

---

## Stop copying at loss threshold

Automatically pauses copying if your realized loss from this provider exceeds a set percentage.

**Example:** Set to -20% — if your copied positions from this provider lose 20% of your allocated capital, copying pauses automatically. You can resume manually.

---

## Symbol whitelist / blacklist

**Whitelist** — Only copy trades on the symbols you list. All other symbols are ignored.

**Example:** Whitelist `BTCUSDT`, `ETHUSDT` — skip all altcoin signals from this provider.

**Blacklist** — Exclude specific symbols. All others are copied.

---

## Risk management recommendations

:::tip
- Start with a 0.5x multiplier and scale up once you trust the provider's performance
- Set a maximum position cap at 5–10% of your total balance per trade
- Never allocate more than 30% of your total capital to one provider
- Monitor weekly and adjust settings if drawdown exceeds your tolerance
:::

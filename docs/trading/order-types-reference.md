---
id: order-types-reference
title: Order Types Reference
sidebar_label: Order Types Reference
---

# Order Types Reference

Full reference for all order types available on MetaStation.

---

## Basic order types

| Order Type | Description | Best for |
|---|---|---|
| **Market** | Executes immediately at best available price | Speed, high-liquidity pairs |
| **Limit** | Executes at your specified price or better | Price control, entries/exits |
| **Stop Market** | Market order triggered when price reaches stop level | Breakout entries, loss limits |
| **Stop Limit** | Limit order triggered at stop level | Precise conditional entries |

:::note[Webhook API accepts only market and limit]
The table above describes order types available **in the trading terminal**. The webhook API
accepts only `market` and `limit` as `orderType`; stop behaviour is configured through the stop
loss fields instead. → [Supported Actions](/docs/developer/supported-actions#order-types)
:::
| **Trailing Stop** | Dynamic stop that follows price | Profit protection in trending markets |

---

## Quantity formats

| Format | Example | Notes |
|---|---|---|
| Token amount | `0.001 BTC` | Precise token control |
| USD value | `$300` or `300 USD` | Consistent dollar risk per trade |
| Wallet percentage | `2%` | Portfolio-based sizing |

---

## Stop Loss types

| Type | Fills at | Risk |
|---|---|---|
| Simple (Market SL) | Market price at trigger — guaranteed fill | Slippage in fast markets |
| Limit SL | Your specified limit — may not fill if price gaps | No fill if price moves too fast |
| Trailing SL | Market price, dynamic trigger | Moves up with price |

---

## Take Profit

Up to 10 TP levels per position. Each TP can be set as:
- Token amount
- USD value
- Percentage of position

TPs execute independently. Unexecuted TPs remain active after earlier TPs fill.

---

## SLX (Stop Loss X)

Advanced trailing stop system. Two modes:

| Mode | Behaviour |
|---|---|
| Callback Rate | Trail by % from peak, activates at specified price |
| Trailing Profits | Move SL to entry or previous TP after each TP hits |

→ Full SLX documentation: [Advanced Orders](/docs/trading/advanced-orders#stop-loss-x-slx)

---

## Exchange availability

| Feature | MetaStation Acct | Binance | ByBit | KuCoin |
|---|---|---|---|---|
| Market / Limit | ✅ | ✅ | ✅ | ✅ |
| Stop Market / Limit | ✅ | ✅ | ✅ | ✅ |
| Trailing Stop | ✅ | ✅ | ✅ | ✅ |
| Multi-TP | ✅ | ✅ | ✅ | ✅ |
| SLX | ✅ | ✅ | ✅ | ✅ |
| Hedge Mode | ❌ | ❌ | ✅ | ❌ |

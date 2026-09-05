---
id: supported-actions
title: Supported Actions Reference
sidebar_label: Supported Actions
description: Every webhook action MetaStation accepts, the fields each one takes, and the values that are rejected.
---

# Supported Actions Reference

All actions available via webhook.

| Action | Purpose |
|---|---|
| `open` | Open a new position |
| `close` | Close a position, fully or partially |
| `update` | Modify TP / SL on an open position |

:::warning[`reverse` is not accepted]
An earlier version of this page documented a `reverse` action. It is **rejected** by the API with
`Invalid action: reverse. Must be one of: open, close, update, cancel`.

To flip a position, send a `close` followed by an `open`.
:::

---

## `open` — Open a position

Opens a new long or short position.

```json
{
  "action": "open",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "market",
  "quantity": 0.01,
  "category": "linear",
  "leverage": 10,
  "marginMode": "isolated"
}
```

**Required:** `action`, `symbol`, `side`
**Optional:** `orderType`, `category`, `price`, `quantity`, `leverage`, `marginMode`,
`takeProfit`, `takeProfits`, `futurestopLoss`, `stopLossX`, `comment`

Limit orders require `price` — without it the signal is rejected with `Limit orders require price`.

---

## `close` — Close a position

Closes an existing position on the specified symbol.

```json
{
  "action": "close",
  "symbol": "BTCUSDT",
  "side": "sell"
}
```

**Partial close:**

```json
{
  "action": "close",
  "symbol": "BTCUSDT",
  "side": "sell",
  "quantity": "50%"
}
```

**Required:** `action`, `symbol`, `side`
**Optional:** `quantity` (omit to close 100%)

---

## `update` — Modify TP/SL

Modifies the Take Profit and/or Stop Loss on an open position.

```json
{
  "action": "update",
  "symbol": "BTCUSDT",
  "side": "buy",
  "takeProfit": 52000,
  "stopLoss": 43000
}
```

**Required:** `action`, `symbol`
**Optional:** `takeProfit`, `stopLoss` (at least one must be provided)

`update` uses the **scalar** `takeProfit` and `stopLoss` fields rather than the `takeProfits`
array.

---

## Order types

| `orderType` | Description |
|---|---|
| `market` | Immediate execution at best price |
| `limit` | Execute at `price` or better |

:::warning[Only `market` and `limit` are accepted]
Any other value — including `stop_market` and `stop_limit`, which this page previously listed —
is rejected with `Invalid order type: <value>. Supported types: market, limit`.

Stop-triggered behaviour is configured through the stop loss fields
([`futurestopLoss`](/docs/developer/json-format#stop-loss)) rather than through the order type.
:::

---

## Market category

| `category` | Description |
|---|---|
| `linear` | Perpetual futures. Default |
| `spot` | Spot market |

Leverage, margin mode, take-profit ladders and stop loss apply to `linear` only.

---

## Margin modes

| `marginMode` | Description |
|---|---|
| `isolated` | Dedicated margin per position |
| `cross` | Shared margin across all positions |

---

## Price types

Used by `futurestopLoss.priceType`:

| Value | Description |
|---|---|
| `mark` | Mark price (default) |
| `last` | Last traded price |
| `index` | Index price |

And by `stopLossX.triggerBy`:

| Value | Description |
|---|---|
| `mark_price` | Mark price (default) |
| `last_price` | Last traded price |
| `index_price` | Index price |

---
id: supported-actions
title: Supported Actions Reference
sidebar_label: Supported Actions
---

# Supported Actions Reference

All actions available via webhook.

---

## `open` — Open a position

Opens a new long or short position.

```json
{
  "action": "open",
  "symbol": "BTCUSDC",
  "side": "buy",
  "orderType": "market",
  "quantity": "2%",
  "leverage": 10,
  "marginMode": "isolated"
}
```

**Required:** `action`, `symbol`, `side`  
**Optional:** `orderType`, `price`, `quantity`, `leverage`, `marginMode`, `takeProfit`, `takeProfits`, `stopLoss`, `stopLossX`

---

## `close` — Close a position

Closes an existing position on the specified symbol.

```json
{
  "action": "close",
  "symbol": "BTCUSDC",
  "side": "sell"
}
```

**Partial close:**

```json
{
  "action": "close",
  "symbol": "BTCUSDC",
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
  "symbol": "BTCUSDC",
  "takeProfit": 52000,
  "stopLoss": 43000
}
```

**Required:** `action`, `symbol`  
**Optional:** `takeProfit`, `stopLoss`, `takeProfits` (at least one must be provided)

---

## `reverse` — Reverse position

Closes the current position and immediately opens the opposite direction.

```json
{
  "action": "reverse",
  "symbol": "BTCUSDC",
  "side": "sell",
  "quantity": "2%",
  "leverage": 10
}
```

Useful for strategies that flip direction on signal (e.g., long → short on bearish signal).

**Required:** `action`, `symbol`, `side`  
**Optional:** `quantity`, `leverage`, `marginMode`, `takeProfit`, `stopLoss`

---

## Order types

| `orderType` | Description |
|---|---|
| `market` | Immediate execution at best price |
| `limit` | Execute at `price` or better |
| `stop_market` | Market order triggered at `stopPrice` |
| `stop_limit` | Limit order triggered at `stopPrice`, executes at `price` |

---

## Margin modes

| `marginMode` | Description |
|---|---|
| `isolated` | Dedicated margin per position |
| `cross` | Shared margin across all positions |

---

## Price types (for SLX)

| `triggerBy` | Description |
|---|---|
| `mark_price` | Uses exchange mark price (default) |
| `last_price` | Uses last traded price |
| `index_price` | Uses index price |

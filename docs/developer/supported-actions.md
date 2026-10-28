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
| `open` | Open a position, or add to one |
| `close` | Close the position held in a market, fully or partially |
| `target` | Bring the position to `long`, `short` or `flat` — one message instead of close-then-open |
| `cancel` | Withdraw followers' copy entries that have not filled yet |
| `update` | Not supported for changing take-profit or stop-loss — see below |

Any other action is rejected with
`Invalid action: <value>. Must be one of: open, close, update, cancel`.

:::note[`reverse` is not an action]
To flip a position, send one `target` message with the side you want. → [`target`](#target--hold-a-position)
:::

---

## `open` — Open a position

Opens a new long or short position, or adds to one.

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
`takeProfit`, `takeProfits`, `stopLoss`, `futurestopLoss`, `stopLossX`, `reduceOnly`,
`timeInForce`, `comment`, `metadata`, `dryRun`

- Limit orders require `price` — without it the signal is rejected with `Missing required field: price`.
- With no `quantity`, the slot's **Trade Setting** default size is used; with neither, the signal
  is refused.
- An opening signal more than **90 seconds** old when it arrives is refused, not traded. Send a
  `timestamp` (or TradingView's `{{timenow}}`) so the age is measured from when it was sent.

---

## `close` — Close a position

Closes whatever the slot holds in that market. No `side` is needed.

```json
{
  "action": "close",
  "symbol": "BTCUSDT"
}
```

**Partial close:**

```json
{
  "action": "close",
  "symbol": "BTCUSDT",
  "quantity": "50%"
}
```

**Required:** `action`, `symbol`
**Optional:** `quantity` (omit to close 100%)

A close is never refused for being late, and it is never stopped by a filter — closing late beats
staying in a position the sender has left.

---

## `target` — Hold a position

Says what the slot should **hold** in a market: `long`, `short` or `flat`. MetaStation reads the
position from the exchange and moves to the target — so a missed alert heals on the next one.

```json
{
  "action": "target",
  "symbol": "BTCUSDT",
  "position": "short",
  "position_size": 0.01
}
```

| Field | Values |
|---|---|
| `position`, `market_position` or `sentiment` | `long` / `short` / `flat` — or `bullish` / `bearish` / `flat` |
| `position_size` (or `market_position_size`) | The size for a new position |

- Already on the target side: nothing is done, whatever the size.
- On the other side: the position is closed and the target side opened.
- `flat`: the position is closed.

`action` may be left out when a target field is present — TradingView's
`{{strategy.market_position}}` template works as sent.
→ [TradingView Templates](/docs/developer/tradingview-templates)

---

## `cancel` — Withdraw resting copy entries

For a provider with followers: withdraws the followers' **copy entries that have not filled yet** in
that market. It opens and closes nothing; anything that already filled stays.

```json
{
  "action": "cancel",
  "symbol": "BTCUSDT"
}
```

---

## `update`

:::warning[Do not use `update` to move a take-profit or stop-loss]
`update` does not modify the protection on an open position yet. For followers it is refused when
they hold no position in the market. To change protection on your own slot, manage the orders from
the trade page.
:::

---

## Order types

| `orderType` | Description |
|---|---|
| `market` | Immediate execution at best price |
| `limit` | Execute at `price` or better |

Any other value is rejected. Stop-triggered behaviour is configured through the stop loss fields
([`futurestopLoss`](/docs/developer/json-format#stop-loss)) rather than through the order type.

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

With no `marginMode`, the account's current setting for that market is kept.

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

---

## Dry run

Add `?dryRun=1` to the URL, an `X-Dry-Run: 1` header, or `"dryRun": true` to the body. The webhook
returns the orders the signal **would** place and places nothing.

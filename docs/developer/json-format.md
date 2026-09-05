---
id: json-format
title: JSON Message Format
sidebar_label: JSON Format
description: The exact JSON a MetaStation webhook accepts — every field, the values that validate, and the shapes that are rejected.
---

# JSON Message Format

Full reference for the JSON webhook message format.

:::tip Build it instead of typing it
The **[Payload Builder](/docs/developer/payload-builder)** generates a valid payload from a form,
including the TradingView alert message and a `curl` command. It emits the same shape the
platform's own Webhook Management builder does.
:::

---

## Basic structure

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

---

## Fields reference

### Required fields

| Field | Type | Values | Description |
|---|---|---|---|
| `action` | string | `open`, `close`, `update` | Trade action |
| `symbol` | string | e.g. `BTCUSDT` | Trading pair |
| `side` | string | `buy`, `sell` | Direction |

### Optional fields

| Field | Type | Example | Description |
|---|---|---|---|
| `orderType` | string | `market`, `limit` | Default: `market`. **Only these two validate** |
| `category` | string | `linear`, `spot` | Market type. Default: `linear` |
| `price` | number | `44500` | Required for limit orders |
| `quantity` | string/number | `0.01`, `"2%"`, `"300 USD"` | Position size |
| `leverage` | number | `10` | Futures only |
| `marginMode` | string | `isolated`, `cross` | Futures only |
| `takeProfit` | number | `50000` | Single TP price |
| `takeProfits` | array | see below | Multiple TP levels |
| `futurestopLoss` | object | see below | Futures stop loss |
| `stopLossX` | object | see below | SLX configuration |
| `comment` | string | `"my strategy"` | Free-text label, echoed back |

---

## Quantity formats

```json
{ "quantity": 0.001 }        // 0.001 tokens
{ "quantity": "0.001 BTC" }  // same, with an explicit unit
{ "quantity": "2%" }         // 2% of wallet balance
{ "quantity": "300 USD" }    // $300 worth
```

:::warning `"$300"` is not accepted
The parser recognises a trailing `%`, the literal substring `USD`, or a
`<number> <TICKER>` pair. A bare `"$300"` matches none of them and falls through to a numeric
parse, which fails. Write `"300 USD"`.
:::

---

## Multiple Take Profits

Up to 10 levels. **Each level takes `price` and `amount`, both numbers.**

```json
{
  "action": "open",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "market",
  "quantity": 0.01,
  "category": "linear",
  "takeProfits": [
    { "price": 48000, "amount": 0.003 },
    { "price": 50000, "amount": 0.004 },
    { "price": 52000, "amount": 0.003 }
  ]
}
```

:::danger `amount` is a token quantity, not a percentage
This is the single most common reason a multi-TP signal is rejected.

- `amount` must be a **positive number in base tokens**. Percentage strings (`"30%"`) and
  keywords (`"remainder"`) are **rejected** — the validator returns
  `TPn missing price or amount`.
- Both `price` and `amount` are required on every level.
- The **sum of all amounts must not exceed `quantity`**, or the signal is rejected with
  `Total TP amount exceeds order amount`.

In the example above the three amounts total `0.01`, matching the order quantity exactly.
:::

For a single take profit, use the scalar `takeProfit` field instead:

```json
{ "takeProfit": 50000 }
```

---

## Stop loss

For futures, the stop loss travels as an object under `futurestopLoss`:

```json
{
  "futurestopLoss": {
    "slType": "market",
    "stopLossPrice": 41000,
    "priceType": "mark"
  }
}
```

A limit stop additionally needs `stopLimitPrice`:

```json
{
  "futurestopLoss": {
    "slType": "limit",
    "stopLossPrice": 41000,
    "stopLimitPrice": 40900,
    "priceType": "mark"
  }
}
```

| Field | Values | Notes |
|---|---|---|
| `slType` | `market`, `limit` | `market` always fills; `limit` may not |
| `stopLossPrice` | number | The trigger price |
| `stopLimitPrice` | number | Required when `slType` is `limit` |
| `priceType` | `mark`, `last`, `index` | Default `mark` |

The scalar `stopLoss` field is used with the [`update`](#update-tp-and-sl) action.

---

## SLX configuration

### Callback Rate Mode

```json
{
  "stopLossX": {
    "slxMode": "callback_rate",
    "activationPrice": 46000,
    "callbackRate": 2.0,
    "triggerBy": "mark_price"
  }
}
```

### Trailing Profits Mode

```json
{
  "stopLossX": {
    "slxMode": "trailing_profits",
    "activationPoint": "TP1",
    "trailingType": "breakeven"
  }
}
```

`trailingType` options: `breakeven` or `follow_tp`.

:::note Two accepted forms
The nested `stopLossX` object above is accepted by the API. The platform's own Webhook Management
builder emits an equivalent **flattened** form instead — `slxChecked` with either
`trailingStatus` / `activationPoint` / `trailingType`, or `callBackStatus` /
`callbackActivationPrice` / `callbackRate`. Both work; the [Payload
Builder](/docs/developer/payload-builder) emits the flattened form so it matches the app exactly.
:::

---

## Close position

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

---

## Update TP and SL

```json
{
  "action": "update",
  "symbol": "BTCUSDT",
  "side": "buy",
  "takeProfit": 51000,
  "stopLoss": 44000
}
```

`update` uses the scalar `takeProfit` and `stopLoss` fields.

---

## Full example

```json
{
  "action": "open",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "limit",
  "price": 44500,
  "quantity": 0.01,
  "category": "linear",
  "leverage": 10,
  "marginMode": "isolated",
  "takeProfits": [
    { "price": 47000, "amount": 0.003 },
    { "price": 49000, "amount": 0.004 },
    { "price": 52000, "amount": 0.003 }
  ],
  "futurestopLoss": {
    "slType": "market",
    "stopLossPrice": 41000,
    "priceType": "mark"
  },
  "stopLossX": {
    "slxMode": "trailing_profits",
    "activationPoint": "TP1",
    "trailingType": "breakeven"
  }
}
```

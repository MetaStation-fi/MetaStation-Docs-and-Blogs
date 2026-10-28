---
id: json-format
title: JSON Message Format
sidebar_label: JSON Format
description: The exact JSON a MetaStation webhook accepts — every field, the values that validate, and the shapes that are rejected.
---

# JSON Message Format

Full reference for the JSON webhook message format.

:::tip[Build it instead of typing it]
The **[Payload Builder](/docs/developer/payload-builder)** generates a valid payload from a form,
including the TradingView alert message and a `curl` command.
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
| `action` | string | `open`, `close`, `target`, `cancel` | Trade action. May be left out when a target field is sent |
| `symbol` | string | e.g. `BTCUSDT` | Trading pair |
| `side` | string | `buy`, `sell` | Direction. Required for `open` only |

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
| `stopLoss` | number | `41000` | A simple stop-loss price |
| `stopLossX` | object | see below | SLX configuration — see the note under SLX |
| `reduceOnly` | boolean | `true` | Only reduce a position, never open one |
| `timeInForce` | string | `GTC`, `IOC`, `FOK` | Default `GTC` |
| `timestamp` | number/string | `{{timenow}}` | When the signal was sent. An opening signal more than 90 s old is refused |
| `position` / `market_position` / `sentiment` | string | `long`, `short`, `flat` | A [target position](/docs/developer/supported-actions#target--hold-a-position) |
| `position_size` | number | `0.01` | Size for a target's new position |
| `dryRun` | boolean | `true` | Return what would be placed; place nothing |
| `metadata` | object | `{}` | Your own data, stored with the signal |
| `comment` | string | `"my strategy"` | Free-text label |

Most fields also accept a snake_case spelling — `order_type`, `take_profits`, `stop_loss_x`,
`margin_mode`, `reduce_only`, `time_in_force`.

---

## Quantity formats

```json
{ "quantity": 0.001 }        // 0.001 tokens
{ "quantity": "0.001 BTC" }  // same, with an explicit unit
{ "quantity": "2%" }         // 2% of wallet balance
{ "quantity": "300 USD" }    // $300 worth
```

:::warning[`"$300"` is not accepted]
The parser recognises a trailing `%`, the literal substring `USD`, or a
`<number> <TICKER>` pair. A bare `"$300"` matches none of them and falls through to a numeric
parse, which fails. Write `"300 USD"`.
:::

---

## Multiple Take Profits

**Each level takes `price` and `amount`, both numbers.** An optional `label` names the level.

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

:::danger[`amount` is a token quantity, not a percentage]
This is the single most common reason a multi-TP signal is rejected.

- `amount` must be a **positive number in base tokens**. Percentage strings (`"30%"`) and
  keywords (`"remainder"`) are **rejected** — the validator returns
  `TPn has invalid price or amount`.
- Both `price` and `amount` are required on every level.
- Keep the **sum of all amounts at or below `quantity`**. Each level must also be at least the
  market's minimum order size.

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

A plain price works too:

```json
{ "stopLoss": 41000 }
```

When the entry is a limit order, the stop and take-profits are placed **when the entry fills**,
sized to the fill. If a stop cannot be placed, the position is closed rather than left
unprotected.

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

:::warning[SLX over the webhook]
SLX is set on the **order ticket** in the trading terminal. A webhook signal's `stopLossX` is
accepted but is not placed yet — send a plain stop loss (`futurestopLoss` or `stopLoss`) with your
signal, and add SLX on the ticket if you want it.
:::

---

## Close position

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

No `side` is needed: a close closes whatever the slot holds in that market.

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
  }
}
```

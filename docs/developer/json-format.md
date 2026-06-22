---
id: json-format
title: JSON Message Format
sidebar_label: JSON Format
---

# JSON Message Format

Full reference for the JSON webhook message format.

---

## Basic structure

```json
{
  "action": "open",
  "symbol": "BTCUSDC",
  "side": "buy",
  "orderType": "market",
  "quantity": "2%",
  "leverage": 10,
  "marginMode": "isolated",
  "takeProfit": 50000,
  "stopLoss": 40000
}
```

---

## Fields reference

### Required fields

| Field | Type | Values | Description |
|---|---|---|---|
| `action` | string | `open`, `close`, `update`, `reverse` | Trade action |
| `symbol` | string | e.g. `BTCUSDC`, `ETHUSDT` | Trading pair |
| `side` | string | `buy`, `sell` | Direction (for `open`) |

### Optional fields

| Field | Type | Example | Description |
|---|---|---|---|
| `orderType` | string | `market`, `limit` | Default: `market` |
| `price` | number | `45000` | Required for limit orders |
| `quantity` | string/number | `"2%"`, `"300 USD"`, `0.001` | Position size |
| `leverage` | number | `10` | Leverage multiplier |
| `marginMode` | string | `isolated`, `cross` | Margin mode |
| `takeProfit` | number | `50000` | Single TP price |
| `stopLoss` | number | `40000` | Stop loss price |

---

## Quantity formats

```json
{ "quantity": "2%" }         // 2% of wallet balance
{ "quantity": "300 USD" }    // $300 worth
{ "quantity": "$300" }       // same as above
{ "quantity": 0.001 }        // 0.001 BTC (token amount)
{ "quantity": "0.001 BTC" }  // same with explicit unit
```

---

## Multiple Take Profits

```json
{
  "action": "open",
  "symbol": "BTCUSDC",
  "side": "buy",
  "orderType": "market",
  "quantity": "2%",
  "takeProfits": [
    { "price": 48000, "quantity": "30%" },
    { "price": 50000, "quantity": "40%" },
    { "price": 52000, "quantity": "remainder" }
  ],
  "stopLoss": 40000
}
```

Up to 10 TP levels. Use `"remainder"` for the last level to close whatever is left.

---

## Advanced Stop Loss types

```json
{
  "stopLoss": {
    "slType": "limit",
    "stopLossPrice": 40000,
    "stopLimitPrice": 39900,
    "priceType": "mark"
  }
}
```

| `slType` | Behaviour |
|---|---|
| `market` | Market SL — guaranteed fill |
| `limit` | Limit SL — may not fill in fast markets |
| `trailing` | Trailing SL — dynamic |

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

`trailingType` options: `breakeven` or `follow_tp`

---

## Close position

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

---

## Update TP/SL

```json
{
  "action": "update",
  "symbol": "BTCUSDC",
  "takeProfit": 51000,
  "stopLoss": 44000
}
```

---

## Reverse position

```json
{
  "action": "reverse",
  "symbol": "BTCUSDC",
  "side": "sell",
  "quantity": "2%"
}
```

Closes the current position and opens the opposite direction with the specified size.

---

## Full example with all features

```json
{
  "action": "open",
  "symbol": "BTCUSDC",
  "side": "buy",
  "orderType": "limit",
  "price": 44500,
  "quantity": "3%",
  "leverage": 10,
  "marginMode": "isolated",
  "takeProfits": [
    { "price": 47000, "quantity": "30%" },
    { "price": 49000, "quantity": "40%" },
    { "price": 52000, "quantity": "remainder" }
  ],
  "stopLoss": 41000,
  "stopLossX": {
    "slxMode": "trailing_profits",
    "activationPoint": "TP1",
    "trailingType": "follow_tp"
  }
}
```

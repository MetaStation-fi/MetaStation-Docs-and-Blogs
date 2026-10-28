---
id: tradingview-templates
title: TradingView Templates
sidebar_label: TradingView Templates
---

# TradingView Alert Templates

Copy-paste ready alert messages for common TradingView setups. Paste the slot's **Webhook URL** from
**Automation** into the alert's Webhook URL box, and one of these into the message box.

:::tip[Turn on the Source-address check]
TradingView alerts cannot sign a request. Set the slot's verification mode to **Source-address
check** on the Automation page: requests are then accepted only from TradingView's published
addresses, and a leaked URL is useless to anyone else.
:::

---

## Strategy alerts — the target template (recommended)

One template for every Pine strategy. It sends the position the strategy **wants to hold**, so
entries, exits and reversals are all the same message, and a missed alert heals on the next one.

```
{
  "symbol": "{{ticker}}",
  "market_position": "{{strategy.market_position}}",
  "position_size": {{strategy.market_position_size}},
  "timestamp": "{{timenow}}",
  "leverage": 5,
  "marginMode": "isolated"
}
```

`{{strategy.market_position}}` is `long`, `short` or `flat`. → [`target`](/docs/developer/supported-actions#target--hold-a-position)

---

## Strategy alerts — open and close

### Open on a strategy signal

```
{
  "action": "open",
  "symbol": "{{ticker}}",
  "side": "{{strategy.order.action}}",
  "orderType": "market",
  "quantity": "2%",
  "leverage": 10,
  "marginMode": "isolated",
  "timestamp": "{{timenow}}"
}
```

### Close on exit

```
{
  "action": "close",
  "symbol": "{{ticker}}"
}
```

:::note[No arithmetic in placeholders]
TradingView substitutes `{{variables}}` as text; it does not calculate. `{{strategy.order.price * 1.06}}`
is not a value and breaks the JSON. Compute take-profit and stop-loss prices in your Pine script and
pass them in with `alert()`, or use fixed prices.
:::

---

## Indicator alerts

Use with custom indicators or price alerts. You define the values.

### EMA crossover — open long

```
{
  "action": "open",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "market",
  "quantity": "2%",
  "leverage": 10,
  "stopLoss": 40000
}
```

### RSI oversold bounce — open long

```
{
  "action": "open",
  "symbol": "ETHUSDT",
  "side": "buy",
  "orderType": "market",
  "quantity": "1%",
  "leverage": 5,
  "stopLoss": 2800,
  "takeProfit": 3400
}
```

### Support bounce with multiple TPs

```
{
  "action": "open",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "market",
  "quantity": 0.01,
  "leverage": 10,
  "marginMode": "isolated",
  "takeProfits": [
    {"price": 48000, "amount": 0.003},
    {"price": 50000, "amount": 0.004},
    {"price": 52000, "amount": 0.003}
  ],
  "stopLoss": 41000
}
```

---

## Natural language templates

```
Buy {{ticker}} at market
Size: 2%
Leverage: 10x
Isolated Margin
SL: 40000
TP: 50000
```

```
Close {{ticker}}
```

```
Short {{ticker}}
Size: 1%
Cross 5x
Stop: 47000
Target: 43000
```

---

## TradingView variable reference

| Variable | Value |
|---|---|
| `{{ticker}}` | Symbol (e.g., `BTCUSDT`) |
| `{{close}}` | Current bar close |
| `{{open}}` | Current bar open |
| `{{high}}` | Current bar high |
| `{{low}}` | Current bar low |
| `{{volume}}` | Current bar volume |
| `{{timenow}}` | When the alert fired — send it as `timestamp` |
| `{{strategy.order.action}}` | `buy` or `sell` |
| `{{strategy.order.price}}` | Strategy order price |
| `{{strategy.market_position}}` | `long`, `short` or `flat` |
| `{{strategy.market_position_size}}` | The strategy's position size |
| `{{strategy.order.id}}` | Order ID from Pine strategy |

:::tip
For JSON alerts, put `{{variable}}` outside quotes for numeric values and inside quotes for strings.
TradingView substitutes values before sending.
:::

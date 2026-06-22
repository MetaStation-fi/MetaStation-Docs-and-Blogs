---
id: tradingview-templates
title: TradingView Templates
sidebar_label: TradingView Templates
---

# TradingView Alert Templates

Copy-paste ready alert messages for common TradingView setups.

---

## Strategy-based alerts

Use with Pine Script strategies. TradingView injects values at alert time via `{{variables}}`.

### Open position on strategy signal

```
{
  "action": "open",
  "symbol": "{{ticker}}",
  "side": "{{strategy.order.action}}",
  "orderType": "market",
  "quantity": "2%",
  "leverage": 10,
  "marginMode": "isolated"
}
```

### Open with TP and SL based on price

```
{
  "action": "open",
  "symbol": "{{ticker}}",
  "side": "{{strategy.order.action}}",
  "orderType": "market",
  "quantity": "2%",
  "leverage": 10,
  "takeProfit": {{strategy.order.price * 1.06}},
  "stopLoss": {{strategy.order.price * 0.97}}
}
```

### Close on exit signal

```
{
  "action": "close",
  "symbol": "{{ticker}}",
  "side": "{{strategy.order.action}}"
}
```

---

## Indicator-based alerts

Use with custom indicators or price alerts. You manually define the values.

### EMA crossover — open long

```
{
  "action": "open",
  "symbol": "BTCUSDC",
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
  "symbol": "ETHUSDC",
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
  "symbol": "BTCUSDC",
  "side": "buy",
  "orderType": "market",
  "quantity": "3%",
  "leverage": 10,
  "marginMode": "isolated",
  "takeProfits": [
    {"price": 48000, "quantity": "30%"},
    {"price": 50000, "quantity": "40%"},
    {"price": 52000, "quantity": "remainder"}
  ],
  "stopLoss": 41000
}
```

---

## Natural language templates (for simpler alerts)

```
Buy {{ticker}} at market
Size: 2%
Leverage: 10x Isolated
SL: 40000
TP: 50000
```

```
Close {{ticker}} long
```

```
Short {{ticker}} 5x
Size: 1%
Stop: 47000
Target: 43000
```

---

## TradingView variable reference

| Variable | Value |
|---|---|
| `{{ticker}}` | Symbol (e.g., `BTCUSDC`) |
| `{{close}}` | Current bar close |
| `{{open}}` | Current bar open |
| `{{high}}` | Current bar high |
| `{{low}}` | Current bar low |
| `{{volume}}` | Current bar volume |
| `{{time}}` | Alert timestamp (Unix ms) |
| `{{strategy.order.action}}` | `buy` or `sell` |
| `{{strategy.order.price}}` | Strategy order price |
| `{{strategy.position_size}}` | Current strategy position size |
| `{{strategy.order.id}}` | Order ID from Pine strategy |

:::tip
For JSON alerts, wrap `{{variable}}` outside of quotes for numeric values, or inside quotes for strings. TradingView substitutes values before sending.
:::

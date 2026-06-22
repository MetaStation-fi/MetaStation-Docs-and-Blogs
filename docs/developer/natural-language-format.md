---
id: natural-language-format
title: Natural Language Format
sidebar_label: Natural Language Format
---

# Natural Language Format

MetaStation's parser accepts human-readable text signals in addition to JSON. This is ideal for TradingView alerts and manual Telegram signal channels.

---

## Basic format

```
Buy BTCUSDC at market
Size: 2% of wallet
Leverage: 10x Isolated
Take Profit: 50000
Stop Loss: 40000
```

---

## Supported signal patterns

### Open long (buy)

```
Buy BTCUSDC at market
Size: 2%
Leverage: 10x
SL: 40000
TP: 50000
```

```
Long BTC/USDT
Entry: Market
Size: $300
TP1: 48000
TP2: 51000
SL: 41000
```

```
LONG ETHUSDC 5x Isolated
2% of wallet
Stop: 2800
Target: 3500
```

### Open short (sell)

```
Short BTCUSDC at market
Size: 1%
Leverage: 5x
SL: 47000
TP: 42000
```

### Close position

```
Close BTC long
```

```
Close all ETHUSDC positions
```

```
Close 50% of BTCUSDC long
```

### Update TP/SL

```
Update BTC
New TP: 51000
New SL: 44000
```

---

## Recognized keywords

**Actions:** `Buy`, `Sell`, `Long`, `Short`, `Close`, `Update`, `Reverse`

**Size:** `Size`, `Quantity`, `Amount`, `Position Size`, or just a number with `%`, `USD`, `$`, or token symbol

**Leverage:** `Leverage`, `Lev`, or a number followed by `x` (e.g., `10x`)

**Margin mode:** `Isolated`, `Cross`

**Take Profit:** `TP`, `Take Profit`, `Target`, `TP1`, `TP2`, ..., `TP10`

**Stop Loss:** `SL`, `Stop Loss`, `Stop`, `Stop Price`

---

## Multiple Take Profits in natural language

```
Buy BTCUSDC market
Size: 2%
Leverage: 10x
TP1: 48000 (30%)
TP2: 50000 (40%)
TP3: 52000 (30%)
SL: 41000
```

---

## Parser behavior

- **Case insensitive** — `buy`, `BUY`, `Buy` all work
- **Symbol formats** — `BTCUSDC`, `BTC/USDT`, `BTC-USDT` are all accepted
- **Missing fields** — If a required field (action, symbol, side) cannot be parsed, the signal is rejected and logged as a parse error. No trade is executed.
- **Ambiguous signals** — The parser does not guess. If the signal is unclear, it fails safely.

---

## Limitations vs JSON

Natural language is convenient but less precise. For complex configurations — multiple TPs with specific sizes, SLX, stop limit orders — use the [JSON format](/docs/developer/json-format) for reliability.

Use natural language for:
- Simple long/short signals from TradingView text alerts
- Telegram channel signals in text form

Use JSON for:
- Programmatic bots
- Strategies with multi-TP and SLX
- Any automated system that generates signals

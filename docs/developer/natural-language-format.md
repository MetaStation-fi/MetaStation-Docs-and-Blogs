---
id: natural-language-format
title: Natural Language Format
sidebar_label: Natural Language Format
---

# Natural Language Format

MetaStation's parser accepts human-readable text signals in addition to JSON — the kind Telegram
channels post. Send them as `text/plain`, or inside a JSON `{ "message": "…" }` wrapper.

:::tip[Test before you trust it]
Send any message with `?dryRun=1` on the URL and the response shows what it was read as — and what
would be traded — without placing anything.
:::

---

## Basic format

```
Buy BTCUSDT at market
Size: 2%
Leverage: 10x
Isolated Margin
TP: 50000
SL: 40000
```

---

## Supported signal patterns

### Open long

```
Long BTC/USDT
Entry: Market
Size: 300 USD
TP1: 48000
TP2: 51000
SL: 41000
```

```
Buy ETHUSDT
Size: 2%
Cross 5x
Stop: 2800
Target: 3500
```

### Open short

```
Short BTCUSDT at market
Size: 1%
Leverage: 5x
SL: 47000
TP: 42000
```

### Close position

```
Close BTCUSDT
```

A close closes the **whole** position in that market.

### Cancel resting copy entries

```
Cancel BTCUSDT
```

---

## Recognized keywords

| What | Words |
|---|---|
| **Action** | `open`, `close`, `cancel`. A message with no action word but a side is an **open** |
| **Side** | `Buy`, `Long`, `Sell`, `Short`, `Enter long`, `Enter short` |
| **Size** | A number after `Size`, `Qty`, `Quantity` or `Amount` — with `%`, `USD`, or a token symbol |
| **Leverage** | `Leverage 10`, `Lev 10`, `10x` or `x10` |
| **Margin mode** | `Isolated` or `Cross` **followed by** `Margin` or a leverage (`Cross 5x`) |
| **Entry price** | `at`, `@`, `Entry`, `Entry price`, `Price` — a range (`Entry: 120-121`) is accepted |
| **Take profit** | `TP`, `Target`, `Take Profit`, `TP1` … `TP10`, `Target 1:` |
| **Stop loss** | `SL`, `Stop Loss`, `Stop`, `Stoploss` |
| **Time in force** | `TIF: GTC`, `IOC`, `FOK`, `Post-Only` |
| **Market** | `spot`, `futures` |

:::warning[Sizes that look right and are not]
- **`$300` is read as 300 tokens**, not dollars. Write `Size: 300 USD`.
- A size needs its word. `2% of wallet` on its own line carries **no size** — write `Size: 2%`.
  With no size, the slot's Trade Setting default size is used.
- `Close 50% of BTCUSDT` closes the **whole** position — partial closes need JSON.
:::

---

## Multiple take profits

```
Buy BTCUSDT market
Size: 2%
Leverage: 10x
TP1: 48000 (30%)
TP2: 50000 (40%)
TP3: 52000 (30%)
SL: 41000
```

The percentages are shares of the position and **must add up to 100%**. A take-profit's share needs
its `%` sign.

---

## Parser behaviour

- **Case insensitive** — `buy`, `BUY`, `Buy` all work
- **Symbol formats** — `BTCUSDT`, `BTC/USDT`, `BTC-USDT`, `#BTCUSDT`. A bare coin needs its quote
  currency or a side word next to it
- **Missing fields** — if the symbol or the side of an opening cannot be read, the signal is
  rejected with a `400` that lists what was found and what is missing. No trade is executed
- **No guessing** — an ambiguous message fails safely
- **Trigger orders** — a post written as a stop or trigger entry is refused

---

## Limitations vs JSON

Natural language is convenient but less precise. Use [JSON](/docs/developer/json-format) for:

- Partial closes, and target positions
- Take-profit ladders with exact token amounts
- Stop-limit stops
- Any automated system that generates signals

Use natural language for simple long/short signals and Telegram channel posts.

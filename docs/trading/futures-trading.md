---
id: futures-trading
title: Futures Trading
sidebar_label: Futures Trading
---

# Futures Trading

Futures (perpetual contracts) let you trade with leverage — amplifying both gains and losses. Perpetuals have no expiry date.

:::warning
Futures trading involves substantial risk. High leverage can result in rapid and complete loss of margin. Only trade with capital you can afford to lose.
:::

---

## Open a futures position

1. Open **Future** in the navigation, select your account slot
2. Select a market (e.g., `BTC` perpetual)
3. On a MetaStation Account, press **Enable Trading** the first time
4. Set leverage — up to the market's own maximum, which the ticket shows and enforces
5. Choose margin mode: **Isolated** or **Cross**
6. Set order type and quantity
7. Click **Long** (buy) or **Short** (sell)

---

## Leverage

Leverage multiplies your buying power. A 10x leveraged position on $100 controls $1,000 in exposure.

| Leverage | Risk | Use case |
|---|---|---|
| 1x–5x | Low | Conservative, swing trades |
| 5x–20x | Medium | Active trading |
| 20x–50x | High | Short-term, experienced traders |
| 50x+ | Very high | Expert only — where the market allows it |

Each market has its own maximum leverage, read from the venue; the order ticket will not let you go
above it. Adjust leverage per position in the order panel.

---

## Margin modes

**Isolated margin** — Each position has its own dedicated margin. If the position is liquidated, only that margin is lost. Recommended for most traders.

**Cross margin** — All positions share your total account balance as margin. Higher liquidation resistance, but a loss in one position draws from your whole balance.

---

## Position modes (ByBit)

**One-Way mode** — One position per symbol. Opening an opposite direction closes or reduces the existing one.

**Hedge mode** — Separate long and short positions can be open simultaneously on the same symbol. Useful for hedging strategies.

Other accounts, the MetaStation Account included, trade in one-way mode.

---

## Take Profit and Stop Loss

Set TP/SL when placing the order or attach them after opening the position. For advanced configurations including multiple Take Profits and trailing stops, see:

→ [Advanced Orders](/docs/trading/advanced-orders)

---

## Liquidation

If your position's margin falls below the maintenance margin requirement, it is liquidated. The **liquidation price** is shown in the Positions panel.

Reduce liquidation risk by:
- Using lower leverage
- Adding margin to isolated positions
- Setting a Stop Loss before reaching liquidation price

On a MetaStation Account you also get a **Margin warning** in the notification bell when a
position's margin runs low.

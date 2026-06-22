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

1. Open the **Trade** tab, select your account slot
2. Set market type to **Futures**
3. Select a pair (e.g., `BTCUSDC-PERP`)
4. Set leverage (1x–50x on MetaStation Account, up to 125x on Binance/ByBit)
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
| 50x+ | Very high | Expert only — on supported exchanges |

Adjust leverage per position in the order panel.

---

## Margin modes

**Isolated margin** — Each position has its own dedicated margin. If the position is liquidated, only that margin is lost. Recommended for most traders.

**Cross margin** — All positions share your total account balance as margin. Higher liquidation resistance, but a loss in one position draws from your whole balance.

---

## Position modes (ByBit only)

**One-Way mode** — One position per symbol. Opening an opposite direction closes or reduces the existing one.

**Hedge mode** — Separate long and short positions can be open simultaneously on the same symbol. Useful for hedging strategies.

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

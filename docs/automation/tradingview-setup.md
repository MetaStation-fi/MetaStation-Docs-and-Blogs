---
id: tradingview-setup
title: TradingView Setup
sidebar_label: TradingView Setup
---

# TradingView Setup

Connect TradingView alerts to MetaStation so your chart signals execute as live trades automatically.

---

## Prerequisites

- A MetaStation webhook URL (see [Webhook Trading](/docs/automation/webhook-trading))
- The slot's verification mode set to **Source-address check** on the Automation page — TradingView
  cannot sign requests, so this is the check that makes a leaked URL useless
- A TradingView account (Free or paid — webhooks require at least the Essential plan)

---

## Step-by-step

### 1. Create your alert in TradingView

1. Open your chart and set up the indicator or strategy that generates signals
2. Right-click the indicator → **Add Alert** (or press `Alt+A`)
3. Set your alert condition (e.g., EMA crossover, price level, strategy order)

### 2. Configure the alert to send a webhook

In the alert creation dialog:

1. Expand **Notifications**
2. Enable **Webhook URL**
3. Paste your MetaStation webhook URL
4. In the **Message** field, enter your signal (see formats below)
5. Set **Frequency** — typically "Once per bar close" or "Once per bar"
6. Click **Create**

---

## Message formats

You can use either JSON or natural language. Both work.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="json" label="JSON Format">

```json
{
  "action": "open",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "market",
  "quantity": "2%",
  "leverage": 10,
  "marginMode": "isolated",
  "takeProfit": 50000,
  "stopLoss": 40000
}
```

  </TabItem>
  <TabItem value="nl" label="Natural Language">

```
Buy BTCUSDT at market
Size: 2%
Leverage: 10x
Isolated Margin
Take Profit: 50000
Stop Loss: 40000
```

  </TabItem>
</Tabs>

---

## Using TradingView variables in messages

TradingView can inject live values into your message at alert time:

| Variable | Value inserted |
|---|---|
| `{{ticker}}` | Symbol name (e.g., `BTCUSDC`) |
| `{{close}}` | Current bar close price |
| `{{strategy.order.action}}` | `buy` or `sell` |
| `{{strategy.market_position}}` | `long`, `short` or `flat` |
| `{{strategy.market_position_size}}` | The strategy's position size |
| `{{timenow}}` | When the alert fired — send it as `timestamp` |

**The one template a strategy needs** — it sends the position the strategy wants to hold, so
entries, exits and reversals are all the same alert:

```
{
  "symbol": "{{ticker}}",
  "market_position": "{{strategy.market_position}}",
  "position_size": {{strategy.market_position_size}},
  "timestamp": "{{timenow}}"
}
```

TradingView substitutes values; it does not calculate, so `{{strategy.order.price * 1.06}}` does
not work. → [TradingView Templates](/docs/developer/tradingview-templates)

---

## Common alert setups

**EMA crossover — open long:**
```json
{
  "action": "open",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "market",
  "quantity": "2%",
  "stopLoss": 40000
}
```

**Close the position:**
```json
{
  "action": "close",
  "symbol": "BTCUSDT"
}
```

---

## Testing

1. Before going live, send the message once with `?dryRun=1` on the URL — the response shows what
   would be placed, and nothing is
2. Once the alert is live, fire it once at a small size
3. Check **History → Signal History** to confirm it was received and executed
4. Verify the order in your account

:::tip
Always test with a small position size (`"quantity": "0.5%"`) before deploying a full strategy.
:::

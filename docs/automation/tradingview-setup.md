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

  </TabItem>
  <TabItem value="nl" label="Natural Language">

```
Buy BTCUSDC at market
Size: 2% of wallet
Leverage: 10x Isolated
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
| `{{strategy.position_size}}` | Current strategy position size |
| `{{time}}` | Alert timestamp |

**Example template:**

```
{{strategy.order.action}} {{ticker}} at {{close}}
Size: 2%
Stop Loss: {{strategy.order.price * 0.97}}
Take Profit: {{strategy.order.price * 1.06}}
```

---

## Common alert setups

**EMA crossover — open long:**
```json
{
  "action": "open",
  "symbol": "BTCUSDC",
  "side": "buy",
  "orderType": "market",
  "quantity": "2%",
  "stopLoss": 40000
}
```

**Close position on opposite signal:**
```json
{
  "action": "close",
  "symbol": "BTCUSDC",
  "side": "sell"
}
```

**Update Stop Loss after TP1:**
```json
{
  "action": "update",
  "symbol": "BTCUSDC",
  "stopLoss": 47000
}
```

---

## Testing

1. Once the alert is live, use TradingView's **Test** button to fire a sample signal
2. Check MetaStation → **Webhook Management** to confirm it was received and parsed
3. Verify the order executed in your account

:::tip
Always test with a small position size (`"quantity": "0.5%"`) before deploying a full strategy.
:::

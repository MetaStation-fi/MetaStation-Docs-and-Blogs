---
id: webhook-trading
title: Webhook Trading
sidebar_label: Webhook Trading
---

# Webhook Trading

Webhooks let external services — TradingView, custom bots, or any HTTP source — send trading signals to MetaStation for automatic execution.

---

## How it works

```mermaid
graph LR
  A[Signal Source<br/>TradingView / Bot] --> B[Webhook URL]
  B --> C[MetaStation Parser]
  C --> D[Trading Engine]
  D --> E[Exchange / Account]
```

When your signal source fires an alert, it sends a POST request to your unique webhook URL. MetaStation parses the message and executes the trade on your selected account slot.

---

## Setup

### 1. Enable webhook for an account slot

1. Go to **Settings → Account Slots**
2. Select the slot you want to automate
3. Toggle **Webhook** → **Enable**

:::note
Webhook automation is **included free** on your MetaStation Account slot. For Binance, ByBit, or KuCoin slots, a paid slot subscription is required.
:::

### 2. Generate your webhook URL

1. Click **Generate Webhook URL**
2. Copy the URL — it looks like:

```
https://api.metastation.fi/webhook/{your-unique-token}
```

3. Store it securely. Treat it like a password — anyone with this URL can execute trades on your account.

### 3. Configure security (optional but recommended)

- **IP Whitelist** — Restrict webhook to only accept signals from specific IPs (e.g., TradingView's server IPs)
- **Rate limit** — Set max signals per minute to prevent abuse

### 4. Send signals

Send POST requests to your webhook URL in [JSON format](/docs/developer/json-format) or [Natural Language format](/docs/developer/natural-language-format).

---

## Supported actions

| Action | Description |
|---|---|
| `open` | Open a new position |
| `close` | Close an existing position (full or partial) |
| `update` | Modify TP/SL on an existing position |
| `reverse` | Close current position and open the opposite |

---

## Viewing webhook history

Go to **Settings → Webhooks → History** to see all received signals, their parsed content, execution status, and any errors.

---

## Testing your webhook

Use a tool like Postman or curl to send a test signal:

```bash
curl -X POST https://api.metastation.fi/webhook/YOUR_TOKEN \
  -H "Content-Type: application/json" \
  -d '{"action":"open","symbol":"BTCUSDC","side":"buy","orderType":"market","quantity":"1%"}'
```

Verify the trade appears in your account before going live.

---

→ [JSON Format Reference](/docs/developer/json-format)  
→ [Natural Language Format](/docs/developer/natural-language-format)  
→ [TradingView Setup](/docs/automation/tradingview-setup)

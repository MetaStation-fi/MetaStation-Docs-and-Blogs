---
id: webhook-api-overview
title: Webhook API Overview
sidebar_label: Webhook API Overview
---

# Webhook API Overview

The MetaStation Webhook API lets external systems execute trades on your account via HTTP POST requests.

:::tip Try it without writing any code
The **[API Reference](/docs/api/metastation-webhook-api)** is generated from our OpenAPI spec and
ships an interactive console — fill in the fields, send a real request, and read the real
response, straight from the page.

Start there: **[Execute a trade signal](/docs/api/execute-webhook)**.
:::

---

## Endpoint

```
POST https://metastation.fi/metastationapi/socialTrade/webhook/{accountId}
```

- `{token}` — Your unique webhook token, generated per account slot
- Content-Type: `application/json`
- No additional authentication headers required — the token in the URL is the auth

---

## Authentication

The webhook token authenticates the request. Treat it as a secret:

- Never commit it to public repositories
- Rotate it if exposed
- Use IP whitelisting to restrict which sources can call it

Regenerate your token at **Webhook Management → Your Webhook URLs → [Slot] → Regenerate Secret**. The old token stops working immediately.

---

## Rate limits

| Limit | Value |
|---|---|
| Requests per minute | 60 |
| Requests per hour | 500 |
| Concurrent open orders via webhook | 10 |

Requests exceeding the rate limit return HTTP `429 Too Many Requests`.

---

## Request format

Two formats are accepted:

**JSON** — Structured, precise, recommended for programmatic use  
**Natural Language** — Human-readable text, recommended for TradingView alerts

→ [JSON Format Reference](/docs/developer/json-format)  
→ [Natural Language Format](/docs/developer/natural-language-format)

---

## Response format

A successful response is an **acknowledgement that the signal was accepted**, not a confirmation
that the order filled:

```json
{
  "success": true,
  "message": "Webhook received and queued for processing",
  "signalId": "6512c0f1e4b0a1c2d3e4f5a6"
}
```

:::warning 200 means queued, not filled
The signal is validated and queued, then executed asynchronously. A bot that treats a 200 as
"the position exists" will be wrong whenever execution fails downstream — insufficient margin, a
symbol the venue rejects, a risk control on the slot.

Confirm real state from your positions, or from the signal log in **Webhook Management**, not from
this response.
:::

**Error response:**

```json
{
  "success": false,
  "result": null,
  "message": "Insufficient balance",
  "code": "INSUFFICIENT_BALANCE"
}
```

---

## Supported actions

| Action | Description |
|---|---|
| `open` | Open a new position |
| `close` | Close an existing position (full or partial) |
| `update` | Modify TP/SL on an open position |
| `reverse` | Close current position and open the opposite direction |

---

## Webhook history and logs

Every webhook request is logged. View it in **Webhook Management**:
- Timestamp
- Raw request body
- Parse result
- Execution status and order ID
- Error message (if failed)

---

## Error codes

→ [Error Codes Reference](/docs/developer/error-codes)

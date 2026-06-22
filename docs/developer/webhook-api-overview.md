---
id: webhook-api-overview
title: Webhook API Overview
sidebar_label: Webhook API Overview
---

# Webhook API Overview

The MetaStation Webhook API lets external systems execute trades on your account via HTTP POST requests.

---

## Endpoint

```
POST https://api.metastation.fi/webhook/{token}
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

Regenerate your token at **Settings → Account Slots → [Slot] → Webhook → Regenerate Token**. The old token stops working immediately.

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

All responses follow this structure:

```json
{
  "success": true,
  "result": { ... },
  "message": "Order placed successfully"
}
```

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

Every webhook request is logged. View at **Settings → Webhooks → History**:
- Timestamp
- Raw request body
- Parse result
- Execution status and order ID
- Error message (if failed)

---

## Error codes

→ [Error Codes Reference](/docs/developer/error-codes)

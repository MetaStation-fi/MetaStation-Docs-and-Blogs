---
id: webhook-api-overview
title: Webhook API Overview
sidebar_label: Webhook API Overview
---

# Webhook API Overview

The MetaStation Webhook API lets external systems execute trades on one of your accounts via HTTP
POST requests.

:::tip[Try it without writing any code]
The **[API Reference](/docs/api/metastation-webhook-api)** is generated from our OpenAPI spec and
ships an interactive console — fill in the fields and read the real response, straight from the
page. Add `?dryRun=1` to see what would be traded without placing anything.

Start there: **[Execute a trade signal](/docs/api/execute-webhook)**.
:::

---

## Endpoint

```
POST https://metastation.fi/metastationapi/socialTrade/webhook/{webhookSecret}
```

- `{webhookSecret}` — the secret part of the slot's **Webhook URL**, shown on the **Automation**
  page. Each slot has its own
- `Content-Type: application/json` — or `text/plain` for a natural-language message

Copy the full URL from **Automation → Your Webhook URLs** rather than assembling it.

---

## Authentication

The secret in the URL identifies the slot and is always required. Each slot also has a
**verification mode**, set on the **Automation** page:

| Mode | What a request must also carry |
|---|---|
| **URL only** | Nothing. Anyone who has the URL can send signals |
| **Signed requests** | An `X-MetaStation-Signature: t=<unix seconds>,v1=<hex>` header — the HMAC-SHA256 of `"<t>.<raw body>"` with the slot's **signing key**. `t` must be within 300 seconds of now, and a signature is accepted once |
| **Source-address check** | Nothing — but the request must come from the charting alert service's published addresses (TradingView alerts) |

Generating a signing key turns signed requests on; the key is shown once. The Automation page has
copy-ready signing examples in curl, Node.js and Python.

Every refusal by the verification mode answers `401` with the same message,
*"This webhook request was not accepted."* — the reason is sent to you in the app, at most once a
minute.

Regenerate the secret at **Automation → Your Webhook URLs → [slot] → Regenerate Secret**, at most
once every 24 hours. The old URL stops working immediately.

→ [Secure Your Webhook](/docs/guides/secure-your-webhook)

---

## Rate limits

| Limit | Value |
|---|---|
| Per source IP | 300 requests a minute |
| Per slot | 120 requests a minute |

Over a limit, the webhook answers `429` with a `Retry-After` header and a `retryAfter` field. If the
limiter itself is unavailable it answers `503` rather than letting requests through. Responses carry
`X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`.

---

## Request format

Two formats are accepted on the same endpoint:

**JSON** — structured, precise, recommended for programmatic use
**Natural language** — human-readable text, as Telegram channels post it

A JSON object sent as `text/plain` is read as JSON, and a `{ "message": "…" }` (or `text`, or
`content`) wrapper around a natural-language message is accepted too.

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

:::warning[200 means queued, not filled]
The signal is validated and queued, then executed asynchronously. A bot that treats a 200 as
"the position exists" will be wrong whenever execution fails downstream — insufficient margin, a
market the venue rejects, a cap in the slot's Trade Setting.

Confirm real state from your positions, or from **History → Signal History**, not from this
response.
:::

**Retries are safe.** The same request repeated within 60 seconds answers the first signal and runs
once:

```json
{
  "success": true,
  "message": "Webhook already received; it is processed once.",
  "signalId": "6512c0f1e4b0a1c2d3e4f5a6",
  "replay": true
}
```

**Error response:**

```json
{
  "success": false,
  "result": null,
  "message": "Account not found. Please connect it first."
}
```

---

## Supported actions

| Action | Description |
|---|---|
| `open` | Open or add to a position |
| `close` | Close the position held in that market (full, or partial with a size) |
| `target` | Bring the position to `long`, `short` or `flat` in one message |
| `cancel` | Withdraw followers' copy entries that have not filled yet |
| `update` | See [Supported Actions](/docs/developer/supported-actions#update) before using it |

→ [Supported Actions](/docs/developer/supported-actions)

---

## Signal history

Every signal a slot receives is listed under **History → Signal History**: when it arrived, what it
was read as, whether it executed, and why not if it did not.

---

## Error codes

→ [Error Codes Reference](/docs/developer/error-codes)

---
id: error-codes
title: Error Codes
sidebar_label: Error Codes
---

# Error Codes

A webhook request can fail in two places, and they report differently:

1. **When it arrives** — the HTTP response tells you, straight away
2. **When it executes** — after a `200`, asynchronously. The response cannot tell you; **History →
   Signal History** does

Every error body has the same shape:

```json
{
  "success": false,
  "result": null,
  "message": "Account not found. Please connect it first."
}
```

Messages are written by MetaStation. An exchange's own error text is never passed through.

---

## When it arrives: HTTP status codes

| HTTP | When | What to do |
|---|---|---|
| `200` | Accepted and queued. With `"replay": true`, the same request was already received and runs once | Confirm the result in Signal History |
| `400` | The body could not be read — invalid JSON, a missing required field, or a natural-language message that could not be parsed | Fix the payload. A parse failure lists the fields it found and the ones missing |
| `401` | The slot's verification mode refused the request: a missing or wrong signature, an expired or replayed one, or a source address that is not allowed | Check your signing, or the slot's mode on the Automation page |
| `403` | Automation is not allowed on this slot (`"code": "AUTOMATION_NOT_ALLOWED"`, with a `reason`) — typically an exchange slot with no active plan. Or the provider is not active | Buy or renew the slot's plan in the Store |
| `404` | No slot has this webhook secret — it was regenerated, or never existed | Copy the current URL from the Automation page |
| `429` | A rate limit was reached | Wait for `Retry-After` seconds |
| `503` | The webhook is temporarily unavailable | Retry after `Retry-After` seconds |
| `500` | Something failed on our side | Retry; contact support if it persists |

### A natural-language parse failure

```json
{
  "success": false,
  "message": "Failed to parse natural language message",
  "error": "Missing side",
  "extractedFields": { "symbol": "BTCUSDT", "action": "open" },
  "missingFields": ["side"],
  "confidence": 0.4
}
```

---

## When it executes: Signal History

After a `200`, the signal can still be refused or changed at execution. **History → Signal History**
lists every signal with its **Processing Status** and, when it did not execute as sent, a **Reason**
in plain words. The common reasons:

| Reason | Why |
|---|---|
| Too old | An opening signal arrived more than 90 seconds after it was sent. Closes are never refused for age |
| No size | The signal named no size, and the slot's Trade Setting has no default size |
| No open position | An `update` arrived for a market where nothing is held |
| Capped | The slot's Trade Setting reduced the size or leverage |
| Refused by the exchange | Margin, minimum order size, or a market that is not available |
| Not protected | The stop-loss could not be placed, so the position was closed rather than left unprotected |

For the trade itself, check **Positions** and **History** on the trade page.

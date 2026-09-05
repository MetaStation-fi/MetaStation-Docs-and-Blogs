---
id: error-codes
title: Error Codes
sidebar_label: Error Codes
---

# Error Codes

All webhook errors return a JSON response with `"success": false` and a `code` field.

---

## Authentication errors

| Code | HTTP | Description | Fix |
|---|---|---|---|
| `INVALID_TOKEN` | 401 | Webhook token not found or revoked | Regenerate your webhook URL |
| `IP_NOT_WHITELISTED` | 403 | Request came from a non-whitelisted IP | Add the IP in webhook security settings |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Reduce signal frequency |

---

## Parse errors

| Code | HTTP | Description | Fix |
|---|---|---|---|
| `PARSE_ERROR` | 400 | Message could not be parsed | Check JSON syntax or natural language format |
| `MISSING_ACTION` | 400 | `action` field missing | Add `"action": "open"` etc. |
| `MISSING_SYMBOL` | 400 | `symbol` field missing | Add trading pair |
| `INVALID_SIDE` | 400 | `side` is not `buy` or `sell` | Use exactly `"buy"` or `"sell"` |
| `INVALID_ORDER_TYPE` | 400 | Unrecognized `orderType` | Use `market` or `limit` — these are the only values accepted |
| `INVALID_QUANTITY` | 400 | Quantity format not recognized | Use `"2%"`, `"$300"`, or a number |

---

## Account/slot errors

| Code | HTTP | Description | Fix |
|---|---|---|---|
| `SLOT_INACTIVE` | 400 | Account slot is disabled | Enable the slot in Settings |
| `AUTOMATION_NOT_ENABLED` | 403 | Slot does not have automation active | Purchase automation from the Store |
| `SLOT_NOT_FOUND` | 404 | Token is valid but slot was deleted | Regenerate webhook for the correct slot |

---

## Trading errors

| Code | HTTP | Description | Fix |
|---|---|---|---|
| `INSUFFICIENT_BALANCE` | 400 | Not enough margin to open position | Deposit funds or reduce position size |
| `SYMBOL_NOT_FOUND` | 400 | Symbol is not available on this exchange | Check the symbol name for the connected exchange |
| `LEVERAGE_EXCEEDED` | 400 | Requested leverage above account/exchange max | Lower `leverage` in the signal |
| `POSITION_NOT_FOUND` | 400 | `close` or `update` on a position that doesn't exist | Verify the position is open |
| `MIN_ORDER_SIZE` | 400 | Order size below exchange minimum | Increase the quantity |
| `MAX_ORDER_SIZE` | 400 | Order size above exchange maximum | Reduce the quantity |
| `EXCHANGE_ERROR` | 502 | Exchange API returned an error | Retry — or check exchange status |

---

## Example error response

```json
{
  "success": false,
  "result": null,
  "message": "Insufficient balance to open position. Required: $450.00, Available: $120.34",
  "code": "INSUFFICIENT_BALANCE"
}
```

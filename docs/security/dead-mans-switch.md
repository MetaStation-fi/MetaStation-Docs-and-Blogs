---
id: dead-mans-switch
title: Dead Man's Switch
sidebar_label: Dead Man's Switch
description: An opt-in safety switch, per account, that has the exchange cancel your resting orders if MetaStation loses contact with it for five minutes.
---

# Dead Man's Switch

The dead man's switch is an **opt-in safety setting, per account**. While it is on, MetaStation
checks in with the exchange continuously. If those check-ins stop for **5 minutes** — an outage on
our side, a network failure between us and the exchange — the exchange itself **cancels every
resting order** on that account.

It lives on the **Security** page ([metastation.fi/security](https://metastation.fi/security)),
under **Dead man's switch**, with one **Turn on / Turn off** button per account.

---

## What it does, and what it does not

| | |
|---|---|
| **Cancels** | Every resting order on the account — limit orders, **stop-losses and take-profits included** |
| **Does not touch** | Your open positions. They stay open, and after the switch fires they are **unprotected** |
| **Who fires it** | The exchange, on its own clock — it works even when MetaStation cannot reach you or the exchange |
| **Default** | Off, on every account |

:::warning[Think before you turn it on]
The switch protects you from orders filling while MetaStation is unreachable. It does that by
removing **all** of them — including the stop-loss that protects an open position. If you rely on
resting stops while you are away, a switch that fires leaves those positions with no stop at all.
:::

---

## Where it is available

| Account | Available |
|---|---|
| **MetaStation Account** | Yes, once the account has traded the volume the exchange requires. Below it, turning it on is refused with a message that says so |
| **Binance** (futures) | Yes. Spot has no equivalent on the exchange |
| **KuCoin** | Yes |
| **ByBit** | No — the exchange offers this only to institutional accounts. The Security page says so next to the account |

---

## Turning it on

1. Open **Security** in the sidebar
2. Find **Dead man's switch** and the account you want
3. Press **Turn on**. The row reads *"On — waiting for the exchange"* until the exchange confirms
4. Press **Turn off** at any time to stop it

If the exchange refuses — for example because of its volume requirement — the reason is shown on
the row and nothing is changed.

---

## Related

- [Risk Controls](/docs/concepts/risk-controls) — every other control that limits a loss
- [Account Access & Sessions](/docs/security/session-management)

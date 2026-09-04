---
id: security-setup
title: Security Setup
sidebar_label: Security Setup
---

# Security Setup

Two things to do before you trade. The first is required to withdraw at all; the second is what
stops a leaked password from mattering.

---

## 1. Two-Factor Authentication (2FA)

MetaStation uses **Google Authenticator** (TOTP). Without it enabled, **withdrawals are blocked
entirely** — the withdrawal screen refuses the request.

{/* SCREENSHOT: 2fa-enable | Security page, Google Authenticator card, Enable state | 1440x900 | redact: none */}

**Setup:**

1. Open **Security** in the sidebar — [metastation.fi/security](https://metastation.fi/security)
2. On the **Google Authenticator** card, click **Enable**
3. Scan the QR code with your authenticator app (Google Authenticator, Authy, or any TOTP app).
   Cannot scan? The same screen shows the secret key to type in manually
4. Enter the 6-digit code to confirm

{/* SCREENSHOT: 2fa-qr | QR + manual secret screen | 1440x900 | redact: QR CODE AND SECRET, both mandatory */}

:::danger Save the secret key
MetaStation does **not** issue backup codes. The **secret key** shown during setup is your only
self-service recovery path — copy it into a password manager before you finish. Without it, a
lost phone means a manual support recovery that takes days.
:::

:::warning
**Never share your 2FA code or secret key with anyone.** MetaStation support will never ask for
them.
:::

---

## 2. A strong, unique password

Your password is the credential that matters most, because MetaStation has no session-revocation
dashboard — changing the password is the primary way to lock an attacker out.

- Minimum 8 characters
- Mix uppercase, lowercase, numbers and symbols
- Never reuse a password from another service
- Use a password manager

Change it any time at **Security → Password → Change**.

---

## What is *not* available

Worth knowing so you do not go looking for it:

| Feature | Status |
|---|---|
| Withdrawal address whitelist | Not available. Verify addresses yourself — see [Withdrawal Security](/docs/security/withdrawal-whitelist) |
| Active-session list / remote logout | Not available. Sessions expire on their own after 72 hours — see [Account Access](/docs/security/session-management) |

---

## Before you connect an exchange

If you plan to use Binance, ByBit or KuCoin slots: create those API keys with **trading
permission only**. Never enable withdrawal permission on a key you give to any third party,
MetaStation included. See [API Key Management](/docs/security/api-key-management).

---

→ Full security reference: [Two-Factor Authentication](/docs/security/two-factor-auth)

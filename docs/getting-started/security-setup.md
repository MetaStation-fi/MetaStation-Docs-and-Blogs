---
id: security-setup
title: Security Setup
sidebar_label: Security Setup
---

# Security Setup

Three things to do before you trade with real money.

---

## 1. Two-Factor Authentication (2FA)

MetaStation uses an **authenticator app** (TOTP — Google Authenticator, Authy or any compatible
app). Once it is on:

- every **sign-in** asks for the 6-digit code after your password
- every **withdrawal** is confirmed with your authenticator code, with no daily cap

Without it, withdrawals are confirmed by a code sent by e-mail and are capped at **$1,000 in 24
hours**.

{/* SCREENSHOT: 2fa-enable | Security page, Google Authenticator card, Enable state | 1440x900 | redact: none */}
<Screenshot id="2fa-enable" />

**Setup:**

1. Open **Security** in the sidebar — [metastation.fi/security](https://metastation.fi/security)
2. On the **Google Authenticator** card, click **Enable**
3. Scan the QR code with your authenticator app. Cannot scan? The same screen shows the secret key
   to type in manually
4. Enter the 6-digit code to confirm

{/* SCREENSHOT: 2fa-qr | QR + manual secret screen | 1440x900 | redact: QR CODE AND SECRET, both mandatory */}

:::danger[Save the secret key]
MetaStation does **not** issue backup codes. The **secret key** shown during setup is your only
self-service recovery path — copy it into a password manager before you finish. Without it, a lost
phone means a support reset, after which withdrawals pause for 24 hours.
:::

:::warning
**Never share your 2FA code or secret key with anyone.** MetaStation support will never ask for
them.
:::

---

## 2. A strong, unique password

- 8 to 16 characters, with upper case, lower case, a number and a special character
- Never reuse a password from another service
- Use a password manager

Change it any time at **Security → Password → Change**. Changing it signs you out on every other
device. Five wrong passwords in a row block sign-in for 2 hours.

---

## 3. Know your emergency controls

| Control | Where | What it does |
|---|---|---|
| **Sign out everywhere** | Security | Ends every session on every device, this one included |
| **Dead man's switch** | Security | Opt-in, per account: the exchange cancels your resting orders if MetaStation loses contact for 5 minutes |
| **Regenerate Secret** | Automation | Invalidates a webhook URL that may have leaked |

→ [Account Access & Sessions](/docs/security/session-management) · [Dead Man's Switch](/docs/security/dead-mans-switch)

---

## What is *not* available

| Feature | Status |
|---|---|
| Withdrawal address whitelist | Not available. Verify addresses yourself — see [Withdrawal Security](/docs/security/withdrawal-whitelist) |
| Active-session list | Not available. Use **Sign out everywhere** to end every session at once |
| Backup codes | Not issued. Save the secret key |

---

## Before you connect an exchange

If you plan to use Binance, ByBit or KuCoin slots: create those API keys with **trading
permission only**. Never enable withdrawal permission on a key you give to any third party,
MetaStation included. See [API Key Management](/docs/security/api-key-management).

---

→ Full security reference: [Two-Factor Authentication](/docs/security/two-factor-auth)

---
id: two-factor-auth
title: Two-Factor Authentication
sidebar_label: Two-Factor Auth (2FA)
---

# Two-Factor Authentication (2FA)

2FA adds a second layer of security to your account. MetaStation uses **Google Authenticator**
(TOTP). It is **required to withdraw** and strongly recommended for everything else.

---

## Setup

1. Open **Security** in the sidebar — [metastation.fi/security](https://metastation.fi/security)
2. On the **Google Authenticator** card, click **Enable**
3. Scan the QR code with a TOTP app:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
   - Any TOTP-compatible app
4. Cannot scan? The same screen shows the **secret key** — enter it into your app manually
5. Type the 6-digit code from the app to confirm

The card now reads **Disable**, which is how you know 2FA is active.

:::tip Save the secret key, not just the QR
MetaStation does **not** issue printed backup codes. Your recovery material is the **secret key**
shown during setup. Copy it into a password manager, or store it offline, *before* you finish
setup. It is the only thing that lets you re-add the account to a new authenticator app yourself.
:::

---

## If you lose your 2FA device

Without the secret key, you cannot re-create the code yourself.

1. If you saved the secret key — add it to a TOTP app on your new device. Access is restored immediately
2. If you did not — contact support. Recovery requires identity verification and may take several business days

:::danger
Losing your device *and* the secret key means a manual, slow recovery. Store the key the day you
enable 2FA, not later.
:::

---

## What 2FA protects

| Action | 2FA required |
|---|---|
| Login | Optional (recommended) |
| Withdrawals | ✅ Always required — plus an emailed one-time code |
| Changing password | ✅ Always required |
| Disabling 2FA | ✅ Always required |

Withdrawals are double-gated: a **Google Authenticator code** *and* an **email verification
code**, both entered on the withdrawal confirmation dialog. See
[Withdrawal Security](/docs/security/withdrawal-whitelist).

---

## Disabling 2FA

1. Open **Security** in the sidebar
2. On the **Google Authenticator** card, click **Disable**
3. Enter your current 6-digit code to confirm

:::warning
**Withdrawals stay blocked while 2FA is off.** The withdrawal screen rejects the request with
*"2FA is disabled. Please enable 2FA to withdraw."* Disabling 2FA does not make withdrawing
easier — it makes it impossible.
:::

---

## Changing your password

Same page: the **Password** card → **Change**. You are asked for your old password and the new
one twice.

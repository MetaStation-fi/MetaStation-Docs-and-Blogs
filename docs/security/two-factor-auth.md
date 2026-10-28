---
id: two-factor-auth
title: Two-Factor Authentication
sidebar_label: Two-Factor Auth (2FA)
---

# Two-Factor Authentication (2FA)

2FA adds a second layer of security to your account. MetaStation uses an **authenticator app**
(TOTP — Google Authenticator or any compatible app). Once it is on, it protects every sign-in and
every withdrawal.

---

## Setup

{/* SCREENSHOT: 2fa-enable | Security page, Google Authenticator card | 1440x900 | redact: none */}
<Screenshot id="2fa-enable" />

1. Open **Security** in the sidebar — [metastation.fi/security](https://metastation.fi/security)
2. On the **Google Authenticator** card, click **Enable**
3. Scan the QR code with a TOTP app:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
   - Any TOTP-compatible app
4. Cannot scan? The same screen shows the **secret key** — enter it into your app manually
5. Type the 6-digit code from the app to confirm

You see *"Two-factor authentication is on."* and the card now reads **Disable**.

:::tip[Save the secret key, not just the QR]
MetaStation does **not** issue printed backup codes. Your recovery material is the **secret key**
shown during setup. Copy it into a password manager, or store it offline, *before* you finish
setup. It is the only thing that lets you re-add the account to a new authenticator app yourself.
:::

---

## If you lose your 2FA device

1. **If you saved the secret key** — add it to a TOTP app on your new device. Access is restored
   immediately.
2. **If you did not** — use **Change/lost device?** on the Google Authenticator card, or contact
   support. Support resets your authenticator once your identity is confirmed, and records why.

:::warning[Withdrawals pause after a reset]
After support resets your authenticator, **withdrawals are paused for 24 hours**. Trading and moves
between your own accounts carry on. The pause is what stops someone who talked their way into a
reset from emptying the account straight away.
:::

---

## What 2FA protects

| Action | With an authenticator turned on |
|---|---|
| **Sign in** | Every sign-in asks for the 6-digit code after your password |
| **Withdrawals** | The confirmation code is always your authenticator code — never a weaker e-mailed one — and there is no $1,000 daily cap |
| **Disabling 2FA** | Needs your current 6-digit code |

Without an authenticator, withdrawals are confirmed with a code sent by e-mail (or by Telegram, for
an account with no e-mail), capped at $1,000 in 24 hours. See
[Withdrawal Security](/docs/security/withdrawal-whitelist).

---

## Disabling 2FA

1. Open **Security** in the sidebar
2. On the **Google Authenticator** card, click **Disable**
3. Enter your current 6-digit code to confirm

:::warning
With 2FA off, sign-in needs only your password, and withdrawals fall back to a code sent by e-mail
with the $1,000 daily cap. Keep it on.
:::

---

## Changing your password

Same page: the **Password** card → **Change**. You are asked for your old password and the new one
twice. Changing your password **signs you out on every other device**.

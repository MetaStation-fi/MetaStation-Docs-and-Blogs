---
id: two-factor-auth
title: Two-Factor Authentication
sidebar_label: Two-Factor Auth (2FA)
---

# Two-Factor Authentication (2FA)

2FA adds a second layer of security to your account. It is required for withdrawals and strongly recommended for login.

---

## Setup

1. Go to **Settings → Security → Two-Factor Authentication**
2. Click **Enable 2FA**
3. Scan the QR code with an authenticator app:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
   - Any TOTP-compatible app
4. Enter the 6-digit code from the app to verify
5. **Save your backup codes** — store them offline in a secure location

---

## Backup codes

Backup codes let you recover access if you lose your 2FA device. Each code can only be used once.

Store them in:
- A password manager
- Printed and stored in a safe
- Encrypted notes app

:::danger
If you lose both your 2FA device and your backup codes, account recovery requires identity verification and may take several business days. Do not lose your backup codes.
:::

---

## What 2FA protects

| Action | 2FA required |
|---|---|
| Login | Optional (recommended) |
| Withdrawals | ✅ Always required |
| Adding withdrawal address | ✅ Always required |
| Changing password | ✅ Always required |
| Disabling 2FA | ✅ Always required |

---

## Disabling 2FA

1. Go to **Settings → Security → Two-Factor Authentication**
2. Click **Disable 2FA**
3. Enter your current 2FA code to confirm

After disabling, 2FA is no longer required for login. Withdrawal 2FA remains enforced via email confirmation.

---

## Lost your 2FA device?

1. Use a backup code to log in
2. Immediately set up 2FA on a new device
3. If no backup codes remain, contact support — manual verification required

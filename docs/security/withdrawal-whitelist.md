---
id: withdrawal-whitelist
title: Withdrawal Security
sidebar_label: Withdrawal Security
---

# Withdrawal Security

Withdrawals are the one action on MetaStation that moves funds off the platform irreversibly, so
they are gated harder than anything else. Every withdrawal needs **two independent codes** from
two separate channels.

---

## The two gates

| Gate | What it is | Where it comes from |
|---|---|---|
| **Google Authenticator code** | 6-digit TOTP | The authenticator app on your phone |
| **Email verification code** | One-time code sent on request | Your registered email inbox |

Both are entered in the **Confirm withdrawal** dialog. A withdrawal cannot proceed with only one.

This matters because the two channels fail independently: someone with your password does not
have your phone, and someone with your phone does not have your mailbox.

---

## 2FA is mandatory to withdraw

If 2FA is disabled, the withdrawal screen refuses the request outright —
*"2FA is disabled. Please enable 2FA to withdraw."* There is no bypass and no support override
for convenience.

Enable it first: **Security → Google Authenticator → Enable**. See
[Two-Factor Authentication](/docs/security/two-factor-auth).

---

## Withdrawing, step by step

1. Open **Withdraw** in the sidebar ([metastation.fi/withdraw](https://metastation.fi/withdraw))
2. Select the asset and the network
3. Paste the destination address and enter the amount
4. Press withdraw — the **Confirm withdrawal** dialog opens
5. Press **send code** to have the email code delivered, then read it from your inbox
6. Enter the **Google Authenticator** code and the **email** code
7. Confirm — the withdrawal is queued and broadcast

Track it under **History** in the sidebar.

---

## Address whitelisting

:::note[Not available today]
MetaStation does **not** currently support a withdrawal address whitelist. Any valid address on
the selected network can be used as a destination, provided both verification codes are correct.

If you have read about a 24-hour address-approval delay elsewhere, it does not apply here. This
page describes the controls that actually exist.
:::

Because there is no whitelist to catch a mistyped or substituted address, **you** are the last
check on the destination:

- Paste addresses; never retype them by hand
- Verify the first and last six characters after pasting — clipboard-hijacking malware swaps the middle
- Send a small test amount the first time you withdraw to a new address
- Confirm the network matches the address. An ERC-20 address on a TRC-20 withdrawal loses the funds permanently

---

## Withdrawal safety rules

:::warning
- Blockchain transactions are irreversible. There is no chargeback and no recall
- MetaStation will **never** ask you to withdraw funds to an "official", "verification", or "recovery" address. Any such request is a scam, without exception
- Support will never ask for your 2FA code, your email code, or your password
:::

---

## Related

- [Two-Factor Authentication](/docs/security/two-factor-auth) — set up the first gate
- [Withdraw](/docs/wallet/withdraw) — the full withdrawal walkthrough, fees and statuses
- [API Key Management](/docs/security/api-key-management) — never grant withdrawal permission on an exchange API key

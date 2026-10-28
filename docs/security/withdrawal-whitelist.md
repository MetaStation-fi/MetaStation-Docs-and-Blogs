---
id: withdrawal-whitelist
title: Withdrawal Security
sidebar_label: Withdrawal Security
---

# Withdrawal Security

Withdrawals are the one action on MetaStation that moves funds off the platform irreversibly, so
they are gated harder than anything else.

---

## The confirmation code

Every withdrawal needs a **6-digit code** that is tied to *that* withdrawal — its destination, its
amount and your current sign-in — and works once. A code for one withdrawal cannot confirm another,
and a code issued in one session is useless in another.

MetaStation picks where the code comes from. The strongest option you have always wins:

| Order | Factor | When it is used |
|---|---|---|
| 1 | **Authenticator app** | You have turned on two-factor authentication. You are never offered the e-mail option |
| 2 | **E-mail code** | No authenticator. Press **Send code** in the dialog |
| 3 | **Telegram message** from our bot | No authenticator and no e-mail address (an account created with Telegram) |

The code is entered in the **Confirm withdrawal** dialog and expires after **5 minutes**.

This matters because the threat a code defends against is a stolen session: someone holding your
signed-in browser can reach the Withdraw page, but not your phone's authenticator or your inbox.

---

## Limits that protect you

| Rule | What happens |
|---|---|
| **5 wrong codes** | Withdrawals are locked for **15 minutes**, and you are told in the app and by e-mail |
| **Sent codes cap** | A code sent by e-mail or Telegram covers withdrawals worth up to **$1,000 in 24 hours**. Above that you are asked to turn on an authenticator app |
| **After an authenticator reset** | When support resets your authenticator, withdrawals pause for **24 hours**. Trading and moves between your own accounts continue |
| **Sanctions screening** | Every destination is checked against international sanctions lists. A listed address is refused |

The surest way to keep withdrawing smoothly is an authenticator app: it has no $1,000 cap.
**Security → Google Authenticator → Enable.** See [Two-Factor Authentication](/docs/security/two-factor-auth).

---

## Withdrawing, step by step

1. Open **Withdraw** in the sidebar ([metastation.fi/withdraw](https://metastation.fi/withdraw))
2. Pick the account and wallet, the coin and the network
3. Paste the destination address and enter the amount, then read the quote
4. Press **Withdraw** — the **Confirm withdrawal** dialog opens
5. Enter your authenticator code — or press **Send code** and enter the code you receive
6. Press **Withdraw**

Track it under **Recent Withdrawals** or **History → Withdraw**.

---

## Address whitelisting

:::note[Not available today]
MetaStation does **not** support a withdrawal address book or whitelist. Any valid address on the
selected network can be used as a destination, provided the confirmation code is correct and the
address passes sanctions screening.
:::

Because there is no whitelist to catch a mistyped or substituted address, **you** are the last
check on the destination:

- Paste addresses; never retype them by hand
- Verify the first and last six characters after pasting — clipboard-hijacking malware swaps the middle
- Send a small test amount the first time you withdraw to a new address
- Confirm the network matches the address

---

## Withdrawal safety rules

:::warning
- Blockchain transactions are irreversible. There is no chargeback and no recall
- MetaStation will **never** ask you to withdraw funds to an "official", "verification", or "recovery" address. Any such request is a scam, without exception
- Support will never ask for your confirmation code, your authenticator code, or your password
:::

---

## Related

- [Two-Factor Authentication](/docs/security/two-factor-auth) — turn on an authenticator app
- [Withdraw](/docs/wallet/withdraw) — the full withdrawal walkthrough, fees and statuses
- [API Key Management](/docs/security/api-key-management) — never grant withdrawal permission on an exchange API key

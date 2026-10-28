---
id: withdraw
title: Withdraw
sidebar_label: Withdraw
---

# Withdraw

Withdraw crypto from your **MetaStation Account** to any external address.

:::note[Connected exchange accounts]
Funds held on a connected **Binance, ByBit or KuCoin** account are withdrawn on that exchange's own
website or app. MetaStation does not move funds off an exchange; the Withdraw page shows a short
notice and a link to the exchange instead.
:::

---

## Withdrawal process

{/* SCREENSHOT: withdraw-form | Withdraw form filled | 1440x900 | redact: address, balance */}
<Screenshot id="withdraw-form" />

1. Open **Withdraw** in the sidebar ([metastation.fi/withdraw](https://metastation.fi/withdraw))
2. Pick the account, and the wallet you are withdrawing from — **Funding Wallet** or **Trading
   Account**
3. Select the coin and the network
4. Paste the destination address and enter the amount
5. MetaStation quotes the withdrawal: what arrives, the fees, and the route. A quote expires after a
   short time — if it does, check the new figures and withdraw again
6. Press **Withdraw**. The **Confirm withdrawal** dialog repeats the address, the network, the fees
   and what you receive
7. Enter the **6-digit confirmation code** (see below) and press **Withdraw**

### What you can withdraw

| Coin | Where it can go |
|---|---|
| **USDC** | Many networks. Off Arbitrum One it is bridged for you, and the quote shows the route |
| **BTC, ETH, SOL, AVAX** and a few other coins | Their own network |

The Withdraw page lists exactly which coins and networks your account can use. If a coin is not in
the list, it cannot be withdrawn from MetaStation directly.

---

## The confirmation code

Every withdrawal asks for **one 6-digit code**. MetaStation chooses which kind, and you cannot pick
a weaker one:

| You have… | The code comes from… |
|---|---|
| An **authenticator app** turned on | Your authenticator app |
| No authenticator, but an e-mail address | An **e-mail** we send when you press **Send code** |
| Neither (an account created with Telegram) | A **Telegram message** from our bot |

- A code is valid for **5 minutes** and works once, for this withdrawal only.
- **Five wrong codes** lock withdrawals for **15 minutes**. You are told in the app and by e-mail.
- Codes sent by e-mail or Telegram cover withdrawals worth up to **$1,000 in 24 hours**. Above that,
  you are asked to turn on an authenticator app first.
- After support resets your authenticator, withdrawals pause for **24 hours**. Trading and moves
  between your own accounts are not affected.

For the Telegram message to arrive, you must have pressed **Start** in our bot
([@MetaStationBot](https://t.me/MetaStationBot)) at least once and not blocked it.

→ [Two-Factor Authentication](/docs/security/two-factor-auth) — turn on an authenticator app.

---

## Verifying the destination address

MetaStation does **not** offer a withdrawal address book, so nothing catches a wrong address on
your behalf. Every destination is also checked against international sanctions lists, and a
listed address is refused. Beyond that, the address field is the last checkpoint:

- Paste the address; never retype it
- Check the first and last six characters after pasting — clipboard malware substitutes the middle
- Send a small test amount the first time you use a new address
- Make sure the network matches the address format

→ Full detail: [Withdrawal Security](/docs/security/withdrawal-whitelist)

---

## Fees

| Fee | What it is |
|---|---|
| **Withdrawal fee** | A flat fee per withdrawal, shown as one figure on the quote |
| **Network fee** | Covers the on-chain cost of the transfer, shown on the quote |

Both are shown before you confirm, next to **You receive**. There is no daily limit and no manual
review of withdrawals.

---

## Withdrawal status

Track your withdrawal under **Recent Withdrawals** on the Withdraw page, or under **History →
Withdraw** ([metastation.fi/history](https://metastation.fi/history)).

{/* SCREENSHOT: history-withdrawals | History → withdrawals tab | 1440x900 | redact: amounts optional */}
<Screenshot id="history-withdrawals" />

A withdrawal that takes more than one step — for example USDC bridged to another network — shows
as **"N steps"**. Expand it to see each step with its status, amount, time and a link to the
blockchain explorer.

| Status | Meaning |
|---|---|
| Processing | Started; it completes in the background, so you can leave the page |
| Completed | Confirmed on-chain |
| Failed | Did not go through — the funds stay in your account |
| Delayed | Stuck on the network. You can return it to your Funding Wallet from **Recent Withdrawals** |

You also get a notification in the bell when a withdrawal completes.

---

## Security reminders

:::warning
- Verify the destination address carefully before confirming — blockchain transactions are irreversible
- MetaStation will never ask you to withdraw funds to any address
- If you receive a request to withdraw to an "official" address, it is a scam
- Support will never ask for your confirmation code or your password
:::

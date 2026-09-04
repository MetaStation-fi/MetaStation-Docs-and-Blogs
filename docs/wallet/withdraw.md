---
id: withdraw
title: Withdraw
sidebar_label: Withdraw
---

# Withdraw

Withdraw crypto from your MetaStation wallet to any external address.

---

## Withdrawal process

1. Open **Withdraw** in the sidebar ([metastation.fi/withdraw](https://metastation.fi/withdraw))
2. Select the asset (USDT, BTC, ETH, SOL, TRX, TON)
3. Select the network
4. Enter the destination address
5. Enter the amount
6. In the **Confirm withdrawal** dialog, request the **email code** and read it from your inbox
7. Enter your **Google Authenticator** code and the **email code** — both are required
8. Withdrawal is processed and broadcast to the network

:::warning 2FA is mandatory
With 2FA disabled the withdrawal is rejected outright — *"2FA is disabled. Please enable 2FA to
withdraw."* Enable it under **Security → Google Authenticator** before you need to withdraw.
:::

---

## Verifying the destination address

MetaStation does **not** currently offer a withdrawal address whitelist, so nothing catches a
wrong address on your behalf. Treat the address field as the last checkpoint:

- Paste the address; never retype it
- Check the first and last six characters after pasting — clipboard malware substitutes the middle
- Send a small test amount the first time you use a new address
- Make sure the network matches the address format

→ Full detail: [Withdrawal Security](/docs/security/withdrawal-whitelist)

---

## Withdrawal limits

| Limit Type | Details |
|---|---|
| Daily limit | Set per account tier |
| Minimum withdrawal | Varies by asset and network |
| Large withdrawal | Manual review may apply |

Contact support if you need to increase your daily limit.

---

## Network fees

Network fees are deducted from your withdrawal amount. The fee estimate is shown before you confirm. Final amounts may vary slightly based on network conditions at the time of broadcast.

---

## Withdrawal status

Track your withdrawal under **History** in the sidebar ([metastation.fi/history](https://metastation.fi/history)), on the withdrawal tab:

| Status | Meaning |
|---|---|
| Pending | Awaiting confirmation |
| Processing | Approved, being broadcast |
| Completed | Confirmed on-chain |
| Failed | Rejected or error — contact support |

Use the transaction hash (shown on completion) to track on a blockchain explorer.

---

## Security reminders

:::warning
- Verify the destination address carefully before confirming — blockchain transactions are irreversible
- MetaStation will never ask you to withdraw funds to any address
- If you receive a request to withdraw to an "official" address, it is a scam
:::

---
id: withdraw
title: Withdraw
sidebar_label: Withdraw
---

# Withdraw

Withdraw crypto from your MetaStation wallet to any external address.

---

## Withdrawal process

1. Go to **Wallet → Withdraw**
2. Select the asset (USDT, BTC, ETH, SOL, TRX, TON)
3. Select the network
4. Enter the destination address — must be whitelisted (see below)
5. Enter the amount
6. Complete **2FA verification**
7. Confirm via **email link**
8. Withdrawal is processed and broadcast to the network

---

## Withdrawal address whitelist

For security, you can only withdraw to pre-approved (whitelisted) addresses.

**Adding a new address:**

1. Go to **Settings → Security → Withdrawal Whitelist**
2. Click **Add Address**
3. Enter the wallet address and a label
4. Confirm via email and 2FA
5. **Wait 24 hours** — new addresses have a mandatory 24-hour delay before they become active

This delay prevents unauthorized withdrawals even if your account is compromised.

:::tip
Add your withdrawal addresses before you need them. The 24-hour delay is by design.
:::

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

Track your withdrawal at **Wallet → History → Withdrawals**:

| Status | Meaning |
|---|---|
| Pending | Awaiting email confirmation |
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

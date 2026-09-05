---
id: deposit
title: Deposit
sidebar_label: Deposit
---

# Deposit

MetaStation supports crypto deposits from 56 blockchain networks, fiat purchases via card, and cross-asset swaps.

---

## Deposit to MetaStation Account (bridge)

The MetaStation Account is a **Web3 account by default**. It accepts deposits from virtually any
chain: funds bridge into your **Funding Wallet** and are converted to USDC automatically.

**Supported networks include:**
Ethereum · Arbitrum · Optimism · Base · Polygon · BNB Smart Chain · Avalanche · Solana · TRON · TON · and 25+ more

**Steps:**

{/* SCREENSHOT: deposit-flow | Deposit screen with MetaStation Account as destination | 1440x900 | redact: address */}
<Screenshot id="deposit-flow" />

1. Open **Deposit** in the sidebar ([metastation.fi/deposit](https://metastation.fi/deposit))
2. Select **MetaStation Account** as the destination
3. Choose your source network and token
4. Review the bridge route and estimated received USDC amount
5. Confirm and approve the transaction from your connected wallet
6. USDC is credited to your account once the bridge completes (typically 1–10 minutes depending on network)

:::tip
The estimated received amount shown already accounts for bridge fees, so it is what actually
lands in your Funding Wallet.
:::

### What the Funding Wallet is

| | |
|---|---|
| Type | A smart-contract wallet on Arbitrum, created for you on first use |
| Holds | The USDC backing your MetaStation Account |
| Keys | Managed for you — there is no seed phrase to store |
| Gas | Trading and settlement are gasless; you only pay gas on the source chain when you bridge in |

Its address is shown on the **Deposit** screen. Anything you bridge to it credits your
MetaStation Account.

---

## Deposit to platform wallet (direct crypto)

For standard wallet deposits (USDT, BTC, ETH, SOL, TRX, TON):

1. Open **Deposit** in the sidebar
2. Select the asset and network
3. Copy the deposit address
4. Send from your external wallet to that address
5. Balance updates after network confirmation

**Supported assets for direct deposit:**
- USDT (TRC20, ERC20, BEP20)
- BTC (Bitcoin)
- ETH (Ethereum)
- SOL (Solana)
- TRX (Tron)
- TON (The Open Network)

:::warning
Always verify the network matches before sending. Sending USDT on ERC20 to a TRC20 address will result in lost funds.
:::

---

## Buy with card (Transak)

Buy USDC or other supported assets with a debit or credit card.

1. Click **Buy Crypto** in the top navigation ([metastation.fi/buy-crypto](https://metastation.fi/buy-crypto))
2. Select amount and currency
3. Complete the Transak checkout (Visa, Mastercard, Apple Pay, Google Pay)
4. Funds arrive in your wallet within minutes

Transak may require basic identity verification for larger purchases.

---

## Swap assets (SimpleSwap)

Convert between supported crypto assets without leaving MetaStation.

1. Click **Buy Crypto** in the top navigation and switch to the swap tab ([metastation.fi/exchangeswap](https://metastation.fi/exchangeswap))
2. Select your input asset and output asset
3. Enter the amount
4. Review the rate — no hidden fees
5. Confirm the swap

---

## Deposit confirmation times

| Network | Typical time |
|---|---|
| Arbitrum | 1–2 minutes |
| Ethereum | 5–15 minutes |
| Solana | Under 1 minute |
| BNB Smart Chain | 1–3 minutes |
| TRON | 1–2 minutes |
| Bitcoin | 10–60 minutes |

---
id: fund-account
title: Fund Your Account
sidebar_label: Fund Your Account
---

# Fund Your Account

MetaStation accepts deposits from **56 blockchain networks**. Whatever asset you send is automatically bridged and converted to USDC and credited to your MetaStation Account.

## Your Funding Wallet

{/* DIAGRAM: funding-flow | source chain -> bridge -> Funding Wallet (Arbitrum smart account) -> USDC margin in MetaStation Account. mermaid, both themes */}

Your **MetaStation Account is a Web3 account by default.** It is funded through a **Funding
Wallet** — a smart-contract wallet created for you on Arbitrum when you first deposit.

| | |
|---|---|
| What it is | A smart account that holds the USDC backing your MetaStation Account |
| Who creates it | MetaStation, automatically. No seed phrase for you to store |
| What you do with it | Bridge into it. Everything downstream — trading, settlement — is gasless |
| Where you see it | The **Deposit** screen shows the Funding Wallet address and its status |

{/* SCREENSHOT: funding-wallet-status | Funding Wallet address + activation state on Deposit | 1440x900 | redact: address */}

You do not need a wallet of your own to *use* the Funding Wallet, but you do need one to bridge
from an external network into it.

---

## Method 1 — Bridge from any network (recommended)

This is the primary way to fund your MetaStation Account.

**Supported networks include:**

Ethereum · Arbitrum · Optimism · Base · Polygon · BNB Smart Chain · Avalanche · Solana · TRON · TON · and 25+ more

**How it works:**

{/* SCREENSHOT: deposit-picker | Deposit screen, network + asset picker open | 1440x900 | redact: Funding Wallet address */}
{/* SCREENSHOT: bridge-quote | quote screen with estimated received amount | 1440x900 | redact: address, balance */}

1. Open **Deposit** in the sidebar ([metastation.fi/deposit](https://metastation.fi/deposit))
2. Select your source network and token (e.g., USDT on BSC, ETH on Ethereum, SOL on Solana)
3. MetaStation quotes the bridge route and shows the estimated amount you will receive
4. Review the estimate and confirm
5. Approve and send the transaction from your connected wallet
6. Funds are bridged into your **Funding Wallet** → converted to USDC → credited to your MetaStation Account automatically

:::tip
Always send a small test amount first when depositing from a new network or wallet.
:::

---

## Method 2 — Buy with a card (Transak)

Buy USDC directly with a Visa, Mastercard, Apple Pay, or Google Pay card — no prior crypto needed.

{/* SCREENSHOT: buy-crypto | Buy Crypto / Transak entry screen | 1440x900 | redact: none */}

1. Click **Buy Crypto** in the top navigation ([metastation.fi/buy-crypto](https://metastation.fi/buy-crypto))
2. Select your currency and amount
3. Complete the Transak payment flow (basic verification may be required)
4. USDC is credited to your account within minutes

---

## Method 3 — Swap assets (SimpleSwap)

Already hold crypto but want a different asset? Use SimpleSwap to convert between assets directly.

1. Click **Buy Crypto** in the top navigation and switch to the swap tab ([metastation.fi/exchangeswap](https://metastation.fi/exchangeswap))
2. Select input and output assets
3. Review the rate and confirm
4. Swapped funds appear in your wallet

---

## Wallet assets (for exchange slots)

If you are using Binance, ByBit, or KuCoin slots, fund those directly through your exchange account. MetaStation does not custody exchange funds — your API keys connect to your own exchange balance.

---

## Minimum deposits

Minimum deposit amounts vary by network. Amounts below the minimum may not be credited. Always check the displayed minimum before sending.

---

## Next step

→ [Place your first trade](/docs/getting-started/quick-start#step-3--place-your-first-trade) or [connect an exchange](/docs/trading/connect-exchange).

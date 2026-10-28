---
id: fund-account
title: Fund Your Account
sidebar_label: Fund Your Account
---

# Fund Your Account

Your **MetaStation Account is a Web3 account by default**, funded through its **Funding Wallet**.
Send USDC on Arbitrum One to it by hand, or connect a wallet on another network and MetaStation
bridges it for you. Either way it arrives as USDC.

## Your Funding Wallet

{/* DIAGRAM: funding-flow | USDC on Arbitrum One by hand, or a connected wallet -> bridge -> Funding Wallet -> trading balance. mermaid, both themes */}

| | |
|---|---|
| What it is | The wallet on Arbitrum One that receives your deposits |
| Who creates it | MetaStation, with your account. No seed phrase for you to store |
| What it accepts by hand | **USDC on Arbitrum One only** |
| Where you see it | The **Deposit** page shows its address under **Destination address (Funding Wallet)** |

{/* SCREENSHOT: funding-wallet-status | Funding Wallet address + activation state on Deposit | 1440x900 | redact: address */}
<Screenshot id="funding-wallet-status" />

---

## Your first deposit activates the account

The first deposit into the Funding Wallet:

- pays a **one-time activation fee** — the Deposit page shows it as *"Activation fee · one-time,
  taken from your first deposit"*
- must be at least the **minimum** shown on the page
- activates the account, and the rest moves into your trading balance automatically

Then press **Enable Trading** on the account once, before your first order.

---

## Method 1 — Send USDC on Arbitrum One

From any wallet or exchange, no connection needed.

1. Open **Deposit** in the sidebar ([metastation.fi/deposit](https://metastation.fi/deposit))
2. **Deposit to**: your MetaStation Account, **Funding Wallet**
3. **Send from**: **Send manually**
4. Copy the address and send **USDC on Arbitrum One** to it
5. The page updates when it arrives

:::danger
Anything other than USDC on Arbitrum One sent by hand to the Funding Wallet address is lost.
:::

---

## Method 2 — Connect a wallet on another network

For a coin on Ethereum, an Ethereum Layer 2, another EVM chain, Solana or TON.

{/* SCREENSHOT: deposit-picker | Deposit screen, network + asset picker open | 1440x900 | redact: Funding Wallet address */}
<Screenshot id="deposit-picker" />
{/* SCREENSHOT: bridge-quote | quote screen with estimated received amount | 1440x900 | redact: address, balance */}

1. **Deposit to**: your MetaStation Account, **Funding Wallet**
2. **Send from**: **Connect a wallet**
3. Pick the **Network you are sending from** and the coin
4. Connect your wallet — EVM, Solana (such as Phantom) or TON
5. Enter the amount; MetaStation quotes the route and shows what reaches your Funding Wallet
6. **Review deposit**, confirm, and approve the transaction in your wallet

:::tip
Always send a small test amount first when depositing from a new network or wallet.
:::

→ [Cross-Chain Deposits](/docs/wallet/cross-chain-exchange)

---

## Method 3 — Buy Crypto (swap, or pay in fiat)

**Buy Crypto** in the top navigation opens the **Crypto Swap** page, powered by SimpleSwap. Use it
to swap one crypto asset for another, or to pay with one of the supported fiat currencies.

{/* SCREENSHOT: buy-crypto | Buy Crypto / Crypto Swap entry screen | 1440x900 | redact: none */}
<Screenshot id="buy-crypto" />

1. Click **Buy Crypto** in the top navigation ([metastation.fi/exchangeswap](https://metastation.fi/exchangeswap))
2. Choose what you send and what you receive
3. Review the rate and the destination address, then confirm
4. Follow SimpleSwap's instructions to complete the payment; the asset is sent to the destination
   address you gave

---

## After activation: other coins

Once the account is activated, **BTC, ETH, SOL and other coins** can be deposited straight into its
**Trading Account**, each on its own network. Pick **Trading Account** under **Deposit to**, then the
coin, and send to the address shown. → [Deposit](/docs/wallet/deposit)

---

## Exchange slots

If you are using Binance, ByBit, or KuCoin slots, the Deposit page shows that exchange's own deposit
address; the funds land on your exchange account. MetaStation does not custody exchange funds —
your API keys connect to your own exchange balance.

---

## Next step

→ [Place your first trade](/docs/getting-started/quick-start#step-3--place-your-first-trade) or [connect an exchange](/docs/trading/connect-exchange).

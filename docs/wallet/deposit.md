---
id: deposit
title: Deposit
sidebar_label: Deposit
---

# Deposit

Every **MetaStation Account** has two wallets you can deposit into, and the Deposit page names the
one you are sending to before it shows an address:

| Wallet | Takes | When |
|---|---|---|
| **Funding Wallet** | **USDC on Arbitrum One** — sent by hand, or bridged from another network for you | Always |
| **Trading Account** | **BTC, ETH, SOL and more**, each on its own network | After your first deposit has activated the account |

Open **Deposit** in the sidebar ([metastation.fi/deposit](https://metastation.fi/deposit)).

{/* SCREENSHOT: deposit-flow | Deposit screen with MetaStation Account as destination | 1440x900 | redact: address */}
<Screenshot id="deposit-flow" />

---

## Your first deposit

A new MetaStation Account starts with its **Funding Wallet** only. The first deposit:

1. Pays the **one-time activation fee**, shown on the Deposit page as *"Activation fee · one-time,
   taken from your first deposit"*
2. Must be at least the **minimum shown** on the page
3. Activates the account — the rest of the deposit moves into your trading balance automatically

You accept the activation fee once, in the **Review deposit** dialog. When the deposit lands the
page says *"Deposit received. Your account is activated."*

---

## Deposit to the Funding Wallet

### Send manually (USDC on Arbitrum One)

From any wallet or exchange, no connection needed.

1. Step 1 **Deposit to**: pick the account, and **Funding Wallet**
2. Step 2 **Send from**: pick **Send manually**
3. Copy the **Destination address (Funding Wallet)**
4. Send **USDC on Arbitrum One** to it from your wallet or exchange
5. The page updates when the deposit arrives — you can leave and come back

:::danger[USDC on Arbitrum One only]
The Funding Wallet address accepts **USDC on Arbitrum One** and nothing else. Any other token, or
USDC on any other network, sent to that address is **lost**. To deposit from another network, use
**Connect a wallet** below.
:::

### Connect a wallet (any other network)

Send from another network and MetaStation bridges it to your Funding Wallet for you.

1. Step 1 **Deposit to**: pick the account, and **Funding Wallet**
2. Step 2 **Send from**: pick **Connect a wallet**
3. Pick the **Network you are sending from** and the coin
4. Connect your wallet — an EVM wallet, a Solana wallet such as Phantom, or a TON wallet
5. Enter the amount. MetaStation quotes the route and shows what reaches your Funding Wallet
6. **Review deposit**, confirm, and approve the transaction in your wallet

The network fee on the source chain is *"Paid in your wallet's gas"*. If the price moves before you
approve, the page asks you to check the new figures and confirm again.

→ The full list of source networks: [Cross-Chain Deposits](/docs/wallet/cross-chain-exchange)

---

## Deposit to the Trading Account (other coins)

Once the account is activated, you can deposit coins straight into its trading balance.

1. Step 1 **Deposit to**: pick the account, and the **Trading Account** (it may read **Unified
   Trading Account**)
2. Step 2 **Choose a coin**: pick the coin. Each one lists its own network
3. Copy the address shown and send **that coin on that network** from any wallet or exchange
4. Amounts below the minimum shown for the coin are not credited

---

## Deposit to a connected exchange account

When the selected account is a connected **Binance, ByBit or KuCoin** slot, the Deposit page shows
that exchange's own deposit address for the coin and network you pick. The deposit lands on your
exchange account, not in MetaStation. If KuCoin has no address yet for a network, press **Create
deposit address**.

---

## Buy Crypto (SimpleSwap)

Swap between supported crypto assets, or pay with a supported fiat currency, without leaving
MetaStation.

{/* SCREENSHOT: buy-crypto | Buy Crypto / Crypto Swap entry screen | 1440x900 | redact: none */}

1. Click **Buy Crypto** in the top navigation ([metastation.fi/exchangeswap](https://metastation.fi/exchangeswap))
2. Select what you send and what you receive
3. Enter the amount
4. Review the rate and the destination address
5. Confirm the swap

---

## Where your deposit shows up

- **History → Deposit** lists every deposit with its status and explorer link
- A notification arrives in the bell when a deposit is credited
- Bridged deposits appear under **Deposits in progress** on the Deposit page. One that is delayed
  on the network can be sent back to your wallet with **Refund delayed deposit**

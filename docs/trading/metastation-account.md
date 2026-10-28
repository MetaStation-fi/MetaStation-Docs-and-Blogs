---
id: metastation-account
title: MetaStation Account
sidebar_label: MetaStation Account
---

# MetaStation Account

**Your account is ready before you are.**

Every user gets a native MetaStation Account the moment they register — no API keys, no external exchange to open, no setup. It is the default account that powers your trading on MetaStation.

**The MetaStation Account is a Web3 account by default.** It trades on-chain in USDC and is
funded through your **Funding Wallet** — created for you, with no seed phrase to manage and no gas
to pay on your orders.

---

{/* SCREENSHOT: account-overview | MetaStation Account overview panel | 1440x900 | redact: balance, address */}
<Screenshot id="account-overview" />

## Why it's different

| | |
|---|---|
| **On-chain order book** | Trades execute against a live, on-chain order book with transparent liquidity — the same book everyone trades against, fully visible. |
| **No gas on orders** | You never pay network gas to place, modify, or close a trade. |
| **Spot & perpetuals** | Trade spot markets and perpetual futures from one account, with professional order types. |
| **Settles in USDC** | Your USDC balance is your margin. Profit and loss on perpetuals settle in USDC. |
| **No connection required** | It isn't a key you link or a wallet you import. The account is yours by default. |

---

## Get it ready: deposit, then Enable Trading

Two one-time steps, then you trade:

1. **First deposit** into the Funding Wallet — it pays a **one-time activation fee** and must meet
   the **minimum** shown on the Deposit page. The rest becomes your trading balance
2. **Enable Trading** — press it once on the order ticket or the account

### How to fund

1. Open **Deposit** in the sidebar ([metastation.fi/deposit](https://metastation.fi/deposit))
2. Pick the account and **Funding Wallet**
3. **Send manually** USDC on Arbitrum One, or **Connect a wallet** on an EVM network, Solana or TON
   and MetaStation bridges it for you
4. After activation you can also deposit BTC, ETH, SOL and other coins straight into the
   **Trading Account**, each on its own network

→ [Fund Your Account](/docs/getting-started/fund-account)

---

## All automation tools — free

Every MetaStation Account includes **every automation tool at no cost**.

**Included free on your MetaStation Account:**

- ✅ **Webhook automation** — connect TradingView or any signal source
- ✅ **Telegram-to-Trade** — auto-execute signals from your Telegram channels
- ✅ **Copy trading** — follow providers, strategies and indexes into your own account
- ✅ **Advanced orders** — take-profit ladders, trailing stops, and SLX logic

| Feature | MetaStation Account | Connected exchange slot (Binance / ByBit / KuCoin) |
|---|---|---|
| Manual trading | ✅ Free | ✅ Free |
| Copy trading as a follower | ✅ Free | ✅ Free (signal providers on the same exchange) |
| Webhook automation | ✅ Free | 🔒 Store plan |
| Telegram-to-Trade | ✅ Free | 🔒 Store plan |

→ See [Account Slots](/docs/trading/account-slots) for how exchange slots work.

---

## Security & trust

- **On-chain transparency** — Orders rest and fill on a public on-chain order book. There is no opaque internal matching you can't see.
- **Your own wallet** — Your balance lives in your account's own wallets, not pooled with other users'.
- **No hidden counterparty** — You trade against an open market, not against the house.
- **Protected withdrawals** — Every withdrawal is confirmed with a 6-digit code; addresses are screened against sanctions lists.

---

## Supported markets

{/* SCREENSHOT: orderbook | live on-chain order book | 1440x900 | redact: none */}
<Screenshot id="orderbook" />
{/* SCREENSHOT: positions-panel | open positions — batch with the other live-position captures so a real position stays open for the shortest time | 1440x900 | redact: size, PnL optional */}

- **Perpetual futures** — BTC, ETH, SOL and 100+ other markets, each with its own maximum leverage
- **Spot** — trade between supported assets

On perpetual futures, **History → Funding Payments** lists the funding you paid or received, and
the futures header shows the **predicted funding (next hour)**.

---

## Withdraw any time

1. Open **Withdraw** in the sidebar ([metastation.fi/withdraw](https://metastation.fi/withdraw))
2. Pick the wallet, coin and network, and paste the destination address
3. Read the quote — what arrives and the fees
4. Confirm with your 6-digit code: from your authenticator app, or sent by e-mail

→ [Withdraw](/docs/wallet/withdraw)

---

## More than one MetaStation Account

Every MetaStation Account slot is free. Want to run separate strategies in parallel? Add another in
**Account Management** — once the ones you already have are activated.

→ See [Account Slots](/docs/trading/account-slots) for details.

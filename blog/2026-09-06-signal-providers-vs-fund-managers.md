---
slug: signal-providers-vs-fund-managers
title: "Signal Providers vs Fund Managers: which one are you actually copying?"
description: MetaStation has two kinds of provider and they are copied through the same machinery. The difference that matters is how the provider gets paid, and which incentive that creates.
authors: [metastation]
tags: [copy-trading]
keywords:
  - signal provider vs fund manager
  - crypto copy trading types
  - profit sharing copy trading
---

The MetaStation marketplace lists two kinds of provider side by side, and most people subscribe
without noticing which one they picked. The tabs say **Signal Providers** and **Fund Managers**.
The difference is not cosmetic, but it is also not where most people assume it is.

{/* truncate */}

## The part that is identical

Start here, because it removes most of the confusion.

Once a provider opens a trade, **both types reach your account through exactly the same path**. The
same three copy modes size the position. The same leverage and margin controls apply. The same
execution runs onto the slot you nominated.

There is no separate "fund manager engine". A fund manager's trade is copied to you the same way a
signal provider's is.

So if you are comparing the two on *how faithfully they replicate*, there is nothing to compare.

## Whose account is it? Their own — in both cases

A **signal provider** trades an account they already own and connect.

A **fund manager** does too. At signup they pick the account they will trade from — an exchange
account connected with their own API keys, or a MetaStation Account. MetaStation does not create,
fund or run that account, and it does not manage anyone's money.

On both sides, the follower's copies execute in **the follower's own account**. Your balance never
moves to the provider, and the provider has no access to your account.

## The part that differs most: how they get paid

This is the one to think about.

| | Signal Provider | Fund Manager |
|---|---|---|
| Card shows | **Fee** | **Profit Share** |
| Typical terms | A subscription fee they set — often zero while building a record | A declared share of profits, **10%–30%**, defaulting to 20% |
| Button reads | Subscribe | Allocate |

A **subscription fee is earned whether you make money or not**. That is not a criticism — it is a
predictable cost, and a provider on a flat fee has no incentive to chase volatility to get paid.
But it does mean a provider having a terrible quarter is still being paid by everyone who has not
got round to cancelling.

A **profit share is only earned when there is a profit**. That sounds strictly better, and for
direction it is: the manager makes money when you do. But look at the shape of it. The upside is
shared; the downside is entirely yours. An arrangement that pays a percentage of gains and nothing
of losses rewards taking more risk, not less — and a manager publishing a **10×–20× leverage band**
is telling you exactly how that incentive is being expressed.

Neither model is safer. They fail differently, and knowing which failure you are exposed to is most
of the value of reading the label.

:::tip[One thing the leverage band is not]
A fund manager's leverage band describes the range **their** strategy runs at. It does not cap the
leverage on **your** copied position — that is the number you set in your own copy settings, and it
does not inherit from theirs. Read the band as a statement about volatility, not as a limit that
protects you.
:::

## What neither type gives you

Worth being blunt, because this is the part people assume is handled.

Copy trading on MetaStation has **no automatic circuit breaker**. Nothing pauses copying after a
drawdown. There is **no per-symbol filter** — every symbol the provider trades is copied. There is
**no absolute per-trade cap** trimming a position after your copy mode has sized it.

Your risk controls are three decisions, all made *before* you subscribe:

1. **The copy mode.** Fixed Ratio takes a percentage of the provider's size, capped at 100%. Start
   from `(your balance / provider balance) × 100`, then halve it while you learn how they behave.
   It cannot be changed later — changing modes means cancelling and subscribing again.
2. **The leverage.** Yours, not theirs. No higher than the provider's own is a reasonable rule.
3. **The allocation.** With no automatic stop, the amount you allocate *is* the maximum you have
   decided to risk on this provider. Keeping any single provider under roughly 30% of total capital
   is the guard that survives a bad month.

After that, the only lever is pausing the subscription yourself — and pausing stops new copies
without closing the positions you already hold.

## So which should you follow?

The honest answer is that the provider matters far more than the category.

Read the drawdown before the return. Check the trade count, because twelve trades is a story and
three hundred is a distribution. Check how long the record runs — three profitable months cannot
separate skill from a rising market. Then read the fee or the profit share and ask what incentive it
creates for the person on the other side.

The label tells you how they are paid. It does not tell you whether they are
any good.

---

**Read next:**

- [Fund Managers](/docs/social-trading/fund-managers) — the account they trade, the terms, and what carries over
- [How Copy Trading Executes](/docs/concepts/copy-trading-mechanics) — the full path a trade takes to your account
- [Set Up Copy Trading Safely](/docs/guides/copy-trading-setup) — the three decisions, in order

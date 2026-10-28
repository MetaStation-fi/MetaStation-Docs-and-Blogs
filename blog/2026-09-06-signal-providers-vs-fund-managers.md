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
| Charges | A **monthly price**, prepaid — or nothing | A **performance fee** on profit only |
| Typical terms | Free while building a record, then a price they set; your price is locked in when you subscribe | 0% or a whole 2–99%, capped by the manager's tier (10%–30%) |
| Button reads | Subscribe | Copy |

A **subscription fee is earned whether you make money or not**. That is not a criticism — it is a
predictable cost, and a provider on a flat fee has no incentive to chase volatility to get paid.
But it does mean a provider having a terrible quarter is still being paid by everyone who has not
got round to cancelling.

A **profit share is only earned when there is a profit**. That sounds strictly better, and for
direction it is: the manager makes money when you do. But look at the shape of it. The upside is
shared; the downside is entirely yours. An arrangement that pays a percentage of gains and nothing
of losses rewards taking more risk, not less — and a manager publishing a high **leverage range**
is telling you exactly how that incentive is being expressed.

Neither model is safer. They fail differently, and knowing which failure you are exposed to is most
of the value of reading the label.

:::tip[One thing the leverage range is not]
A fund manager's leverage range describes the range **their** strategy runs at. It does not cap the
leverage on **your** copied position — that is the number you set in your own copy settings, and it
does not inherit from theirs. Read the range as a statement about volatility, not as a limit that
protects you. Your copies open at your own account's leverage, or one you set.
:::

## What protects you, whichever you follow

Worth being blunt, because this is the part people assume is handled: the protection is yours to
set, before you subscribe.

1. **A loss limit.** Stop copying after this many dollars lost on this subscription's copies — and
   choose whether the open copies are closed, kept, or closed with the provider. Add a daily loss
   limit on top.
2. **The sizing.** A share of each trade is capped at 100% of the provider's size. Start from
   `(your balance / provider balance) × 100`, then halve it while you learn how they behave.
3. **The filters and caps.** Only the markets you want, at most so many open positions, a cap on the
   margin in one market, and *copy only trades that come with a stop-loss*.
4. **The leverage.** Yours, never theirs.

Keeping any single provider under roughly 30% of total capital is still the guard that survives a
bad month.

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
- [Set Up Copy Trading Safely](/docs/guides/copy-trading-setup) — the decisions, in order

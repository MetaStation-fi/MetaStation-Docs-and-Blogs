import React, { useMemo, useState } from 'react';
import styles from './styles.module.css';

/**
 * Copy-trading calculator — provider's trade in, your trade out.
 *
 * COMPONENT: copy-calculator (PLACEHOLDERS.md design register), for
 * docs/social-trading/copy-settings.mdx.
 *
 * ── GROUND TRUTH, AND WHY IT MATTERS HERE ──────────────────────────────────
 * The arithmetic below mirrors `calculatePositionSize()` in
 * metastation-backend, app/services/socialTrade/copyTradingService.js, and the
 * limits mirror the live settings form in metastation-frontend,
 * src/Components/SocialTrade/components/CopySettingsForm.js. Both were read
 * rather than assumed, because the page this component sits on described a
 * different product:
 *
 *   - There is no "position size multiplier". There are three COPY MODES —
 *     Copy Trader (mirror the size exactly), Fixed Ratio (a PERCENTAGE of the
 *     provider's size) and Fixed Amount (a flat USDT figure per trade).
 *   - Fixed Ratio is capped at 100%. A "2.0x — copy double the provider's
 *     size" setting is not merely unavailable, it fails validation.
 *   - Copy mode cannot be changed after the subscription exists; the form
 *     ignores the change (`if (isUpdate && name === 'copyMode') return`).
 *   - Fixed Amount is bounded by the PROVIDER's own minCopyAmount and
 *     maxCopyAmount, defaulting to 100 and 10,000 USDT.
 *
 * A calculator that computed a multiplier the platform rejects would be worse
 * than no calculator, which is why this one refuses sizes the platform would
 * refuse and says which rule it broke.
 *
 * ── WHY THE SUBSCRIPTION COST IS IN HERE ───────────────────────────────────
 * Copying is not free and the cost is fixed, not proportional: it is a
 * subscription, so a small allocation pays the same fee as a large one. The
 * break-even figure is the number that decides whether following a provider at
 * a given size makes sense at all, and it is the one thing a subscriber cannot
 * read off the marketplace page. The platform's own commission split with the
 * provider is deliberately absent — it is not published, and inventing a rate
 * to make a prettier output would be the kind of number readers plan around.
 *
 * Dependency-free: plain React state and CSS modules, matching PayloadBuilder.
 * It renders during the static build, so nothing here may touch `window`
 * outside a handler.
 */

const COPY_MODES = [
  {
    value: 'copy_trader',
    label: 'Copy Trader',
    hint: "Mirror the provider's size exactly",
  },
  {
    value: 'fixed_ratio',
    label: 'Fixed Ratio',
    hint: "A percentage of the provider's size, 0.01–100",
  },
  {
    value: 'fixed_amount',
    label: 'Fixed Amount',
    hint: 'A flat position size per trade',
  },
];

const PERIODS = [
  { value: 1, label: 'Monthly' },
  { value: 3, label: 'Quarterly' },
  { value: 12, label: 'Annual' },
];

function num(v) {
  const n = Number(String(v ?? '').trim());
  return Number.isFinite(n) ? n : null;
}

function fmt(v, dp = 2) {
  if (v === null || !Number.isFinite(v)) return '—';
  return v.toLocaleString('en-US', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

export default function CopyCalculator() {
  const [providerSize, setProviderSize] = useState('0.5');
  const [price, setPrice] = useState('45000');
  const [copyMode, setCopyMode] = useState('fixed_ratio');
  const [copyAmount, setCopyAmount] = useState('40');
  const [leverage, setLeverage] = useState('10');
  const [balance, setBalance] = useState('5000');
  const [minCopyAmount, setMinCopyAmount] = useState('100');
  const [maxCopyAmount, setMaxCopyAmount] = useState('10000');
  const [subCost, setSubCost] = useState('49');
  const [months, setMonths] = useState(1);
  const [tradesPerMonth, setTradesPerMonth] = useState('20');

  const model = useMemo(() => {
    const pSize = num(providerSize);
    const px = num(price);
    const amount = num(copyAmount);
    const lev = num(leverage) || 1;
    const bal = num(balance);
    const minAmt = num(minCopyAmount);
    const maxAmt = num(maxCopyAmount);

    const errors = [];
    const warnings = [];

    if (px === null || px <= 0) {
      errors.push('Enter the price the trade opens at.');
    }
    if (pSize === null || pSize <= 0) {
      errors.push("Enter the provider's position size in base tokens.");
    }

    /* The three branches ARE calculatePositionSize(). `fixed_amount` returns
       copyAmount unchanged — the backend's own comment says it will divide by
       price, and the code does not, so the value is used as the position size
       rather than as a notional. Reproduced as written, not as commented. */
    let yourSize = null;
    let sizeNote = '';

    if (copyMode === 'copy_trader') {
      yourSize = pSize;
      sizeNote = "Copy Trader mirrors the provider's size, whatever it is.";
    } else if (copyMode === 'fixed_ratio') {
      if (amount === null || amount < 0.01 || amount > 100) {
        errors.push(
          'Fixed Ratio takes 0.01–100. Above 100 fails validation: you cannot ' +
            "copy more than the provider's own size.",
        );
      } else if (pSize !== null) {
        yourSize = pSize * (amount / 100);
        sizeNote = `${fmt(amount, 2)}% of the provider's ${fmt(pSize, 4)}.`;
      }
    } else if (copyMode === 'fixed_amount') {
      if (amount === null || amount <= 0) {
        errors.push('Fixed Amount must be greater than zero.');
      } else {
        yourSize = amount;
        sizeNote = 'Fixed Amount uses the figure you set as the position size.';
        if (minAmt !== null && amount < minAmt) {
          errors.push(
            `Below this provider's minimum of ${fmt(minAmt)}. The settings form ` +
              'rejects it before it reaches the API.',
          );
        }
        if (maxAmt !== null && amount > maxAmt) {
          errors.push(`Above this provider's maximum of ${fmt(maxAmt)}.`);
        }
      }
    }

    if (yourSize === null || px === null || px <= 0) {
      return { ok: false, errors, warnings };
    }

    const notional = yourSize * px;
    const margin = notional / lev;
    const providerNotional = (pSize ?? 0) * px;

    if (bal !== null && bal > 0) {
      if (margin > bal) {
        errors.push(
          `This trade needs ${fmt(margin)} of margin and the account holds ` +
            `${fmt(bal)}. It cannot open.`,
        );
      } else if (margin > bal * 0.3) {
        warnings.push(
          `One trade commits ${fmt((margin / bal) * 100, 1)}% of the account. The ` +
            'docs recommend a per-trade cap of 5–10%.',
        );
      }
    }

    /* Subscription economics. The cost is per PERIOD and does not scale with
       size, so the smaller the allocation the larger the hurdle. */
    const cost = num(subCost);
    const trades = num(tradesPerMonth);
    const perMonth = cost !== null && months ? cost / months : null;
    const costPerTrade =
      perMonth !== null && trades !== null && trades > 0 ? perMonth / trades : null;
    const breakEvenPct =
      perMonth !== null && bal !== null && bal > 0 ? (perMonth / bal) * 100 : null;
    const breakEvenPerTradePct =
      costPerTrade !== null && margin > 0 ? (costPerTrade / margin) * 100 : null;

    return {
      ok: errors.length === 0,
      errors,
      warnings,
      yourSize,
      sizeNote,
      notional,
      margin,
      providerNotional,
      shareOfBalance: bal !== null && bal > 0 ? (margin / bal) * 100 : null,
      perMonth,
      costPerTrade,
      breakEvenPct,
      breakEvenPerTradePct,
    };
  }, [
    providerSize,
    price,
    copyMode,
    copyAmount,
    leverage,
    balance,
    minCopyAmount,
    maxCopyAmount,
    subCost,
    months,
    tradesPerMonth,
  ]);

  const amountLabel =
    copyMode === 'fixed_ratio'
      ? 'Copy amount (% of provider)'
      : 'Copy amount (position size)';

  return (
    <div className={styles.calculator}>
      <fieldset className={styles.group}>
        <legend>The provider&rsquo;s trade</legend>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Provider position size</span>
            <input
              type="number"
              inputMode="decimal"
              value={providerSize}
              onChange={(e) => setProviderSize(e.target.value)}
            />
            <small>Base tokens</small>
          </label>
          <label className={styles.field}>
            <span>Entry price</span>
            <input
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend>Your copy settings</legend>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Copy mode</span>
            <select value={copyMode} onChange={(e) => setCopyMode(e.target.value)}>
              {COPY_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <small>{COPY_MODES.find((m) => m.value === copyMode).hint}</small>
          </label>

          {copyMode !== 'copy_trader' && (
            <label className={styles.field}>
              <span>{amountLabel}</span>
              <input
                type="number"
                inputMode="decimal"
                value={copyAmount}
                onChange={(e) => setCopyAmount(e.target.value)}
              />
              <small>
                {copyMode === 'fixed_ratio'
                  ? '0.01 to 100 — never above the provider'
                  : `Between this provider's minimum and maximum`}
              </small>
            </label>
          )}

          <label className={styles.field}>
            <span>Leverage</span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              max="125"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
            />
            <small>1 to 125</small>
          </label>

          <label className={styles.field}>
            <span>Your account balance</span>
            <input
              type="number"
              inputMode="decimal"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </label>

          {copyMode === 'fixed_amount' && (
            <>
              <label className={styles.field}>
                <span>Provider minimum</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={minCopyAmount}
                  onChange={(e) => setMinCopyAmount(e.target.value)}
                />
                <small>Set by the provider; 100 by default</small>
              </label>
              <label className={styles.field}>
                <span>Provider maximum</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={maxCopyAmount}
                  onChange={(e) => setMaxCopyAmount(e.target.value)}
                />
                <small>Set by the provider; 10,000 by default</small>
              </label>
            </>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend>What the subscription costs</legend>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Subscription price</span>
            <input
              type="number"
              inputMode="decimal"
              value={subCost}
              onChange={(e) => setSubCost(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>Billing period</span>
            <select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>Trades per month</span>
            <input
              type="number"
              inputMode="decimal"
              value={tradesPerMonth}
              onChange={(e) => setTradesPerMonth(e.target.value)}
            />
            <small>From the provider&rsquo;s marketplace stats</small>
          </label>
        </div>
      </fieldset>

      {model.errors.length > 0 && (
        <ul className={styles.errors}>
          {model.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {model.warnings.length > 0 && (
        <ul className={styles.warnings}>
          {model.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      {model.ok && (
        <>
          <dl className={styles.readout} aria-live="polite">
            <div>
              <dt>Your position size</dt>
              <dd>{fmt(model.yourSize, 4)}</dd>
            </div>
            <div>
              <dt>Position value</dt>
              <dd>{fmt(model.notional)}</dd>
            </div>
            <div>
              <dt>Margin required</dt>
              <dd>{fmt(model.margin)}</dd>
            </div>
            <div>
              <dt>Share of your balance</dt>
              <dd>
                {model.shareOfBalance === null
                  ? '—'
                  : `${fmt(model.shareOfBalance, 1)}%`}
              </dd>
            </div>
          </dl>

          <p className={styles.reason}>{model.sizeNote}</p>

          <dl className={styles.readout} aria-live="polite">
            <div>
              <dt>Subscription per month</dt>
              <dd>{fmt(model.perMonth)}</dd>
            </div>
            <div>
              <dt>Cost per copied trade</dt>
              <dd>{fmt(model.costPerTrade)}</dd>
            </div>
            <div>
              <dt>Monthly return to break even</dt>
              <dd>
                {model.breakEvenPct === null ? '—' : `${fmt(model.breakEvenPct, 2)}%`}
              </dd>
            </div>
            <div>
              <dt>Per trade, on this margin</dt>
              <dd>
                {model.breakEvenPerTradePct === null
                  ? '—'
                  : `${fmt(model.breakEvenPerTradePct, 2)}%`}
              </dd>
            </div>
          </dl>

          <p className={styles.note}>
            Break-even is against your whole balance, because the subscription is
            charged whether you trade or not. Trading fees, funding and slippage
            are not included, so the real hurdle is higher than the figure above.
          </p>
        </>
      )}
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import styles from './styles.module.css';

/**
 * Order-type visualiser — the TP ladder, the stop loss, and SLX, drawn.
 *
 * COMPONENT: order-visualiser (PLACEHOLDERS.md design register), for
 * docs/trading/advanced-orders.mdx and docs/trading/order-types-reference.md.
 *
 * ── WHAT PROSE CANNOT DO HERE ──────────────────────────────────────────────
 * "Move the stop loss to the previous take-profit level after each new take
 * profit is hit" is a sentence people read twice and still get wrong, because
 * the thing it describes is a sequence of states, not a fact. The whole
 * component is one idea: ONE control — how far the price has travelled — and
 * every consequence recomputed from it. Drag it and the ladder fills, the stop
 * walks up behind it, the remaining size shrinks and the locked-in result
 * changes. That is the mechanism, and it is not explainable in a table.
 *
 * ── ONE CONTROL DRIVES BOTH SLX MODES ──────────────────────────────────────
 * The docs describe SLX's two modes with two different triggers: Callback Rate
 * reacts to the peak price, Trailing Profits reacts to take-profit events. But
 * a take-profit event IS a price event — TPn has filled exactly when the peak
 * has passed TPn's price — so both modes are functions of the same number.
 * That is why there is one slider rather than a mode-dependent UI, and it is
 * also the clearest way to show that the two modes are not as different as the
 * documentation's separate sections imply.
 *
 * ── GROUND TRUTH ───────────────────────────────────────────────────────────
 * Behaviour follows docs/trading/advanced-orders.mdx, and the take-profit rules
 * follow the backend parser that actually consumes these orders
 * (metastation-backend, app/services/socialTrade/webhookService.js —
 * validateTakeProfits), the same source src/components/PayloadBuilder was
 * built against:
 *
 *   - A take profit's `amount` is a NUMBER OF BASE TOKENS. Not a percentage,
 *     never "remainder". The docs' own example table writes TP quantities as
 *     30% / 40% / 30%, which is what the ORDER PANEL accepts; the API does not.
 *   - The total of all TP amounts must not exceed the order quantity, or the
 *     signal is rejected with "Total TP amount exceeds order amount". That
 *     check is reproduced below, because a visualiser that happily draws a
 *     ladder the platform would reject teaches the wrong thing.
 *
 * ── DELIBERATELY NOT A PRICE CHART ─────────────────────────────────────────
 * There is no time axis and no candles. Every one of these order types is a
 * statement about PRICE LEVELS; a time axis would imply the levels depend on
 * when price arrives, which is exactly the misunderstanding to avoid. The
 * drawing is a price ladder, drawn to scale.
 *
 * Dependency-free: plain React state, inline SVG and CSS modules, matching
 * PayloadBuilder. It renders during the static build, so nothing here may
 * touch `window` outside a handler.
 */

const SLX_MODES = [
  { value: 'off', label: 'No SLX — fixed stop loss' },
  { value: 'callback_rate', label: 'SLX: Callback Rate' },
  { value: 'breakeven', label: 'SLX: Trailing Profits — breakeven' },
  { value: 'follow_tp', label: 'SLX: Trailing Profits — follow TP' },
];

const CHART_HEIGHT = 340;
const PAD_TOP = 18;
const PAD_BOTTOM = 18;
const LABEL_GUTTER = 132;

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

const DEFAULT_TPS = [
  { price: '48000', amount: '0.3' },
  { price: '50000', amount: '0.4' },
  { price: '52000', amount: '0.3' },
];

export default function OrderVisualiser() {
  const [side, setSide] = useState('long');
  const [entry, setEntry] = useState('45000');
  const [quantity, setQuantity] = useState('1');
  const [stopLoss, setStopLoss] = useState('43000');
  const [slxMode, setSlxMode] = useState('breakeven');
  const [activationTp, setActivationTp] = useState(1);
  const [activationPrice, setActivationPrice] = useState('46000');
  const [callbackRate, setCallbackRate] = useState('2');
  const [tps, setTps] = useState(DEFAULT_TPS);
  /* 0–100 along the travelled range, not a price: the price domain changes as
     the reader edits the levels, and a raw price would jump around under the
     handle every time they did. */
  const [travel, setTravel] = useState(60);

  const isLong = side === 'long';

  const model = useMemo(() => {
    const entryPrice = num(entry);
    const qty = num(quantity);
    const initialStop = num(stopLoss);

    const levels = tps
      .map((tp, i) => ({
        n: i + 1,
        price: num(tp.price),
        amount: num(tp.amount),
      }))
      .filter((tp) => tp.price !== null && tp.price > 0);

    if (entryPrice === null || entryPrice <= 0 || qty === null || qty <= 0) {
      return { ok: false, levels: [], errors: ['Enter an entry price and a position size.'] };
    }

    /* Ladders are read in the direction the trade profits. Sorting rather than
       trusting input order means a reader can add TP4 below TP2 and still see
       a coherent picture instead of a scribble. */
    const ordered = [...levels].sort((a, b) =>
      isLong ? a.price - b.price : b.price - a.price,
    );

    const errors = [];
    const warnings = [];

    const totalTpAmount = ordered.reduce((sum, tp) => sum + (tp.amount ?? 0), 0);
    if (ordered.some((tp) => tp.amount === null || tp.amount <= 0)) {
      errors.push(
        'Every take profit needs an amount in base tokens. The API rejects a ' +
          'level without one: "TPn missing price or amount".',
      );
    }
    if (totalTpAmount > qty + 1e-12) {
      errors.push(
        `Take-profit amounts total ${fmt(totalTpAmount, 4)}, which is more than the ` +
          `position size of ${fmt(qty, 4)}. The API rejects this: "Total TP amount ` +
          'exceeds order amount".',
      );
    }
    if (ordered.some((tp) => (isLong ? tp.price <= entryPrice : tp.price >= entryPrice))) {
      warnings.push(
        `A take profit is on the losing side of the entry for a ${side}. It would ` +
          'fill immediately at a loss.',
      );
    }
    if (initialStop !== null) {
      if (isLong ? initialStop >= entryPrice : initialStop <= entryPrice) {
        warnings.push(
          `The stop loss is on the profitable side of the entry for a ${side}. ` +
            'It would trigger immediately.',
        );
      }
    }

    const prices = [
      entryPrice,
      ...(initialStop !== null ? [initialStop] : []),
      ...ordered.map((tp) => tp.price),
    ];
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const span = Math.max(rawMax - rawMin, entryPrice * 0.01);
    const domainMin = rawMin - span * 0.08;
    const domainMax = rawMax + span * 0.08;

    /* The peak (a long) or trough (a short) the market has reached. The travel
       control runs from the entry to just past the furthest take profit, so
       every level on the ladder is reachable by dragging. */
    const furthest = ordered.length
      ? ordered[ordered.length - 1].price
      : isLong
        ? entryPrice * 1.1
        : entryPrice * 0.9;
    const reach = furthest + (isLong ? 1 : -1) * Math.abs(furthest - entryPrice) * 0.06;
    const peak = entryPrice + ((reach - entryPrice) * travel) / 100;

    const filled = ordered.filter((tp) => (isLong ? peak >= tp.price : peak <= tp.price));
    const filledCount = filled.length;

    /* ── Where the stop loss is now ──────────────────────────────────────
       Each branch is the rule as docs/trading/advanced-orders.md states it.
       A stop is only ever ALLOWED TO IMPROVE: SLX trails in the direction of
       profit and never gives ground, which is why every branch takes the
       better of the computed level and the level before it. */
    const better = (a, b) => {
      if (a === null) return b;
      if (b === null) return a;
      return isLong ? Math.max(a, b) : Math.min(a, b);
    };

    let stopNow = initialStop;
    let stopReason = 'The stop loss you set. It does not move.';

    if (slxMode === 'callback_rate') {
      const act = num(activationPrice);
      const rate = num(callbackRate);
      const armed =
        act !== null && rate !== null && (isLong ? peak >= act : peak <= act);
      if (armed) {
        const trailed = isLong
          ? peak * (1 - rate / 100)
          : peak * (1 + rate / 100);
        stopNow = better(initialStop, trailed);
        stopReason =
          `Armed at ${fmt(act)} and trailing ${fmt(rate, 2)}% behind the ` +
          `${isLong ? 'highest' : 'lowest'} price seen (${fmt(peak)}).`;
      } else {
        stopReason =
          `Not armed yet — SLX starts trailing once price reaches ${fmt(act)}. ` +
          'Until then the stop loss you set is what protects the position.';
      }
    } else if (slxMode === 'breakeven') {
      if (filledCount >= activationTp) {
        stopNow = better(initialStop, entryPrice);
        stopReason = `TP${activationTp} filled, so the stop moved to the entry price. The position cannot now lose.`;
      } else {
        stopReason = `Waiting for TP${activationTp} to fill. Until then the stop loss you set is what protects the position.`;
      }
    } else if (slxMode === 'follow_tp') {
      if (filledCount >= activationTp) {
        // TP1 filling moves the stop to entry; every later fill moves it to
        // the level below the one that just filled.
        const target =
          filledCount === 1 ? entryPrice : ordered[filledCount - 2].price;
        stopNow = better(initialStop, target);
        stopReason =
          filledCount === 1
            ? 'TP1 filled, so the stop moved to the entry price.'
            : `TP${filledCount} filled, so the stop moved up to TP${filledCount - 1} (${fmt(ordered[filledCount - 2].price)}).`;
      } else {
        stopReason = `Waiting for TP${activationTp} to fill. Until then the stop loss you set is what protects the position.`;
      }
    }

    /* ── Result if the position closed from here ─────────────────────────
       Realised on the filled levels, plus whatever is left closing at the
       stop. The point of the number is not precision — there are no fees or
       funding in it — but the sign flip a reader can watch happen. */
    const dir = isLong ? 1 : -1;
    const realised = filled.reduce(
      (sum, tp) => sum + (tp.amount ?? 0) * (tp.price - entryPrice) * dir,
      0,
    );
    const closedAmount = filled.reduce((sum, tp) => sum + (tp.amount ?? 0), 0);
    const remaining = Math.max(qty - closedAmount, 0);
    const atStop =
      stopNow === null ? null : remaining * (stopNow - entryPrice) * dir;
    const ifStoppedNow = atStop === null ? null : realised + atStop;

    return {
      ok: errors.length === 0,
      errors,
      warnings,
      entryPrice,
      qty,
      initialStop,
      levels: ordered,
      domainMin,
      domainMax,
      peak,
      filledCount,
      stopNow,
      stopReason,
      realised,
      remaining,
      ifStoppedNow,
    };
  }, [
    side,
    entry,
    quantity,
    stopLoss,
    slxMode,
    activationTp,
    activationPrice,
    callbackRate,
    tps,
    travel,
    isLong,
  ]);

  const y = (price) => {
    if (!model.ok && model.domainMin === undefined) return 0;
    const t = (price - model.domainMin) / (model.domainMax - model.domainMin);
    const usable = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
    return PAD_TOP + usable * (1 - Math.min(Math.max(t, 0), 1));
  };

  const setTp = (i, key, value) =>
    setTps((prev) => prev.map((tp, j) => (j === i ? { ...tp, [key]: value } : tp)));

  const addTp = () =>
    setTps((prev) => (prev.length >= 10 ? prev : [...prev, { price: '', amount: '' }]));

  const removeTp = (i) => setTps((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className={styles.visualiser}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Direction</span>
          <select value={side} onChange={(e) => setSide(e.target.value)}>
            <option value="long">Long — profit above entry</option>
            <option value="short">Short — profit below entry</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Entry price</span>
          <input
            type="number"
            inputMode="decimal"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Position size</span>
          <input
            type="number"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <small>Base tokens, the unit take-profit amounts are measured in</small>
        </label>

        <label className={styles.field}>
          <span>Stop loss</span>
          <input
            type="number"
            inputMode="decimal"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Stop-loss behaviour</span>
          <select value={slxMode} onChange={(e) => setSlxMode(e.target.value)}>
            {SLX_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        {slxMode === 'callback_rate' && (
          <>
            <label className={styles.field}>
              <span>Activation price</span>
              <input
                type="number"
                inputMode="decimal"
                value={activationPrice}
                onChange={(e) => setActivationPrice(e.target.value)}
              />
              <small>SLX starts trailing here</small>
            </label>
            <label className={styles.field}>
              <span>Callback rate (%)</span>
              <input
                type="number"
                inputMode="decimal"
                value={callbackRate}
                onChange={(e) => setCallbackRate(e.target.value)}
              />
              <small>How far behind the peak the stop follows</small>
            </label>
          </>
        )}

        {(slxMode === 'breakeven' || slxMode === 'follow_tp') && (
          <label className={styles.field}>
            <span>Activation point</span>
            <select
              value={activationTp}
              onChange={(e) => setActivationTp(Number(e.target.value))}
            >
              {model.levels.map((tp) => (
                <option key={tp.n} value={tp.n}>
                  TP{tp.n}
                </option>
              ))}
            </select>
            <small>Which take profit arms SLX</small>
          </label>
        )}
      </div>

      <fieldset className={styles.tps}>
        <legend>Take profits — up to 10</legend>
        {tps.map((tp, i) => (
          <div className={styles.tpRow} key={i}>
            <span className={styles.tpTag}>TP{i + 1}</span>
            <label>
              <span className={styles.srOnly}>{`Take profit ${i + 1} price`}</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Price"
                value={tp.price}
                onChange={(e) => setTp(i, 'price', e.target.value)}
              />
            </label>
            <label>
              <span className={styles.srOnly}>
                {`Take profit ${i + 1} amount in base tokens`}
              </span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Amount (tokens)"
                value={tp.amount}
                onChange={(e) => setTp(i, 'amount', e.target.value)}
              />
            </label>
            <button
              type="button"
              className={styles.remove}
              onClick={() => removeTp(i)}
              disabled={tps.length === 1}
            >
              Remove TP{i + 1}
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.add}
          onClick={addTp}
          disabled={tps.length >= 10}
        >
          {tps.length >= 10 ? 'Ten take profits is the maximum' : 'Add a take profit'}
        </button>
      </fieldset>

      <label className={styles.travel}>
        <span>
          {isLong ? 'Highest price reached' : 'Lowest price reached'} —{' '}
          <strong>{fmt(model.peak)}</strong>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={travel}
          onChange={(e) => setTravel(Number(e.target.value))}
        />
        <small>
          Drag to walk the market away from your entry. Everything below follows
          from this one number.
        </small>
      </label>

      {model.errors.length > 0 && (
        <ul className={styles.errors}>
          {model.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {model.warnings?.length > 0 && (
        <ul className={styles.warnings}>
          {model.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      {model.ok && (
        <>
          <div className={styles.chartWrap}>
            <svg
              className={styles.chart}
              viewBox={`0 0 640 ${CHART_HEIGHT}`}
              preserveAspectRatio="none"
              /* The drawing repeats the readout below it and adds nothing an
                 assistive technology can use, so it is not exposed. The
                 numbers are the accessible version. */
              aria-hidden="true"
              focusable="false"
            >
              {/* Travelled range */}
              <rect
                className={styles.travelled}
                x="0"
                width={640 - LABEL_GUTTER}
                y={Math.min(y(model.entryPrice), y(model.peak))}
                height={Math.abs(y(model.peak) - y(model.entryPrice))}
              />

              {model.levels.map((tp, i) => {
                const hit = i < model.filledCount;
                return (
                  <g key={tp.n}>
                    <line
                      className={hit ? styles.tpLineHit : styles.tpLine}
                      x1="0"
                      x2={640 - LABEL_GUTTER}
                      y1={y(tp.price)}
                      y2={y(tp.price)}
                    />
                    <text
                      className={hit ? styles.tpTextHit : styles.tpText}
                      x={640 - LABEL_GUTTER + 8}
                      y={y(tp.price) + 4}
                    >
                      {`TP${tp.n} ${fmt(tp.price)}${hit ? ' — filled' : ''}`}
                    </text>
                  </g>
                );
              })}

              <line
                className={styles.entryLine}
                x1="0"
                x2={640 - LABEL_GUTTER}
                y1={y(model.entryPrice)}
                y2={y(model.entryPrice)}
              />
              <text
                className={styles.entryText}
                x={640 - LABEL_GUTTER + 8}
                y={y(model.entryPrice) + 4}
              >
                {`Entry ${fmt(model.entryPrice)}`}
              </text>

              {model.stopNow !== null && (
                <>
                  <line
                    className={styles.stopLine}
                    x1="0"
                    x2={640 - LABEL_GUTTER}
                    y1={y(model.stopNow)}
                    y2={y(model.stopNow)}
                  />
                  <text
                    className={styles.stopText}
                    x={640 - LABEL_GUTTER + 8}
                    y={y(model.stopNow) + 4}
                  >
                    {`Stop ${fmt(model.stopNow)}`}
                  </text>
                </>
              )}

              <line
                className={styles.peakLine}
                x1="0"
                x2={640 - LABEL_GUTTER}
                y1={y(model.peak)}
                y2={y(model.peak)}
              />
            </svg>
          </div>

          {/* The readout is the accessible rendering of the drawing, and it is
              a live region because it changes under a slider the reader is
              already holding — announcing it on every change is the only way
              the control means anything without sight of the chart. */}
          <dl className={styles.readout} aria-live="polite">
            <div>
              <dt>Take profits filled</dt>
              <dd>
                {model.filledCount} of {model.levels.length}
              </dd>
            </div>
            <div>
              <dt>Stop loss now</dt>
              <dd>{fmt(model.stopNow)}</dd>
            </div>
            <div>
              <dt>Size still open</dt>
              <dd>{fmt(model.remaining, 4)}</dd>
            </div>
            <div>
              <dt>Realised so far</dt>
              <dd className={model.realised >= 0 ? styles.pos : styles.neg}>
                {fmt(model.realised)}
              </dd>
            </div>
            <div>
              <dt>Result if stopped out now</dt>
              <dd className={model.ifStoppedNow >= 0 ? styles.pos : styles.neg}>
                {fmt(model.ifStoppedNow)}
              </dd>
            </div>
          </dl>

          <p className={styles.reason}>{model.stopReason}</p>

          <p className={styles.note}>
            Quote-currency figures, before fees and funding. They are here to
            show the sign change when the stop moves past the entry, not to
            price a trade.
          </p>
        </>
      )}
    </div>
  );
}

import React, {useMemo, useState} from 'react';
import styles from './styles.module.css';

/**
 * Webhook Payload Builder.
 *
 * This mirrors `generateBuilderJSON()` in the platform's own Webhook Management
 * page (metastation-frontend, Components/SocialTrade/WebhookManagement.js), and
 * was cross-checked field by field against the backend parser that actually
 * consumes the payload (metastation-backend,
 * app/services/socialTrade/webhookService.js — parseSignal / parseTakeProfits /
 * validateTakeProfits).
 *
 * That cross-check matters more than it sounds. Several shapes that read
 * plausibly are rejected outright by the parser:
 *
 *   - Take-profit entries use `amount`, a NUMBER in base tokens. Not
 *     `quantity`, and never "remainder" — validateTakeProfits does
 *     `parseFloat(tp.amount)` and errors with "TPn missing price or amount",
 *     so a percentage string or a keyword fails validation.
 *   - Total TP `amount` must not exceed the order quantity, or the signal is
 *     rejected with "Total TP amount exceeds order amount".
 *   - Only `market` and `limit` order types pass validation. `stop_market` and
 *     `stop_limit` are rejected: "Invalid order type ... Supported types:
 *     market, limit".
 *   - Futures stop loss goes in `futurestopLoss` as an object, not `stopLoss`.
 *   - SLX is emitted FLATTENED by the app (slxChecked + trailingStatus /
 *     callBackStatus and siblings). The backend also accepts a nested
 *     `stopLossX` object, but this builder emits what the app emits so the two
 *     surfaces cannot drift apart.
 *
 * If the platform builder changes, change this with it — a docs builder that
 * emits a payload the parser rejects is worse than no builder at all.
 *
 * Dependency-free on purpose: plain React state and CSS modules. It renders
 * during the static build, so nothing here may touch window outside a handler.
 */

const ACTIONS = [
  {value: 'open', label: 'Open a position'},
  {value: 'close', label: 'Close a position'},
  {value: 'update', label: 'Update TP / SL'},
];

const SIZE_TYPES = [
  {value: 'token', label: 'Token amount', hint: 'e.g. 0.001 — fixed token exposure'},
  {value: 'usd', label: 'USD value', hint: 'Constant risk per trade'},
  {value: 'percentage', label: '% of balance', hint: 'Compounds as the account grows'},
];

const SL_STRATEGIES = [
  {value: 'none', label: 'None'},
  {value: 'simple', label: 'Simple stop loss'},
  {value: 'slx', label: 'SLX — stop loss with activation'},
  {value: 'trailing', label: 'Trailing stop loss'},
  {value: 'breakeven', label: 'Break-even stop'},
];

function n(v) {
  const s = String(v ?? '').trim();
  if (s === '') return null;
  const x = Number(s);
  return Number.isFinite(x) ? x : null;
}

export default function PayloadBuilder() {
  const [marketType, setMarketType] = useState('futures');
  const [action, setAction] = useState('open');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [sizeType, setSizeType] = useState('token');
  const [quantity, setQuantity] = useState('0.01');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState('10');
  const [marginMode, setMarginMode] = useState('isolated');
  const [tps, setTps] = useState([{price: '', amount: ''}]);
  const [slStrategy, setSlStrategy] = useState('simple');
  const [slType, setSlType] = useState('market');
  const [stopLoss, setStopLoss] = useState('41000');
  const [stopLimitPrice, setStopLimitPrice] = useState('');
  const [slPriceType, setSlPriceType] = useState('mark');
  const [slxMode, setSlxMode] = useState('trailing_profits');
  const [activationPoint, setActivationPoint] = useState('1');
  const [slxTrailingType, setSlxTrailingType] = useState('breakeven');
  const [callbackActivationPrice, setCallbackActivationPrice] = useState('');
  const [callbackRate, setCallbackRate] = useState('');
  const [trailingActivation, setTrailingActivation] = useState('');
  const [trailingCallback, setTrailingCallback] = useState('');
  const [trailingType, setTrailingType] = useState('percent');
  const [breakEvenTrigger, setBreakEvenTrigger] = useState('');
  const [breakEvenOffset, setBreakEvenOffset] = useState('0');
  const [comment, setComment] = useState('');
  // Docs-only convenience, not present in the platform builder: swap symbol and
  // side for the substitutions TradingView fills in when an alert fires. It
  // changes only those two values, never the payload SHAPE, so format parity
  // with the app builder is unaffected.
  const [dynamic, setDynamic] = useState(false);
  const [tab, setTab] = useState('json');
  const [copied, setCopied] = useState(null);

  const isFutures = marketType === 'futures';

  const payload = useMemo(() => {
    const json = {
      action,
      symbol: dynamic ? '{{ticker}}' : symbol.trim().toUpperCase(),
      side: dynamic ? '{{strategy.order.action}}' : side,
    };

    if (action === 'open') {
      json.orderType = orderType;

      if (sizeType === 'percentage') json.quantity = `${quantity}%`;
      else if (sizeType === 'usd') json.quantity = `${quantity} USD`;
      else {
        const q = String(quantity).trim();
        json.quantity = Number.isNaN(Number(q)) || q === '' ? q : parseFloat(q);
      }

      json.category = isFutures ? 'linear' : 'spot';

      if (orderType === 'limit' && n(price) !== null) json.price = n(price);

      if (isFutures) {
        // Take-profit entries: { price, amount } — amount is a NUMBER of base
        // tokens. The validator sums these and rejects the signal if the total
        // exceeds the order quantity.
        const valid = tps.filter((t) => n(t.price) !== null && n(t.amount) !== null);
        if (valid.length) {
          json.takeProfits = valid.map((t) => ({price: n(t.price), amount: n(t.amount)}));
        }

        if (slStrategy === 'simple' && n(stopLoss) !== null) {
          json.futurestopLoss =
            slType === 'limit' && n(stopLimitPrice) !== null
              ? {
                  slType: 'limit',
                  stopLossPrice: n(stopLoss),
                  stopLimitPrice: n(stopLimitPrice),
                  priceType: slPriceType,
                }
              : {slType: 'market', stopLossPrice: n(stopLoss), priceType: slPriceType};
        }

        if (slStrategy === 'slx') {
          json.slxChecked = true;
          if (slxMode === 'callback_rate') {
            if (n(callbackActivationPrice) !== null && n(callbackRate) !== null) {
              json.callBackStatus = true;
              json.callbackActivationPrice = n(callbackActivationPrice);
              json.callbackRate = n(callbackRate);
            }
          } else if (activationPoint) {
            json.trailingStatus = true;
            json.activationPoint = activationPoint;
            json.trailingType = slxTrailingType;
          }
        } else if (slStrategy === 'trailing') {
          if (n(trailingActivation) !== null && n(trailingCallback) !== null) {
            json.trailingStopLoss = {
              activationPrice: n(trailingActivation),
              callbackRate: n(trailingCallback),
              type: trailingType,
            };
          }
        } else if (slStrategy === 'breakeven') {
          if (n(breakEvenTrigger) !== null) {
            json.breakEven = {
              triggerPrice: n(breakEvenTrigger),
              offset: n(breakEvenOffset) ?? 0,
            };
          }
        }

        if (n(leverage) !== null) json.leverage = parseInt(leverage, 10);
        if (marginMode) json.marginMode = marginMode;
      }
    }

    if (action === 'update') {
      const valid = tps.filter((t) => n(t.price) !== null);
      if (valid.length > 1) {
        json.trailingStop = valid.map((t) => ({price: n(t.price), quantity: n(t.amount) ?? 0}));
      } else if (valid.length === 1) {
        json.takeProfit = n(valid[0].price);
      }
      if (n(stopLoss) !== null) json.stopLoss = n(stopLoss);
    }

    if (comment.trim()) json.comment = comment.trim();

    return json;
  }, [
    action, symbol, side, orderType, sizeType, quantity, price, isFutures, tps,
    slStrategy, slType, stopLoss, stopLimitPrice, slPriceType, slxMode,
    activationPoint, slxTrailingType, callbackActivationPrice, callbackRate,
    trailingActivation, trailingCallback, trailingType, breakEvenTrigger,
    breakEvenOffset, leverage, marginMode, comment, dynamic,
  ]);

  const json = useMemo(() => JSON.stringify(payload, null, 2), [payload]);
  const curl = useMemo(
    () =>
      [
        'curl -X POST "$METASTATION_WEBHOOK_URL" \\',
        '  -H "Content-Type: application/json" \\',
        `  -d '${JSON.stringify(payload)}'`,
      ].join('\n'),
    [payload],
  );

  const output = tab === 'curl' ? curl : json;

  const warnings = useMemo(() => {
    const w = [];
    if (action === 'open' && isFutures) {
      const totalTp = tps.reduce((s, t) => s + (n(t.amount) ?? 0), 0);
      const q = sizeType === 'token' ? n(quantity) : null;
      if (q !== null && totalTp > q) {
        w.push(`Take-profit amounts total ${totalTp}, which exceeds the order quantity ${q}. The signal will be rejected.`);
      }
      const partial = tps.some((t) => (n(t.price) === null) !== (n(t.amount) === null));
      if (partial) {
        w.push('A take-profit level has a price or an amount but not both. Each level needs an amount in base tokens — percentages and "remainder" are rejected.');
      }
      if (slStrategy === 'none') {
        w.push('No stop loss. An automated position without one has no defined worst case.');
      }
      if (marginMode === 'cross') {
        w.push('Cross margin puts the whole slot balance behind this position, not just its margin.');
      }
      if ((n(leverage) ?? 0) > 10) {
        w.push('Leverage above 10x turns a wrong signal into a liquidation rather than a loss.');
      }
    }
    if (action === 'open' && !isFutures && slStrategy !== 'none') {
      w.push('Stop loss, take profits and leverage are futures-only. They are omitted from a spot payload.');
    }
    return w;
  }, [action, isFutures, tps, sizeType, quantity, slStrategy, marginMode, leverage]);

  async function copy(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied('failed');
      setTimeout(() => setCopied(null), 1600);
    }
  }

  const setTp = (i, field, value) =>
    setTps((prev) => prev.map((t, idx) => (idx === i ? {...t, [field]: value} : t)));

  return (
    <div className={styles.builder}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Market</span>
          <select value={marketType} onChange={(e) => setMarketType(e.target.value)}>
            <option value="futures">Futures (linear)</option>
            <option value="spot">Spot</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Action</span>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            {ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Symbol</span>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="BTCUSDT" disabled={dynamic} />
        </label>

        <label className={styles.field}>
          <span>Side</span>
          <select value={side} onChange={(e) => setSide(e.target.value)} disabled={dynamic}>
            <option value="buy">Buy / Long</option>
            <option value="sell">Sell / Short</option>
          </select>
        </label>

        {action === 'open' && (
          <>
            <label className={styles.field}>
              <span>Order type</span>
              <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="market">Market</option>
                <option value="limit">Limit</option>
              </select>
              <small>Only market and limit pass validation</small>
            </label>

            {orderType === 'limit' && (
              <label className={styles.field}>
                <span>Limit price</span>
                <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
              </label>
            )}

            <label className={styles.field}>
              <span>Size</span>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="decimal" />
            </label>

            <label className={styles.field}>
              <span>Size type</span>
              <select value={sizeType} onChange={(e) => setSizeType(e.target.value)}>
                {SIZE_TYPES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <small>{SIZE_TYPES.find((s) => s.value === sizeType)?.hint}</small>
            </label>
          </>
        )}

        {action === 'open' && isFutures && (
          <>
            <label className={styles.field}>
              <span>Leverage</span>
              <input value={leverage} onChange={(e) => setLeverage(e.target.value)} inputMode="numeric" />
            </label>
            <label className={styles.field}>
              <span>Margin mode</span>
              <select value={marginMode} onChange={(e) => setMarginMode(e.target.value)}>
                <option value="isolated">Isolated — bounds the loss</option>
                <option value="cross">Cross — whole balance backs it</option>
              </select>
            </label>
          </>
        )}
      </div>

      {((action === 'open' && isFutures) || action === 'update') && (
        <div className={styles.block}>
          <strong className={styles.blockTitle}>Take profits</strong>
          <p className={styles.hint}>
            <code>amount</code> is a number of base tokens, and the total across levels must not
            exceed the order quantity. Percentages and <code>"remainder"</code> are rejected.
          </p>
          <div className={styles.tps}>
            {tps.map((t, i) => (
              <div className={styles.tpRow} key={i}>
                <span className={styles.tpLabel}>TP{i + 1}</span>
                <input
                  aria-label={`Take profit ${i + 1} price`}
                  value={t.price}
                  onChange={(e) => setTp(i, 'price', e.target.value)}
                  placeholder="price"
                  inputMode="decimal"
                />
                <input
                  aria-label={`Take profit ${i + 1} amount`}
                  value={t.amount}
                  onChange={(e) => setTp(i, 'amount', e.target.value)}
                  placeholder="amount (tokens)"
                  inputMode="decimal"
                />
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setTps((p) => p.filter((_, idx) => idx !== i))}
                  aria-label={`Remove take profit ${i + 1}`}
                  disabled={tps.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => setTps((p) => [...p, {price: '', amount: ''}])}
              disabled={tps.length >= 10}
            >
              + Add level {tps.length >= 10 && '(10 max)'}
            </button>
          </div>
        </div>
      )}

      {(action === 'open' ? isFutures : action === 'update') && (
        <div className={styles.block}>
          <div className={styles.grid}>
            {action === 'open' && (
              <label className={styles.field}>
                <span>Stop loss strategy</span>
                <select value={slStrategy} onChange={(e) => setSlStrategy(e.target.value)}>
                  {SL_STRATEGIES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
            )}

            {(action === 'update' || slStrategy === 'simple') && (
              <label className={styles.field}>
                <span>Stop loss price</span>
                <input value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} inputMode="decimal" />
              </label>
            )}

            {action === 'open' && slStrategy === 'simple' && (
              <>
                <label className={styles.field}>
                  <span>Stop loss type</span>
                  <select value={slType} onChange={(e) => setSlType(e.target.value)}>
                    <option value="market">Market — guaranteed fill</option>
                    <option value="limit">Limit — may not fill</option>
                  </select>
                </label>
                {slType === 'limit' && (
                  <label className={styles.field}>
                    <span>Stop limit price</span>
                    <input value={stopLimitPrice} onChange={(e) => setStopLimitPrice(e.target.value)} inputMode="decimal" />
                  </label>
                )}
                <label className={styles.field}>
                  <span>Trigger price type</span>
                  <select value={slPriceType} onChange={(e) => setSlPriceType(e.target.value)}>
                    <option value="mark">Mark</option>
                    <option value="last">Last</option>
                    <option value="index">Index</option>
                  </select>
                </label>
              </>
            )}

            {action === 'open' && slStrategy === 'slx' && (
              <>
                <label className={styles.field}>
                  <span>SLX mode</span>
                  <select value={slxMode} onChange={(e) => setSlxMode(e.target.value)}>
                    <option value="trailing_profits">Trailing profits (TP-based)</option>
                    <option value="callback_rate">Callback rate (price-based)</option>
                  </select>
                </label>
                {slxMode === 'trailing_profits' ? (
                  <>
                    <label className={styles.field}>
                      <span>Activate at TP</span>
                      <select value={activationPoint} onChange={(e) => setActivationPoint(e.target.value)}>
                        {tps.map((_, i) => (
                          <option key={i} value={String(i + 1)}>TP{i + 1}</option>
                        ))}
                      </select>
                    </label>
                    <label className={styles.field}>
                      <span>Trailing type</span>
                      <select value={slxTrailingType} onChange={(e) => setSlxTrailingType(e.target.value)}>
                        <option value="breakeven">Breakeven — SL to entry</option>
                        <option value="follow_tp">Follow TP — SL to previous level</option>
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <label className={styles.field}>
                      <span>Activation price</span>
                      <input value={callbackActivationPrice} onChange={(e) => setCallbackActivationPrice(e.target.value)} inputMode="decimal" />
                    </label>
                    <label className={styles.field}>
                      <span>Callback rate (%)</span>
                      <input value={callbackRate} onChange={(e) => setCallbackRate(e.target.value)} inputMode="decimal" />
                    </label>
                  </>
                )}
              </>
            )}

            {action === 'open' && slStrategy === 'trailing' && (
              <>
                <label className={styles.field}>
                  <span>Activation price</span>
                  <input value={trailingActivation} onChange={(e) => setTrailingActivation(e.target.value)} inputMode="decimal" />
                </label>
                <label className={styles.field}>
                  <span>Callback rate</span>
                  <input value={trailingCallback} onChange={(e) => setTrailingCallback(e.target.value)} inputMode="decimal" />
                </label>
                <label className={styles.field}>
                  <span>Trail by</span>
                  <select value={trailingType} onChange={(e) => setTrailingType(e.target.value)}>
                    <option value="percent">Percent</option>
                    <option value="price">Price</option>
                  </select>
                </label>
              </>
            )}

            {action === 'open' && slStrategy === 'breakeven' && (
              <>
                <label className={styles.field}>
                  <span>Trigger price</span>
                  <input value={breakEvenTrigger} onChange={(e) => setBreakEvenTrigger(e.target.value)} inputMode="decimal" />
                </label>
                <label className={styles.field}>
                  <span>Offset from entry</span>
                  <input value={breakEvenOffset} onChange={(e) => setBreakEvenOffset(e.target.value)} inputMode="decimal" />
                </label>
              </>
            )}

            <label className={styles.field}>
              <span>Comment (optional)</span>
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="strategy name" />
            </label>
          </div>
        </div>
      )}

      <label className={styles.check}>
        <input type="checkbox" checked={dynamic} onChange={(e) => setDynamic(e.target.checked)} />
        <span>
          Use TradingView placeholders — <code>{"{{ticker}}"}</code> and{" "}
          <code>{"{{strategy.order.action}}"}</code>, so one alert serves every symbol and both
          directions. Strategy alerts only for the side placeholder.
        </span>
      </label>

      {warnings.length > 0 && (
        <ul className={styles.warnings}>
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <div className={styles.output}>
        <div className={styles.tabs} role="tablist">
          {[
            ['json', 'JSON payload'],
            ['tradingview', 'TradingView alert'],
            ['curl', 'curl'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? styles.tabActive : styles.tab}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Outside the tablist on purpose: role="tablist" may only contain
            role="tab" children, and a stray button fails
            aria-required-children for the entire group. */}
        <div className={styles.actions}>
          <button type="button" className={styles.copyBtn} onClick={() => copy(output, tab)}>
            {copied === tab ? 'Copied' : copied === 'failed' ? 'Select and copy' : 'Copy'}
          </button>
        </div>

        {tab === 'tradingview' && (
          <p className={styles.note}>
            Paste this into the alert’s <strong>Message</strong> box, with your slot’s webhook URL
            in <strong>Webhook URL</strong>. Nothing else — comments or stray text break the parse.
          </p>
        )}

        <pre className={styles.code}>
          <code>{output}</code>
        </pre>
      </div>
    </div>
  );
}

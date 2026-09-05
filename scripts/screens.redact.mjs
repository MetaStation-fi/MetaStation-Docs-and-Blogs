/**
 * In-page redaction and leak assertion.
 *
 * Everything here is stringified and run inside the page, so it must be
 * self-contained: no imports, no closure over module scope.
 *
 * Two jobs, in order:
 *
 *  1. Redact. Sensitive values are masked in the DOM before the pixel is taken.
 *     This is pattern-based rather than selector-based on purpose - selectors
 *     rot every time the app is restyled, and a rotted selector fails silently
 *     by NOT redacting, which is the worst possible failure direction.
 *
 *  2. Assert. After redaction, the visible text must not contain a forbidden
 *     term. CI greps build/ for these strings, but CI cannot read a PNG - so
 *     this assertion is the only thing standing between a venue-name leak and
 *     production. It is a hard failure, never a warning.
 */

export const FORBIDDEN = ['hyperliquid', 'symbiosis', 'docs-origin'];

/** Runs in the page. Returns a report. */
export function redactInPage(config) {
  const { forbidden, extraSelectors } = config;
  const MASK = '•';
  const report = { masked: [], hidden: 0, leaks: [] };

  const PATTERNS = [
    { name: 'email', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
    { name: 'evm-address', re: /\b0x[a-fA-F0-9]{40}\b/g },
    { name: 'tx-hash', re: /\b0x[a-fA-F0-9]{64}\b/g },
    { name: 'btc-address', re: /\b(bc1[a-z0-9]{25,62}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/g },
    { name: 'solana-address', re: /\b[1-9A-HJ-NP-Za-km-z]{43,44}\b/g },
    { name: 'tron-address', re: /\bT[1-9A-HJ-NP-Za-km-z]{33}\b/g },
    { name: 'jwt', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
    // Webhook secret: the path segment after /webhook/. The single most
    // sensitive string the app renders - anyone holding it can post signals.
    { name: 'webhook-token', re: /(\/webhook\/)[A-Za-z0-9_-]{8,}/g, replace: (m, p1) => p1 + MASK.repeat(24) },
    { name: 'api-key-like', re: /\b[A-Za-z0-9]{32,}\b/g },
    // Platform account ids (MET_66241, BYB_1234...). Short and structured, so
    // none of the address/key patterns above catch them, but the register calls
    // for redacting account ids on the slots and management screens.
    { name: 'account-id', re: /\b(MET|BYB|BIN|KUC|MS)[_-]\d{3,}\b/g },
  ];

  function maskText(text) {
    let out = text;
    for (const p of PATTERNS) {
      out = out.replace(p.re, (...args) => {
        report.masked.push(p.name);
        if (p.replace) return p.replace(...args);
        const m = args[0];
        // Keep a short prefix so the shape stays recognisable in the docs.
        const keep = m.length > 12 ? 4 : 0;
        return m.slice(0, keep) + MASK.repeat(Math.min(m.length - keep, 18));
      });
    }
    return out;
  }

  // --- 1. mask text nodes ---------------------------------------------------
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  for (const node of textNodes) {
    const parent = node.parentElement;
    if (!parent) continue;
    const tag = parent.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;
    const masked = maskText(node.nodeValue);
    if (masked !== node.nodeValue) node.nodeValue = masked;
  }

  // --- 2. mask input values -------------------------------------------------
  for (const el of document.querySelectorAll('input, textarea')) {
    const type = (el.getAttribute('type') || '').toLowerCase();
    const name = ((el.getAttribute('name') || '') + ' ' + (el.getAttribute('placeholder') || '') + ' ' + (el.id || '')).toLowerCase();
    const sensitive = type === 'password' ||
      /key|secret|passphrase|token|address|email|seed|mnemonic|code/.test(name);
    if (!el.value) continue;

    const patterned = maskText(el.value);
    if (patterned !== el.value) {
      // Structure survives, the secret does not. A reader needs to see that a
      // webhook URL looks like
      //   https://metastation.fi/metastationapi/socialTrade/webhook/••••
      // Blanking the whole field would hide the endpoint the docs are teaching.
      el.value = patterned;
      report.masked.push('input:patterned');
    } else if (sensitive) {
      el.value = MASK.repeat(Math.min(el.value.length, 20));
      report.masked.push('input:' + (name.trim().split(/\s+/)[0] || type || 'field'));
    }
  }

  // --- 3. caller-supplied selectors ----------------------------------------
  for (const sel of extraSelectors || []) {
    for (const el of document.querySelectorAll(sel)) {
      el.style.filter = 'blur(7px)';
      report.masked.push('selector:' + sel);
    }
  }

  // --- 4. QR codes ----------------------------------------------------------
  // A QR in a docs image is machine-readable by anyone who finds it. Blur any
  // canvas/svg/img whose context suggests a code, regardless of shot.
  for (const el of document.querySelectorAll('canvas, svg, img')) {
    const ctx = ((el.getAttribute('alt') || '') + ' ' + (el.className || '') + ' ' + (el.id || '')).toString().toLowerCase();
    if (/qr|totp|authenticator/.test(ctx)) {
      el.style.filter = 'blur(12px)';
      report.masked.push('qr');
    }
  }

  // --- 5. neutralise forbidden terms ---------------------------------------
  // Hide the smallest element that carries a forbidden term, so a venue tab
  // disappears rather than the whole switcher.
  for (const term of forbidden) {
    let guard = 0;
    while (guard++ < 200) {
      const all = Array.from(document.body.querySelectorAll('*'));
      const hit = all.filter((el) => {
        // Mark what we have handled. Elements hidden with visibility:hidden
        // still report a non-null offsetParent, so without this the loop
        // re-matches them every pass and burns the guard (it "hid" 401 nodes
        // on a page with three).
        if (el.dataset.msRedacted) return false;
        if (el.offsetParent === null && el.tagName !== 'BODY') return false;
        const own = Array.from(el.childNodes)
          .filter((n) => n.nodeType === 3)
          .map((n) => n.nodeValue)
          .join(' ');
        const attrs = (el.getAttribute('alt') || '') + ' ' + (el.getAttribute('title') || '') + ' ' + (el.getAttribute('aria-label') || '');
        return (own + ' ' + attrs).toLowerCase().includes(term);
      });
      if (!hit.length) break;
      for (const el of hit) {
        const target = el.closest('li, [role="tab"], button, a, td, tr, .card, [class*="item"]') || el;
        // In a table, display:none collapses the cell and every value to its
        // right slides one column left - the row then reads as if the account
        // id were the exchange. visibility:hidden holds the column open.
        const inTable = /^(TD|TH)$/.test(target.tagName);
        if (inTable) {
          target.style.visibility = 'hidden';
        } else {
          target.style.display = 'none';
        }
        target.dataset.msRedacted = '1';
        el.dataset.msRedacted = '1';
        report.hidden++;
      }
    }
  }

  // --- 6. assert ------------------------------------------------------------
  const visible = (document.body.innerText || '').toLowerCase();
  for (const term of forbidden) {
    if (visible.includes(term)) report.leaks.push(term);
  }

  return report;
}

/** Stabilise the page so two runs of the same shot differ only where the data does. */
export function stabiliseInPage() {
  // CRA's dev-server error overlay is an iframe injected on top of the app. It
  // is tooling, not product UI, so it must never appear in a doc image. It is
  // removed rather than hidden so a later emptiness check sees the real page.
  // The underlying runtime error is still reported by the runner - stripping
  // the overlay hides the artifact, never the fact that it happened.
  for (const el of document.querySelectorAll(
    'iframe#webpack-dev-server-client-overlay, [id*="webpack-dev-server"], [class*="webpack-dev-server"]'
  )) {
    el.remove();
  }

  // The app's own error toasts for local-only failures. AppKit refuses to
  // initialise because localhost is not in its allowed-origins list, so the
  // toast is an artifact of capturing against a dev origin and does not happen
  // on metastation.fi. This strips the toast, not the finding: the runner still
  // records the runtime error against the shot.
  const DEV_ARTIFACTS = /createAppKit|useAppKit|Uncaught runtime|ChunkLoadError/i;
  for (const el of Array.from(document.body.querySelectorAll('*'))) {
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.nodeValue)
      .join(' ');
    if (own && DEV_ARTIFACTS.test(own)) {
      const box = el.closest(
        '[class*="toast"], [class*="Toast"], [class*="notification"], [class*="alert"], [role="alert"], [role="status"]'
      ) || el;
      // Hiding the message alone leaves the toast shell and its close button
      // floating as an empty red box, so climb to the shell that owns the
      // dismiss control and hide that instead.
      let shell = box;
      for (let up = 0; up < 4 && shell.parentElement; up++) {
        const p = shell.parentElement;
        const text = (p.innerText || '').trim();
        const hasDismiss = p.querySelector('button, [aria-label*="close" i], [aria-label*="dismiss" i]');
        if (hasDismiss && text.length < 240) shell = p; else break;
      }
      // Hide, never remove. Detaching a node React still owns makes React throw
      // on its next render and trips the app's error boundary - which is
      // exactly how this line first went wrong, replacing the whole page with
      // "Oops! Something went wrong". The dev-server overlay above is safe to
      // remove because React does not own it.
      shell.style.display = 'none';
    }
  }

  // Hiding a toast's message can leave its shell behind as an empty coloured
  // box with a lone close button. Sweep up any toast-ish container that no
  // longer has visible text.
  for (const el of document.querySelectorAll(
    '[class*="toast" i], [class*="notification" i], [role="alert"], [role="status"]'
  )) {
    if (!(el.innerText || '').trim() && el.getBoundingClientRect().width > 0) {
      el.style.display = 'none';
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      caret-color: transparent !important;
    }
    /* Chat bubbles, cookie bars and toasts are never wanted in a doc image. */
    [class*="intercom"], [id*="intercom"], [class*="crisp"], [class*="toast"],
    [class*="Toastify"], [class*="cookie"] { display: none !important; }
  `;
  document.documentElement.appendChild(style);
  // Deliberately does NOT reset scroll. It used to call window.scrollTo(0, 0)
  // here, which ran after the runner's scrollTo step and silently undid it -
  // the webhook URL stayed below the fold through three separate "fixes" to
  // the selector before the reset turned out to be the cause.
}

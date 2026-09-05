/**
 * Interaction routines for shots that need a state deeper than a route load.
 *
 * Contract: reach the target state, or throw. A prep routine that cannot find
 * its control MUST NOT fall through to capturing the underlying page - a
 * screenshot showing the wrong screen is worse in the docs than a missing one,
 * because nobody notices it is wrong.
 *
 * Locators are text- and role-based rather than class-based. The app is about
 * to be restyled; accessible names survive that, CSS module hashes do not.
 */

const CLICK_TIMEOUT = 8000;

/** Click the first locator that resolves, else throw naming everything tried. */
async function clickFirst(page, candidates, what) {
  const tried = [];
  for (const c of candidates) {
    const loc = typeof c === 'string' ? page.locator(c) : c(page);
    tried.push(typeof c === 'string' ? c : '(fn)');
    try {
      const n = await loc.count();
      if (!n) continue;
      const el = loc.first();
      if (!(await el.isVisible())) continue;
      await el.click({ timeout: CLICK_TIMEOUT });
      await page.waitForTimeout(900);
      return true;
    } catch {
      /* try the next candidate */
    }
  }
  throw new Error(`prep: could not find ${what}. Tried: ${tried.join(' | ')}`);
}

async function fillFirst(page, candidates, value, what) {
  for (const sel of candidates) {
    const loc = page.locator(sel).first();
    try {
      if ((await loc.count()) && (await loc.isVisible())) {
        await loc.fill(value, { timeout: CLICK_TIMEOUT });
        await page.waitForTimeout(400);
        return true;
      }
    } catch {
      /* next */
    }
  }
  throw new Error(`prep: could not fill ${what}`);
}

/**
 * The advanced order controls (SL / TP / SLX) do not exist in the DOM until
 * Pro Mode is on — which is why every one of these preps used to fail looking
 * for a Take Profit control on a page that had never rendered one.
 *
 * The switch hides a zero-size checkbox behind a styled slider, so the click
 * has to land on the slider, exactly where a user would put it. Idempotent:
 * if Pro Mode is already on, this leaves it on.
 */
async function enableProMode(page) {
  const input = page.locator('.ms-switch input').first();
  if (await input.count()) {
    if (await input.isChecked()) return;
    await page.locator('.ms-switch__slider').first().click({ timeout: CLICK_TIMEOUT });
    await page.waitForTimeout(1200);
    if (await input.isChecked()) return;
  }
  throw new Error('prep: could not enable Pro Mode (no .ms-switch on the page)');
}

export const preps = {
  async bridgeQuote(page) {
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /select (network|chain)/i }),
      (p) => p.getByText(/select (network|chain)/i),
      '[class*="network"] button',
    ], 'the network picker');
    await fillFirst(page, ['input[type="number"]', 'input[placeholder*="mount" i]'], '100', 'the amount field');
    await page.waitForTimeout(2500); // let the quote come back
  },

  async addSlots(page) {
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /add slot/i }),
      (p) => p.getByText(/add slots?/i),
    ], 'the Add Slots control');
  },

  async apiKeyForm(page) {
    // The API-key form is behind "Add Slots" — there is no "connect exchange"
    // control on this page, which is what the old locators were hunting for.
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /add slots?/i }),
      (p) => p.getByText(/add slots?/i),
    ], 'the Add Slots control');
    // Then the exchange picker inside the dialog.
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /binance|bybit|kucoin/i }),
      (p) => p.getByText(/binance|bybit|kucoin/i),
    ], 'an exchange in the Add Slots dialog');
  },

  async copySettings(page) {
    // /social-trade/copy-settings renders "Loading providers" forever without
    // ?id=<providerId>&type=<providerType>. Rather than hardcode a provider id
    // that may be deleted, start on the marketplace and take the same route a
    // user does — the card's own Subscribe/Allocate button carries the params.
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /^subscribe$|^allocate$/i }),
      (p) => p.getByText(/^subscribe$|^allocate$/i),
    ], 'a provider Subscribe/Allocate button');
    await page.waitForTimeout(2500);
  },

  async tpLadder(page) {
    await enableProMode(page);
    await clickFirst(page, [
      (p) => p.getByText(/^tp$/i),
      (p) => p.getByText(/take profit/i),
      (p) => p.getByRole('tab', { name: /^tp$|take profit/i }),
    ], 'the Take Profit control');
  },

  async trailingStop(page) {
    // Pro Mode *is* the trailing/advanced order mode — the toggle sets
    // `trailingChecked` in the place-order component. Turning it on is the
    // state this shot documents.
    await enableProMode(page);
  },

  async slxSetup(page) {
    await enableProMode(page);
    await clickFirst(page, [
      (p) => p.getByText(/^slx$/i),
      (p) => p.getByRole('tab', { name: /^slx$/i }),
    ], 'the SLX control');
  },

  async regenerateSecret(page) {
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /regenerate/i }),
      (p) => p.getByText(/regenerate secret/i),
    ], 'the Regenerate Secret button');
  },

  // The signal log is a tab on /history, not a panel on the webhook page.
  async webhookHistory(page) {
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /signal history/i }),
      (p) => p.getByText(/^signal history$/i),
    ], 'the Signal History tab on /history');
    await page.waitForTimeout(1800);
  },

  async providerDetail(page) {
    await page.waitForTimeout(2000);
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /view|details|copy/i }),
      '[class*="provider"] a',
      '[class*="card"] a',
    ], 'the first provider card');
    await page.waitForTimeout(2000);
  },

  // /withdraw renders only the address field until a coin is chosen - there is
  // no amount input to fill before that. Select a coin first, then fill.
  // Every mutating request is blocked by the runner, so the submit reaches the
  // confirmation state without moving funds.
  async withdraw2fa(page) {
    await clickFirst(page, [
      (p) => p.getByText(/^select coin$/i),
      (p) => p.getByRole('button', { name: /select coin/i }),
    ], 'the Select Coin control');
    await clickFirst(page, [
      (p) => p.getByText(/^usdt$/i),
      (p) => p.getByRole('option').first(),
      '[role="option"]',
      'li',
    ], 'a coin in the coin list');
    await fillFirst(
      page,
      ['input[type="number"]', 'input[placeholder*="mount" i]', 'input[placeholder*="wallet" i]'],
      '10',
      'the withdrawal amount',
    );
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /^withdraw$/i }),
      (p) => p.getByRole('button', { name: /continue|next|submit/i }),
    ], 'the withdraw submit button');
  },

  async historyWithdrawals(page) {
    await clickFirst(page, [
      (p) => p.getByRole('tab', { name: /withdraw/i }),
      (p) => p.getByText(/^withdrawals?$/i),
    ], 'the withdrawals tab');
    await page.waitForTimeout(1500);
  },
};

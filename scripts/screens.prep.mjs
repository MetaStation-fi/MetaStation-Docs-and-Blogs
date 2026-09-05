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
    await clickFirst(page, [
      (p) => p.getByRole('button', { name: /connect|add (account|exchange)|api key/i }),
      (p) => p.getByText(/connect exchange|add api key/i),
    ], 'the connect-exchange control');
  },

  async tpLadder(page) {
    await clickFirst(page, [
      (p) => p.getByText(/take profit|^tp$/i),
      (p) => p.getByRole('tab', { name: /tp|take profit/i }),
      (p) => p.getByRole('checkbox', { name: /tp|take profit/i }),
    ], 'the Take Profit control');
  },

  async trailingStop(page) {
    await clickFirst(page, [
      (p) => p.getByText(/trailing/i),
      (p) => p.getByRole('tab', { name: /trailing/i }),
    ], 'the trailing stop control');
  },

  async slxSetup(page) {
    await clickFirst(page, [
      (p) => p.getByText(/slx/i),
      (p) => p.getByRole('tab', { name: /slx/i }),
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

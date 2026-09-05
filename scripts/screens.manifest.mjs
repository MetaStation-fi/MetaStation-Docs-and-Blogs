/**
 * Screenshot register, mechanised.
 *
 * Mirrors the table in PLACEHOLDERS.md. `id` is the filename stem and must stay
 * in step with the SCREENSHOT marker left in the corresponding doc.
 *
 * mode:
 *   'auto'   - a plain route load; the runner navigates and captures.
 *   'prep'   - needs interaction first; a named routine in prep.mjs drives it.
 *   'manual' - cannot or must not be automated. Reported, never captured.
 *
 * annotate: callouts. Each draws a ring plus a numbered badge on the image; the
 * text is composed into a legend BELOW the screenshot, never over it. Either an
 * array, or an object keyed by viewport when the layout differs enough that the
 * desktop set does not fit a 390px screen.
 *
 * Targets come from scripts/screens-discover.mjs, which reads them off the live
 * pages. Do not invent selectors here - a missing target fails the whole shot.
 */

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true },
};

export const shots = [
  // ---- getting-started ----------------------------------------------------
  {
    id: 'register-form', section: 'getting-started', doc: 'create-account.md',
    url: '/register', mode: 'auto', anon: true,
    annotate: [
      { at: 'text=Email Address *', label: 'The email you verify here becomes your login and receives withdrawal confirmations' },
      { at: 'text=Referral Code (Optional)', label: 'Optional — leave blank if nobody referred you. It cannot be added after the account exists.' },
      { at: 'text=Continue with Google', label: 'Google and Telegram sign-up create the same account type as email — not a limited one' },
    ],
    note: 'Register form, captured empty. Filling it to "just before submit" would bake a real email into the image.',
  },
  {
    id: 'google-signin', section: 'getting-started', doc: 'create-account.md',
    url: '/login', mode: 'auto', anon: true,
    annotate: [
      { at: 'text=Continue with Google', label: 'Signs in with Google. Use the same method you registered with — the accounts are not merged.' },
      { at: 'text=Sign In', label: 'Email sign-in. Wrong method for an existing account gives "no account found", not a merge prompt.' },
    ],
    note: 'Login page showing the Continue with Google button.',
  },
  {
    id: 'verify-email', section: 'getting-started', doc: 'create-account.md',
    url: '/verify', mode: 'auto', anon: true,
    annotate: [
      { at: 'text=Enter Verification Code', label: 'The code is emailed on registration. Nothing else in the account works until it is entered.' },
    ],
    note: 'Post-registration verification-pending state.',
  },
  {
    id: 'deposit-picker', section: 'getting-started', doc: 'fund-account.md',
    url: '/deposit', mode: 'auto',
    annotate: [
      { at: 'text=Select coin to deposit', label: 'Pick the asset you are sending. Deposits arrive in the Funding Wallet as USDC.' },
      { at: 'text=Select a network', label: 'The network must match the one you send on. Sending on a different chain loses the funds.' },
      { at: 'text=Deposit details', label: 'The generated address is specific to this coin and network pair' },
    ],
    note: 'Deposit screen with the network and asset picker.',
  },
  {
    id: 'bridge-quote', section: 'getting-started', doc: 'fund-account.md',
    url: '/deposit', mode: 'prep', prep: 'bridgeQuote',
    note: 'Quote screen with an estimated received amount.',
  },
  {
    id: 'funding-wallet-status', section: 'getting-started', doc: 'fund-account.md',
    url: '/assets', mode: 'auto',
    annotate: [
      { at: 'text=TOTAL ASSET', label: 'Total across both wallets, valued in USDC' },
      { at: 'text=Funding', label: 'Funding Wallet — where deposits land. Funds must be transferred before they can trade.' },
      { at: 'text=Unified Trading', label: 'Unified Trading Wallet — the balance orders actually draw on' },
    ],
    note: 'Funding Wallet address and activation state.',
  },
  {
    id: 'buy-crypto', section: 'getting-started', doc: 'fund-account.md',
    url: '/buy-crypto', mode: 'auto',
    annotate: [
      { at: 'text=Crypto Swap', label: 'Buys crypto with fiat through a third-party provider, then credits the Funding Wallet' },
      { at: 'text=Exchange', label: 'Rate and fees are quoted before you commit' },
    ],
    note: 'Buy Crypto entry screen.',
  },
  {
    id: 'first-trade', section: 'getting-started', doc: 'quick-start.md',
    url: '/trade', mode: 'auto', settle: 4000,
    annotate: {
      desktop: [
        { at: 'text=Order Book', label: 'Live book for the selected pair. Asks above, bids below.' },
        { at: 'text=Limit', label: 'Limit needs a price and rests on the book; Market takes the best available price now' },
        { at: 'text=Available balance', label: 'Drawn from the Unified Trading Wallet, not the Funding Wallet' },
      ],
      mobile: [
        { at: 'text=Order Book', label: 'Live book for the selected pair. Asks above, bids below.' },
      ],
    },
    note: 'Trade terminal with the order ticket. Never submitted.',
  },

  // ---- trading ------------------------------------------------------------
  {
    id: 'account-overview', section: 'trading', doc: 'metastation-account.md',
    url: '/dashboard', mode: 'auto',
    annotate: [
      { at: 'text=Equity', label: 'Equity includes unrealised PnL; Available Balance is what a new order can use' },
      { at: 'text=Hide Low Balance', label: 'Hides dust so the table shows only balances worth acting on' },
    ],
    note: 'Account overview panel.',
  },
  {
    id: 'orderbook', section: 'trading', doc: 'metastation-account.md',
    url: '/trade', mode: 'auto', settle: 5000,
    annotate: {
      desktop: [
        { at: 'text=Order Book', label: 'Asks above, bids below — the depth bars scale to the largest order in view' },
        { at: 'text=Good-Till-Canceled', label: 'Time in force. GTC rests until filled or cancelled.' },
        { at: 'text=Enable Trading', label: 'Shown until the account is authorised for trading; it becomes Buy/Sell once enabled' },
      ],
      mobile: [
        { at: 'text=Order Book', label: 'Asks above, bids below' },
      ],
    },
    note: 'Live order book. Extra settle time so the venue socket has filled the ladder.',
  },
  {
    id: 'positions-panel', section: 'trading', doc: 'metastation-account.md',
    url: '/future', mode: 'auto', settle: 5000,
    note: 'Open positions panel. NOTE: /future currently renders the app error boundary — see the run report.',
  },
  {
    id: 'account-management', section: 'trading', doc: 'connect-exchange.md',
    url: '/social-trade/account-management', mode: 'auto',
    annotate: [
      { at: 'text=Add Slots', label: 'Add a trading slot before connecting an exchange — a slot is what an API key attaches to' },
      { at: 'text=Status', label: 'Pending Auth means the slot exists but no API key is authorised on it yet' },
    ],
    note: 'Account Management, Trading Slots table.',
  },
  {
    id: 'slots-overview', section: 'trading', doc: 'account-slots.md',
    url: '/social-trade/account-management', mode: 'auto',
    annotate: [
      { at: 'text=Trading Slots', label: 'One row per slot. Each slot holds one exchange connection.' },
      { at: 'text=Exchange', label: 'The venue the slot is bound to; the MetaStation Account above needs no slot' },
      { at: 'text=Account ID', label: 'Identifies the slot in webhook and copy-trading settings' },
    ],
    note: 'Trading Slots table with mixed slot types.',
  },
  {
    id: 'add-slots', section: 'trading', doc: 'connect-exchange.md',
    url: '/social-trade/account-management', mode: 'prep', prep: 'addSlots',
    note: 'Add Slots dialog.',
  },
  {
    id: 'api-key-form', section: 'trading', doc: 'connect-exchange.md',
    url: '/social-trade/account-management', mode: 'prep', prep: 'apiKeyForm',
    note: 'Per-exchange API key form. Key, secret and passphrase fields masked.',
  },
  {
    id: 'store-slots', section: 'trading', doc: 'account-slots.md',
    url: '/store', mode: 'auto',
    annotate: [
      { at: 'text=Select Exchange', label: 'A slot is bought per exchange — it is not transferable between venues' },
      { at: 'text=Choose Your Plan', label: 'Billing term for the slot. The MetaStation Account is active by default at no cost.' },
    ],
    note: 'Store slot purchase screen.',
  },
  {
    id: 'tp-ladder', section: 'trading', doc: 'advanced-orders.md',
    url: '/future', mode: 'prep', prep: 'tpLadder',
    note: '10-TP configuration UI. Blocked: /future renders the error boundary.',
  },
  {
    id: 'trailing-stop', section: 'trading', doc: 'advanced-orders.md',
    url: '/future', mode: 'prep', prep: 'trailingStop',
    note: 'Trailing stop configuration. Blocked: /future renders the error boundary.',
  },
  {
    id: 'slx-setup', section: 'trading', doc: 'advanced-orders.md',
    url: '/future', mode: 'prep', prep: 'slxSetup',
    note: 'SLX setup. Blocked: /future renders the error boundary.',
  },

  // ---- automation ---------------------------------------------------------
  {
    id: 'webhook-urls', section: 'automation', doc: 'webhook-trading.md',
    url: '/social-trade/webhook-management', mode: 'auto',
    // The rendered "WEBHOOK URL" is text-transform:uppercase over DOM text
    // "Webhook URL", so a text match is unreliable and also collides with the
    // "Your Webhook URLs" heading. The label carries a stable class.
    scrollTo: '.webhook-label',
    annotate: [
      { at: '.webhook-label', label: 'One webhook URL per trading account — the account a signal hits is chosen by the URL, not the payload' },
      { at: 'text=Regenerate Secret', label: 'Regenerating invalidates the old URL immediately. Every signal source must be updated.' },
      { at: 'text=Total Signals', label: 'Counts signals received on this URL, including ones that failed to parse' },
    ],
    note: 'Your Webhook URLs. The app masks the URL itself behind a reveal/copy control.',
  },
  {
    id: 'regenerate-secret', section: 'automation', doc: 'webhook-trading.md',
    url: '/social-trade/webhook-management', mode: 'prep', prep: 'regenerateSecret',
    note: 'Regenerate Secret confirmation state. The runner blocks the POST so nothing is actually regenerated.',
  },
  {
    id: 'webhook-history', section: 'automation', doc: 'webhook-trading.md',
    url: '/history', mode: 'prep', prep: 'webhookHistory',
    annotate: [
      { at: 'text=Signal History', label: 'Every received signal with its parse result — the first place to look when a webhook did not trade' },
    ],
    note: 'Signal log. Lives on /history under the Signal History tab, not on the webhook page.',
  },
  {
    id: 'tv-alert-dialog', section: 'automation', doc: 'tradingview-setup.md',
    mode: 'manual',
    note: 'TradingView alert dialog. Lives on tradingview.com, outside our app. Capture by hand.',
  },
  {
    id: 'tg-channel-binding', section: 'automation', doc: 'telegram-to-trade.md',
    mode: 'manual',
    note: 'Channel binding happens inside the Telegram client, not the web app.',
  },
  {
    id: 'tg-parse-preview', section: 'automation', doc: 'telegram-to-trade.md',
    mode: 'manual',
    note: 'Signal parse preview inside Telegram.',
  },

  // ---- social-trading -----------------------------------------------------
  {
    id: 'marketplace-grid', section: 'social-trading', doc: 'browse-marketplace.md',
    url: '/social-trade/marketplace', mode: 'auto',
    annotate: [
      { at: 'text=All Providers', label: 'Filter between signal providers and fund managers — they are copied on different terms' },
      { at: 'text=Leaderboard', label: 'Ranks providers by performance; the grid below is the full list' },
    ],
    note: 'Provider grid.',
  },
  {
    id: 'provider-detail', section: 'social-trading', doc: 'browse-marketplace.md',
    url: '/social-trade/marketplace', mode: 'prep', prep: 'providerDetail',
    note: 'Provider detail card and performance chart, reached by clicking the first grid card — provider ids are not stable.',
  },
  {
    id: 'copy-settings', section: 'social-trading', doc: 'copy-settings.md',
    url: '/social-trade/copy-settings', mode: 'auto',
    note: 'Copy settings form. NOTE: renders only a heading — see the run report.',
  },
  {
    id: 'provider-onboarding', section: 'social-trading', doc: 'become-provider.md',
    url: '/social-trade/become-provider', mode: 'auto',
    annotate: [
      { at: 'text=Agreement', label: 'Four steps, in order. The agreement must be accepted before the rest unlocks.' },
      { at: 'text=Provider Type', label: 'Signal provider or fund manager — this choice sets how subscribers are charged' },
    ],
    note: 'Provider onboarding form.',
  },
  {
    id: 'provider-dashboard', section: 'social-trading', doc: 'become-provider.md',
    url: '/social-trade/provider-management', mode: 'auto',
    annotate: [
      { at: 'text=All Providers', label: 'Providers you run, split by type. Empty until an onboarding is approved.' },
    ],
    note: 'Provider dashboard.',
  },

  // ---- wallet -------------------------------------------------------------
  {
    id: 'deposit-flow', section: 'wallet', doc: 'deposit.md',
    url: '/deposit', mode: 'auto',
    annotate: [
      { at: 'text=Deposit details', label: 'Deposits credit the Funding Wallet as USDC regardless of the chain sent on' },
      { at: 'text=Recent Deposits', label: 'Confirmations appear here. Address and TxID are truncated by the app itself.' },
    ],
    note: 'Deposit screen, MetaStation Account destination.',
  },
  {
    id: 'withdraw-form', section: 'wallet', doc: 'withdraw.md',
    url: '/withdraw', mode: 'auto',
    annotate: [
      { at: 'text=Select Coin', label: 'Withdrawals are narrower than deposits — USDT, BTC, ETH, SOL, TRX and TON only' },
      { at: 'text=Wallet Address', label: 'Checked against the selected network. A mismatched chain is rejected, not recovered.' },
      { at: 'text=Withdraw Amount', label: 'Network fee is deducted from this amount, not added to it' },
    ],
    note: 'Withdraw form.',
  },
  {
    id: 'withdraw-2fa', section: 'wallet', doc: 'withdraw.md',
    url: '/withdraw', mode: 'prep', prep: 'withdraw2fa',
    note: 'Confirm withdrawal dialog with both code fields. The runner blocks the submit.',
  },
  {
    id: 'history-withdrawals', section: 'wallet', doc: 'withdraw.md',
    url: '/withdraw', mode: 'auto', scrollTo: 'text=Recent Withdrawals',
    annotate: [
      { at: 'text=Recent Withdrawals', label: 'Withdrawal history lives on the Withdraw page — /history has no withdrawals tab' },
    ],
    note: 'Withdrawal history. Retargeted: the register said History → withdrawals tab, but /history only has Order, Trade, Deposit and Signal tabs.',
  },

  // ---- security -----------------------------------------------------------
  {
    id: '2fa-enable', section: 'security', doc: 'two-factor-auth.md',
    url: '/security', mode: 'auto',
    annotate: [
      { at: 'text=Google Authenticator', label: 'Time-based OTP. Enabling it is required before withdrawals are permitted.' },
    ],
    note: 'Security page, Google Authenticator card.',
  },
  {
    id: 'security-page', section: 'security', doc: 'session-management.md',
    url: '/security', mode: 'auto',
    annotate: [
      { at: 'text=Google Authenticator', label: 'Second factor for login and withdrawal confirmation' },
      { at: 'text=Password', label: 'Changing the password does not sign out other devices — there is no session list to revoke from' },
    ],
    note: 'Security page, both cards.',
  },
  {
    id: '2fa-qr', section: 'security', doc: 'two-factor-auth.md',
    mode: 'manual',
    note: 'QR plus manual secret. Deliberately not automated: capturing a real TOTP seed writes a working second factor into a public image. Shoot against a throwaway account by hand.',
  },
];

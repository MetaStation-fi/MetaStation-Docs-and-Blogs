# Placeholder markers — asset & design registry

Inline markers left in the docs so later phases (screenshots, design, interactive components)
are mechanical instead of archaeological. **Not published** — this file lives at the repo root,
outside `docs/`, so Docusaurus never builds it.

## Marker syntax

Docusaurus 3 parses `.md` as MDX, so HTML comments (`<!-- -->`) **break the build**. Every marker
uses a JSX comment instead:

```jsx
{/* SCREENSHOT: id | what to capture | viewport | redact */}
```

Markers render nothing. Grep for them:

```bash
grep -rn "{/\* SCREENSHOT" docs/          # everything still outstanding
grep -rn "{/\* \(DESIGN\|EFFECT\|ICON\)" docs/ src/
```

## Marker types

| Marker | Means | Phase |
|---|---|---|
| `SCREENSHOT` | A real platform capture goes here | 3 |
| `DIAGRAM` | A mermaid or SVG diagram goes here | 3 |
| `COMPONENT` | An interactive MDX React component goes here | 4 |
| `EFFECT` | A Canvas UI hero effect — marketing surfaces only, never doc content | 2 |
| `ICON` | Replace an emoji or placeholder with an inline lucide SVG | 1 |
| `FAQ` | A per-section FAQ block + `FAQPage` JSON-LD | 3 |
| `DESIGN` | A styling decision deferred to the design pass | 1–2 |

## Screenshot conventions

- **Output:** `static/img/screens/<section>/<id>.png`
- **Served from:** jsDelivr, tag-pinned —
  `https://cdn.jsdelivr.net/gh/MetaStation-fi/MetaStation-Docs-and-Blogs@<tag>/static/img/screens/...`
  Never `@main` — it is mutable and cached hard.
- **Viewports:** `1440x900` desktop, `390x844` for Telegram Mini App screens
- **Every embed needs explicit `width`/`height`** or it costs CLS, which feeds Core Web Vitals,
  which feeds the ranking goal this project exists for.
- **Redaction is non-negotiable.** A capture containing a real address or key is a permanent leak
  the moment it is indexed. Default redaction set: email, account id, wallet address, Funding
  Wallet address, API key/secret/passphrase fields, webhook URL token.
- **Brand assertion:** the capture run fails if any captured DOM contains the venue name.

## Screenshot register

Grouped by doc. `id` is the filename stem.

### getting-started/

| id | Doc | Capture | Redact |
|---|---|---|---|
| `register-form` | create-account.md | `/register` filled to just-before-submit | email |
| `google-signin` | create-account.md | Login page, Continue with Google button | — |
| `verify-email` | create-account.md | Post-registration verification-pending state | email |
| `deposit-picker` | fund-account.md | Deposit screen, network + asset picker open | Funding Wallet address |
| `bridge-quote` | fund-account.md | Quote screen with estimated received amount | address, balance |
| `funding-wallet-status` | fund-account.md | Funding Wallet address + activation state | address |
| `buy-crypto` | fund-account.md | Buy Crypto / Transak entry screen | — |
| `first-trade` | quick-start.md | Trade terminal, order ticket filled, not submitted | balance |

### trading/

| id | Doc | Capture | Redact |
|---|---|---|---|
| `account-overview` | metastation-account.md | MetaStation Account overview panel | balance, address |
| `orderbook` | metastation-account.md | Live on-chain order book | — |
| `positions-panel` | metastation-account.md | Open positions (batch with other live captures) | size, PnL optional |
| `account-management` | connect-exchange.md | Account Management → Trading Slots table | account ids |
| `add-slots` | connect-exchange.md | Add Slots dialog | — |
| `api-key-form` | connect-exchange.md | Per-exchange key form | key, secret, passphrase |
| `slots-overview` | account-slots.md | Trading Slots table with mixed slot types | account ids |
| `store-slots` | account-slots.md | Store slot purchase screen | — |
| `tp-ladder` | advanced-orders.mdx | 10-TP configuration UI | — |
| `trailing-stop` | advanced-orders.mdx | Trailing stop config | — |
| `slx-setup` | advanced-orders.mdx | SLX setup | — |

### automation/

| id | Doc | Capture | Redact |
|---|---|---|---|
| `webhook-urls` | webhook-trading.md | Webhook Management → Your Webhook URLs | **webhook token** |
| `regenerate-secret` | webhook-trading.md | Regenerate Secret confirm state | webhook token |
| `tv-alert-dialog` | tradingview-setup.md | TradingView alert dialog with webhook URL pasted | webhook token |
| `webhook-history` | webhook-trading.md | Received-signal log with parse results | account ids |
| `tg-channel-binding` | telegram-to-trade.md | Telegram channel binding screen | channel names optional |
| `tg-parse-preview` | telegram-to-trade.md | Signal parse preview | — |

### social-trading/

| id | Doc | Capture | Redact |
|---|---|---|---|
| `marketplace-grid` | browse-marketplace.md | Marketplace provider grid | — |
| `provider-detail` | browse-marketplace.md | Provider detail card + performance chart | — |
| `copy-settings` | copy-settings.mdx | Copy settings form, sizing options visible | balance |
| `provider-onboarding` | become-provider.md | Provider onboarding form | — |
| `provider-dashboard` | become-provider.md | Provider dashboard | earnings optional |

### wallet/ & security/

| id | Doc | Capture | Redact |
|---|---|---|---|
| `deposit-flow` | deposit.md | Deposit screen, MetaStation Account destination | address |
| `withdraw-form` | withdraw.md | Withdraw form filled | address, balance |
| `withdraw-2fa` | withdraw.md, withdrawal-whitelist.md | Confirm withdrawal dialog — both code fields | codes |
| `history-withdrawals` | withdraw.md | History → withdrawals tab | amounts optional |
| `2fa-enable` | two-factor-auth.md | Security page, Google Authenticator card | — |
| `2fa-qr` | two-factor-auth.md | QR + manual secret screen | **QR and secret both** |
| `security-page` | session-management.md | Security page, both cards | — |

## Design / effect register

**The `Where` column moved for the first three entries.** They all said
`src/pages/index.js`, which builds to `/` — and `/` is not this site. The Cloudflare
Snippet forwards only `/docs`, `/blogs`, `/assets/`, `/img/`, `/search`, `/sitemap.xml`,
`/llms.txt` and `/search-index.json` to VPS2; `metastation.fi/` is VPS1, the trading app.
The hero and the card grid now live on `docs/intro.md` (`slug: /`), which is the page
readers actually arrive on, and `src/pages/index.js` is a `<Redirect>`.

| id | Where | Status | What |
|---|---|---|---|
| `hero-canvas` | `docs/intro.md` → `src/components/DocsHero` | **done** | Canvas UI effect on the docs landing hero. Lazy-mount behind IntersectionObserver, `prefers-reduced-motion` static fallback, must pass the Lighthouse budget gate |
| `blog-hero` | `src/theme/BlogListPage` | **done** | Same treatment, lighter — `intensity="soft"` in a `.ms-hero--blog` band. Carries the page's h1, which `DocsHero` deliberately does not |
| `card-icons` | `docs/intro.md` → `src/components/SectionCards` | **done** | Replace 🚀 💹 🤝 🤖 💰 👨‍💻 with inline lucide SVG. Inlined in `src/components/icons.jsx` — no `lucide-react` dependency |
| `section-hubs` | Phase 3 IA | **done** | Landing hub per section, card grid, own hero header |
| `payload-builder` | `docs/developer/`, `docs/automation/webhook-trading.md` | **done** | Webhook Payload Builder MDX component — the highest-value linkable asset on the site |
| `order-visualiser` | `docs/trading/advanced-orders.mdx` → `src/components/OrderVisualiser` | **done** | Interactive SLX / trailing / 10-TP ladder visualiser. One control — how far price travelled — drives both SLX modes. `order-types-reference.md` links to it rather than mounting a second copy |
| `copy-calculator` | `docs/social-trading/copy-settings.mdx` → `src/components/CopyCalculator` | **done** | Copy mode → position size → margin → subscription break-even. Refuses settings the platform refuses. The platform's commission split with the provider is unpublished, so the fee side is the subscription cost only |
| `try-it-console` | `docs/developer/` | **done** | OpenAPI Try-It, via `@PaloAltoNetworks/docusaurus-openapi-docs` |

---
id: session-management
title: Account Access & Sessions
sidebar_label: Account Access
---

# Account Access & Sessions

How MetaStation keeps you signed in, how that session ends, and what to do if you think someone
else has your account.

---

## How your session works

When you sign in, MetaStation issues an encrypted session token to that browser. It is what
keeps you logged in between page loads.

| | |
|---|---|
| Lifetime | **72 hours** (3 days) from sign-in |
| Scope | The browser you signed in on. Signing in elsewhere creates a separate session |
| Expiry | Automatic. Once it lapses you are returned to the login screen |
| Ending it early | **Logout** — in the account menu on desktop, in the drawer on mobile |

:::note No session dashboard yet
MetaStation does **not** currently provide a list of active sessions, per-device revocation, or a
configurable timeout. The 72-hour expiry is fixed and applies to every session.

That changes what "secure my account" means in practice: the reliable lever is your
**password**, not a revoke button. See the recovery steps below.
:::

---

## Sensible habits

- **Log out on shared or public machines.** Closing the tab does not end the session; the token
  stays valid for the rest of its 72 hours
- **Use one browser profile you control.** Sessions do not follow you between devices, so there
  is no benefit to signing in on machines you do not own
- **Keep 2FA on.** It is the control that stops a stolen password from becoming a withdrawal —
  see [Two-Factor Authentication](/docs/security/two-factor-auth)

---

## If you think your account is compromised

Do these in order. Speed matters more than thoroughness here.

1. **Change your password** — **Security → Password → Change**. This is the step that matters most: it invalidates the credential an attacker has
2. **Enable 2FA if it is off** — **Security → Google Authenticator → Enable**. Without it, withdrawals are impossible for an attacker; this is your hard stop
3. **Check History** — review deposits, withdrawals and trades for anything you did not do
4. **Rotate exchange API keys** — delete the keys at Binance / ByBit / KuCoin and issue new ones. See [API Key Management](/docs/security/api-key-management)
5. **Review your automation** — check **Webhook Management** and press **Regenerate Secret** on any webhook URL that may have leaked
6. **Contact support** with times, amounts and transaction hashes

:::warning
MetaStation support will never ask for your password, your Google Authenticator code, or the
email verification code sent for a withdrawal. Anyone who asks is attacking you.
:::

---

## Related

- [Two-Factor Authentication](/docs/security/two-factor-auth)
- [Withdrawal Security](/docs/security/withdrawal-whitelist)
- [API Key Management](/docs/security/api-key-management)

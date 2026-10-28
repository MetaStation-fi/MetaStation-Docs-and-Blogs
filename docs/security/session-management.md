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
| Ending all of them | **Security → Sign out everywhere** |

{/* SCREENSHOT: security-page | Security page, all cards | 1440x900 | redact: email */}
<Screenshot id="security-page" />

### Sign out everywhere

**Security → Sign out everywhere** ends every session on every device and browser signed in to your
account — including the one you are using. You sign in again on each of them afterwards.

Changing your password does the same for every *other* device: the browser you changed it on stays
signed in.

:::note[What there is not]
MetaStation does not show a list of active sessions, and the 72-hour lifetime is fixed. To end one
particular session, sign out everywhere.
:::

---

## Wrong passwords

Five wrong passwords in a row **block sign-in for 2 hours**. This protects your account from
password guessing; wait, or reset your password with **Forgot password** on the sign-in page.

---

## Sensible habits

- **Log out on shared or public machines.** Closing the tab does not end the session; the token
  stays valid for the rest of its 72 hours
- **Use one browser profile you control.** Sessions do not follow you between devices, so there
  is no benefit to signing in on machines you do not own
- **Turn on an authenticator app.** With it, every sign-in needs a code from your phone, and every
  withdrawal is confirmed by it — see [Two-Factor Authentication](/docs/security/two-factor-auth)

---

## If you think your account is compromised

Do these in order. Speed matters more than thoroughness here.

1. **Change your password** — **Security → Password → Change**. This invalidates the credential an
   attacker has and signs out every other device
2. **Sign out everywhere** — **Security → Sign out everywhere**, then sign back in
3. **Turn on 2FA if it is off** — **Security → Google Authenticator → Enable**. From then on every
   sign-in and every withdrawal needs a code from your phone
4. **Check History** — review deposits, withdrawals and trades for anything you did not do
5. **Rotate exchange API keys** — delete the keys at Binance / ByBit / KuCoin and issue new ones.
   See [API Key Management](/docs/security/api-key-management)
6. **Review your automation** — open **Automation** and press **Regenerate Secret** on any webhook
   URL that may have leaked
7. **Contact support** with times, amounts and transaction hashes

:::warning
MetaStation support will never ask for your password, your authenticator code, or the
confirmation code sent for a withdrawal. Anyone who asks is attacking you.
:::

---

## Related

- [Two-Factor Authentication](/docs/security/two-factor-auth)
- [Withdrawal Security](/docs/security/withdrawal-whitelist)
- [API Key Management](/docs/security/api-key-management)
- [Dead Man's Switch](/docs/security/dead-mans-switch)

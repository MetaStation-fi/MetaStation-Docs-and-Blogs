# shadcn/ui components

Vendored, not installed. shadcn/ui is a source-distribution library — you own
the files — so these are the upstream components with three deliberate,
documented deviations. Read this before adding a fourth.

## The three deviations

**1. Every utility carries the `tw:` prefix.**
`src/css/tailwind.css` namespaces Tailwind so its utilities cannot collide with
Infima's class names (`container`, `table`, `hidden` are all real Infima
classes). Upstream source ships unprefixed, so `npx shadcn add <component>`
will drop in a file that renders **unstyled** — the classes it writes do not
exist in our build. Prefix them by hand after adding, and set the prefix on
`cn()` — `src/lib/utils.js` already does this for tailwind-merge.

**2. `.jsx`, not `.tsx`.** This site is JavaScript. Type props are dropped;
nothing else changes.

**3. No icon dependency.** Upstream imports chevrons and check marks from
`lucide-react`. The homepage already made the call to inline lucide geometry
rather than take the dependency for a handful of icons, and that decision holds
here — see `src/components/icons.jsx`.

## What is NOT vendored, and why

Radix primitives are only pulled in where the component genuinely needs
behaviour we would otherwise have to write and get wrong: `@radix-ui/react-slot`
for `asChild`. `Separator` is written by hand against the ARIA spec instead of
pulling `@radix-ui/react-separator`, because a `<div role="separator">` is the
entire component and this site has a hard Lighthouse performance budget.

Anything needing real interaction behaviour — focus traps, roving tabindex,
dismissable layers — should take the Radix dependency rather than be
hand-rolled. That is the line: hand-roll presentation, never hand-roll a11y
behaviour.

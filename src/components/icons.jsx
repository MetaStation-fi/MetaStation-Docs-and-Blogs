import React from 'react';

/**
 * Inline lucide geometry, stroked with currentColor.
 *
 * Lifted out of src/pages/index.js so the swizzles can share it. The reason it
 * is inline rather than `lucide-react` is unchanged and still holds: a dozen
 * icons do not justify a runtime dependency on a site with a hard Lighthouse
 * budget, and this set is stable — these are the six section icons plus the
 * handful of glyphs the theme components need.
 *
 * Every icon is aria-hidden unless given a `label`. An icon next to its own
 * text label is decoration; announcing it twice is noise.
 */
export const Icon = ({ children, label, className, size = 24, strokeWidth = 1.75 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={label ? undefined : 'true'}
    role={label ? 'img' : undefined}
    aria-label={label}
  >
    {children}
  </svg>
);

const icon = (name, paths) => {
  const C = (props) => <Icon {...props}>{paths}</Icon>;
  C.displayName = name;
  return C;
};

/* ── Section icons (the former emoji set) ─────────────────────────────── */

export const IconRocket = icon('IconRocket', (
  <>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </>
));

export const IconChart = icon('IconChart', (
  <>
    <path d="M9 5v4" />
    <rect width="4" height="6" x="7" y="9" rx="1" />
    <path d="M9 15v2" />
    <path d="M17 3v2" />
    <rect width="4" height="8" x="15" y="5" rx="1" />
    <path d="M17 13v3" />
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
  </>
));

export const IconUsers = icon('IconUsers', (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
));

export const IconWebhook = icon('IconWebhook', (
  <>
    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
    <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
    <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
  </>
));

export const IconWallet = icon('IconWallet', (
  <>
    <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </>
));

export const IconTerminal = icon('IconTerminal', (
  <>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </>
));

/* ── Glyphs the theme components need ─────────────────────────────────── */

export const IconArrowRight = icon('IconArrowRight', (
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>
));

export const IconChevronRight = icon('IconChevronRight', <path d="m9 18 6-6-6-6" />);

export const IconExternal = icon('IconExternal', (
  <>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </>
));

export const IconFile = icon('IconFile', (
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </>
));

export const IconFolder = icon('IconFolder', (
  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
));

export const IconClock = icon('IconClock', (
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
));

export const IconCalendar = icon('IconCalendar', (
  <>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </>
));

export const IconTag = icon('IconTag', (
  <>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </>
));

export const IconSearch = icon('IconSearch', (
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
));

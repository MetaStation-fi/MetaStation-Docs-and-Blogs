import clsx from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * shadcn/ui's `cn` helper, with one required adjustment.
 *
 * tailwind-merge's whole job is knowing that `p-2` and `p-4` are the same
 * property so the later one wins. It recognises classes by parsing them, and
 * our utilities are prefixed (`tw:p-4`, see src/css/tailwind.css for why).
 * Stock twMerge does not know about the prefix, so it would treat every one of
 * our classes as an unknown passthrough and silently stop deduplicating —
 * which shows up as a component variant that cannot be overridden by a
 * `className` prop, with no error anywhere.
 *
 * Configuring the prefix here is what keeps every vendored shadcn component
 * behaving the way its upstream source says it does.
 */
const twMerge = extendTailwindMerge({ prefix: 'tw' });

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

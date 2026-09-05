import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@site/src/lib/utils';

/**
 * shadcn/ui Badge, prefixed.
 *
 * `brand` is the only variant with a filled accent background, and it is
 * deliberately the one place --ms-accent-fill IS correct: a badge is chrome,
 * its text is not body copy, and at this size the 3.7:1 pair clears AA for
 * large/UI text. Everything else here is a tinted surface with accent-coloured
 * text, which measures the full ~5.4:1.
 */
const badgeVariants = cva(
  'tw:inline-flex tw:items-center tw:justify-center tw:gap-1 tw:rounded-pill tw:border tw:px-2.5 tw:py-0.5 tw:text-xs tw:font-medium tw:w-fit tw:whitespace-nowrap tw:shrink-0',
  {
    variants: {
      variant: {
        default: 'tw:border-brand-line tw:bg-brand-soft tw:text-brand',
        brand: 'tw:border-transparent tw:bg-brand-fill tw:text-brand-on-fill',
        outline: 'tw:border-border tw:bg-transparent tw:text-fg-secondary',
        secondary: 'tw:border-border tw:bg-secondary tw:text-secondary-foreground',
        warn: 'tw:border-warn/30 tw:bg-warn/10 tw:text-warn',
        info: 'tw:border-info/30 tw:bg-info/10 tw:text-info',
        ok: 'tw:border-ok/30 tw:bg-ok/10 tw:text-ok',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

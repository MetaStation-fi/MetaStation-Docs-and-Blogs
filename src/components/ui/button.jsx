import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@site/src/lib/utils';

/**
 * shadcn/ui Button, prefixed for our Tailwind namespace.
 *
 * Colour note that matters: `default` uses `bg-primary`, which tailwind.css
 * maps to --ms-accent (~5.4:1), NOT --ms-accent-fill (~3.7:1). A button is a
 * filled surface carrying small text, which is exactly the case the token
 * comment in custom.css warns about. Do not "fix" this to accent-fill.
 */
const buttonVariants = cva(
  'tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:whitespace-nowrap tw:rounded-md tw:font-medium tw:transition-all tw:cursor-pointer tw:no-underline tw:hover:no-underline tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:shrink-0 tw:outline-none tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-ring',
  {
    variants: {
      variant: {
        default:
          'tw:bg-primary tw:text-primary-foreground tw:hover:text-primary-foreground tw:shadow-sm tw:hover:opacity-90',
        brand:
          'tw:bg-[image:var(--ms-gradient)] tw:text-[color:var(--ms-gradient-on)] tw:hover:text-[color:var(--ms-gradient-on)] tw:shadow-sm tw:hover:opacity-92',
        destructive:
          'tw:bg-destructive tw:text-white tw:hover:text-white tw:shadow-sm tw:hover:opacity-90',
        outline:
          'tw:border tw:border-border tw:bg-surface tw:text-foreground tw:shadow-sm tw:hover:border-brand tw:hover:bg-accent tw:hover:text-accent-foreground',
        secondary:
          'tw:bg-secondary tw:text-secondary-foreground tw:shadow-sm tw:hover:bg-surface-hover tw:hover:text-secondary-foreground',
        ghost:
          'tw:text-foreground tw:hover:bg-accent tw:hover:text-accent-foreground',
        link: 'tw:text-brand tw:underline-offset-4 tw:hover:underline tw:hover:text-brand-hover',
      },
      size: {
        default: 'tw:h-9 tw:px-4 tw:py-2 tw:text-sm',
        sm: 'tw:h-8 tw:gap-1.5 tw:px-3 tw:text-xs',
        lg: 'tw:h-11 tw:px-6 tw:text-base',
        icon: 'tw:size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

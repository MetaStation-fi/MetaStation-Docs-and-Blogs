import * as React from 'react';
import { cn } from '@site/src/lib/utils';

/**
 * Separator — hand-written rather than pulling @radix-ui/react-separator.
 *
 * Radix's version is a div with role="separator", aria-orientation and
 * aria-hidden on the decorative path. That is the whole component, and this
 * site has a hard Lighthouse performance budget, so the dependency buys
 * nothing. The a11y contract is reproduced exactly: a decorative rule is
 * `role="none"` so assistive tech skips it, and a semantic one announces its
 * orientation.
 */
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) {
  const ariaProps = decorative
    ? { role: 'none' }
    : { role: 'separator', 'aria-orientation': orientation };

  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      {...ariaProps}
      className={cn(
        'tw:shrink-0 tw:bg-border',
        orientation === 'horizontal' ? 'tw:h-px tw:w-full' : 'tw:w-px tw:self-stretch',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };

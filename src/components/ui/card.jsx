import * as React from 'react';
import { cn } from '@site/src/lib/utils';

/**
 * shadcn/ui Card, prefixed. Surfaces come from --ms-surface / --ms-border via
 * the theme bridge, so a Card and a hand-written .doc-card cannot drift apart.
 */
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'tw:flex tw:flex-col tw:gap-4 tw:rounded-lg tw:border tw:border-border tw:bg-card tw:text-card-foreground tw:shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn('tw:flex tw:flex-col tw:gap-1.5', className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn('tw:font-semibold tw:leading-snug tw:text-foreground', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn('tw:text-sm tw:text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('tw:flex tw:items-center', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

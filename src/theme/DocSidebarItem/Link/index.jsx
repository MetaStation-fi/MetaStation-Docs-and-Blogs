import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import { Badge } from '@site/src/components/ui/badge';
import { IconExternal } from '@site/src/components/icons';

/**
 * SWIZZLE: DocSidebarItem/Link — only the leaf is ejected.
 *
 * `DocSidebarItem` itself is a three-way switch between Category, Html and
 * Link. Ejecting the switch would fork the collapse/expand behaviour in
 * Category for no reason, so only the leaf is replaced and the other two
 * branches keep coming from the theme untouched.
 *
 * WHAT THIS ADDS: sidebar badges, driven by front matter.
 *
 *   ---
 *   sidebar_custom_props:
 *     badge: New
 *     badgeVariant: brand      # optional; see ui/badge.jsx for the set
 *   ---
 *
 * Docusaurus already carries `sidebar_custom_props` through to
 * `item.customProps` and then does nothing with it. The sidebar is the one
 * place a reader scans the whole product surface, and it had no way to say
 * "this page is new" or "this one is deprecated" — so a genuinely new page
 * looked exactly like a three-year-old one.
 *
 * The badge is decoration for a sighted reader and MUST NOT become the only
 * way to know something: it is aria-hidden, and the same fact belongs in the
 * page itself. It is deliberately not a link, not focusable, and adds nothing
 * to the tab order.
 *
 * Everything else here — the `menu__link` classes, the active detection, the
 * two-line label clamp, the external-link affordance — reproduces the theme's
 * behaviour exactly, because the sidebar's CSS in custom.css is written
 * against those class names.
 */

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const { href, label, className, autoAddBaseUrl, customProps } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const badge = customProps?.badge;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}
    >
      <Link
        className={clsx('menu__link', 'tw:flex tw:items-center tw:gap-2', {
          'menu__link--active': isActive,
        })}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}
      >
        {/* The theme clamps the label to two lines; keeping that means a long
            page title still cannot push the sidebar wide or run away
            vertically. `min-w-0` is what actually lets it shrink inside the
            flex row — without it the label refuses to wrap and the badge gets
            pushed out of the rail. */}
        <span
          title={label}
          className="tw:line-clamp-2 tw:min-w-0 tw:flex-1 tw:overflow-hidden"
        >
          {label}
        </span>

        {badge && (
          <Badge
            variant={customProps?.badgeVariant ?? 'default'}
            aria-hidden="true"
            className="tw:shrink-0 tw:px-1.5 tw:py-0 tw:text-[10px] tw:leading-4 tw:font-semibold tw:uppercase tw:tracking-wide"
          >
            {badge}
          </Badge>
        )}

        {!isInternalLink && (
          <IconExternal size={12} strokeWidth={2} className="tw:shrink-0" />
        )}
      </Link>
    </li>
  );
}

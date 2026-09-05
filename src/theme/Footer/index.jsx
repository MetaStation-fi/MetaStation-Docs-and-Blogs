import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { useThemeConfig } from '@docusaurus/theme-common';
import { Separator } from '@site/src/components/ui/separator';
import { IconExternal } from '@site/src/components/icons';

/**
 * SWIZZLE: Footer — ejected.
 *
 * The stock footer is four `.col` blocks and a centred copyright line, which
 * is why the old one read as a link dump: no hierarchy, nothing that says what
 * this site is, and the disclaimer — the one line here with legal weight —
 * styled identically to "Blog".
 *
 * COLOUR, and the trap in it: this bar is dark in BOTH colour schemes
 * (--ifm-footer-background-color is a near-black in light mode too). So every
 * theme-flipping token is wrong inside this component — `text-foreground`
 * resolves to #0f172a in light mode and would paint black on black. Everything
 * here uses the fixed `footer-*` tokens instead, which is also why they have
 * their own @theme block in tailwind.css. If you add an element to this file
 * and it vanishes in light mode, that is the mistake you made.
 *
 * `.footer` and `.footer--dark` are kept on the element so Infima still paints
 * the ground and any external selector still resolves.
 */

function FooterLinkItem({ item }) {
  const { to, href, label, prependBaseUrlToHref, className, ...rest } = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const external = href != null && !isInternalUrl(href);

  return (
    <li>
      <Link
        className={clsx(
          'tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:text-footer-muted tw:no-underline',
          'tw:transition-colors tw:hover:text-footer-accent tw:hover:underline tw:underline-offset-4',
          className,
        )}
        {...(href
          ? { href: prependBaseUrlToHref ? normalizedHref : href }
          : { to: toUrl })}
        {...rest}
      >
        {label}
        {/* The stock footer renders no external indicator at all, so a link that
            leaves the docs looked identical to one that did not. */}
        {external && <IconExternal size={12} strokeWidth={2} />}
      </Link>
    </li>
  );
}

function FooterColumn({ column }) {
  return (
    <div>
      <h2 className="tw:mb-3 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-widest tw:text-footer-accent">
        {column.title}
      </h2>
      <ul className="tw:m-0 tw:flex tw:list-none tw:flex-col tw:gap-2 tw:p-0">
        {(column.items ?? []).map((item, i) => (
          <FooterLinkItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const { footer, navbar } = useThemeConfig();
  const { siteConfig } = useDocusaurusContext();

  if (!footer) {
    return null;
  }

  const { copyright, links = [], style } = footer;

  /* themeConfig.footer.links has two shapes. Ours is the multi-column one, but
     a future edit could switch it to the flat list without touching this file,
     and a footer that silently renders nothing is the kind of thing nobody
     notices for a month. Detect it rather than assume. */
  const isMultiColumn = links.length > 0 && 'title' in links[0];
  const columns = isMultiColumn ? links : [{ title: null, items: links }];

  return (
    <footer
      className={clsx(
        'theme-layout-footer footer',
        { 'footer--dark': style === 'dark' },
        'tw:bg-footer-bg tw:text-footer-fg',
      )}
    >
      <div className="tw:mx-auto tw:w-full tw:max-w-[1240px] tw:px-6 tw:py-14">
        <div className="tw:grid tw:gap-10 tw:lg:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))]">
          {/* Brand block. The wordmark is the same CDN asset and the same
              declared 132x48 box as the navbar's, so it is already in the HTTP
              cache by the time a reader scrolls here — and the explicit
              width/height keep a below-the-fold lazy image from shifting the
              page, which the CLS gate would otherwise catch. */}
          <div className="tw:flex tw:flex-col tw:gap-3">
            {navbar?.logo?.src && (
              <img
                src={navbar.logo.src}
                alt={navbar.logo.alt ?? siteConfig.title}
                width={132}
                height={48}
                loading="lazy"
                decoding="async"
                /* `self-start` is not cosmetic. This is a column flex
                   container, so the default `align-items: stretch` sizes
                   children across the cross axis — the width — and stretch
                   beats `w-auto`. Without it the 264x96 wordmark is pulled to
                   the full column width and squashed to a 7:1 letterbox. */
                className="tw:h-10 tw:w-auto tw:self-start"
              />
            )}
            <p className="tw:m-0 tw:max-w-[34ch] tw:text-sm tw:leading-relaxed tw:text-footer-muted">
              {siteConfig.tagline}
            </p>
          </div>

          {columns.map((column, i) => (
            <FooterColumn key={i} column={column} />
          ))}
        </div>

        <Separator className="tw:my-9 tw:bg-footer-border" />

        {/* The copyright string carries the risk disclaimer, which is the only
            sentence in this footer with legal weight. It gets its own line and
            is left-aligned at reading width rather than centred and shrunk. */}
        {copyright && (
          <div
            className="tw:m-0 tw:max-w-[92ch] tw:text-xs tw:leading-relaxed tw:text-footer-muted"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: copyright }}
          />
        )}
      </div>
    </footer>
  );
}

export default React.memo(Footer);

import React from 'react';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {
  extractLeadingEmoji,
  useDocCardDescriptionCategoryItemsPlural,
} from '@docusaurus/theme-common/internal';
import { ThemeClassNames } from '@docusaurus/theme-common';
import Heading from '@theme/Heading';
import { cn } from '@site/src/lib/utils';
import { Badge } from '@site/src/components/ui/badge';
import {
  IconArrowRight,
  IconChart,
  IconExternal,
  IconFile,
  IconFolder,
  IconRocket,
  IconTerminal,
  IconUsers,
  IconWallet,
  IconWebhook,
} from '@site/src/components/icons';

/**
 * SWIZZLE: DocCard — ejected, not wrapped.
 *
 * Two reasons this could not stay a wrapper:
 *
 * 1. THE EMOJI. The stock card puts an emoji in front of every title — 🗃 for a
 *    category, 📄️ for a doc, 🔗 for an external link — via
 *    `getFallbackEmojiIcon`. Phase 1 removed every emoji from this site because
 *    they render differently on every OS and read as unfinished. The seven
 *    `generated-index` section hubs are built entirely out of these cards, so
 *    the emoji survived Phase 1 in the one place nobody was looking: the hub
 *    pages, which are the most-linked pages in the IA.
 *
 * 2. `text--truncate` ON THE DESCRIPTION. The stock card clamps the description
 *    to a single line with an ellipsis. Every one of our child pages has a real
 *    front-matter description written to be read; a hub that shows the first
 *    six words of each is a worse index than a plain list of links.
 *
 * The card is the homepage `.doc-card` shape, rebuilt with Tailwind + the
 * shadcn Badge, so the section hubs and the homepage grid are visibly the same
 * component. `ThemeClassNames.docs.docCard.*` are preserved so any external CSS
 * (and Docusaurus's own selectors) still find the card.
 */

/* Section icons, keyed by the first path segment under /docs/. The stock theme
   has no concept of this — it only knows "category or leaf". Matching the
   homepage icon set means a reader arriving on /docs/trading sees the same
   glyph they clicked on the homepage. Unknown sections fall through to the
   generic file/folder pair rather than guessing. */
const SECTION_ICONS = {
  'getting-started': IconRocket,
  trading: IconChart,
  'social-trading': IconUsers,
  automation: IconWebhook,
  wallet: IconWallet,
  security: IconWallet,
  developer: IconTerminal,
  api: IconTerminal,
  guides: IconRocket,
  concepts: IconChart,
};

function pickIcon(href, isCategory) {
  if (href && !isInternalUrl(href)) return IconExternal;
  const segment = (href || '').replace(/^\/docs\/?/, '').split('/')[0];
  return SECTION_ICONS[segment] ?? (isCategory ? IconFolder : IconFile);
}

function DocCardShell({ href, className, icon: CardIcon, title, description, count }) {
  return (
    <Link
      href={href}
      className={cn(
        ThemeClassNames.docs.docCard.container,
        'tw:group tw:flex tw:h-full tw:flex-col tw:gap-3 tw:rounded-lg tw:border tw:border-border tw:bg-card tw:p-5 tw:shadow-sm tw:no-underline',
        'tw:transition-[border-color,box-shadow,background-color,transform] tw:duration-200',
        'tw:hover:-translate-y-0.5 tw:hover:border-brand tw:hover:bg-surface-hover tw:hover:no-underline tw:hover:shadow-md',
        className,
      )}
    >
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
        <span
          className="tw:inline-flex tw:size-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-sm tw:border tw:border-brand-line tw:bg-brand-soft tw:text-brand"
          aria-hidden="true"
        >
          <CardIcon size={18} />
        </span>
        {count != null && <Badge variant="outline">{count}</Badge>}
      </div>

      <Heading
        as="h2"
        className={cn(
          ThemeClassNames.docs.docCard.heading,
          'tw:m-0 tw:text-base tw:font-semibold tw:leading-snug tw:text-foreground',
        )}
      >
        {title}
      </Heading>

      {description && (
        <p
          className={cn(
            ThemeClassNames.docs.docCard.description,
            /* Deliberately NOT `text--truncate`. Clamped to three lines so a
               long description cannot make one card in a grid taller than its
               neighbours, but the reader still gets a real sentence. */
            'tw:m-0 tw:line-clamp-3 tw:text-sm tw:leading-relaxed tw:text-muted-foreground',
          )}
        >
          {description}
        </p>
      )}

      <span className="tw:mt-auto tw:inline-flex tw:items-center tw:gap-1.5 tw:pt-1 tw:text-xs tw:font-semibold tw:text-brand">
        Read
        <IconArrowRight
          size={14}
          className="tw:transition-transform tw:duration-200 tw:group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

/* The stock theme calls extractLeadingEmoji to SPLIT an author's emoji off the
   label and then render it as the icon. We call it for the split and throw the
   emoji away — it is the one reliable way to strip a leading emoji from a
   sidebar label without reimplementing its unicode handling. */
function cleanTitle(label) {
  return extractLeadingEmoji(label).rest.trim();
}

function CardCategory({ item }) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useDocCardDescriptionCategoryItemsPlural();
  if (!href) {
    return null;
  }
  return (
    <DocCardShell
      href={href}
      className={item.className}
      icon={pickIcon(href, true)}
      title={cleanTitle(item.label)}
      description={item.description}
      count={categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({ item }) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <DocCardShell
      href={item.href}
      className={item.className}
      icon={pickIcon(item.href, false)}
      title={cleanTitle(item.label)}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({ item }) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}

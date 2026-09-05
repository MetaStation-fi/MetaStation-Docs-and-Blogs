import React from 'react';
import { BlogPostProvider } from '@docusaurus/plugin-content-blog/client';
import BlogPostItem from '@theme/BlogPostItem';

/**
 * SWIZZLE: BlogPostItems — ejected, for one line.
 *
 * The stock component renders a bare fragment, and the stock BlogPostItem
 * spaced the cards with its own `margin-bottom--xl`. Our BlogPostItem dropped
 * that margin — margin-based spacing leaves a trailing gap under the last card
 * and cannot be reasoned about from the container — so the gap has to live on
 * a parent.
 *
 * It lives HERE rather than in BlogListPage because this is the one component
 * every list of posts goes through: the blog index, `/blogs/tags/*` and
 * `/blogs/authors/*`. Putting the wrapper in BlogListPage alone fixed the
 * index and left the tag and author pages with their cards touching, which is
 * exactly the sort of thing nobody notices until a second post exists.
 */
export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem,
}) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-6">
      {items.map(({ content: BlogPostContent }) => (
        <BlogPostProvider
          key={BlogPostContent.metadata.permalink}
          content={BlogPostContent}
        >
          <BlogPostItemComponent>
            <BlogPostContent />
          </BlogPostItemComponent>
        </BlogPostProvider>
      ))}
    </div>
  );
}

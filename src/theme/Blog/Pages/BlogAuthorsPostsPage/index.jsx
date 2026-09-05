import React from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  useBlogAuthorPageTitle,
  BlogAuthorsListViewAllLabel,
  BlogAuthorNoPostsLabel,
} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import { useBlogMetadata } from '@docusaurus/plugin-content-blog/client';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import Author from '@theme/Blog/Components/Author';

/**
 * SWIZZLE: Blog/Pages/BlogAuthorsPostsPage — ejected for ONE attribute.
 *
 * The stock page renders `<PageMetadata title={title} />` and no description,
 * so an author page ships with no `<meta name="description">` at all. That is
 * a scored Lighthouse SEO failure — `meta-description` is an ERROR in
 * lighthouserc.json — and it took the page to SEO 0.92 against a 1.0 gate the
 * moment `page: true` was added to blog/authors.yml.
 *
 * The description already exists: blog/authors.yml supplies it, and the stock
 * page renders it in the body. It simply was not passed to PageMetadata. Every
 * other line here is the stock component, deliberately — the tag page next
 * door gets this right (`description={tag.description}`), which is the best
 * evidence that this is an upstream oversight rather than a decision.
 *
 * The fallback matters: an author with no description in authors.yml would
 * otherwise reintroduce the same empty meta tag through a different door.
 */
function Metadata({ author }) {
  const title = useBlogAuthorPageTitle(author);
  const description =
    author.description ?? `Posts written by ${author.name} on the MetaStation blog.`;
  return (
    <>
      <PageMetadata title={title} description={description} />
      <SearchMetadata tag="blog_authors_posts" />
    </>
  );
}

function ViewAllAuthorsLink() {
  const { authorsListPath } = useBlogMetadata();
  return (
    <Link href={authorsListPath}>
      <BlogAuthorsListViewAllLabel />
    </Link>
  );
}

function Content({ author, items, sidebar, listMetadata }) {
  return (
    <BlogLayout sidebar={sidebar}>
      <header className="margin-bottom--xl">
        <Author as="h1" author={author} />
        {author.description && <p>{author.description}</p>}
        <ViewAllAuthorsLink />
      </header>
      {items.length === 0 ? (
        <p>
          <BlogAuthorNoPostsLabel />
        </p>
      ) : (
        <>
          <hr />
          {/* Resolves to src/theme/BlogPostItems, which carries the column gap
              the swizzled BlogPostItem stopped carrying itself. */}
          <BlogPostItems items={items} />
          <BlogListPaginator metadata={listMetadata} />
        </>
      )}
    </BlogLayout>
  );
}

export default function BlogAuthorsPostsPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorsPostsPage,
      )}
    >
      <Metadata {...props} />
      <Content {...props} />
    </HtmlClassNameProvider>
  );
}

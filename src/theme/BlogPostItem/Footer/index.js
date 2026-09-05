import React from 'react';
import Footer from '@theme-original/BlogPostItem/Footer';
import Comments from '@site/src/components/Comments';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

/**
 * Same wrap for blog posts, with one difference that matters: the blog LIST
 * page renders each post through BlogPostItem too. Without the isBlogPostPage
 * guard every card in the list would mount its own giscus iframe — ten
 * iframes on one page, all pointing at different threads.
 */
export default function FooterWrapper(props) {
  const {isBlogPostPage, frontMatter} = useBlogPost();
  const enabled = frontMatter.comments ?? true;

  return (
    <>
      <Footer {...props} />
      {isBlogPostPage && enabled && <Comments />}
    </>
  );
}

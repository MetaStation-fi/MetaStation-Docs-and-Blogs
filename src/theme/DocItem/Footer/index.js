import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import Comments from '@site/src/components/Comments';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

/**
 * Wraps the theme's doc footer rather than ejecting it, so the tags,
 * edit-this-page link, last-updated line and pagination keep coming from the
 * theme and survive minor upgrades untouched.
 *
 * Comments are opt-OUT per page via front matter:
 *
 *   ---
 *   comments: false
 *   ---
 *
 * Generated API reference pages set it off by default below — a Try-It console
 * is a tool, not a discussion, and threads there would fragment across pages
 * that are regenerated wholesale whenever the spec changes.
 */
export default function FooterWrapper(props) {
  const {frontMatter, metadata} = useDoc();
  const isGeneratedApiPage = metadata.id?.startsWith('api/');
  const enabled = frontMatter.comments ?? !isGeneratedApiPage;

  return (
    <>
      <Footer {...props} />
      {enabled && <Comments />}
    </>
  );
}

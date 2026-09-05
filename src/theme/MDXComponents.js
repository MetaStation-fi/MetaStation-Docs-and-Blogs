import MDXComponents from '@theme-original/MDXComponents';
import Screenshot from '@site/src/components/Screenshot';

/**
 * Globally available MDX components.
 *
 * Registered here rather than imported per page: 34 screenshot markers are
 * spread across 15 docs, and an import line in each is 15 more places for a
 * path to rot. It also keeps the markdown readable for non-developers.
 */
export default {
  ...MDXComponents,
  Screenshot,
};

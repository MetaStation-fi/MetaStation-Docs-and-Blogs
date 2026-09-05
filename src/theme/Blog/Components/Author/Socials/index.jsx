import React from 'react';
import Socials from '@theme-original/Blog/Components/Author/Socials';

/**
 * SWIZZLE: Blog/Components/Author/Socials — WRAPPED, not ejected.
 *
 * The stock component paints each social link as a bare 16x16 icon. That is
 * below the 24x24 minimum the `target-size` accessibility audit enforces, and
 * it failed the moment socials were added to blog/authors.yml — on the author
 * page, on every post header and on the blog index card, because the author
 * block renders in all three.
 *
 * The fix is a hit area, not a bigger icon: 24x24 of clickable padding around
 * the same 16px glyph. A finger misses a 16px target on a phone far more often
 * than the audit score suggests, so this is a real defect rather than a scored
 * one.
 *
 * Wrapped rather than ejected because there is nothing wrong with the
 * component's logic — the platform table, the icon mapping and the fallback
 * icon are all fine, and copying them here would be one more list to keep in
 * step with upstream. The class below is the entire change; the sizing lives
 * in custom.css next to the other author styles.
 */
export default function SocialsWrapper(props) {
  return (
    <div className="ms-author-socials">
      <Socials {...props} />
    </div>
  );
}

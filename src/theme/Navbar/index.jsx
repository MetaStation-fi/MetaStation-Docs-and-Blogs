import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@theme-original/Navbar';
import { useLocation } from '@docusaurus/router';

/**
 * SWIZZLE: Navbar — WRAPPED, deliberately not ejected.
 *
 * Ejecting Navbar means owning the mobile drawer, the dropdown menus, the
 * search modal trigger and the focus management that ties them together. That
 * is a large surface of keyboard and screen-reader behaviour to re-implement
 * for what is, in the end, a visual change — and the Lighthouse a11y gate is a
 * hard failure at 0.95. Wrapping gets the two things worth having and leaves
 * every one of those behaviours coming from the theme.
 *
 * What the wrapper adds:
 *
 * 1. A SCROLL STATE. `.navbar` carried a permanent border and blur, so the bar
 *    looked identical at the top of a page and halfway down it. `data-ms-
 *    scrolled` on <html> lets custom.css hold the bar flat at rest and lift it
 *    once content passes underneath.
 *
 * 2. A READING PROGRESS BAR on long-form pages. The docs run to 2,000-word
 *    guides, and the sidebar shows position in the SECTION, never in the PAGE.
 *
 * ── The sticky trap, and why the shell is styled the way it is ──────────────
 * Docusaurus's navbar is `position: sticky` via `.navbar--fixed-top`. A sticky
 * element sticks only within its PARENT's box, so simply wrapping it in a
 * plain <div> — the obvious way to write this component — silently ends the
 * stickiness: the wrapper is exactly as tall as the navbar, so the navbar has
 * no room to travel and scrolls away with the page. It looks completely normal
 * in a screenshot of the top of the page.
 *
 * So the SHELL is the sticky element and the navbar inside it is static. See
 * `.ms-navbar-shell` in custom.css, which must stay in step with this comment.
 * Sticky does not create a containing block for fixed positioning, so the
 * mobile drawer inside the navbar is unaffected.
 */

/* Progress is only meaningful where there is a long article to be partway
   through. On the docs index or a section hub it would sit near 100% at rest
   and mean nothing. */
function pageHasProgress(pathname) {
  if (pathname === '/docs/' || pathname === '/blogs/') return false;
  return pathname.startsWith('/docs/') || pathname.startsWith('/blogs/');
}

export default function NavbarWrapper(props) {
  const { pathname } = useLocation();
  const showProgress = pageHasProgress(pathname);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef(null);
  const frame = useRef(0);

  useEffect(() => {
    /* One passive listener, rAF-coalesced. The bar is driven by writing a
       transform straight to the node rather than through React state: a scroll
       handler that calls setState every frame re-renders the whole navbar
       subtree and shows up as Total Blocking Time, which is a Lighthouse
       budget line. Only the coarse boolean goes through state, and only when
       it actually flips. */
    const read = () => {
      frame.current = 0;
      const y = window.scrollY;
      const isScrolled = y > 4;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));

      const bar = barRef.current;
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
        bar.style.transform = `scaleX(${ratio})`;
      }
    };

    const onScroll = () => {
      if (!frame.current) frame.current = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [pathname]);

  useEffect(() => {
    /* On <html> rather than on the shell: the announcement bar sits above the
       navbar and custom.css needs to reach both from one selector. */
    document.documentElement.setAttribute(
      'data-ms-scrolled',
      scrolled ? 'true' : 'false',
    );
  }, [scrolled]);

  return (
    <div className="ms-navbar-shell">
      <Navbar {...props} />
      {showProgress && (
        <div className="ms-navbar-progress" aria-hidden="true">
          <span ref={barRef} className="ms-navbar-progress-bar" />
        </div>
      )}
    </div>
  );
}

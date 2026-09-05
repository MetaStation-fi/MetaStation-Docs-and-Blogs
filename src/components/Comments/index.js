import React, {useEffect, useRef} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

/**
 * Giscus comments, backed by GitHub Discussions on the docs repo.
 *
 * Chosen over a hosted comment service because it needs no database, no
 * tracking and no ads, and because the threads become real Discussions —
 * indexable content on a public repo rather than data locked inside a widget.
 *
 * Config values below are IDs, not secrets. They are resolved from the GitHub
 * GraphQL API and are visible in the page source of every giscus site; the
 * write path is the giscus GitHub App acting for a signed-in commenter, so
 * publishing them grants nothing.
 *
 *   repo        MetaStation-fi/MetaStation-Docs-and-Blogs
 *   category    Announcements — giscus's own recommendation. Only maintainers
 *               can open discussions there, so a visitor cannot create threads
 *               that masquerade as page discussions; giscus still creates the
 *               per-page thread itself via the App.
 *   mapping     pathname — stable across rebuilds, unlike title or og:title,
 *               both of which silently orphan every thread when a page is
 *               renamed.
 *
 * The script is injected rather than added via a dependency so the site keeps
 * its zero-runtime-dependency posture.
 */

const GISCUS = {
  repo: 'MetaStation-fi/MetaStation-Docs-and-Blogs',
  repoId: 'R_kgDOTBb1rQ',
  category: 'Announcements',
  categoryId: 'DIC_kwDOTBb1rc4DE5ua',
  mapping: 'pathname',
  strict: '1',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'en',
};

// giscus ships its own themes; these are the two that sit closest to the
// site's own surfaces without fighting them.
const themeFor = (colorMode) => (colorMode === 'dark' ? 'transparent_dark' : 'light');

export default function Comments() {
  const {colorMode} = useColorMode();
  const {pathname} = useLocation();
  const ref = useRef(null);

  // Mount (and re-mount on navigation): giscus reads its config from the
  // script attributes at load, so a client-side route change needs the iframe
  // rebuilt rather than merely re-themed.
  useEffect(() => {
    const container = ref.current;
    if (!container) return undefined;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', GISCUS.repo);
    script.setAttribute('data-repo-id', GISCUS.repoId);
    script.setAttribute('data-category', GISCUS.category);
    script.setAttribute('data-category-id', GISCUS.categoryId);
    script.setAttribute('data-mapping', GISCUS.mapping);
    script.setAttribute('data-strict', GISCUS.strict);
    script.setAttribute('data-reactions-enabled', GISCUS.reactionsEnabled);
    script.setAttribute('data-emit-metadata', GISCUS.emitMetadata);
    script.setAttribute('data-input-position', GISCUS.inputPosition);
    script.setAttribute('data-theme', themeFor(colorMode));
    script.setAttribute('data-lang', GISCUS.lang);
    script.setAttribute('data-loading', 'lazy');

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
    // colorMode is deliberately NOT a dependency: re-mounting the iframe on
    // every theme toggle would discard a half-written comment. The effect
    // below re-themes the live iframe in place instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Re-theme without reloading.
  useEffect(() => {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      {giscus: {setConfig: {theme: themeFor(colorMode)}}},
      'https://giscus.app',
    );
  }, [colorMode]);

  return (
    <section className={styles.comments}>
      <h2 className={styles.heading}>Questions & comments</h2>
      <p className={styles.intro}>
        Threads live in{' '}
        <a
          href="https://github.com/MetaStation-fi/MetaStation-Docs-and-Blogs/discussions"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Discussions
        </a>
        . Sign in with GitHub to post. For account or funds issues, use in-app support instead —
        this is a public page.
      </p>
      {/* The giscus iframe loads async and sizes itself, so without a reserved
          box the footer below it jumps once the widget resolves. Measured at
          0.0455 CLS on every docs page against a 0.1 budget - roughly half the
          site's entire layout-shift allowance spent on a widget that has not
          rendered yet. */}
      <div ref={ref} className={styles.mount} />
    </section>
  );
}

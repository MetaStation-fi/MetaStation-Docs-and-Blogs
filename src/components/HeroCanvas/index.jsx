import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

/**
 * EFFECT: hero-canvas / blog-hero (PLACEHOLDERS.md design register).
 *
 * The mount discipline, which is the whole point of this file — the drawing
 * lives in ./engine.js:
 *
 * 1. NOT IN THE INITIAL BUNDLE. The engine arrives through a dynamic import
 *    fired from an effect, so it is a separate chunk that cannot delay first
 *    paint or add to the parse cost Lighthouse measures.
 *
 * 2. LAZY-MOUNTED BEHIND AN IntersectionObserver, and — the part that actually
 *    matters — UNMOUNTED THE SAME WAY. A hero animation that keeps its rAF
 *    loop running while the reader is 4,000px down a guide is burning battery
 *    to render pixels nobody can see. The observer stops the loop on exit and
 *    restarts it on re-entry.
 *
 * 3. PAUSED ON A HIDDEN TAB. IntersectionObserver does not fire when a tab is
 *    backgrounded — the element is still technically intersecting — so
 *    visibilitychange is handled separately. Without it the loop runs forever
 *    in a background tab.
 *
 * 4. prefers-reduced-motion GETS A STATIC FRAME. The field is drawn once and
 *    never animated. It is not removed: it carries no information, and the
 *    preference is about movement, not about decoration.
 *
 * 5. NEVER ON A DOC CONTENT PAGE. Marketing surfaces only — the docs landing
 *    band and the blog index. This component does not enforce that; the call
 *    sites do.
 *
 * CLS: the canvas is absolutely positioned inside a parent that must establish
 * its own height. It is out of flow and cannot move content, which is why this
 * effect costs the CLS budget nothing.
 */
export default function HeroCanvas({ className, seed, intensity = 'full' }) {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let cancelled = false;
    let observer;
    let resizeObserver;
    let themeObserver;
    let onVisibility;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    import('./engine')
      .then(({ createField }) => {
        if (cancelled || !canvasRef.current) return;

        const field = createField(canvasRef.current, {
          seed,
          reducedMotion: motionQuery.matches,
        });
        fieldRef.current = field;
        field.resize();

        /* Visibility gate. `stop()` on a field that is not running is a no-op,
           so the two conditions can be evaluated independently. */
        let inView = false;
        const sync = () => {
          if (inView && !document.hidden) field.start();
          else field.stop();
        };

        observer = new IntersectionObserver(
          (entries) => {
            inView = entries.some((e) => e.isIntersecting);
            sync();
          },
          { rootMargin: '120px' },
        );
        observer.observe(canvasRef.current);

        onVisibility = () => sync();
        document.addEventListener('visibilitychange', onVisibility);

        resizeObserver = new ResizeObserver(() => field.resize());
        resizeObserver.observe(canvasRef.current);

        /* The palette is read out of CSS custom properties, so the colours
           have to be re-read when the reader flips the colour scheme —
           otherwise the traces keep the previous theme's teal. */
        themeObserver = new MutationObserver(() => field.refreshPalette());
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme'],
        });
      })
      .catch(() => {
        /* A decorative layer must never be able to break the page. If the
           chunk fails to load, the CSS wash underneath is the design. */
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      resizeObserver?.disconnect();
      themeObserver?.disconnect();
      if (onVisibility) {
        document.removeEventListener('visibilitychange', onVisibility);
      }
      fieldRef.current?.destroy();
      fieldRef.current = null;
    };
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      className={clsx('ms-hero-canvas', `ms-hero-canvas--${intensity}`, className)}
      /* Decoration with no information in it. Not exposed, not labelled, and
         not focusable. */
      aria-hidden="true"
      role="presentation"
    />
  );
}

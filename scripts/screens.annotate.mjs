/**
 * Annotation layer: rings, numbered badges, arrows and callout labels drawn
 * onto a capture before the pixel is taken.
 *
 * Why draw in the page rather than post-process the PNG:
 *   - coordinates come from the live layout, so an annotation cannot drift out
 *     of alignment when the app is restyled - it either finds its element or
 *     fails loudly;
 *   - it scales with deviceScaleFactor for free, so the same definition gives a
 *     crisp result at 2x desktop and 3x mobile;
 *   - no image library, no font loading, nothing to install.
 *
 * Runs inside the page, so it must be self-contained.
 *
 * Nodes are APPENDED, never removed or reparented. Appending to <body> is safe
 * with React; detaching nodes React owns is what trips its error boundary.
 */

export function annotateInPage(config) {
  const { annotations, accent, onAccent, ink, withLabels } = config;
  const report = { drawn: [], missing: [], labels: [] };

  const layer = document.createElement('div');
  layer.setAttribute('data-ms-annotations', '');
  Object.assign(layer.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '2147483000',
    pointerEvents: 'none',
    font: '600 13px/1.35 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  });

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  Object.assign(svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible' });
  const defs = document.createElementNS(svgNS, 'defs');
  const marker = document.createElementNS(svgNS, 'marker');
  marker.setAttribute('id', 'ms-arrowhead');
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerWidth', '7');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('orient', 'auto-start-reverse');
  const head = document.createElementNS(svgNS, 'path');
  head.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  head.setAttribute('fill', accent);
  marker.appendChild(head);
  defs.appendChild(marker);
  svg.appendChild(defs);
  layer.appendChild(svg);

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Every ring and every placed label becomes an obstacle for the labels placed
  // after it. Without this, callouts land on top of the values they point at
  // and on top of each other.
  const occupied = [];
  const overlaps = (a1, b1) =>
    a1.left < b1.right && a1.right > b1.left && a1.top < b1.bottom && a1.bottom > b1.top;
  const overlapArea = (a1, b1) => {
    const w1 = Math.min(a1.right, b1.right) - Math.max(a1.left, b1.left);
    const h1 = Math.min(a1.bottom, b1.bottom) - Math.max(a1.top, b1.top);
    return w1 > 0 && h1 > 0 ? w1 * h1 : 0;
  };

  annotations.forEach((a, i) => {
    const el = resolve(a.at);
    if (!el) { report.missing.push(a.at); return; }

    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) { report.missing.push(a.at); return; }

    // Clamp the ring to the viewport so a partially-scrolled target still reads.
    const pad = a.pad ?? 6;
    const x = Math.max(2, r.left - pad);
    const y = Math.max(2, r.top - pad);
    const w = Math.min(vw - x - 2, r.width + pad * 2);
    const h = Math.min(vh - y - 2, r.height + pad * 2);

    // --- ring ---
    const ring = document.createElement('div');
    Object.assign(ring.style, {
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: w + 'px',
      height: h + 'px',
      border: `2.5px solid ${accent}`,
      borderRadius: (a.radius ?? 10) + 'px',
      boxShadow: `0 0 0 4px ${accent}26, 0 6px 22px rgba(0,0,0,.45)`,
      pointerEvents: 'none',
    });
    layer.appendChild(ring);
    occupied.push({ left: x, top: y, right: x + w, bottom: y + h });

    // --- numbered badge ---
    // Always numbered when the explanation lives in the legend below the
    // image: the badge is the only thing tying a ring to its text.
    if (annotations.length > 1 || !withLabels) {
      const badge = document.createElement('div');
      badge.textContent = String(i + 1);
      Object.assign(badge.style, {
        position: 'absolute',
        left: x - 11 + 'px',
        top: y - 11 + 'px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: accent,
        color: onAccent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: '700 13px/1 ui-sans-serif, system-ui, sans-serif',
        boxShadow: '0 2px 8px rgba(0,0,0,.5)',
      });
      layer.appendChild(badge);
    }

    // Legend mode: the ring and badge go on the image, the words go underneath
    // it. Drawing the text over the screenshot covers the very UI the callout
    // is describing, which is the whole reason the image is there.
    if (!withLabels) {
      report.drawn.push(a.at);
      report.labels.push(a.label || '');
      return;
    }

    if (!a.label) { report.drawn.push(a.at); return; }

    // --- label, placed on the side with the most room ---
    const label = document.createElement('div');
    label.textContent = annotations.length > 1 ? `${i + 1}. ${a.label}` : a.label;
    Object.assign(label.style, {
      position: 'absolute',
      maxWidth: Math.min(300, vw * 0.42) + 'px',
      padding: '8px 12px',
      borderRadius: '8px',
      background: accent,
      color: onAccent,
      boxShadow: '0 6px 20px rgba(0,0,0,.5)',
      whiteSpace: 'normal',
      visibility: 'hidden',
    });
    layer.appendChild(label);

    const lb = label.getBoundingClientRect();
    const gap = 22;

    // Score every side and take the best. A label must (a) sit fully on screen
    // and (b) not cover a ring or an earlier label. Clamping a bad choice into
    // the nearest corner - the previous behaviour - produced a callout in the
    // top-left with an arrow dragged clear across the screenshot.
    const candidates = (a.place ? [a.place] : ['right', 'left', 'bottom', 'top']).map((place) => {
      let lx;
      let ly;
      if (place === 'right') { lx = x + w + gap; ly = y + h / 2 - lb.height / 2; }
      else if (place === 'left') { lx = x - gap - lb.width; ly = y + h / 2 - lb.height / 2; }
      else if (place === 'top') { lx = x + w / 2 - lb.width / 2; ly = y - gap - lb.height; }
      else { lx = x + w / 2 - lb.width / 2; ly = y + h + gap; }

      // Slide along the edge to stay on screen, rather than jumping sides.
      const cx = Math.max(8, Math.min(lx, vw - lb.width - 8));
      const cy = Math.max(8, Math.min(ly, vh - lb.height - 8));
      const rect = { left: cx, top: cy, right: cx + lb.width, bottom: cy + lb.height };

      const offscreen = (lx !== cx ? Math.abs(lx - cx) : 0) + (ly !== cy ? Math.abs(ly - cy) : 0);
      const collision = occupied.reduce((sum, o) => sum + overlapArea(rect, o), 0);
      return { place, lx: cx, ly: cy, rect, penalty: collision + offscreen * 40 };
    });

    const best = candidates.sort((p, q) => p.penalty - q.penalty)[0];
    const place = best.place;
    const lx = best.lx;
    const ly = best.ly;

    label.style.left = lx + 'px';
    label.style.top = ly + 'px';
    label.style.visibility = 'visible';
    occupied.push(best.rect);

    // --- arrow from label edge to ring edge ---
    const from = {
      x: place === 'right' ? lx : place === 'left' ? lx + lb.width : lx + lb.width / 2,
      y: place === 'top' ? ly + lb.height : place === 'bottom' ? ly : ly + lb.height / 2,
    };
    const to = {
      x: place === 'right' ? x + w + 3 : place === 'left' ? x - 3 : x + w / 2,
      y: place === 'top' ? y - 3 : place === 'bottom' ? y + h + 3 : y + h / 2,
    };
    const line = document.createElementNS(svgNS, 'path');
    // Gentle curve; a straight line reads as a border, a curve reads as a pointer.
    const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
    const bow = place === 'left' || place === 'right' ? 14 : 0;
    line.setAttribute('d', `M ${from.x} ${from.y} Q ${mid.x} ${mid.y - bow} ${to.x} ${to.y}`);
    line.setAttribute('stroke', accent);
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('marker-end', 'url(#ms-arrowhead)');
    svg.appendChild(line);

    report.drawn.push(a.at);
  });

  document.body.appendChild(layer);
  return report;

  function resolve(spec) {
    // 'text=Add Slots' matches on visible text; anything else is a CSS selector.
    if (typeof spec === 'string' && spec.startsWith('text=')) {
      const needle = spec.slice(5).toLowerCase();
      const all = Array.from(document.body.querySelectorAll('button, a, h1, h2, h3, h4, label, span, div, td, th, p'));
      const matches = all.filter((el) => {
        const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join(' ');
        return own.toLowerCase().includes(needle) && el.getBoundingClientRect().width > 0;
      });
      // Smallest match: the tightest element that owns the text.
      return matches.sort((p, q) => {
        const a1 = p.getBoundingClientRect();
        const b1 = q.getBoundingClientRect();
        return a1.width * a1.height - b1.width * b1.height;
      })[0] || null;
    }
    try {
      return document.querySelector(spec);
    } catch {
      return null;
    }
  }
}

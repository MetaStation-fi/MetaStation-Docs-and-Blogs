/**
 * Hero canvas — signal-trace field.
 *
 * WHAT IT DRAWS, AND WHY THAT
 * Right-angled traces running left to right, with pulses travelling along them
 * and settling at nodes. It is the product's own shape: a signal enters from a
 * source, is routed, and lands as an execution. A generic particle cloud would
 * have cost the same and said nothing.
 *
 * WHY CANVAS 2D AND NOT WEBGL
 * WebGL means a shader compile on the main thread during page load, a context
 * that can be lost and has to be restored, and a hard failure mode on machines
 * where it is blocked. For a decorative band behind text, 2D costs less and
 * cannot fail. Lighthouse performance is a budget line on this site.
 *
 * THE PERFORMANCE SHAPE
 * - The traces never move, so they are rasterised ONCE into an offscreen
 *   canvas and blitted per frame. Only the pulses are drawn live.
 * - devicePixelRatio is capped at 2. A 3x phone would otherwise rasterise nine
 *   times the pixels for an effect nobody is looking at.
 * - Pulse count scales with area and is hard-capped.
 * - The caller owns start/stop; this module never installs a scroll or
 *   visibility listener of its own.
 *
 * This module is framework-free on purpose: it is loaded through a dynamic
 * import so it stays out of the initial bundle, and keeping React out of it
 * means the chunk is genuinely small.
 */

const DPR_CAP = 2;
const LANE_GAP = 78; // px between traces, in CSS pixels
const MAX_PULSES = 26;

/* Deterministic RNG. A hero that reshuffles itself on every navigation reads
   as noise, and a fixed field is also reproducible in a screenshot diff. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function readPalette(el) {
  const cs = getComputedStyle(el);
  const pick = (name, fallback) => {
    const v = cs.getPropertyValue(name).trim();
    return v || fallback;
  };
  return {
    trace: pick('--ms-accent-line', 'rgba(13,148,136,0.28)'),
    pulse: pick('--ms-accent', '#0f766e'),
    node: pick('--ms-blue', '#60a5fa'),
  };
}

/**
 * Build the trace geometry. Each lane is a polyline of axis-aligned segments
 * with one or two step-ups, so the field reads as routing rather than as
 * ruled lines.
 */
function buildLanes(width, height, random) {
  const lanes = [];
  const count = Math.max(3, Math.ceil(height / LANE_GAP));
  const step = height / count;

  for (let i = 0; i < count; i += 1) {
    const y = Math.round(step * (i + 0.5));
    const points = [{ x: -40, y }];
    let x = Math.round(width * (0.12 + random() * 0.2));
    let cursorY = y;

    const bends = 1 + Math.floor(random() * 2);
    for (let b = 0; b < bends; b += 1) {
      const rise = (random() > 0.5 ? 1 : -1) * step * (0.6 + random() * 0.8);
      const nextY = Math.round(
        Math.min(height - 8, Math.max(8, cursorY + rise)),
      );
      points.push({ x, y: cursorY });
      points.push({ x, y: nextY });
      cursorY = nextY;
      x = Math.round(x + width * (0.16 + random() * 0.22));
    }

    points.push({ x: width + 40, y: cursorY });
    lanes.push(points);
  }
  return lanes;
}

/* Cumulative lengths let a pulse be positioned by a single 0..1 parameter
   instead of walking the polyline every frame. */
function measure(points) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    segs.push({ a, b, len, start: total });
    total += len;
  }
  return { segs, total };
}

function pointAt(measured, dist) {
  const { segs, total } = measured;
  const d = ((dist % total) + total) % total;
  for (let i = 0; i < segs.length; i += 1) {
    const s = segs[i];
    if (d <= s.start + s.len) {
      const t = s.len === 0 ? 0 : (d - s.start) / s.len;
      return {
        x: s.a.x + (s.b.x - s.a.x) * t,
        y: s.a.y + (s.b.y - s.a.y) * t,
      };
    }
  }
  const last = segs[segs.length - 1];
  return { x: last.b.x, y: last.b.y };
}

export function createField(canvas, options = {}) {
  const { seed = 20260905, reducedMotion = false } = options;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    return { start() {}, stop() {}, resize() {}, refreshPalette() {}, destroy() {} };
  }

  let dpr = 1;
  let width = 0;
  let height = 0;
  let lanes = [];
  let measured = [];
  let pulses = [];
  let palette = readPalette(canvas.parentElement ?? canvas);
  let traceLayer = null;
  let raf = 0;
  let last = 0;

  function paintTraces() {
    traceLayer = document.createElement('canvas');
    traceLayer.width = canvas.width;
    traceLayer.height = canvas.height;
    const t = traceLayer.getContext('2d');
    if (!t) return;
    t.scale(dpr, dpr);
    t.strokeStyle = palette.trace;
    t.lineWidth = 1;
    t.lineJoin = 'round';
    t.lineCap = 'round';

    for (const points of lanes) {
      t.beginPath();
      t.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i += 1) {
        t.lineTo(points[i].x, points[i].y);
      }
      t.stroke();
    }

    /* Nodes at the bends — the points where a signal changes direction. */
    t.fillStyle = palette.node;
    t.globalAlpha = 0.35;
    for (const points of lanes) {
      for (let i = 1; i < points.length - 1; i += 1) {
        t.beginPath();
        t.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
        t.fill();
      }
    }
    t.globalAlpha = 1;
  }

  function build() {
    const random = rng(seed);
    lanes = buildLanes(width, height, random);
    measured = lanes.map(measure);

    const budget = Math.min(
      MAX_PULSES,
      Math.max(6, Math.round((width * height) / 46000)),
    );
    pulses = [];
    for (let i = 0; i < budget; i += 1) {
      const lane = i % measured.length;
      pulses.push({
        lane,
        /* px per second. Slow: this sits behind body copy. */
        speed: 34 + random() * 46,
        dist: random() * measured[lane].total,
        len: 46 + random() * 54,
      });
    }
    paintTraces();
  }

  function drawPulses() {
    ctx.strokeStyle = palette.pulse;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';

    for (const p of pulses) {
      const m = measured[p.lane];
      const head = pointAt(m, p.dist);
      const tail = pointAt(m, p.dist - p.len);
      /* A pulse spanning a bend would draw as a straight chord across the
         corner. Drawing it as a straight segment only when head and tail share
         an axis keeps it on the trace; otherwise the corner is drawn in two
         parts via the bend point. */
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      if (tail.x !== head.x && tail.y !== head.y) {
        ctx.lineTo(tail.x, head.y);
      }
      ctx.lineTo(head.x, head.y);
      ctx.stroke();

      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = palette.pulse;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    if (traceLayer) {
      ctx.drawImage(traceLayer, 0, 0, width, height);
    }
    drawPulses();
  }

  function frame(now) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    for (const p of pulses) {
      p.dist += p.speed * dt;
    }
    render();
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    render();
  }

  return {
    resize,
    refreshPalette() {
      palette = readPalette(canvas.parentElement ?? canvas);
      paintTraces();
      render();
    },
    start() {
      /* Reduced motion still gets the field — it is information-free
         decoration either way — but as a single static frame. Removing it
         entirely would leave a visibly emptier page for those readers; the
         thing they asked not to have is the movement. */
      if (reducedMotion || raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      traceLayer = null;
      pulses = [];
      measured = [];
      lanes = [];
    },
  };
}

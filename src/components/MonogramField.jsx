"use client";

import { useEffect, useRef } from "react";

// Particles are drawn in alpha buckets rather than per-particle: a fillStyle
// change is the expensive part of a 2,500-node frame, so each bucket becomes
// one path and one fill.
const BUCKETS = 6;
const BUCKET_BASE = 0.36;
const BUCKET_STEP = 0.06;

// Square side in CSS pixels. The sample grid is ~5-6px, so much past 3.4 the
// dots start touching and the field reads as a solid glyph instead of a mesh.
const DOT_SIZE = 3.2;

// How close the pointer gets before the monogram gives way, and how hard.
const PUSH_RADIUS = 150;
const PUSH_FORCE = 2.4;

// Spring back to the glyph, with enough damping that it settles instead of
// ringing. Together these decide how "liquid" the letters feel.
const SPRING = 0.02;
const DAMPING = 0.88;

// A pointer that hasn't moved for this long is treated as absent, which hands
// the field over to the ambient attractor.
const IDLE_AFTER = 2500;

// The navbar is fixed and sits over the top of the hero, so the space the
// monogram actually has starts below it — h-20 in Navbar.jsx.
const TOP_INSET = 80;

// Share of the free space the glyph fills. "NR" is about twice as wide as it is
// tall, so filling the height means the letters run past the side edges — the
// width cap is deliberately over 1 to allow that bleed rather than shrink the
// mark to fit. Whichever limit binds first wins.
const FILL_HEIGHT = 0.98;
const FILL_WIDTH = 1.05;

/**
 * The hero backdrop: a field of particles that rests in the shape of the NR
 * monogram and scatters away from the pointer before springing home.
 *
 * The whole frame is cleared every tick. The previous hero faded the backdrop
 * to 8% instead, which never fully erased older positions — the leftovers
 * slowly baked into a permanent mesh of streaks the longer the tab stayed open.
 */
export default function MonogramField({
  text = "NR",
  color = "15, 110, 99",
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let points = [];
    let buckets = [];
    let frame = null;

    const pointer = { x: -9999, y: -9999, idle: true, last: 0 };

    /**
     * Rasterise the wordmark offscreen, then keep every grid cell that landed
     * on a glyph. Sampling at CSS resolution is deliberate — this only needs to
     * locate the letters, not render them.
     */
    function sample() {
      if (!width || !height) return;

      // next/font ships Sora under a generated family name, and the CSS
      // variable is the only place that name is written down.
      const family = getComputedStyle(document.body)
        .getPropertyValue("--font-sora")
        .trim();

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;

      const octx = off.getContext("2d", { willReadFrequently: true });
      const stack = `${family || "sans-serif"}, sans-serif`;

      octx.fillStyle = "#000";
      octx.textAlign = "center";
      octx.textBaseline = "alphabetic";

      // Fit against the glyph's real ink box rather than the em box: the em box
      // carries line-height padding the letters never use, which is what left
      // the monogram short of the fold and clipped under the navbar.
      const free = Math.max(1, height - TOP_INSET);
      const probe = 100;
      octx.font = `700 ${probe}px ${stack}`;
      let m = octx.measureText(text);

      const unitH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const unitW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const size =
        probe *
        Math.min((free * FILL_HEIGHT) / unitH, (width * FILL_WIDTH) / unitW);

      octx.font = `700 ${size}px ${stack}`;
      m = octx.measureText(text);

      const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      // Centre the ink box in the free space, then draw from the baseline.
      const baseline =
        TOP_INSET + (free - inkH) / 2 + m.actualBoundingBoxAscent;
      const centre =
        width / 2 + (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2;

      octx.fillText(text, centre, baseline);

      const pixels = octx.getImageData(0, 0, width, height).data;

      // Widen the grid on large viewports so the particle count stays roughly
      // constant instead of growing with the area.
      let gap = Math.max(5, Math.round(Math.min(width, height) / 110));
      let found = [];

      for (let attempt = 0; attempt < 5; attempt += 1) {
        found = [];
        for (let y = 0; y < height; y += gap) {
          for (let x = 0; x < width; x += gap) {
            if (pixels[(y * width + x) * 4 + 3] > 128) found.push([x, y]);
          }
        }
        if (found.length <= 3000) break;
        gap += 2;
      }

      buckets = Array.from({ length: BUCKETS }, () => []);
      points = found.map(([hx, hy]) => {
        const point = {
          // Start scattered so the monogram assembles itself on load.
          x: hx + (Math.random() - 0.5) * 70,
          y: hy + (Math.random() - 0.5) * 70,
          hx,
          hy,
          vx: 0,
          vy: 0,
        };
        buckets[(Math.random() * BUCKETS) | 0].push(point);
        return point;
      });
    }

    function fit() {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);
      if (!nextWidth || !nextHeight) return;
      if (nextWidth === width && nextHeight === height) return;

      width = nextWidth;
      height = nextHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sample();
    }

    function paint() {
      ctx.clearRect(0, 0, width, height);
      for (let b = 0; b < BUCKETS; b += 1) {
        const list = buckets[b];
        if (!list.length) continue;
        ctx.fillStyle = `rgba(${color}, ${BUCKET_BASE + b * BUCKET_STEP})`;
        ctx.beginPath();
        const half = DOT_SIZE / 2;
        for (let i = 0; i < list.length; i += 1) {
          ctx.rect(list[i].x - half, list[i].y - half, DOT_SIZE, DOT_SIZE);
        }
        ctx.fill();
      }
    }

    function step(time) {
      // Touch devices never produce a hover, and a parked mouse is no better,
      // so an unattended field is driven by a slow wandering attractor rather
      // than freezing into a flat wordmark.
      if (!pointer.idle && time - pointer.last > IDLE_AFTER) pointer.idle = true;

      const px = pointer.idle
        ? width * (0.5 + 0.34 * Math.sin(time * 0.00021))
        : pointer.x;
      const py = pointer.idle
        ? height * (0.5 + 0.3 * Math.cos(time * 0.00017))
        : pointer.y;

      const radius2 = PUSH_RADIUS * PUSH_RADIUS;

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];

        p.vx += (p.hx - p.x) * SPRING;
        p.vy += (p.hy - p.y) * SPRING;

        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;

        if (d2 < radius2 && d2 > 1) {
          const d = Math.sqrt(d2);
          const force = (1 - d2 / radius2) * PUSH_FORCE;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      paint();
      frame = requestAnimationFrame(step);
    }

    function start() {
      if (frame === null) frame = requestAnimationFrame(step);
    }

    function stop() {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    }

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.idle = false;
      pointer.last = performance.now();
    };

    fit();

    // Sora resolves after first paint; sampling before it lands would trace the
    // fallback face instead, so redraw the glyph once the real one is ready.
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) sample();
      });
    }

    if (reduceMotion) {
      // Settle straight onto the glyph and paint once — no loop, no motion.
      points.forEach((p) => {
        p.x = p.hx;
        p.y = p.hy;
      });
      paint();
      return () => {
        cancelled = true;
      };
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(canvas);

    // Nothing to animate once the hero has scrolled away.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.01 }
    );
    visibility.observe(canvas);

    return () => {
      cancelled = true;
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [text, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

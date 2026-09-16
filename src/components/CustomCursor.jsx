"use client";

import { useEffect, useRef } from "react";

// How much of the remaining gap the caret closes each frame. Terminal carets
// feel snappy, so this is tight — just enough easing to avoid jitter.
const FOLLOW = 0.5;

const INTERACTIVE = "[data-cmd], a[href], button, [role='button'], label";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";

const slug = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * The shell command shown for a hovered element. An explicit `data-cmd` wins;
 * otherwise it's derived from what the element does, so plain links and
 * buttons get a sensible command without every component opting in.
 */
function commandFor(el) {
  if (el.dataset.cmd) return el.dataset.cmd;

  const href = el.getAttribute("href");
  if (href) {
    if (href === "#home" || href === "#") return "cd ~";
    if (href.startsWith("#")) return `cd ~/${href.slice(1)}`;
    if (href.startsWith("mailto:")) return `mail ${href.slice(7).split("@")[0]}`;
    if (href.startsWith("tel:")) return "call nikhil";
    if (el.hasAttribute("download")) return `wget ${href.split("/").pop()}`;
    try {
      const url = new URL(href, window.location.href);
      return url.origin === window.location.origin
        ? `cd ${url.pathname}`
        : `open ${url.hostname.replace(/^www\./, "")}`;
    } catch {
      return null;
    }
  }

  const name = slug(el.getAttribute("aria-label") || el.textContent || "");
  return name ? `run ${name}` : null;
}

/**
 * Terminal block caret. Blinks while idle, holds steady over anything
 * clickable and shows that element's shell command, and narrows to a text bar
 * over form fields. Positions are written straight to the DOM from a rAF loop
 * so the caret never waits on a React render.
 */
export default function CustomCursor() {
  const caretRef = useRef(null);
  const tipRef = useRef(null);
  const cmdRef = useRef(null);

  useEffect(() => {
    // Touch and pen-only devices keep their native behaviour.
    if (!window.matchMedia("(hover: hover)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const caret = caretRef.current;
    const tip = tipRef.current;
    const cmdText = cmdRef.current;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let visible = false;
    let hasCommand = false;
    let frame = null;

    const syncOpacity = () => {
      caret.style.opacity = visible ? "1" : "0";
      tip.style.opacity = visible && hasCommand ? "1" : "0";
    };

    const render = () => {
      caret.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (!hasCommand) return;
      // Sit below-right of the caret, but stay on screen near the edges.
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      const x = Math.max(8, Math.min(pos.x + 12, window.innerWidth - w - 8));
      const below = pos.y + 16;
      const y = below + h > window.innerHeight - 8 ? pos.y - h - 16 : below;
      tip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * FOLLOW;
      pos.y += (target.y - pos.y) * FOLLOW;
      render();

      // Stop once settled; the next mousemove restarts the loop.
      if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = null;
      }
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!visible || reduceMotion) {
        // Appear in place rather than sweeping in from the last exit point.
        pos.x = target.x;
        pos.y = target.y;
        visible = true;
        syncOpacity();
        render();
        if (reduceMotion) return;
      }
      if (frame === null) frame = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const field = e.target.closest?.(TEXT_FIELD);
      const el = field ? null : e.target.closest?.(INTERACTIVE);
      const cmd = el ? commandFor(el) : null;

      caret.dataset.mode = field ? "text" : el ? "link" : "idle";
      hasCommand = Boolean(cmd);
      if (cmd && cmdText.textContent !== cmd) cmdText.textContent = cmd;
      syncOpacity();
      render();
    };

    const onLeave = () => {
      visible = false;
      syncOpacity();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Hidden on touch screens via CSS, so server and client render the same. */}
      <div
        ref={caretRef}
        aria-hidden="true"
        data-mode="idle"
        className="cursor-caret pointer-events-none fixed left-0 top-0 z-[9999] hidden opacity-0 [@media(hover:hover)]:block"
      />

      <div
        ref={tipRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden whitespace-nowrap rounded-md border border-line bg-surface px-2 py-1 font-mono text-xs text-ink opacity-0 shadow-lg shadow-graphite/10 transition-opacity duration-150 [@media(hover:hover)]:block"
      >
        <span className="text-accent">$</span> <span ref={cmdRef} />
      </div>
    </>
  );
}

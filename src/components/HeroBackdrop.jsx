"use client";

import { useSyncExternalStore } from "react";
import MonogramField from "./MonogramField";

const WIDE = "(min-width: 768px)";

function subscribe(onChange) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(WIDE).matches;
// The server cannot know the screen, so it renders the phone backdrop; the
// canvas is only mounted on the client once the viewport is known to be wide.
const getServerSnapshot = () => false;

/**
 * Hero background. Tablet and desktop get the NR particle field. Phones get a
 * CSS-only backdrop instead: the canvas is busy behind small centred text, and
 * running a render loop on a phone costs battery for a decoration.
 */
export default function HeroBackdrop() {
  const wide = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (wide) return <MonogramField />;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Faint dot grid that fades toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--ink) 16%, transparent) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 45%, black 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 45%, black 25%, transparent 78%)",
        }}
      />

      {/* Slow-drifting accent glows. Each orb's transform belongs to the
          animate-blob keyframes alone; nothing else writes to it. */}
      <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-accent/25 blur-3xl animate-blob motion-reduce:animate-none" />
      <div className="absolute -right-20 top-1/2 h-64 w-64 rounded-full bg-graphite/20 blur-3xl animate-blob animation-delay-2000 motion-reduce:animate-none" />
      <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-accent/20 blur-3xl animate-blob animation-delay-4000 motion-reduce:animate-none" />
    </div>
  );
}

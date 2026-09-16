"use client";

import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

// The <html> class is the source of truth — the inline script in layout.js
// sets it before hydration — so this reads it rather than keeping its own copy.
function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
// The server can't know the theme; the icon settles on the first client render.
const getServerSnapshot = () => false;

export default function ThemeToggle({ className = "" }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage blocked (private browsing) — the choice just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      data-cmd={isDark ? "theme --light" : "theme --dark"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-line text-graphite transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
    </button>
  );
}

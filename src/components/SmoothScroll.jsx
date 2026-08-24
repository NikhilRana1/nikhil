"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/lenis";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    registerLenis(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        if (targetId === "#") return;
        const target = document.querySelector(targetId);
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });

    return () => {
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

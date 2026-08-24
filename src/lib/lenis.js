/**
 * Holds the live Lenis instance so components outside SmoothScroll can pause it.
 * A modal cannot rely on `overflow: hidden` alone — Lenis drives the scroll
 * itself and would keep moving the page behind the dialog.
 */
let instance = null;

export function registerLenis(lenis) {
  instance = lenis;
}

export function pauseScroll() {
  instance?.stop();
}

export function resumeScroll() {
  instance?.start();
}

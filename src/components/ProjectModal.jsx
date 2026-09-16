"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { FiX, FiArrowUpRight } from "react-icons/fi";
import { pauseScroll, resumeScroll } from "@/lib/lenis";

// Shown under the title — real deployment info rather than a decorative label.
function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Split reveal: the two halves fly in from opposite edges and meet, then the
 * writing staggers up. GSAP owns every transform in here — the panel, both
 * halves and the text lines — so nothing competes for the same property.
 */
export default function ProjectModal({ project, onClose }) {
  const rootRef = useRef(null);
  const backRef = useRef(null);
  const panelRef = useRef(null);
  const mediaRef = useRef(null);
  const bodyRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const tlRef = useRef(null);

  // The panel stays mounted for the whole close animation because onClose is
  // only called once the reverse finishes — so `project` is the single source
  // of truth and no prop needs mirroring into state.
  const finish = useCallback(() => {
    resumeScroll();
    openerRef.current?.focus?.();
    tlRef.current = null;
    onClose();
  }, [onClose]);

  const requestClose = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) {
      finish();
      return;
    }
    tl.eventCallback("onReverseComplete", finish);
    tl.timeScale(1.4).reverse();
  }, [finish]);

  // Build and play the opening timeline whenever a project is shown
  useEffect(() => {
    if (!project) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    openerRef.current = document.activeElement;
    pauseScroll();
    closeRef.current?.focus();

    const ctx = gsap.context(() => {
      const lines = bodyRef.current.querySelectorAll("[data-line]");

      // Explicit start state, explicit end state — nothing can strand halfway.
      gsap.set(backRef.current, { opacity: 0 });
      gsap.set(mediaRef.current, { xPercent: -102 });
      gsap.set(bodyRef.current, { xPercent: 102 });
      gsap.set(lines, { y: 20, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(backRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
        .to(mediaRef.current, { xPercent: 0, duration: 0.85, ease: "expo.out" }, 0.08)
        .to(bodyRef.current, { xPercent: 0, duration: 0.85, ease: "expo.out" }, 0.08)
        .to(
          lines,
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
          0.55
        );

      tlRef.current = tl;
      if (reduceMotion) tl.progress(1);
      else tl.play();
    }, rootRef);

    return () => ctx.revert();
  }, [project]);

  // Escape closes; Tab stays inside the dialog
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll(
        "a[href], button:not([disabled])"
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [project, requestClose]);

  if (!project) return null;

  const host = project.liveUrl ? hostOf(project.liveUrl) : null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100]">
      <div
        ref={backRef}
        onClick={requestClose}
        aria-hidden="true"
        className="absolute inset-0 bg-[#12161c]/60 backdrop-blur-md"
      />

      <div className="absolute inset-0 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-ink/25 md:grid-cols-2"
        >
          <button
            ref={closeRef}
            onClick={requestClose}
            data-cmd="exit"
            aria-label="Close project details"
            className="group absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#12161c]/70 text-white backdrop-blur transition-colors hover:bg-accent"
          >
            <FiX
              size={17}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </button>

          <div
            ref={mediaRef}
            className="relative aspect-[16/11] w-full overflow-hidden bg-sunken md:aspect-auto md:h-full md:min-h-[30rem]"
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl">
                🚀
              </div>
            )}
          </div>

          <div
            ref={bodyRef}
            className="flex flex-col justify-center p-7 sm:p-10"
          >
            <h3
              data-line
              id="project-modal-title"
              className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              {project.title}
            </h3>

            {host && (
              <p
                data-line
                className="mt-2 flex items-center gap-2 font-mono text-xs text-muted"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                {host}
              </p>
            )}

            <div data-line className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-accent/20 bg-accent-tint px-3 py-1 text-xs font-medium text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div data-line className="mt-6 h-px w-full bg-line" />

            <p data-line className="mt-6 leading-relaxed text-muted">
              {project.longDescription}
            </p>

            {project.liveUrl && (
              <div data-line className="mt-7">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-surface transition-colors hover:bg-accent-strong"
                >
                  Visit Live Site
                  <FiArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

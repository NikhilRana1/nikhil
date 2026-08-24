"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiBootstrap,
  SiMongodb,
  SiMysql,
  SiWordpress,
  SiGithub,
  SiLinux,
  SiGitlab,
} from "react-icons/si";
import { skills } from "@/lib/data";

// Icon, brand colour and bento footprint per skill name from data.js.
const SKILL_META = {
  React: { Icon: SiReact, color: "#149ECA", span: "feature" }, // React's on-light cyan
  "Next.js": { Icon: SiNextdotjs, color: "#12161C", span: "wide" }, // wordmark is black on light
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E", span: "wide" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#0EA5E9", span: "wide" },
  HTML: { Icon: SiHtml5, color: "#E34F26", span: "unit" },
  CSS: { Icon: SiCss, color: "#663399", span: "unit" },
  MongoDB: { Icon: SiMongodb, color: "#47A248", span: "unit" },
  MySQL: { Icon: SiMysql, color: "#4479A1", span: "unit" },
  WordPress: { Icon: SiWordpress, color: "#21759B", span: "unit" },
  Bootstrap: { Icon: SiBootstrap, color: "#7952B3", span: "unit" },
  GitHub: { Icon: SiGithub, color: "#181717", span: "unit" }, // GitHub's brand black
  Linux: { Icon: SiLinux, color: "#1A1A1A", span: "unit" }, // Tux is mostly black
  GitLab: { Icon: SiGitlab, color: "#FC6D26", span: "wide" },
};

const SPAN_CLASSES = {
  feature: "col-span-2 row-span-2",
  wide: "col-span-2",
  unit: "col-span-1",
};

// Grid order is authored rather than taken from data.js so the bento tiles
// interlock instead of leaving holes.
const LAYOUT = [
  "React",
  "Next.js",
  "JavaScript",
  "Tailwind CSS",
  "HTML",
  "CSS",
  "MongoDB",
  "MySQL",
  "WordPress",
  "Bootstrap",
  "GitHub",
  "Linux",
  "GitLab",
];

function SkillTile({ skill, featured }) {
  const meta = SKILL_META[skill.name];
  const Icon = meta?.Icon;

  return (
    <article
      data-tile
      className={`skill-tile group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-6 text-center ${
        SPAN_CLASSES[meta?.span ?? "unit"]
      } ${featured ? "min-h-[15rem]" : "min-h-[9rem]"}`}
      style={{ ["--brand"]: meta?.color ?? "#818cf8" }}
    >
      {/* Cursor-following spotlight, positioned from --mx / --my */}
      <span className="skill-tile__spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {Icon && (
        <Icon
          className={`skill-tile__icon relative shrink-0 ${
            featured ? "text-8xl" : "text-5xl"
          }`}
        />
      )}

      <h3
        className={`relative font-semibold text-ink ${
          featured ? "font-display text-2xl" : "text-base"
        }`}
      >
        {skill.name}
      </h3>
    </article>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const underlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);

  const ordered = LAYOUT.map((name) =>
    skills.find((s) => s.name === name)
  ).filter(Boolean);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const chars = headingRef.current.querySelectorAll("[data-char]");
      const tiles = Array.from(gridRef.current.querySelectorAll("[data-tile]"));

      // Explicit hidden state paired with explicit targets below, so no element
      // can be stranded mid-tween and left invisible.
      gsap.set(chars, { yPercent: 120, rotateX: -80, opacity: 0 });
      gsap.set(underlineRef.current, { scaleX: 0 });
      gsap.set(subtitleRef.current, { y: 20, opacity: 0, filter: "blur(8px)" });
      gsap.set(tiles, { y: 48, opacity: 0, scale: 0.94, transformPerspective: 900 });

      const intro = gsap.timeline({ paused: true });
      intro
        .to(chars, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
        })
        .to(
          underlineRef.current,
          { scaleX: 1, duration: 0.7, ease: "power2.out" },
          "-=0.35"
        )
        .to(
          subtitleRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          tiles,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.055,
          },
          "-=0.35"
        );

      if (reduceMotion) {
        intro.progress(1);
        return;
      }

      // IntersectionObserver rather than ScrollTrigger: it reports synchronously
      // when the section is already on screen (e.g. a deep link to #skills),
      // with no dependence on refresh ordering.
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            intro.play();
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(sectionRef.current);

      // Safety net: an unrevealed grid is never an acceptable resting state.
      const failsafe = window.setTimeout(() => {
        if (!intro.progress() && !intro.isActive()) {
          intro.progress(1);
          observer.disconnect();
        }
      }, 3000);

      // --- 3D tilt + spotlight ---
      // quickTo keeps this off React's render path, and GSAP stays the sole
      // owner of each tile's transform so nothing fights over it.
      const tiltCleanups = tiles.map((tile) => {
        const rotX = gsap.quickTo(tile, "rotationX", {
          duration: 0.5,
          ease: "power3",
        });
        const rotY = gsap.quickTo(tile, "rotationY", {
          duration: 0.5,
          ease: "power3",
        });
        const lift = gsap.quickTo(tile, "y", { duration: 0.5, ease: "power3" });

        const move = (event) => {
          const rect = tile.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          rotY((px - 0.5) * 14);
          rotX((0.5 - py) * 14);
          lift(-6);
          tile.style.setProperty("--mx", `${px * 100}%`);
          tile.style.setProperty("--my", `${py * 100}%`);
        };

        const leave = () => {
          rotX(0);
          rotY(0);
          lift(0);
        };

        tile.addEventListener("mousemove", move);
        tile.addEventListener("mouseleave", leave);
        return () => {
          tile.removeEventListener("mousemove", move);
          tile.removeEventListener("mouseleave", leave);
        };
      });

      return () => {
        window.clearTimeout(failsafe);
        observer.disconnect();
        tiltCleanups.forEach((fn) => fn());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden bg-ground py-24"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h2
            ref={headingRef}
            className="inline-flex overflow-hidden font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
            aria-label="Skills"
          >
            {"Skills".split("").map((char, i) => (
              <span key={i} data-char className="inline-block">
                {char}
              </span>
            ))}
          </h2>
          <div
            ref={underlineRef}
            className="mx-auto mt-3 h-1 w-24 origin-left rounded-full bg-accent"
          />
        </div>

        <p
          ref={subtitleRef}
          className="mx-auto mb-14 max-w-2xl text-center text-muted"
        >
          Technologies and tools I work with.
        </p>

        {/* Bento grid. Capped at four columns: the authored spans tile without
            gaps at 2 and at 4, whereas six leaves the last row part empty. */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {ordered.map((skill) => (
            <SkillTile
              key={skill.name}
              skill={skill}
              featured={SKILL_META[skill.name]?.span === "feature"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

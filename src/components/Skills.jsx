"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiBootstrap,
  SiNodedotjs,
  SiMongodb,
  SiMysql,
  SiDocker,
  SiGit,
  SiGithub,
  SiGitlab,
  SiLinux,
  SiWordpress,
  SiGithubactions,
  SiHostinger,
} from "react-icons/si";
import { TbNetwork, TbServer2, TbCloudCog } from "react-icons/tb";
import { skillCategories } from "@/lib/data";

// data.js stores icon keys as strings so it stays free of component imports.
const ICONS = {
  react: SiReact,
  nextjs: SiNextdotjs,
  javascript: SiJavascript,
  html: SiHtml5,
  css: SiCss,
  tailwind: SiTailwindcss,
  bootstrap: SiBootstrap,
  node: SiNodedotjs,
  mongodb: SiMongodb,
  mysql: SiMysql,
  docker: SiDocker,
  cicd: SiGithubactions,
  git: SiGit,
  github: SiGithub,
  gitlab: SiGitlab,
  linux: SiLinux,
  networking: TbNetwork,
  vps: TbServer2,
  cloudpanel: TbCloudCog,
  hostinger: SiHostinger,
  wordpress: SiWordpress,
};

// Relative luminance of a #rrggbb colour, 0 (black) to 1 (white).
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function SkillCard({ skill }) {
  const Icon = ICONS[skill.icon];

  return (
    <li
      data-skill
      className="skill-card group relative flex min-h-[8.5rem] min-w-0 flex-col items-center justify-center gap-4 rounded-xl border border-line bg-surface px-3 py-6"
      style={{ ["--brand"]: skill.color }}
      data-mono={luminance(skill.color) < 0.08 || undefined}
    >
      {Icon && <Icon className="skill-card__icon shrink-0 text-5xl" />}
      <span className="text-center text-sm font-medium leading-tight text-ink">
        {skill.name}
      </span>
    </li>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const underlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const spineRef = useRef(null);
  const groupsRef = useRef([]);

  const totalSkills = skillCategories.reduce((n, c) => n + c.skills.length, 0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const chars = headingRef.current.querySelectorAll("[data-char]");
      const groups = groupsRef.current.filter(Boolean);

      // --- Header: explicit set + to, so nothing can strand mid-tween ---
      gsap.set(chars, { yPercent: 120, rotateX: -80, opacity: 0 });
      gsap.set(underlineRef.current, { scaleX: 0 });
      gsap.set(subtitleRef.current, { y: 20, opacity: 0, filter: "blur(8px)" });

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
        );

      // --- Each category reveals as its own unit ---
      const groupTimelines = groups.map((group) => {
        const node = group.querySelector("[data-node]");
        const label = group.querySelector("[data-label]");
        const meta = group.querySelector("[data-meta]");
        const cards = group.querySelectorAll("[data-skill]");

        gsap.set(node, { scale: 0, opacity: 0 });
        gsap.set(label, { xPercent: -8, opacity: 0 });
        gsap.set(meta, { opacity: 0 });
        gsap.set(cards, { y: 24, opacity: 0, scale: 0.96 });

        const tl = gsap.timeline({ paused: true });
        tl.to(node, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" })
          .to(
            label,
            { xPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
            "-=0.25"
          )
          .to(meta, { opacity: 1, duration: 0.4 }, "-=0.35")
          .to(
            cards,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.045,
              ease: "power2.out",
            },
            "-=0.3"
          );
        return tl;
      });

      if (reduceMotion) {
        intro.progress(1);
        groupTimelines.forEach((tl) => tl.progress(1));
        gsap.set(spineRef.current, { scaleY: 1 });
        return;
      }

      // IntersectionObserver rather than ScrollTrigger for the reveals: it
      // reports synchronously when a target is already on screen (deep link to
      // #skills), with no dependence on refresh ordering.
      const observers = [];
      const watch = (target, tl) => {
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              tl.play();
              io.disconnect();
            }
          },
          { threshold: 0.2 }
        );
        io.observe(target);
        observers.push(io);
      };

      watch(sectionRef.current, intro);
      groups.forEach((group, i) => watch(group, groupTimelines[i]));

      // Safety net: an unrevealed section is never an acceptable resting state.
      const failsafe = window.setTimeout(() => {
        [intro, ...groupTimelines].forEach((tl) => {
          if (!tl.progress() && !tl.isActive()) tl.progress(1);
        });
        observers.forEach((io) => io.disconnect());
      }, 3500);

      // --- The spine draws in step with scroll through the section ---
      // Scrubbed rather than played: the line is a scroll position readout, so
      // it should track the scrollbar exactly.
      gsap.set(spineRef.current, { scaleY: 0, transformOrigin: "top center" });
      const spine = gsap.to(spineRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          end: "bottom 85%",
          // Unsmoothed: the line is a readout of scroll position, so it should
          // track the scrollbar exactly rather than easing behind it.
          scrub: true,
        },
      });

      return () => {
        window.clearTimeout(failsafe);
        observers.forEach((io) => io.disconnect());
        spine.scrollTrigger?.kill();
        spine.kill();
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
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          className="mx-auto mb-16 max-w-2xl text-center text-muted"
        >
          {totalSkills} technologies, grouped by where they sit in the stack —
          from the interface down to the servers it runs on.
        </p>

        {/* Categories, threaded onto a single spine */}
        <div className="relative">
          {/* Spine track + the drawn line on top of it */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-line sm:block"
          />
          <div
            ref={spineRef}
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-accent sm:block"
          />

          <div className="flex flex-col gap-14">
            {skillCategories.map((category, index) => (
              <div
                key={category.id}
                ref={(el) => {
                  groupsRef.current[index] = el;
                }}
                className="relative sm:pl-12"
              >
                {/* Spine node */}
                <span
                  data-node
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 hidden h-[15px] w-[15px] rounded-full border-2 border-accent bg-ground sm:block"
                />

                <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3
                    data-label
                    className="font-display text-xl font-bold text-ink"
                  >
                    {category.label}
                  </h3>
                  <p data-meta className="font-mono text-xs text-muted">
                    {category.blurb} · {category.skills.length}
                  </p>
                </div>

                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                  {category.skills.map((skill) => (
                    <SkillCard key={skill.name} skill={skill} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

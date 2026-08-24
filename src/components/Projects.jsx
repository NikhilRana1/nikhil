"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { projects } from "@/lib/data";
import { ScrollReveal, SlideReveal, BlurReveal } from "./ScrollAnimations";

export default function Projects() {
  const sectionRef = useRef(null);
  const slotsRef = useRef([]);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Sticky stacking is a desktop effect; below this the cards simply stack.
    const stacks = window.matchMedia("(min-width: 768px)").matches;
    if (reduceMotion || !stacks) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const slots = slotsRef.current.filter(Boolean);

      slots.forEach((slot, i) => {
        const card = slot.querySelector("[data-card]");
        const next = slots[i + 1];
        if (!card || !next) return;

        // As the following slot climbs over this card, the card recedes.
        // fromTo, and scrubbed: both ends are explicit and the value is driven
        // entirely by scroll position, so it can never strand part-way.
        gsap.fromTo(
          card,
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.93,
            filter: "brightness(0.9)",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    /* No overflow-hidden anywhere up this chain: it would turn an ancestor into
       the scroll container and kill position: sticky. */
    <section id="projects" ref={sectionRef} className="bg-ground py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mb-4">
          <SlideReveal direction="left" bgColor="bg-accent">
            <h2 className="text-center font-display text-3xl font-bold text-ink sm:text-4xl">
              My Projects
            </h2>
          </SlideReveal>
        </ScrollReveal>

        <BlurReveal delay={0.2} className="mb-16">
          <p className="mx-auto max-w-2xl text-center text-muted">
            Here are some of the projects I&apos;ve worked on. Each project is a unique
            piece of development.
          </p>
        </BlurReveal>

        {/* One shared container: each item sticks within the WHOLE deck, so
            earlier cards stay pinned and pile up instead of scrolling away. */}
        <div className="flex flex-col gap-6 md:block">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              ref={(el) => {
                slotsRef.current[index] = el;
              }}
              className="deck-item"
              // Each card parks a little lower than the one before, so the
              // stack shows its edges instead of hiding them exactly behind.
              style={{ "--stack-top": `${6 + index * 1.5}rem` }}
            >
              <ProjectCard
                project={project}
                index={index}
                total={projects.length}
                onOpen={setActiveProject}
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}

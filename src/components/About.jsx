"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  personalInfo,
  experiences,
  education,
  skillCategories,
} from "@/lib/data";
import {
  ScrollReveal,
  TextReveal,
  ParallaxWrapper,
  SlideReveal,
  StaggerChildren,
} from "./ScrollAnimations";

export default function About() {
  const [role] = experiences;
  const [degree] = education;
  const techCount = skillCategories.reduce((n, c) => n + c.skills.length, 0);

  const facts = [
    { label: "Role", value: personalInfo.title },
    { label: "Currently", value: role.company, meta: role.duration },
    { label: "Based in", value: personalInfo.location },
    { label: "Education", value: degree.qualification, meta: degree.institution },
    { label: "Toolkit", value: `${techCount} technologies`, meta: skillCategories.map((c) => c.label).join(" · ") },
  ];

  return (
    <section id="about" className="py-24 bg-sunken overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal direction="up" className="mb-12">
          <SlideReveal direction="left" bgColor="bg-accent">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-ink">
              About Me
            </h2>
          </SlideReveal>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content with Staggered Text Reveals */}
          <StaggerChildren
            staggerDelay={0.2}
            direction="left"
            className="space-y-6"
          >
            <TextReveal
              text={`Hello! I'm ${personalInfo.name}, a passionate Frontend Developer focused on building modern, responsive, and user-friendly web experiences. I enjoy turning ideas into real-world digital products using technologies like HTML, CSS, JavaScript, React, and Next.js.`}
              className="text-muted leading-relaxed"
              staggerDelay={0.03}
            />
            <TextReveal
              text="I love creating clean UI designs, smooth user experiences, and performant applications that not only look good but also solve real problems. As a developer, I'm constantly learning new technologies and improving my skills to stay updated with the latest trends in web development."
              className="text-muted leading-relaxed"
              delay={0.3}
              staggerDelay={0.03}
            />
            <TextReveal
              text="Currently, I'm working on personal and client projects, exploring full-stack development, and sharpening my problem-solving abilities. My goal is to build impactful digital experiences that combine creativity with functionality. When I'm not coding, you'll usually find me exploring new tech, experimenting with AI tools, or enjoying a good cup of coffee."
              className="text-muted leading-relaxed"
              delay={0.6}
              staggerDelay={0.03}
            />
          </StaggerChildren>

          {/* Profile card — every value comes from data.js, so it stays true
              to the resume rather than drifting into decoration. */}
          <ScrollReveal direction="right" delay={0.3}>
            <div className="flex justify-center">
              <ParallaxWrapper speed={-0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-7 shadow-xl shadow-graphite/10"
                >
                  {/* Accent rail marks this as the identity card */}
                  <span className="absolute left-0 top-7 bottom-7 w-[3px] rounded-full bg-accent" />

                  <Image
                    src="/images/logo.png"
                    alt={personalInfo.name}
                    width={505}
                    height={257}
                    className="mb-6 h-20 w-auto"
                  />

                  <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-tint px-3 py-1 text-xs font-medium text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Available for opportunities
                  </span>

                  <dl className="flex flex-col gap-4">
                    {facts.map((fact) => (
                      <div key={fact.label} className="flex flex-col gap-0.5">
                        <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                          {fact.label}
                        </dt>
                        <dd className="text-sm font-semibold text-ink">{fact.value}</dd>
                        {fact.meta && (
                          <dd className="text-xs text-muted">{fact.meta}</dd>
                        )}
                      </div>
                    ))}
                  </dl>
                </motion.div>
              </ParallaxWrapper>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

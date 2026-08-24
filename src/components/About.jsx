"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import {
  ScrollReveal,
  TextReveal,
  ParallaxWrapper,
  SlideReveal,
  StaggerChildren,
} from "./ScrollAnimations";

export default function About() {
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

          {/* Avatar with Parallax */}
          <ScrollReveal direction="right" delay={0.3}>
            <div className="flex justify-center">
              <ParallaxWrapper speed={-0.2}>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative w-64 h-64"
                >
                  {/* Animated background rings */}
                  <div className="absolute inset-0 bg-accent rounded-full animate-pulse opacity-15 scale-110" />
                  <div className="absolute inset-0 bg-graphite rounded-full animate-pulse opacity-10 scale-105" style={{ animationDelay: '0.5s' }} />
                  <div className="w-full h-full bg-surface border border-line rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-graphite/10">
                    <motion.span
                      className="text-6xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      👨‍💻
                    </motion.span>
                  </div>
                </motion.div>
              </ParallaxWrapper>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

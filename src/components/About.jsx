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
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal direction="up" className="mb-12">
          <SlideReveal direction="left" bgColor="bg-indigo-500">
            <h2 className="text-3xl sm:text-4xl font-bold text-center">
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
              text={`Hello! I'm ${personalInfo.name}, a passionate developer based in ${personalInfo.location}. I enjoy creating things that live on the internet, whether that be websites, applications, or anything in between.`}
              className="text-gray-600 dark:text-gray-400 leading-relaxed"
              staggerDelay={0.03}
            />
            <TextReveal
              text="My goal is to always build products that provide pixel-perfect, performant experiences. I'm constantly learning and exploring new technologies to stay up-to-date with the latest industry trends."
              className="text-gray-600 dark:text-gray-400 leading-relaxed"
              delay={0.3}
              staggerDelay={0.03}
            />
            <TextReveal
              text="When I'm not coding, you can find me exploring new technologies, contributing to open source, or enjoying a good cup of coffee."
              className="text-gray-600 dark:text-gray-400 leading-relaxed"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20 scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-full animate-pulse opacity-20 scale-105" style={{ animationDelay: '0.5s' }} />
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative z-10">
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

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { skills } from "@/lib/data";
import {
  ScrollReveal,
  SlideReveal,
  BlurReveal,
} from "./ScrollAnimations";

function SkillBar({ skill, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex justify-between mb-2">
        <motion.span
          className="font-medium group-hover:text-indigo-500 transition-colors"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {skill.name}
        </motion.span>
        <motion.span
          className="text-gray-500 tabular-nums"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
        {/* Background shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={isInView ? { x: "200%" } : {}}
          transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "easeInOut" }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full relative"
        >
          {/* Glow effect on the end */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full blur-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 1, 0.5] } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal direction="up" className="mb-4">
          <SlideReveal direction="right" bgColor="bg-purple-500">
            <h2 className="text-3xl sm:text-4xl font-bold text-center">
              Skills
            </h2>
          </SlideReveal>
        </ScrollReveal>

        <BlurReveal delay={0.2} className="mb-12">
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </BlurReveal>

        {/* Skills Grid with Staggered Animations */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

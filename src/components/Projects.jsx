"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "@/lib/data";
import {
  ScrollReveal,
  SlideReveal,
  BlurReveal,
} from "./ScrollAnimations";

export default function Projects() {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section id="projects" className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal direction="up" className="mb-4">
          <SlideReveal direction="left" bgColor="bg-pink-500">
            <h2 className="text-3xl sm:text-4xl font-bold text-center">
              My Projects
            </h2>
          </SlideReveal>
        </ScrollReveal>

        <BlurReveal delay={0.2} className="mb-12">
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            Here are some of the projects I've worked on. Each project is a unique piece of development.
          </p>
        </BlurReveal>

        {/* Projects Grid with Staggered Animation */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div key={project.slug} variants={itemVariants}>
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

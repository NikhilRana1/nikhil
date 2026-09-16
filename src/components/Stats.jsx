"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp, ScaleOnScroll } from "./ScrollAnimations";
import { stats } from "@/lib/data";

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center group"
    >
      {/* Counter with glow effect */}
      <div className="relative">
        <div className="font-display text-4xl sm:text-5xl font-bold text-surface dark:text-ink mb-2 relative z-10 tabular-nums">
          <CountUp
            end={stat.value}
            suffix={stat.suffix}
            delay={index * 0.15}
            duration={2.5}
          />
        </div>
        {/* Glow effect behind number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : {}}
          transition={{ delay: index * 0.15 + 0.5 }}
          className="absolute inset-0 bg-accent/40 blur-xl rounded-full"
        />
      </div>

      {/* Label with slide up */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.4 }}
        className="text-surface/70 dark:text-muted text-sm sm:text-base"
      >
        {stat.label}
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
        className="h-0.5 bg-accent mt-4 mx-auto max-w-[60%] origin-left"
      />
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-16 bg-ink overflow-hidden relative dark:bg-surface dark:border-y dark:border-line">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/15 rounded-full blur-3xl"
        />
      </div>

      <ScaleOnScroll scaleRange={[0.95, 1]}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </ScaleOnScroll>
    </section>
  );
}

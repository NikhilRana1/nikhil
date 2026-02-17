"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp, ScaleOnScroll } from "./ScrollAnimations";

const stats = [
  { value: 1, suffix: "+", label: "Years Experience", icon: "📅" },
  { value: 12, suffix: "+", label: "Projects Completed", icon: "🚀" },
  { value: 30, suffix: "+", label: "Happy Clients", icon: "😄" },
  { value: 99, suffix: "%", label: "Client Satisfaction", icon: "⭐" },
];

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
      {/* Icon with bounce animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{
          type: "spring",
          stiffness: 200,
          delay: index * 0.15 + 0.3,
        }}
        className="text-3xl mb-2 group-hover:animate-bounce"
      >
        {stat.icon}
      </motion.div>

      {/* Counter with glow effect */}
      <div className="relative">
        <div className="text-4xl sm:text-5xl font-bold text-white mb-2 relative z-10">
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
          className="absolute inset-0 bg-white/20 blur-xl rounded-full"
        />
      </div>

      {/* Label with slide up */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.4 }}
        className="text-white/80 text-sm sm:text-base"
      >
        {stat.label}
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
        className="h-0.5 bg-white/30 mt-4 mx-auto max-w-[60%] origin-left"
      />
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden relative">
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
          className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"
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
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"
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

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { personalInfo } from "@/lib/data";
import {
  ScrollReveal,
  SlideReveal,
  BlurReveal,
  MagneticButton,
  StaggerChildren,
} from "./ScrollAnimations";

function ContactInfoItem({ icon: Icon, title, children, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex items-center gap-4 group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        className="p-3 bg-accent-tint rounded-full transition-colors group-hover:bg-accent"
      >
        <Icon className="text-accent transition-colors group-hover:text-surface" size={20} />
      </motion.div>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        {children}
      </div>
    </motion.div>
  );
}

function FormInput({ type = "text", placeholder, rows, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const baseClasses = "w-full px-4 py-3 bg-surface text-ink placeholder:text-muted rounded-lg border border-line transition-all duration-300 hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {rows ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </motion.div>
  );
}

export default function Contact() {
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  return (
    <section id="contact" className="py-24 overflow-hidden bg-sunken">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal direction="up" className="mb-4">
          <SlideReveal direction="right" bgColor="bg-accent">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-ink">
              Get In Touch
            </h2>
          </SlideReveal>
        </ScrollReveal>

        <BlurReveal delay={0.2} className="mb-12">
          <p className="text-muted text-center max-w-2xl mx-auto">
            I&apos;m currently open for new opportunities. Whether you have a question or just want to say hi, feel free to reach out!
          </p>
        </BlurReveal>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <ContactInfoItem icon={FaEnvelope} title="Email" index={0}>
              <MagneticButton
                as="a"
                href={`mailto:${personalInfo.email}`}
                strength={0.3}
                className="text-muted hover:text-accent transition-colors inline-block"
              >
                {personalInfo.email}
              </MagneticButton>
            </ContactInfoItem>

            <ContactInfoItem icon={FaMapMarkerAlt} title="Location" index={1}>
              <p className="text-muted">{personalInfo.location}</p>
            </ContactInfoItem>

            {/* Decorative element */}
            <ScrollReveal direction="left" delay={0.4}>
              <div className="mt-8 p-6 bg-surface rounded-xl border-l-4 border-accent border-y border-r border-y-line border-r-line">
                <p className="text-sm text-muted italic">
                  &ldquo;The best way to predict the future is to create it.&rdquo;
                </p>
                <p className="text-xs text-accent mt-2"></p>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <motion.form
            ref={formRef}
            initial={{ opacity: 0, x: 30 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <FormInput placeholder="Your Name" index={0} />
            <FormInput type="email" placeholder="Your Email" index={1} />
            <FormInput placeholder="Your Message" rows={4} index={2} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <MagneticButton
                type="submit"
                strength={0.2}
                className="w-full py-3 bg-accent text-surface rounded-lg hover:bg-accent-strong transition-all duration-300 font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10">Send Message</span>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />
              </MagneticButton>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

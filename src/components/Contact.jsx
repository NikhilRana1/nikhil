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
        className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full transition-colors
         group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900"
      >
        <Icon className="text-blue-600 dark:text-blue-400 group-hover:text-indigo-600
         dark:group-hover:text-indigo-400 transition-colors" size={20} />
      </motion.div>
      <div>
        <h3 className="font-medium">{title}</h3>
        {children}
      </div>
    </motion.div>
  );
}

function FormInput({ type = "text", placeholder, rows, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const baseClasses = "w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border border-transparent hover:border-indigo-300 dark:hover:border-indigo-700";

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
    <section id="contact" className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal direction="up" className="mb-4">
          <SlideReveal direction="right" bgColor="bg-blue-500">
            <h2 className="text-3xl sm:text-4xl font-bold text-center">
              Get In Touch
            </h2>
          </SlideReveal>
        </ScrollReveal>

        <BlurReveal delay={0.2} className="mb-12">
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            I'm currently open for new opportunities. Whether you have a question or just want to say hi, feel free to reach out!
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
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
              >
                {personalInfo.email}
              </MagneticButton>
            </ContactInfoItem>

            <ContactInfoItem icon={FaMapMarkerAlt} title="Location" index={1}>
              <p className="text-gray-600 dark:text-gray-400">
                {personalInfo.location}
              </p>
            </ContactInfoItem>

            {/* Decorative element */}
            <ScrollReveal direction="left" delay={0.4}>
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "The best way to predict the future is to create it."
                </p>
                <p className="text-xs text-indigo-500 mt-2"></p>
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
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600
                 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium relative overflow-hidden group"
              >
                <span className="relative z-10">Send Message</span>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
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

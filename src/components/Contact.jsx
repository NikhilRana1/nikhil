"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { FiDownload, FiCheck } from "react-icons/fi";
import { personalInfo } from "@/lib/data";
import {
  ScrollReveal,
  SlideReveal,
  BlurReveal,
  MagneticButton,
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

function FormInput({
  type = "text",
  name,
  placeholder,
  rows,
  index,
  value,
  onChange,
  disabled,
  maxLength,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const baseClasses =
    "w-full px-4 py-3 bg-surface text-ink placeholder:text-muted rounded-lg border border-line transition-all duration-300 hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {rows ? (
        <textarea
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          required
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          required
          className={baseClasses}
        />
      )}
    </motion.div>
  );
}

const EMPTY_FORM = { name: "", email: "", message: "" };

export default function Contact() {
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      setStatus("sent");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  const isSending = status === "sending";

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

            <ContactInfoItem icon={FaPhone} title="Phone" index={1}>
              <MagneticButton
                as="a"
                href={`tel:${personalInfo.phone.replace(/[^+\d]/g, "")}`}
                strength={0.3}
                className="text-muted hover:text-accent transition-colors inline-block"
              >
                {personalInfo.phone}
              </MagneticButton>
            </ContactInfoItem>

            <ContactInfoItem icon={FaMapMarkerAlt} title="Location" index={2}>
              <p className="text-muted">{personalInfo.location}</p>
            </ContactInfoItem>

            <ScrollReveal direction="left" delay={0.3}>
              <a
                href={personalInfo.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-85"
              >
                <FiDownload size={16} />
                Download Resume
              </a>
            </ScrollReveal>

            {/* Decorative element */}
            <ScrollReveal direction="left" delay={0.5}>
              <div className="mt-8 p-6 bg-surface rounded-xl border-l-4 border-accent border-y border-r border-y-line border-r-line">
                <p className="text-sm text-muted italic">
                  &ldquo;The best way to predict the future is to create it.&rdquo;
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <FormInput
              name="name"
              placeholder="Your Name"
              index={0}
              value={form.name}
              onChange={handleChange}
              disabled={isSending}
              maxLength={100}
            />
            <FormInput
              type="email"
              name="email"
              placeholder="Your Email"
              index={1}
              value={form.email}
              onChange={handleChange}
              disabled={isSending}
              maxLength={200}
            />
            <FormInput
              name="message"
              placeholder="Your Message"
              rows={4}
              index={2}
              value={form.message}
              onChange={handleChange}
              disabled={isSending}
              maxLength={5000}
            />

            {status === "error" && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {status === "sent" && (
              <p className="flex items-center gap-2 text-sm font-medium text-accent" role="status">
                <FiCheck size={16} />
                Message sent — I&apos;ll get back to you soon!
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <MagneticButton
                type="submit"
                strength={0.2}
                disabled={isSending}
                className="w-full py-3 bg-accent text-surface rounded-lg hover:bg-accent-strong transition-all duration-300 font-semibold relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isSending ? "Sending..." : "Send Message"}
                </span>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
                  whileHover={{ x: isSending ? "-100%" : "200%" }}
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

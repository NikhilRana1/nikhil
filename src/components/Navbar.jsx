"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import { navLinks, personalInfo } from "@/lib/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // The logo art may not be in place yet; fall back to the wordmark rather than
  // showing a broken image.
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-surface/85 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#home" className="flex items-center" aria-label={`${personalInfo.name} — home`}>
            {logoFailed ? (
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                {personalInfo.name}
              </span>
            ) : (
              <Image
                src="/images/logo.png"
                alt={personalInfo.name}
                width={505}
                height={257}
                priority
                onError={() => setLogoFailed(true)}
                className="h-12 w-auto sm:h-14"
              />
            )}
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-accent"
              >
                {link.name}
              </a>
            ))}

            <a
              href={personalInfo.resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-accent px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-surface"
            >
              <FiDownload size={15} />
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-ink"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 text-sm font-medium text-muted transition-colors hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <a
              href={personalInfo.resumeUrl}
              download
              onClick={() => setIsOpen(false)}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-accent px-3.5 py-2 text-sm font-semibold text-accent"
            >
              <FiDownload size={15} />
              Download Resume
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

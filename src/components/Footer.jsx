"use client";

import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";
import { personalInfo } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-ground border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm flex items-center gap-1">
            © {currentYear} {personalInfo.name}. {" "}
            
          </p>

          <div className="flex gap-4">
            <a
              href={personalInfo.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-graphite hover:text-accent transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href={personalInfo.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-graphite hover:text-accent transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
            {/* <a
              href={personalInfo.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-graphite hover:text-accent transition-colors"
            >
              <FaTwitter size={20} />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

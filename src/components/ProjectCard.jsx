"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useState } from "react";

export default function ProjectCard({ project, index }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = (y - centerY) / 10;
    const rotateYValue = (centerX - x) / 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="bg-surface rounded-xl overflow-hidden border border-line shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-graphite/10"
    >
      <div className="relative h-64 bg-sunken">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={index === 0}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🚀
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-bold mb-2 text-ink">{project.title}</h3>
        <p className="text-muted mb-4 text-sm leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-accent-tint text-accent text-xs font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-semibold text-accent hover:underline"
          >
            View Details →
          </Link>

          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-graphite transition-colors hover:text-accent"
              >
                <FaGithub size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-graphite transition-colors hover:text-accent"
              >
                <FaExternalLinkAlt size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

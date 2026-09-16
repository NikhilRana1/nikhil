"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * A card in the sticky stack. Deliberately has no transform of its own:
 * the stacking effect in Projects.jsx scales and dims these cards on scroll,
 * and a second writer on `transform` (the old mouse tilt) would fight it.
 */
export default function ProjectCard({ project, index, total, onOpen }) {
  return (
    <article
      data-card
      className="stack-card grid overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-graphite/10 md:min-h-[24rem] md:grid-cols-2"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-sunken md:aspect-auto md:h-full">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
            priority={index === 0}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            🚀
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
        <p className="font-mono text-xs tracking-wider text-accent">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {project.title}
        </h3>

        <p className="text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-accent/20 bg-accent-tint px-3 py-1 text-xs font-medium text-accent"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpen(project)}
            data-cmd={`open ./${project.slug}`}
            aria-label={`View details for ${project.title}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-accent-strong"
          >
            View Details
            <span aria-hidden="true">→</span>
          </button>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              Live site
              <FiArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

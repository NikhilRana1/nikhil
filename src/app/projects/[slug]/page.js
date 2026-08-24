import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import { projects } from "@/lib/data";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent mb-8"
        >
          <FaArrowLeft />
          Back to Projects
        </Link>

        <div className="relative h-64 sm:h-96 bg-sunken border border-line rounded-xl overflow-hidden mb-8">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🚀
            </div>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-ink">{project.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-accent-tint text-accent text-xs font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mb-8">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-surface rounded-lg hover:opacity-85 transition-opacity"
            >
              <FaGithub />
              View Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-surface rounded-lg hover:bg-accent-strong transition-colors"
            >
              <FaExternalLinkAlt />
              Live Demo
            </a>
          )}
        </div>

        <div className="max-w-none">
          <h2 className="font-display text-xl font-bold mb-3 text-ink">About This Project</h2>
          <p className="text-muted leading-relaxed">
            {project.longDescription}
          </p>
        </div>
      </div>
    </main>
  );
}

import {
  personalInfo,
  skillCategories,
  projects,
  experiences,
  education,
  stats,
} from "./data";

/**
 * Serializes the same facts the site already renders into plain text for the
 * assistant's system prompt. This is generated from data.js on every request
 * rather than duplicated by hand, so the chatbot can never drift out of sync
 * with what a visitor can see on the page — update the resume once, in one
 * file, and both the site and the assistant follow.
 */
export function buildPortfolioContext() {
  const skillsText = skillCategories
    .map((c) => `- ${c.label}: ${c.skills.map((s) => s.name).join(", ")}`)
    .join("\n");

  const projectsText = projects
    .map((p, i) => {
      const links = [
        p.liveUrl && `Live: ${p.liveUrl}`,
        p.githubUrl && `GitHub: ${p.githubUrl}`,
      ]
        .filter(Boolean)
        .join(" | ");
      return [
        `${i + 1}. ${p.title}`,
        `   What it is: ${p.description}`,
        `   Details: ${p.longDescription}`,
        `   Built with: ${p.technologies.join(", ")}`,
        links && `   ${links}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const experienceText = experiences
    .map((e) =>
      [
        `${e.title} at ${e.company} (${e.duration})`,
        ...e.highlights.map((h) => `- ${h}`),
      ].join("\n")
    )
    .join("\n\n");

  const educationText = education
    .map((e) => `- ${e.qualification} — ${e.institution}`)
    .join("\n");

  const statsText = stats.map((s) => `${s.value}${s.suffix} ${s.label}`).join(", ");

  return `
NAME: ${personalInfo.name}
TITLE: ${personalInfo.title}
LOCATION: ${personalInfo.location}
CONTACT EMAIL: ${personalInfo.email}
CONTACT PHONE: ${personalInfo.phone}
RESUME: ${personalInfo.resumeUrl}
GITHUB: ${personalInfo.socialLinks.github}
LINKEDIN: ${personalInfo.socialLinks.linkedin}
BIO: ${personalInfo.bio}

HEADLINE NUMBERS: ${statsText}

SKILLS:
${skillsText}

WORK EXPERIENCE:
${experienceText}

EDUCATION:
${educationText}

PROJECTS:
${projectsText}
`.trim();
}

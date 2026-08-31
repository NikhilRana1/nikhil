"use client";

import {
  personalInfo,
  experiences,
  education,
  skillCategories,
} from "@/lib/data";
import {
  ScrollReveal,
  TextReveal,
  ParallaxWrapper,
  SlideReveal,
  StaggerChildren,
} from "./ScrollAnimations";
import CodeCard from "./CodeCard";

export default function About() {
  const [role] = experiences;
  const [degree] = education;
  const techCount = skillCategories.reduce((n, c) => n + c.skills.length, 0);

  /* The card renders as a source file, so the facts are described as token
     trees — one entry per line — instead of label/value pairs. */
  const codeLines = [
    {
      indent: 0,
      tokens: [
        { t: "kw", v: "const" },
        { t: "key", v: " nikhil" },
        { t: "punc", v: " = {" },
      ],
    },
    ...[
      { key: "role", value: personalInfo.title },
      { key: "currently", value: role.company, comment: role.duration },
      { key: "based", value: personalInfo.location },
      { key: "education", value: degree.qualification, comment: degree.institution },
    ].flatMap((fact) => [
      // Comments sit on their own line so no line grows wider than the card.
      ...(fact.comment
        ? [{ indent: 1, tokens: [{ t: "comment", v: `// ${fact.comment}` }] }]
        : []),
      {
        indent: 1,
        tokens: [
          { t: "key", v: fact.key },
          { t: "punc", v: ": " },
          { t: "str", v: `"${fact.value}"` },
          { t: "punc", v: "," },
        ],
      },
    ]),
    {
      indent: 1,
      tokens: [
        { t: "key", v: "toolkit" },
        { t: "punc", v: ": " },
        { t: "num", v: String(techCount) },
        { t: "punc", v: "," },
        { t: "comment", v: " // technologies" },
      ],
    },
    { indent: 0, tokens: [{ t: "punc", v: "};" }] },
  ];

  return (
    <section id="about" className="py-24 bg-sunken overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal direction="up" className="mb-12">
          <SlideReveal direction="left" bgColor="bg-accent">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-ink">
              About Me
            </h2>
          </SlideReveal>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content with Staggered Text Reveals */}
          <StaggerChildren
            staggerDelay={0.2}
            direction="left"
            className="space-y-6"
          >
            <TextReveal
              text={`Hello! I'm ${personalInfo.name}, a passionate Frontend Developer focused on building modern, responsive, and user-friendly web experiences. I enjoy turning ideas into real-world digital products using technologies like HTML, CSS, JavaScript, React, and Next.js.`}
              className="text-muted leading-relaxed"
              staggerDelay={0.03}
            />
            <TextReveal
              text="I love creating clean UI designs, smooth user experiences, and performant applications that not only look good but also solve real problems. As a developer, I'm constantly learning new technologies and improving my skills to stay updated with the latest trends in web development."
              className="text-muted leading-relaxed"
              delay={0.3}
              staggerDelay={0.03}
            />
            <TextReveal
              text="Currently, I'm working on personal and client projects, exploring full-stack development, and sharpening my problem-solving abilities. My goal is to build impactful digital experiences that combine creativity with functionality. When I'm not coding, you'll usually find me exploring new tech, experimenting with AI tools, or enjoying a good cup of coffee."
              className="text-muted leading-relaxed"
              delay={0.6}
              staggerDelay={0.03}
            />
          </StaggerChildren>

          {/* Identity card, rendered as a source file — every value still comes from
              data.js so it stays true to the resume. */}
          <ScrollReveal direction="right" delay={0.3}>
            <div className="flex justify-center">
              <ParallaxWrapper speed={-0.15}>
                <CodeCard
                  fileName="nikhil.config.js"
                  lines={codeLines}
                  statusLeft="Available for opportunities"
                  statusRight={skillCategories.map((c) => c.label).join(" · ")}
                />
              </ParallaxWrapper>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

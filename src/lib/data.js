export const personalInfo = {
  name: "Nikhil Rana",
  title: "Full Stack Developer",
  email: "nikhilrana7885@gmail.com",
  location: "Your City, Country",
  bio: "A passionate developer crafting beautiful and functional web experiences.",
  socialLinks: {
    github: "https://github.com/NikhilRana1",
    linkedin: "https://www.linkedin.com/in/nikhil-rana-9352352b3/",
    // twitter: "https://twitter.com/yourusername",
  },
};

export const skills = [
  { name: "React", level: 90 },
  { name: "Next.js", level: 85 },
  { name: "JavaScript", level: 90 },
  { name: "TypeScript", level: 75 },
  { name: "Node.js", level: 80 },
  { name: "Tailwind CSS", level: 85 },
  { name: "MongoDB", level: 70 },
  { name: "Git", level: 80 },
];

export const projects = [
  {
    slug: "project-one",
    title: "Project One",
    description: "A brief description of project one and what it does.",
    longDescription: "A detailed description of the project, technologies used, challenges faced, and solutions implemented.",
    image: "/images/project1.png",
    technologies: ["React", "Next.js", "Tailwind CSS"],
    liveUrl: "https://project-one.com",
    githubUrl: "https://github.com/yourusername/project-one",
    featured: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    description: "A brief description of project two and what it does.",
    longDescription: "A detailed description of the project, technologies used, challenges faced, and solutions implemented.",
    image: "/images/project2.png",
    technologies: ["Node.js", "Express", "MongoDB"],
    liveUrl: "https://project-two.com",
    githubUrl: "https://github.com/yourusername/project-two",
    featured: true,
  },
  {
    slug: "project-three",
    title: "Project Three",
    description: "A brief description of project three and what it does.",
    longDescription: "A detailed description of the project, technologies used, challenges faced, and solutions implemented.",
    image: "/images/project3.png",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    liveUrl: "https://project-three.com",
    githubUrl: "https://github.com/yourusername/project-three",
    featured: false,
  },
];

export const experiences = [
  {
    title: "Software Developer",
    company: "Company Name",
    duration: "2023 - Present",
    description: "Description of your role and responsibilities.",
  },
];

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

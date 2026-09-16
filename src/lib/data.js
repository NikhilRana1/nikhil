export const personalInfo = {
  name: "Nikhil Rana",
  title: "Full Stack Developer",
  email: "nikhilrana7885@gmail.com",
  phone: "+91-6230397675",
  location: "New Delhi, India",
  resumeUrl: "/Nikhil_Rana_Resume.pdf",
  bio: "A passionate developer crafting beautiful and functional web experiences.",
  socialLinks: {
    github: "https://github.com/NikhilRana1",
    linkedin: "https://www.linkedin.com/in/nikhil-rana-9352352b3/",
    // twitter: "https://twitter.com/yourusername",
  },
};

/**
 * Skills grouped the way the resume groups them, ordered front-of-stack to
 * infrastructure. `icon` is resolved to a component in Skills.jsx so this file
 * stays free of JSX imports.
 */
export const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Interfaces, state and styling",
    skills: [
      { name: "React.js", icon: "react", color: "#149ECA" },
      { name: "Next.js", icon: "nextjs", color: "#12161C" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "HTML", icon: "html", color: "#E34F26" },
      { name: "CSS", icon: "css", color: "#663399" },
      { name: "Tailwind CSS", icon: "tailwind", color: "#0EA5E9" },
      { name: "Bootstrap", icon: "bootstrap", color: "#7952B3" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Database",
    blurb: "APIs and data",
    skills: [
      { name: "Node.js", icon: "node", color: "#5FA04E" },
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "MySQL", icon: "mysql", color: "#4479A1" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    blurb: "Shipping, versioning and servers",
    skills: [
      { name: "Docker", icon: "docker", color: "#2496ED" },
      { name: "CI/CD", icon: "cicd", color: "#3A4550" },
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#181717" },
      { name: "GitLab", icon: "gitlab", color: "#FC6D26" },
      { name: "Linux", icon: "linux", color: "#1A1A1A" },
      { name: "Networking", icon: "networking", color: "#3A4550" },
      { name: "VPS", icon: "vps", color: "#3A4550" },
      { name: "CloudPanel", icon: "cloudpanel", color: "#0F6E63" },
      { name: "Hostinger", icon: "hostinger", color: "#673DE6" },
    ],
  },
  {
    id: "cms",
    label: "CMS",
    blurb: "Content-managed sites",
    skills: [{ name: "WordPress", icon: "wordpress", color: "#21759B" }],
  },
];

/**
 * The numbers shown in the stats band. Kept here with the rest of the content
 * so a figure is changed in one place, not inside a component.
 */
export const stats = [
  { value: 1, suffix: "+", label: "Years Experience" },
  { value: 12, suffix: "+", label: "Projects Completed" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
];

export const projects = [
  {
    slug: "advance-task-manager-app",
    title: "Advance Task Manager App",
    description: "Smart task management app with priorities, deadlines, and progress tracking.",
    longDescription: "Developed an advanced task manager application to organize, prioritize, and track daily tasks efficiently, while overcoming challenges related to state management,authentication, API integration, responsive design, and deployment configuration.",
    image: "/images/project1.png",
    technologies: ["React", "Next.js", "Tailwind CSS"],
    liveUrl: "https://advance-task-manager-app-iota.vercel.app",
    githubUrl: "https://github.com/NikhilRana1",
    featured: true,
  },
  {
    slug: "press-release-portal",
    title: "Press Release Portal",
    description: "Secure press release management system with authentication and cloud storage integration.",
    longDescription: "Built a full-stack press release portal application featuring user authentication, press release submission and management, MongoDB database for data persistence, and MinIO cloud storage for image and document management. The platform provides a seamless workflow for creating, publishing, and managing press releases with real-time updates.",
    image: "/images/project_new.png",
    technologies: ["Next.js", "MongoDB", "MinIO"],
    liveUrl: "https://press-release.idmvalley.cloud/login",
    githubUrl: "https://github.com/NikhilRana1",
    featured: true,
  },
  {
    slug: "7p-digital",
    title: "7P Digital",
    description: "Modern digital agency platform with comprehensive service management and client solutions.",
    longDescription: "Developed a full-stack digital agency platform for 7P Digital featuring service showcases, portfolio management, client testimonials, and contact forms. Built with Next.js for optimal performance, MongoDB for data management, and MinIO for media storage. The platform provides seamless user experience with modern UI/UX design.",
    image: "/images/project3.png",
    technologies: ["Next.js", "MongoDB", "MinIO"],
    liveUrl: "https://7p-digital.com/",
    githubUrl: "https://github.com/NikhilRana1",
    featured: true,
  },
];

export const experiences = [
  {
    title: "Full Stack Developer",
    company: "IDM Valley",
    duration: "December 2025 - Present",
    highlights: [
      "Developed and maintained responsive web applications using React.js, Next.js, and Tailwind CSS.",
      "Built and integrated RESTful APIs with Node.js and MongoDB for various client projects.",
      "Containerized applications using Docker and set up CI/CD pipelines for automated builds and deployments.",
      "Collaborated with the team using Git, GitHub, and GitLab for version control and code reviews.",
      "Deployed and managed applications on VPS servers using CloudPanel and Hostinger.",
    ],
  },
];

export const education = [
  {
    qualification: "B.C.A. (Computer Applications)",
    institution: "Sardar Patel University (SPU)",
  },
  {
    qualification: "Class XII — Himachal Pradesh Board",
    institution: "2022 · 62%",
  },
  {
    qualification: "Class X — Himachal Pradesh Board",
    institution: "2020 · 70%",
  },
];

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

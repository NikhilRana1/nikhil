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
  { name: "HTML", level: 95 },
  { name: "CSS", level: 90 },
  { name: "Tailwind CSS", level: 85 },
  { name: "Bootstrap", level: 80 },
  { name: "MongoDB", level: 70 },
  { name: "MySQL", level: 75 },
  { name: "WordPress", level: 80 },
  { name: "GitHub", level: 85 },
  { name: "Linux", level: 75 },
  { name: "GitLab", level: 80 },
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

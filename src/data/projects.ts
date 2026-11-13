export type ProjectStatus = "in-development" | "completed";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  number: string;
  name: string;
  coverImage?: string;
  category: string;
  status: ProjectStatus;
  description: string;
  technologies: string[];
  repositoryUrl: string;
  liveUrl?: string;
  relatedLinks?: ProjectLink[];
  featured: boolean;
}

// Keep project content separate from its visual presentation.
// The homepage, project archive, and individual case studies
// will consume this same collection.
export const projects: Project[] = [
  {
    slug: "writespace",
    number: "01",
    name: "Writespace",
    category: "CONTENT PLATFORM",
    status: "in-development",
    description:
      "An evolving content-publishing platform built around modular backend architecture, with a broader vision for writing and knowledge sharing.",
    technologies: [
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Drizzle ORM",
      "Redis",
      "BullMQ",
      "Cloudinary",
    ],
    coverImage: "/images/projects/writespace/writespace.jpeg",
    repositoryUrl: "https://github.com/Afzal14786/writespace",
    featured: true,
  },
  {
    slug: "redis",
    number: "02",
    name: "Redis Clone",
    category: "SYSTEMS ENGINEERING",
    status: "completed",
    description:
      "A Redis-inspired in-memory data server built from scratch in C++. Explores TCP networking, command parsing, core data structures, concurrent client handling, key expiration, and file-based persistence.",
    technologies: ["C++", "POSIX Sockets", "C++ Threads", "Mutexes", "Make"],
    coverImage: "/images/projects/redis/redis.jpeg",
    repositoryUrl: "https://github.com/Afzal14786/redis",
    relatedLinks: [
      {
        label: "Companion Client",
        url: "https://github.com/Afzal14786/redis_cli",
      },
    ],
    featured: true,
  },
  {
    slug: "profitas",
    number: "03",
    name: "PROFITAS",
    category: "REAL ESTATE LIQUIDITY INFRASTRUCTURE",
    status: "completed",
    description:
      "A modular backend for a real-estate liquidity platform. Models organizations, properties, document management, verification, compliance, marketplace listings, offers, and credit application workflows through a versioned REST API.",
    technologies: [
      "Node.js",
      "Express 5",
      "PostgreSQL",
      "Drizzle ORM",
      "JWT",
      "bcrypt",
      "Zod",
      "Cloudinary",
      "Pino",
    ],
    coverImage: "/images/projects/profitas/profitas.jpeg",
    repositoryUrl: "https://github.com/Afzal14786/profitas",
    liveUrl: "https://profitas-one.vercel.app/",
    featured: false,
  },
  {
    slug: "finvista",
    number: "04",
    name: "FinVista — Trading Platform",
    category: "FINTECH BACKEND",
    status: "completed",
    description:
      "A simulated trading ecosystem covering multi-step phone and email OTP authentication, user management, stock search, holdings, positions, and order workflows. Uses Redis for OTP and temporary session data, with MongoDB for application data.",
    technologies: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Redis",
      "ioredis",
      "Firebase Auth",
      "JWT",
      "Cloudinary",
      "Nodemailer",
      "Chart.js",
    ],
    coverImage: "/images/projects/zerodha/zerodha.jpeg",
    repositoryUrl: "https://github.com/Afzal14786/zerodha-backend",
    relatedLinks: [
      {
        label: "Trading Dashboard",
        url: "https://github.com/Afzal14786/trading-dashboard",
      },
      {
        label: "FinVista Frontend",
        url: "https://github.com/Afzal14786/Trading-Platform",
      },
    ],
    featured: false,
  },
  {
    slug: "vacation-rental-marketplace",
    number: "05",
    name: "Vacation Rental Marketplace",
    category: "FULL-STACK MARKETPLACE",
    status: "completed",
    description:
      "An Airbnb-inspired full-stack vacation rental marketplace built with the MERN stack. Focuses on REST API architecture, MongoDB schema design, token-based authentication, and handling complex data queries.",
    technologies: ["MongoDB", "Express", "React", "Node.js"],
    coverImage: "/images/projects/airbnb/airbnb.jpeg",
    repositoryUrl: "https://github.com/Afzal14786/Airbnb",
    featured: false,
  },
];

// Only selected projects appear on the homepage.
// The complete collection powers the /projects archive.
export const featuredProjects = projects.filter((project) => project.featured);

/*
 * Technologies included in the homepage toolkit section.
 *
 * Keep this content separate from the presentation so the Toolkit
 * component can focus on rendering and layout.
 */

export type ToolkitGroupId =
  | "programming-languages"
  | "backend-development"
  | "databases"
  | "developer-tools";

export interface ToolkitItem {
  id: string;
  name: string;
  description: string;
}

export interface ToolkitGroup {
  id: ToolkitGroupId;
  title: string;
  description: string;
  items: ToolkitItem[];
}

export const toolkitGroups: ToolkitGroup[] = [
  {
    id: "programming-languages",
    title: "Programming Languages",
    description: "Languages I use to build software and solve problems.",
    items: [
      {
        id: "typescript",
        name: "TypeScript",
        description: "Typed JavaScript for building maintainable application code.",
      },
      {
        id: "cpp",
        name: "C++",
        description: "Used for data structures, algorithms, and problem-solving.",
      },
    ],
  },
  {
    id: "backend-development",
    title: "Backend Development",
    description: "Runtime technology for server-side application development.",
    items: [
      {
        id: "nodejs",
        name: "Node.js",
        description: "JavaScript runtime for building server-side applications.",
      },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Relational data storage and querying.",
    items: [
      {
        id: "postgresql",
        name: "PostgreSQL",
        description: "Relational database for storing and querying application data.",
      },
    ],
  },
  {
    id: "developer-tools",
    title: "Developer Tools",
    description: "Tools for version control, collaboration, and containerization.",
    items: [
      {
        id: "git",
        name: "Git",
        description: "Version control for tracking and managing code changes.",
      },
      {
        id: "github",
        name: "GitHub",
        description: "Platform for hosting repositories and collaborating on projects.",
      },
      {
        id: "docker",
        name: "Docker",
        description: "Containerization for consistent development and deployment environments.",
      },
    ],
  },
];

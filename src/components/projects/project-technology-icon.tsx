import {
  siTypescript,
  siNodedotjs,
  siExpress,
  siPostgresql,
  siDrizzle,
  siRedis,
  siCloudinary,
  siCplusplus,
  siMongodb,
  siFirebase,
  siJsonwebtokens,
  siReact,
  siTailwindcss,
  siGithub,
} from "simple-icons";

import type { SimpleIcon } from "simple-icons";
import {
  Code2,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  Network,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

// Map portfolio technology labels to their official brand marks.
const brandIcons: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  "Node.js": siNodedotjs,
  Express: siExpress,
  "Express 5": siExpress,
  PostgreSQL: siPostgresql,
  "Drizzle ORM": siDrizzle,
  Redis: siRedis,
  ioredis: siRedis,
  Cloudinary: siCloudinary,
  "C++": siCplusplus,
  MongoDB: siMongodb,
  "Firebase Auth": siFirebase,
  Firebase: siFirebase,
  JWT: siJsonwebtokens,
  React: siReact,
  "Tailwind CSS": siTailwindcss,
  GitHub: siGithub,
};

// Concepts and utilities use Lucide icons when there is no specific brand mark.
const fallbackIcons: Record<string, LucideIcon> = {
  "POSIX Sockets": Network,
  "C++ Threads": Workflow,
  Mutexes: LockKeyhole,
  Make: Terminal,
  BullMQ: Workflow,
  bcrypt: ShieldCheck,
  Mongoose: Database,
  Zod: Code2,
  Pino: FileText,
  Nodemailer: Mail,
};

interface ProjectTechnologyIconProps {
  technology: string;
}

export function ProjectTechnologyIcon({
  technology,
}: ProjectTechnologyIconProps) {
  const brandIcon = brandIcons[technology];
  const FallbackIcon = fallbackIcons[technology] ?? Code2;

  return (
    <span className="project-technology-icon" aria-hidden="true">
      {brandIcon ? (
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="currentColor"
          focusable="false"
        >
          <path d={brandIcon.path} />
        </svg>
      ) : (
        <FallbackIcon size={15} strokeWidth={1.8} />
      )}
    </span>
  );
}

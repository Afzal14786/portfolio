import { projects } from "@/data/projects";
import { ProjectCard } from "./project-card";

export function ProjectGrid() {
  return (
    <div className="project-archive-grid">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}

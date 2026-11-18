import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { featuredProjects } from "@/data/projects";
import { ProjectTechnologyIcon } from "@/components/projects/project-technology-icon";

export function Projects() {
  return (
    <section
      className="site-container projects-section"
      id="projects"
      aria-labelledby="projects-title"
    >
      {/* Section introduction */}
      <div className="projects-heading">
        <div className="section-label">
          <span>FEATURED PROJECTS / 02</span>
          <span>BUILDING · EXPLORING · REFINING</span>
        </div>

        <div className="projects-intro">
          <div>
            <p className="projects-eyebrow">ENGINEERING & CRAFT</p>

            <h2 id="projects-title">
              A selection of
              <br />
              <em>things I&apos;ve built.</em>
            </h2>
          </div>

          <p className="projects-description">
            From backend applications to systems-level experiments, these
            projects are where I turn ideas into working software. I focus on
            the reasoning behind each implementation: how systems are
            structured, how their components interact, and the engineering
            decisions that shape them.
          </p>
        </div>
      </div>

      {/* Featured projects use an editorial list rather than uniform cards. */}
      <div className="featured-project-list">
        {featuredProjects.map((project) => (
          <article className="featured-project" key={project.slug}>
            <span className="featured-project-number" aria-hidden="true">
              {project.number}
            </span>

            <div className="featured-project-main">
              <p className="featured-project-category">{project.category}</p>

              <h3>{project.name}</h3>

              <p className="featured-project-description">
                {project.description}
              </p>

              {project.technologies.length > 0 && (
                <ul
                  className="project-technologies"
                  aria-label={`${project.name} technologies`}
                >
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              )}
            </div>

            <aside className="featured-project-meta">
              <span className="project-status">
                <span
                  className={`status-indicator status-${project.status}`}
                  aria-hidden="true"
                />

                {project.status === "completed"
                  ? "COMPLETED"
                  : "IN DEVELOPMENT"}
              </span>

              <div className="featured-project-links">
                {project.docs && (
                  <a
                    className="project-repository-link"
                    href={project.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Read ${project.name} documentation`}
                  >
                    <BookOpen aria-hidden="true" size={15} />
                    Documentation
                    <ArrowUpRight aria-hidden="true" size={15} />
                  </a>
                )}

                {project.repositoryUrl && (
                  <a
                    className="project-repository-link"
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} source code on GitHub`}
                  >
                    <ProjectTechnologyIcon technology="GitHub" />
                    Source code
                    <ArrowUpRight aria-hidden="true" size={15} />
                  </a>
                )}
              </div>
            </aside>
          </article>
        ))}
      </div>

      <div className="featured-projects-footer">
        <p>There is more to explore beyond these selected projects.</p>

        <Link href="/project" className="featured-projects-link">
          Explore all projects
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

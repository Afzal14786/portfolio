import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { ProjectGrid } from "@/components/projects/project-grid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore projects covering backend engineering, systems programming, fintech, and full-stack development.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="projects-page">
        <section
          className="site-container project-archive-heading"
          aria-labelledby="project-archive-title"
        >
          <div className="project-archive-kicker">
            <span>ENGINEERING PORTFOLIO / 02</span>
            <span>{String(projects.length).padStart(2, "0")} PROJECTS</span>
          </div>

          <h1 id="project-archive-title">
            Projects <em>& experiments.</em>
          </h1>

          <p>
            A collection of software I&apos;ve built, systems I&apos;ve explored, and
            engineering problems I&apos;ve worked through. Each project represents an
            opportunity to turn an idea into working software and understand the
            decisions behind its implementation.
          </p>
        </section>

        <section
          className="site-container project-archive-collection"
          aria-labelledby="project-collection-title"
        >
          <div className="project-archive-collection-heading">
            <h2 id="project-collection-title">The collection</h2>
            <span>01 — {String(projects.length).padStart(2, "0")}</span>
          </div>

          <ProjectGrid />
        </section>
      </main>
    </>
  );
}

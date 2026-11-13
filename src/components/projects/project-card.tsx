"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ExternalLink, House } from "lucide-react";

import type { Project } from "@/data/projects";
import { ProjectTechnologyIcon } from "./project-technology-icon";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const visibleTechnologies = project.technologies.slice(0, 4);
  const remainingTechnologies =
    project.technologies.length - visibleTechnologies.length;

  return (
    <motion.article
      className="project-archive-card"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
              scale: 0.985,
            }
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
              scale: 1,
            }
      }
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.012,
              transition: {
                type: "spring",
                stiffness: 320,
                damping: 24,
              },
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: 0.995,
            }
      }
      viewport={{
        once: true,
        amount: 0.18,
      }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.07, 0.28),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Editorial project artwork. This is not an application screenshot. */}
      <div className="project-card-media">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="project-card-image"
          />
        ) : (
          <div className="project-card-visual-fallback" aria-hidden="true">
            <House size={46} strokeWidth={1.1} />
            <span>VISUAL STUDY / {project.number}</span>
          </div>
        )}

        <div className="project-card-media-overlay" />

        <div className="project-card-media-topline">
          <span>PROJECT / {project.number}</span>
          <span>VISUAL STUDY</span>
        </div>

        <span className="project-card-media-category">{project.category}</span>
      </div>

      {/* Main project information */}
      <div className="project-card-content">
        <div className="project-card-heading">
          <span className="project-card-number">
            {project.number} / PROJECT
          </span>

          <span
            className={`project-card-status project-card-status--${project.status}`}
          >
            <span className="project-card-status-dot" aria-hidden="true" />
            {project.status === "completed" ? "COMPLETED" : "IN DEVELOPMENT"}
          </span>
        </div>

        <h2 className="project-card-title">{project.name}</h2>

        <p className="project-card-description">{project.description}</p>

        {/* Display a compact, icon-led technology stack. */}
        <div className="project-card-stack">
          <span className="project-card-stack-label">TECH STACK</span>

          <ul className="project-card-technologies">
            {visibleTechnologies.map((technology) => (
              <li key={technology}>
                <ProjectTechnologyIcon technology={technology} />
                <span>{technology}</span>
              </li>
            ))}

            {remainingTechnologies > 0 && (
              <li className="project-card-more-technologies">
                +{remainingTechnologies} more
              </li>
            )}
          </ul>
        </div>

        {/* Repository and live links */}
        <div className="project-card-actions">
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="project-card-action project-card-action-primary"
          >
            <ProjectTechnologyIcon technology="GitHub" />
            Source code
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-card-action"
            >
              Live demo
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
        </div>

        {project.relatedLinks && project.relatedLinks.length > 0 && (
          <div className="project-card-related">
            <span>RELATED</span>

            {project.relatedLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

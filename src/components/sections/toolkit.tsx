import {
  siCplusplus,
  siDocker,
  siGit,
  siGithub,
  siNodedotjs,
  siPostgresql,
  siTypescript,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";

import { toolkitGroups } from "@/data/toolkit";

/*
 * Use recognizable brand colours for the technology marks.
 * The icons remain unboxed so they feel like part of the typography,
 * rather than separate UI controls.
 */
interface ToolkitBrand {
  icon: SimpleIcon;
  color: string;
}

const technologyBrands: Record<string, ToolkitBrand> = {
  typescript: {
    icon: siTypescript,
    color: "#3178C6",
  },
  cpp: {
    icon: siCplusplus,
    color: "#00599C",
  },
  nodejs: {
    icon: siNodedotjs,
    color: "#339933",
  },
  postgresql: {
    icon: siPostgresql,
    color: "#4169E1",
  },
  git: {
    icon: siGit,
    color: "#F05032",
  },
  github: {
    icon: siGithub,
    color: "#F0F1F4",
  },
  docker: {
    icon: siDocker,
    color: "#2496ED",
  },
};

interface ToolkitTechnologyIconProps {
  technologyId: string;
}

function ToolkitTechnologyIcon({ technologyId }: ToolkitTechnologyIconProps) {
  const brand = technologyBrands[technologyId];

  if (!brand) {
    return null;
  }

  return (
    <span
      className="toolkit-technology-icon"
      style={{ color: brand.color }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width="19"
        height="19"
        fill="currentColor"
        focusable="false"
      >
        <path d={brand.icon.path} />
      </svg>
    </span>
  );
}

export function Toolkit() {
  return (
    <section
      className="site-container toolkit-section"
      id="toolkit"
      aria-labelledby="toolkit-title"
    >
      <div className="toolkit-heading">
        <div className="section-label">
          <span>TOOLKIT / 04</span>
          <span>LANGUAGES · BACKEND · DATA · TOOLS</span>
        </div>

        <div className="toolkit-intro">
          <div>
            <p className="toolkit-eyebrow">THE ENGINEERING TOOLKIT</p>

            <h2 id="toolkit-title">
              The tools behind
              <br />
              <em>the work.</em>
            </h2>
          </div>

          <p className="toolkit-description">
            These are the technologies I currently work with across programming,
            backend development, data storage, and everyday engineering
            workflows.
          </p>
        </div>
      </div>

      <div className="toolkit-grid">
        {toolkitGroups.map((group, index) => (
          <article
            className="toolkit-group"
            key={group.id}
            aria-labelledby={`toolkit-group-${group.id}`}
          >
            <header className="toolkit-group-heading">
              <span className="toolkit-group-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 id={`toolkit-group-${group.id}`}>{group.title}</h3>
                <p>{group.description}</p>
              </div>
            </header>

            <ul
              className="toolkit-items"
              aria-label={`${group.title} technologies`}
            >
              {group.items.map((item) => (
                <li className="toolkit-item" key={item.id}>
                  <ToolkitTechnologyIcon technologyId={item.id} />

                  <div className="toolkit-item-copy">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

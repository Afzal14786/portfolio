import { ArrowUpRight } from "lucide-react";

// GitHub is a brand icon, so we render its mark locally
// instead of importing it from Lucide.
function GitHubMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.652.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.623-5.48 5.92.43.372.814 1.102.814 2.222 0 1.604-.015 2.896-.015 3.286 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/*
 * These topic groups are based on the actual directory structure
 * of DSA-Prep, rather than the outdated root README.
 */
const dsaTopicGroups = [
  {
    title: "Data structures",
    description:
      "Arrays, linked lists, stacks, queues, hashing, heaps, trees, BST, AVL trees and tries.",
  },
  {
    title: "Algorithmic techniques",
    description:
      "Sorting, divide and conquer, recursion, backtracking, dynamic programming and bitwise operations.",
  },
  {
    title: "Graphs and range queries",
    description:
      "Graph traversal, shortest paths, minimum spanning trees, DSU and segment trees.",
  },
];

export function RepositoryShowcase() {
  return (
    <section
      className="site-container cp-repositories-section"
      aria-labelledby="cp-repositories-title"
    >
      <div className="cp-repositories-heading">
        <div>
          <p className="cp-statistics-eyebrow">LEARNING & PRACTICE</p>

          <h2 id="cp-repositories-title">
            The work behind <em>the problems.</em>
          </h2>

          <p>
            I maintain separate repositories for structured DSA learning and
            documenting the problems I solve on LeetCode.
          </p>
        </div>
      </div>

      <div className="cp-repository-list">
        {/* Structured DSA learning and reference repository */}
        <article className="cp-repository-item cp-repository-item--featured">
          <span className="cp-repository-index" aria-hidden="true">
            01
          </span>

          <div className="cp-repository-body">
            <div className="cp-repository-meta">
              <span>STRUCTURED LEARNING & REFERENCE</span>
              <span>C++</span>
            </div>

            <h3>DSA-Prep</h3>

            <p className="cp-repository-description">
              A topic-organized collection of C++ implementations, concept
              explanations and practice questions. It serves as a learning
              workspace and reference for revisiting data structures and
              algorithms.
            </p>

            <div className="cp-repository-topic-groups">
              {dsaTopicGroups.map((group) => (
                <div className="cp-repository-topic" key={group.title}>
                  <h4>{group.title}</h4>
                  <p>{group.description}</p>
                </div>
              ))}
            </div>
          </div>

          <a
            className="cp-repository-link"
            href="https://github.com/Afzal14786/DSA-Prep"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore DSA-Prep on GitHub"
          >
            <GitHubMark size={15} />
            <span>Explore repository</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </article>

        {/* Automatically synchronized LeetCode solutions */}
        <article className="cp-repository-item">
          <span className="cp-repository-index" aria-hidden="true">
            02
          </span>

          <div className="cp-repository-body">
            <div className="cp-repository-meta">
              <span>PROBLEM SOLUTIONS</span>
              <span>AUTOMATIC SYNC</span>
            </div>

            <h3>LeetCode Solutions</h3>

            <p className="cp-repository-description">
              A separate collection of my LeetCode solutions. New solutions are
              automatically synchronized to this GitHub repository as I solve
              problems on the platform.
            </p>
          </div>

          <a
            className="cp-repository-link"
            href="https://github.com/Afzal14786/leetcode"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore LeetCode solutions on GitHub"
          >
            <GitHubMark size={15} />
            <span>Explore repository</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </article>
      </div>
    </section>
  );
}

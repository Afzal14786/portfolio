import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { PlatformStatistics } from "@/components/competitive-programming/platform-statistics";
import { RepositoryShowcase } from "@/components/competitive-programming/repository-showcase";
import { ProblemSolvingMethodology } from "@/components/competitive-programming/problem-solving-methodology";

export const metadata: Metadata = {
  title: "Competitive Programming & DSA",
  description:
    "Explore my competitive programming profiles, algorithmic practice, rating progression, and problem-solving journey.",
};

const problemSolvingAreas = [
  {
    number: "01",
    title: "Data Structures & Algorithms",
    description:
      "Understanding core data structures, algorithmic techniques, and the trade-offs involved in choosing an approach.",
  },
  {
    number: "02",
    title: "Competitive Programming",
    description:
      "Practising problems and participating in contests across multiple platforms, with an emphasis on solving problems under constraints.",
  },
  {
    number: "03",
    title: "Algorithmic Thinking",
    description:
      "Breaking down problem statements, recognizing patterns, considering edge cases, and reasoning about time and space complexity.",
  },
  {
    number: "04",
    title: "Computer Science Foundations",
    description:
      "Strengthening the fundamentals behind how programs execute, manage data, and communicate, alongside algorithmic practice.",
  },
];

export default function CompetitiveProgrammingPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="cp-page">
        {/* Page introduction */}
        <section
          className="site-container cp-page-heading"
          aria-labelledby="cp-page-title"
        >
          <div className="cp-page-kicker">
            <span>ALGORITHMIC THINKING / 03</span>
            <span>COMPETITIVE PROGRAMMING</span>
          </div>

          <h1 id="cp-page-title">
            Thinking through problems.
            <br />
            <em>Building toward better solutions.</em>
          </h1>

          <p>
            Competitive programming is an important part of how I develop as an
            engineer. It challenges me to understand problems deeply, recognize
            patterns, reason about complexity, and build efficient solutions
            under constraints.
          </p>
        </section>

        {/* Live platform statistics and rating progression */}
        <PlatformStatistics />

        {/* Problem-solving focus */}
        <section
          className="site-container cp-focus-section"
          aria-labelledby="cp-focus-title"
        >
          <div className="cp-focus-heading">
            <div>
              <p className="cp-statistics-eyebrow">AREAS OF PRACTICE</p>

              <h2 id="cp-focus-title">
                Problem-solving <em>focus.</em>
              </h2>

              <p>
                The areas I focus on to develop stronger analytical thinking,
                write better solutions, and build a deeper understanding of
                computer science.
              </p>
            </div>
          </div>

          <div className="cp-focus-grid">
            {problemSolvingAreas.map((area) => (
              <article className="cp-focus-item" key={area.number}>
                <span className="cp-focus-number">{area.number}</span>

                <div className="cp-focus-content">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* DSA and LeetCode repositories */}
        <RepositoryShowcase />
        {/* Problem-solving methodology */}
        <ProblemSolvingMethodology />
      </main>
    </>
  );
}

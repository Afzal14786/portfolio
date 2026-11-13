import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { CompetitiveProgrammingPreview } from "@/components/sections/competitive-programming-preview";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <Hero />
        <Projects />
        <CompetitiveProgrammingPreview />
        <section className="site-container foundation-section" id="foundation">
          <div className="section-label">
            <span>FOUNDATION / 001</span>
            <span>RESPONSIVE BY DESIGN</span>
          </div>

          <div className="foundation-grid">
            <h2>
              Not just what I build. <em>How I think.</em>
            </h2>

            <p>
              This foundation is being built around a simple idea: technical
              depth should be visible in the work, the decisions, and the
              progress behind it. The full portfolio will bring those pieces
              together.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { CompetitiveProgrammingPreview } from "@/components/sections/competitive-programming-preview";
import { Toolkit } from "@/components/sections/toolkit";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <Hero />
        <Projects />
        <CompetitiveProgrammingPreview />
        <Toolkit />
        <Contact />
      </main>
    </>
  );
}

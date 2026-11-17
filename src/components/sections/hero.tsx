import { ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { HeroArtwork } from "./hero-artwork";
import { siteConfig } from "@/config/site";

const focusAreas = [
  "Backend engineering",
  "Competitive programming",
  "Computer science",
];

export function Hero() {
  return (
    <section
      className="site-container hero"
      id="top"
      aria-labelledby="hero-title"
    >
      {/* Main introduction and professional identity */}
      <div className="hero-copy">
        <p className="eyebrow">
          <span>01</span> / {siteConfig.name.toUpperCase()}
        </p>

        <h1 className="hero-name" id="hero-title">
          Afzal
        </h1>

        <p className="hero-tagline">
          I build backend systems <em>from the first architectural decision</em>{" "}
          to a reliable deployment.
        </p>

        <p className="hero-description">
          I&apos;m a developer focused on backend engineering, competitive
          programming, and the computer science fundamentals behind reliable
          software. I enjoy understanding how systems work beneath the surface
          and turning that understanding into practical software.
        </p>

        <div className="hero-actions">
          <a
            className="button button-primary"
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
          >
            Explore my work
            <MoveUpRight aria-hidden="true" size={16} />
          </a>

          <a
            className="button button-quiet"
            href={`mailto:${siteConfig.email}`}
          >
            Get in touch
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>

        {/* The three core areas remain visible without competing with the headline. */}
        <ul className="hero-focus-list" aria-label="Areas of focus">
          {focusAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </div>

      {/* Conceptual artwork with subtle ambient motion. */}
      <HeroArtwork />
      {/* Hero navigation and location metadata */}
      <div className="hero-bottomline">
        <span>{siteConfig.location.toUpperCase()}</span>

        <a href="#projects">
          SCROLL TO EXPLORE
          <ArrowDownRight aria-hidden="true" size={14} />
        </a>
      </div>
    </section>
  );
}

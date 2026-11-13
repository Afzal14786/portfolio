import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { competitivePlatforms } from "@/data/competitive-programming";
import { PlatformLogo } from "@/components/competitive-programming/platform-logo";

export function CompetitiveProgrammingPreview() {
  return (
    <section
      className="site-container cp-preview-section"
      aria-labelledby="cp-preview-title"
    >
      <div className="cp-preview-kicker">
        <span>COMPETITIVE PROGRAMMING / 03</span>
        <span>ALGORITHMS · CONSISTENCY · PRECISION</span>
      </div>

      <div className="cp-preview-content">
        <div className="cp-preview-copy">
          <p className="cp-preview-eyebrow">THE DISCIPLINE OF THINKING</p>

          <h2 id="cp-preview-title">
            The art of
            <br />
            <em>problem solving.</em>
          </h2>
        </div>

        <p className="cp-preview-description">
          Competitive programming is where I develop algorithmic thinking,
          strengthen my understanding of data structures, and learn to reason
          about problems under constraints. It is an ongoing process of
          practising, analysing, and improving.
        </p>
      </div>

      <div className="cp-preview-footer">
        <div className="cp-preview-profiles">
          <span className="cp-preview-profiles-label">PLATFORMS</span>

          <div className="cp-preview-platform-list">
            {competitivePlatforms.map((platform) => (
              <a
                href={platform.profileUrl}
                key={platform.id}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${platform.name} profile`}
              >
                <PlatformLogo platform={platform.id} size="small" />

                {platform.id !== "atcoder" && <span>{platform.name}</span>}

                <ArrowUpRight aria-hidden="true" size={12} />
              </a>
            ))}
          </div>
        </div>

        <Link href="/competitive-programming" className="cp-preview-link">
          Explore CP / DSA
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}

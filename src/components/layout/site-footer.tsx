import Link from "next/link";
import { Heart } from "lucide-react";

import { SiteContainer } from "@/components/layout/site-container";
import { siteConfig } from "@/config/site";

/*
 * Shared footer used across all portfolio routes.
 * Contact and social links remain in the homepage Contact section.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <SiteContainer className="footer-inner">
        <p className="footer-copyright">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>

        <p className="footer-note">
          <span>Made with intent.</span>
          <Heart
            className="footer-heart"
            size={13}
            strokeWidth={1.8}
            fill="currentColor"
            aria-hidden="true"
          />
          <span className="footer-location">{siteConfig.location}</span>
        </p>

        <Link className="footer-top-link" href="/#top">
          Back to top
          <span aria-hidden="true">↑</span>
        </Link>
      </SiteContainer>
    </footer>
  );
}

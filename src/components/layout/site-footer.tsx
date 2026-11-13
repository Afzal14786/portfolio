import { SiteContainer } from "@/components/layout/site-container";
import { siteConfig } from "@/config/site";

/*
 * Shared footer used across all portfolio routes.
 * Keeping it here avoids maintaining duplicate footer markup in page files.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <SiteContainer className="footer-inner">
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>

        <span>Made with intent.</span>
      </SiteContainer>
    </footer>
  );
}
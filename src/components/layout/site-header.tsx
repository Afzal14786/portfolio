"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

type NavigationItem = {
  label: string;
  href: string;
  sectionId?: string;
};

const navigationItems: NavigationItem[] = [
  { label: "Profile", href: "#top", sectionId: "top" },
  { label: "Projects", href: "/project" },
  {
    label: "Sports Programming",
    href: "/competitive-programming",
  },
  { label: "Systems", href: "#systems", sectionId: "systems" },
  { label: "Writing", href: "/writing"},
  {
    label: "Experience",
    href: "#experience",
    sectionId: "experience",
  },
  { label: "Toolkit", href: "#toolkit", sectionId: "toolkit" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

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

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Track homepage sections only.
  // Project archive and detail pages use route-based navigation instead.
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = navigationItems.flatMap((item) =>
      item.sectionId ? [item.sectionId] : [],
    );

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          );

        const currentSection = visibleSections[0]?.target.id;

        if (currentSection) {
          setActiveSection(currentSection);
        }
      },
      {
        rootMargin: "-15% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  // Close the mobile menu when the user clicks outside or presses Escape.
  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  // Resolve homepage section links according to the current route.
  function getNavigationHref(item: NavigationItem) {
    if (!item.sectionId) return item.href;

    return pathname === "/" ? item.href : `/${item.href}`;
  }

  // Homepage links are active when their corresponding section is visible.
  // Dedicated pages are active only when their own route is open.
  function isNavigationItemActive(item: NavigationItem) {
    if (item.sectionId) {
      return pathname === "/" && activeSection === item.sectionId;
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  function handleNavigationClick(item: NavigationItem) {
    if (item.sectionId && pathname === "/") {
      setActiveSection(item.sectionId);
    }

    setIsMenuOpen(false);
  }

  return (
    <header className="site-header-shell" ref={headerRef}>
      <div className="site-container site-header-container">
        <div className="site-header">
          {/* Brand */}
          <a
            aria-label="Afzal — home"
            className="wordmark"
            href={pathname === "/" ? "#top" : "/#top"}
            onClick={() => {
              setIsMenuOpen(false);

              if (pathname === "/") {
                setActiveSection("top");
              }
            }}
          >
            afzal<span>.</span>
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Primary navigation" className="desktop-navigation">
            {navigationItems.map((item) => {
              const isActive = isNavigationItemActive(item);

              return (
                <a
                  aria-current={
                    isActive
                      ? item.sectionId
                        ? "location"
                        : "page"
                      : undefined
                  }
                  className={isActive ? "is-active" : undefined}
                  href={getNavigationHref(item)}
                  key={item.label}
                  onClick={() => handleNavigationClick(item)}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* GitHub action, separate from the navigation links */}
          <a
            aria-label="Visit Afzal's GitHub profile"
            className="header-github"
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubMark size={16} />
            <span>GitHub</span>
            <ArrowUpRight aria-hidden="true" size={13} />
          </a>

          {/* Mobile menu control */}
          <button
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            ref={menuButtonRef}
            type="button"
          >
            {isMenuOpen ? (
              <X aria-hidden="true" size={21} />
            ) : (
              <Menu aria-hidden="true" size={21} />
            )}
          </button>
        </div>

        {/* Mobile dropdown navigation */}
        <div
          aria-label="Mobile navigation panel"
          className="mobile-navigation"
          hidden={!isMenuOpen}
          id="mobile-navigation"
        >
          <nav aria-label="Mobile navigation">
            {navigationItems.map((item) => {
              const isActive = isNavigationItemActive(item);

              return (
                <a
                  aria-current={
                    isActive
                      ? item.sectionId
                        ? "location"
                        : "page"
                      : undefined
                  }
                  className={isActive ? "is-active" : undefined}
                  href={getNavigationHref(item)}
                  key={item.label}
                  onClick={() => handleNavigationClick(item)}
                >
                  {item.label}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
              );
            })}
          </nav>

          <a
            className="mobile-github-link"
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>
              <GitHubMark size={16} />
              GitHub
            </span>
            <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>
      </div>
    </header>
  );
}

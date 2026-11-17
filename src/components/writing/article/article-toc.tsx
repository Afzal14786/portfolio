"use client";

import { useEffect, useRef, useState } from "react";

import type { ArticleHeading } from "@/lib/writing/headings";

interface ArticleTocProps {
  headings: ArticleHeading[];
}

export function ArticleToc({ headings }: ArticleTocProps) {
  const [activeHeadingId, setActiveHeadingId] = useState(headings[0]?.id ?? "");

  const tocRef = useRef<HTMLElement | null>(null);

  /*
   * Observe article headings and identify the section currently
   * passing through the reading position near the top of the viewport.
   */
  useEffect(() => {
    if (headings.length < 3) {
      return;
    }

    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (headingElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Select the uppermost heading currently inside the observation area.
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              first.boundingClientRect.top - second.boundingClientRect.top,
          );

        if (visibleHeadings.length > 0) {
          setActiveHeadingId(visibleHeadings[0].target.id);
        }
      },
      {
        // Track headings near the top of the viewport.
        rootMargin: "-120px 0px -65% 0px",
        threshold: 0,
      },
    );

    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  /*
   * Keep the active entry visible inside the sidebar when the TOC
   * itself becomes scrollable. Never scroll the main article page here.
   */
  useEffect(() => {
    const toc = tocRef.current;

    if (!toc || !activeHeadingId) {
      return;
    }

    // The sidebar only needs internal scrolling when its content overflows.
    if (toc.scrollHeight <= toc.clientHeight + 1) {
      return;
    }

    const activeLink = Array.from(
      toc.querySelectorAll<HTMLAnchorElement>("a[data-heading-id]"),
    ).find((link) => link.dataset.headingId === activeHeadingId);

    if (!activeLink) {
      return;
    }

    const tocRect = toc.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    let nextScrollTop = toc.scrollTop;

    if (linkRect.top < tocRect.top) {
      nextScrollTop += linkRect.top - tocRect.top;
    } else if (linkRect.bottom > tocRect.bottom) {
      nextScrollTop += linkRect.bottom - tocRect.bottom;
    } else {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    toc.scrollTo({
      top: nextScrollTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeHeadingId]);

  // Avoid adding navigation that provides little value to short articles.
  if (headings.length < 3) {
    return null;
  }

  return (
    <nav
      ref={tocRef}
      className="writing-article-toc"
      aria-labelledby="writing-article-toc-title"
    >
      <h2 id="writing-article-toc-title">IN THIS ARTICLE</h2>

      <ol>
        {headings.map((heading) => {
          const isActive = activeHeadingId === heading.id;

          return (
            <li
              key={heading.id}
              data-level={heading.level}
              data-active={isActive}
            >
              <a
                href={`#${heading.id}`}
                data-heading-id={heading.id}
                aria-current={isActive ? "location" : undefined}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

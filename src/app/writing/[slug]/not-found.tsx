import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteHeader } from "@/components/layout/site-header";

export default function WritingArticleNotFound() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="writing-not-found-page">
        <SiteContainer className="writing-not-found-shell">
          <section
            className="writing-not-found-content"
            aria-labelledby="writing-not-found-title"
          >
            <div className="writing-not-found-kicker">
              <span>404 / ARTICLE NOT FOUND</span>
              <span>WRITING ARCHIVE</span>
            </div>

            <p className="writing-not-found-code" aria-hidden="true">
              404
            </p>

            <h1 id="writing-not-found-title">
              This article <em>isn&apos;t here.</em>
            </h1>

            <p className="writing-not-found-description">
              The article you&apos;re looking for may have been unpublished, moved,
              or the address might be incorrect. You can explore the published
              articles in the writing archive instead.
            </p>

            <Link href="/writing" className="writing-not-found-link">
              Explore all writing
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </SiteContainer>
      </main>
    </>
  );
}

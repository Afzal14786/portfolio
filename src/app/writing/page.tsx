import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { WritingCategoryFilter } from "@/components/writing/writing-category-filter";
import { writingTopics } from "@/data/writing";
import { getPublishedWritingArticles } from "@/lib/writing/content";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Technical articles, engineering notes, and ideas by Md Afzal Ansari.",
};

export default async function WritingPage() {
  const publishedArticles = await getPublishedWritingArticles();

  return (
    <>
      <SiteHeader />

      <main id="main-content" className="writing-page">
        <section
          className="site-container writing-heading"
          aria-labelledby="writing-page-title"
        >
          <div className="writing-kicker">
            <span>WRITING / ENGINEERING JOURNAL</span>
            <span>
              {String(publishedArticles.length).padStart(2, "0")} ARTICLES
            </span>
          </div>

          <h1 id="writing-page-title">
            Ideas, experiments <em>& engineering notes.</em>
          </h1>

          <p className="writing-introduction">
            A collection of things I learn, build, investigate, and understand
            along the way. From backend engineering and computer science to
            problem-solving approaches and practical engineering lessons.
          </p>
        </section>

        <section
          className="site-container writing-collection"
          aria-labelledby="writing-collection-title"
        >
          <div className="writing-collection-heading">
            <h2 id="writing-collection-title">Latest writing</h2>

            <span>
              {publishedArticles.length > 0
                ? `01 — ${String(publishedArticles.length).padStart(2, "0")}`
                : "THE COLLECTION"}
            </span>
          </div>

          <WritingCategoryFilter
            articles={publishedArticles}
            topics={writingTopics}
          />
        </section>
      </main>
    </>
  );
}

import Link from "next/link";

import type { WritingArticle } from "@/data/writing";

interface ArticleNavigationProps {
  newerArticle?: WritingArticle;
  olderArticle?: WritingArticle;
}

export function ArticleNavigation({
  newerArticle,
  olderArticle,
}: ArticleNavigationProps) {
  if (!newerArticle && !olderArticle) {
    return null;
  }

  return (
    <nav className="writing-article-navigation" aria-label="Article navigation">
      {newerArticle ? (
        <Link
          href={`/writing/${newerArticle.slug}`}
          className="writing-article-nav-link writing-article-nav-newer"
        >
          <span className="writing-article-nav-label">
            <span aria-hidden="true">←</span>
            NEWER ARTICLE
          </span>

          <span className="writing-article-nav-title">
            {newerArticle.title}
          </span>

          <span className="writing-article-nav-category">
            {newerArticle.category}
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {olderArticle ? (
        <Link
          href={`/writing/${olderArticle.slug}`}
          className="writing-article-nav-link writing-article-nav-older"
        >
          <span className="writing-article-nav-label">
            OLDER ARTICLE
            <span aria-hidden="true">→</span>
          </span>

          <span className="writing-article-nav-title">
            {olderArticle.title}
          </span>

          <span className="writing-article-nav-category">
            {olderArticle.category}
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}

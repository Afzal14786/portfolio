import Image from "next/image";
import Link from "next/link";

import type { WritingArticle } from "@/data/writing";

interface WritingCardProps {
  article: WritingArticle;
  index: number;
}

const articleDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function WritingCard({ article, index }: WritingCardProps) {
  return (
    <article className="writing-card">
      <Link className="writing-card-link" href={`/writing/${article.slug}`}>
        <div className="writing-card-cover">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={`${article.title} cover`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="writing-card-image"
            />
          ) : (
            <div className="writing-card-cover-fallback">
              <span className="writing-card-cover-index">
                FIELD NOTE / {String(index + 1).padStart(2, "0")}
              </span>

              <span className="writing-card-cover-mark" aria-hidden="true">
                A.
              </span>

              <span className="writing-card-cover-caption">
                THE ART OF ENGINEERING
              </span>
            </div>
          )}
        </div>

        <div className="writing-card-content">
          <div className="writing-card-meta">
            <span>{article.category}</span>

            <time dateTime={article.date}>
              {articleDateFormatter.format(new Date(article.date))}
            </time>
          </div>

          <h3>{article.title}</h3>

          <p className="writing-card-description">{article.description}</p>

          <div className="writing-card-footer">
            <div className="writing-card-tags">
              {article.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <span className="writing-card-reading-time">
              {article.readingTime} MIN READ
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

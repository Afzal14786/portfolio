import type { Metadata } from "next";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArticleNavigation } from "@/components/writing/article/article-navigation";
import { ArticleCover } from "@/components/writing/article/article-cover";
import { mdxComponents } from "@/components/writing/mdx/mdx-components";
import rehypeSlug from "rehype-slug";

import { ArticleToc } from "@/components/writing/article/article-toc";
import { extractArticleHeadings } from "@/lib/writing/headings";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteHeader } from "@/components/layout/site-header";
import {
  getPublishedWritingArticle,
  getPublishedWritingArticles,
} from "@/lib/writing/content";

interface WritingArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const articleDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/*
 * Pre-render articles that exist when the application is built.
 * Newly added article routes can still be resolved when requested.
 */
export async function generateStaticParams() {
  const articles = await getPublishedWritingArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: WritingArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedWritingArticle(slug);

  if (!article) {
    return {
      title: "Article not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const coverImage = article.coverImage
    ? {
        url: article.coverImage,
        alt: `Cover image for ${article.title}`,
      }
    : undefined;

  return {
    title: article.title,
    description: article.description,

    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: new Date(`${article.date}T00:00:00.000Z`).toISOString(),
      tags: article.tags,
      ...(coverImage ? { images: [coverImage] } : {}),
    },

    twitter: {
      card: coverImage ? "summary_large_image" : "summary",
      title: article.title,
      description: article.description,
      ...(coverImage ? { images: [coverImage.url] } : {}),
    },
  };
}

export default async function WritingArticlePage({
  params,
}: WritingArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedWritingArticle(slug);

  if (!article) {
    notFound();
  }

  const headings = extractArticleHeadings(article.content);

  // The article collection is sorted newest first by publication date.
  const publishedArticles = await getPublishedWritingArticles();

  const currentArticleIndex = publishedArticles.findIndex(
    (publishedArticle) => publishedArticle.slug === article.slug,
  );

  // The preceding item is newer; the following item is older.
  const newerArticle =
    currentArticleIndex > 0
      ? publishedArticles[currentArticleIndex - 1]
      : undefined;

  const olderArticle =
    currentArticleIndex >= 0 &&
    currentArticleIndex < publishedArticles.length - 1
      ? publishedArticles[currentArticleIndex + 1]
      : undefined;

  return (
    <>
      <SiteHeader />

      <main id="main-content" className="writing-article-page">
        <SiteContainer className="writing-article-shell">
          <Link href="/writing" className="writing-back-link">
            <span aria-hidden="true">←</span>
            All writing
          </Link>

          <article className="writing-article">
            <header className="writing-article-header">
              <div className="writing-article-meta">
                <span>{article.category}</span>

                <time dateTime={article.date}>
                  {articleDateFormatter.format(new Date(article.date))}
                </time>
              </div>

              <h1>{article.title}</h1>

              <p className="writing-article-description">
                {article.description}
              </p>

              <div className="writing-article-details">
                <div className="writing-article-tags">
                  {article.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <span>{article.readingTime} MIN READ</span>
              </div>
            </header>

            <ArticleCover src={article.coverImage} title={article.title} />

            <div className="writing-article-layout">
              <ArticleToc headings={headings} />

              <div className="writing-article-main">
                <div className="writing-article-body">
                  <MDXRemote
                    source={article.content}
                    components={mdxComponents}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [
                          [
                            rehypeSlug,
                            {
                              prefix: "article-",
                            },
                          ],
                          [
                            rehypePrettyCode,
                            {
                              theme: "one-dark-pro",
                              keepBackground: false,
                              defaultLang: "plaintext",
                              bypassInlineCode: true,
                            },
                          ],
                        ],
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <ArticleNavigation
              newerArticle={newerArticle}
              olderArticle={olderArticle}
            />

            <footer className="writing-article-footer">
              <Link href="/writing">← Back to all writing</Link>
            </footer>
          </article>
        </SiteContainer>
      </main>
    </>
  );
}

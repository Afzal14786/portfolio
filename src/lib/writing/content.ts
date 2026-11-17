import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

import { writingTopics } from "@/data/writing";
import type {
  WritingArticle,
  WritingArticleDocument,
  WritingTopic,
} from "@/data/writing";

import {
  extractMarkdownImageSources,
  validateWritingImageAsset,
} from "./assets";

// All writing content is maintained as trusted local MDX files.
const writingDirectory = path.join(process.cwd(), "src", "content", "writing");

// Restrict slugs to safe, predictable file names.
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// The average reading speed used to estimate article reading time.
const WORDS_PER_MINUTE = 200;

// Only explicitly supported frontmatter fields are accepted.
// This helps catch misspelled metadata keys instead of silently ignoring them.
const allowedMetadataKeys = new Set([
  "title",
  "description",
  "date",
  "category",
  "tags",
  "published",
  "featured",
  "coverImage",
]);

type ArticleMetadata = Omit<WritingArticle, "slug" | "readingTime">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingFileError(error: unknown): boolean {
  return isRecord(error) && "code" in error && error.code === "ENOENT";
}

function createMetadataError(slug: string, message: string): Error {
  return new Error(`Invalid frontmatter in "${slug}.mdx": ${message}`);
}

function readRequiredString(
  metadata: Record<string, unknown>,
  key: string,
  slug: string,
): string {
  const value = metadata[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw createMetadataError(slug, `A non-empty "${key}" field is required.`);
  }

  return value.trim();
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value
  );
}

/*
 * Validate tags independently so every article has meaningful,
 * non-empty and unique topic labels.
 */
function parseTags(value: unknown, slug: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw createMetadataError(
      slug,
      'The "tags" field must contain at least one tag.',
    );
  }

  const tags = value.map((tag: unknown, index: number) => {
    if (typeof tag !== "string" || tag.trim().length === 0) {
      throw createMetadataError(
        slug,
        `Tag at position ${index + 1} must be a non-empty string.`,
      );
    }

    return tag.trim();
  });

  // Treat tags with different letter casing as duplicates.
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  if (new Set(normalizedTags).size !== normalizedTags.length) {
    throw createMetadataError(slug, "Duplicate tags are not allowed.");
  }

  return tags;
}

function parseArticleMetadata(data: unknown, slug: string): ArticleMetadata {
  if (!isRecord(data)) {
    throw createMetadataError(slug, "Frontmatter must be a YAML object.");
  }

  // Catch unsupported fields and likely frontmatter spelling mistakes.
  const unknownKeys = Object.keys(data).filter(
    (key) => !allowedMetadataKeys.has(key),
  );

  if (unknownKeys.length > 0) {
    throw createMetadataError(
      slug,
      `Unknown metadata field(s): ${unknownKeys.join(", ")}. ` +
        `Supported fields: ${[...allowedMetadataKeys].join(", ")}.`,
    );
  }

  const title = readRequiredString(data, "title", slug);
  const description = readRequiredString(data, "description", slug);
  const date = readRequiredString(data, "date", slug);
  const category = readRequiredString(data, "category", slug);

  if (!isValidDate(date)) {
    throw createMetadataError(
      slug,
      `Invalid article date "${date}". Use the YYYY-MM-DD format.`,
    );
  }

  if (!(writingTopics as readonly string[]).includes(category)) {
    throw createMetadataError(
      slug,
      `Unknown writing category "${category}". ` +
        "Check the categories in src/data/writing.ts.",
    );
  }

  const tags = parseTags(data.tags, slug);

  if (typeof data.published !== "boolean") {
    throw createMetadataError(
      slug,
      'The "published" field must be either true or false.',
    );
  }

  if (data.featured !== undefined && typeof data.featured !== "boolean") {
    throw createMetadataError(
      slug,
      'The "featured" field must be a boolean when provided.',
    );
  }

  if (
    data.coverImage !== undefined &&
    (typeof data.coverImage !== "string" || data.coverImage.trim().length === 0)
  ) {
    throw createMetadataError(
      slug,
      'The "coverImage" field must be a non-empty string when provided.',
    );
  }

  return {
    title,
    description,
    date,
    category: category as WritingTopic,
    tags,
    published: data.published,
    featured: data.featured === true,
    ...(typeof data.coverImage === "string"
      ? { coverImage: data.coverImage.trim() }
      : {}),
  };
}

/*
 * Estimate reading time from the article body.
 * Frontmatter is excluded because gray-matter separates it from the content.
 */
function calculateReadingTime(content: string): number {
  const words = content.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];

  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}

async function readArticle(
  slug: string,
): Promise<WritingArticleDocument | null> {
  // Never allow a request parameter to become an arbitrary filesystem path.
  if (!slugPattern.test(slug)) {
    return null;
  }

  const filePath = path.join(writingDirectory, `${slug}.mdx`);

  let source: string;

  try {
    source = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }

  let parsedContent: ReturnType<typeof matter>;

  try {
    parsedContent = matter(source);
  } catch (error) {
    throw new Error(
      `Unable to parse frontmatter in writing article "${slug}.mdx".`,
      { cause: error },
    );
  }

  const metadata = parseArticleMetadata(parsedContent.data, slug);

  // Validate the optional cover image and all inline Markdown images.
  const bodyImageSources = extractMarkdownImageSources(parsedContent.content);

  const assetsToValidate = [
    ...(metadata.coverImage
      ? [{ source: metadata.coverImage, purpose: "cover" as const }]
      : []),

    ...bodyImageSources.map((source) => ({
      source,
      purpose: "article body" as const,
    })),
  ];

  await Promise.all(
    assetsToValidate.map(({ source, purpose }) =>
      validateWritingImageAsset(source, slug, purpose),
    ),
  );

  return {
    slug,
    ...metadata,
    readingTime: calculateReadingTime(parsedContent.content),
    content: parsedContent.content,
  };
}

/*
 * Discover all local MDX files, validate their metadata, and return
 * published articles in descending publication-date order.
 */
export async function getPublishedWritingArticles(): Promise<WritingArticle[]> {
  let entries;

  try {
    entries = await readdir(writingDirectory, {
      withFileTypes: true,
    });
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }

    throw error;
  }

  const articleSlugs = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.slice(0, -4));

  const articles = await Promise.all(
    articleSlugs.map((slug) => readArticle(slug)),
  );

  return articles
    .filter(
      (article): article is WritingArticleDocument =>
        article !== null && article.published,
    )
    .map(
      (article): WritingArticle => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        date: article.date,
        category: article.category,
        tags: article.tags,
        readingTime: article.readingTime,
        published: article.published,
        ...(article.featured === undefined
          ? {}
          : { featured: article.featured }),
        ...(article.coverImage === undefined
          ? {}
          : { coverImage: article.coverImage }),
      }),
    )
    .sort((first, second) => second.date.localeCompare(first.date));
}

/*
 * Return one article only when it exists and is published.
 * Drafts must not be accessible through their public URL.
 */
export async function getPublishedWritingArticle(
  slug: string,
): Promise<WritingArticleDocument | null> {
  const article = await readArticle(slug);

  if (!article || !article.published) {
    return null;
  }

  return article;
}

import GithubSlugger from "github-slugger";

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/*
 * Convert Markdown heading content into plain text before generating its ID.
 * This keeps formatting syntax out of the visible TOC labels and heading slugs.
 */
function normalizeHeadingText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/[*_~]/g, "")
    .replace(/\\([\\`*_{}\[\]()#+.!>~-])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * Extract H2 and H3 headings from an MDX document.
 * Fenced code blocks are ignored so code examples cannot become TOC entries.
 *
 * The "article-" prefix matches the prefix configured in rehype-slug.
 */
export function extractArticleHeadings(content: string): ArticleHeading[] {
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];

  let activeFence: { marker: string; length: number } | null = null;

  for (const line of content.split(/\r?\n/)) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);

    if (activeFence) {
      // Only a matching fence of sufficient length can close a code block.
      if (
        fenceMatch &&
        fenceMatch[1][0] === activeFence.marker &&
        fenceMatch[1].length >= activeFence.length &&
        fenceMatch[2].trim().length === 0
      ) {
        activeFence = null;
      }

      continue;
    }

    // Ignore everything inside fenced code blocks.
    if (fenceMatch) {
      activeFence = {
        marker: fenceMatch[1][0],
        length: fenceMatch[1].length,
      };

      continue;
    }

    const headingMatch = line.match(/^ {0,3}(#{2,3})[ \t]+(.+?)\s*$/);

    if (!headingMatch) {
      continue;
    }

    // Markdown permits optional closing hashes on ATX headings.
    const rawText = headingMatch[2].replace(/[ \t]+#+[ \t]*$/, "");
    const text = normalizeHeadingText(rawText);

    if (!text) {
      continue;
    }

    headings.push({
      id: `article-${slugger.slug(text)}`,
      text,
      level: headingMatch[1].length as 2 | 3,
    });
  }

  return headings;
}

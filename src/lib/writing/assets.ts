import { realpath, stat } from "node:fs/promises";
import path from "node:path";

const writingAssetsDirectory = path.resolve(
  process.cwd(),
  "public",
  "images",
  "writing",
);

const supportedImageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function isInsideDirectory(directory: string, target: string): boolean {
  const relativePath = path.relative(directory, target);

  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

/*
 * Validate that a public image path points to an existing image file
 * within the Writing asset directory.
 *
 * realpath checks also prevent a symlink inside the asset directory
 * from pointing outside the permitted directory.
 */
export async function validateWritingImageAsset(
  source: string,
  articleSlug: string,
  purpose: "cover" | "article body",
): Promise<void> {
  const context = `${purpose} image "${source}" in "${articleSlug}.mdx"`;

  if (typeof source !== "string" || !source.startsWith("/images/writing/")) {
    throw new Error(
      `Invalid ${context}. Use a local path beginning with "/images/writing/".`,
    );
  }

  if (/[\\?#\0]/.test(source)) {
    throw new Error(
      `Invalid ${context}. Backslashes, query strings and URL fragments are not supported.`,
    );
  }

  let decodedSource: string;

  try {
    decodedSource = decodeURIComponent(source);
  } catch {
    throw new Error(`Invalid URL encoding in ${context}.`);
  }

  if (
    !decodedSource.startsWith("/images/writing/") ||
    decodedSource.includes("\\") ||
    decodedSource.includes("\0")
  ) {
    throw new Error(`Unsafe image path in ${context}.`);
  }

  const segments = decodedSource.slice(1).split("/");

  if (
    segments.some(
      (segment) => segment.length === 0 || segment === "." || segment === "..",
    )
  ) {
    throw new Error(`Unsafe directory traversal in ${context}.`);
  }

  const assetPath = path.resolve(process.cwd(), "public", `.${decodedSource}`);

  if (!isInsideDirectory(writingAssetsDirectory, assetPath)) {
    throw new Error(
      `${context} must be located inside public/images/writing/.`,
    );
  }

  const extension = path.extname(assetPath).toLowerCase();

  if (!supportedImageExtensions.has(extension)) {
    throw new Error(`Unsupported image format "${extension}" in ${context}.`);
  }

  let actualAssetPath: string;
  let actualAssetsDirectory: string;

  try {
    [actualAssetPath, actualAssetsDirectory] = await Promise.all([
      realpath(assetPath),
      realpath(writingAssetsDirectory),
    ]);
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(
        `Missing ${context}. Check that the file exists under public/images/writing/.`,
        { cause: error },
      );
    }

    throw error;
  }

  // Verify the resolved file still belongs to the permitted asset directory.
  if (!isInsideDirectory(actualAssetsDirectory, actualAssetPath)) {
    throw new Error(`The ${context} resolves outside public/images/writing/.`);
  }

  const fileInformation = await stat(actualAssetPath);

  if (!fileInformation.isFile()) {
    throw new Error(`The ${context} does not point to a regular image file.`);
  }
}

/*
 * Extract inline Markdown image references.
 * Fenced code blocks are ignored so code examples don't trigger asset checks.
 */
export function extractMarkdownImageSources(content: string): string[] {
  const imageSources: string[] = [];

  let activeFence: { marker: string; length: number } | null = null;

  for (const line of content.split(/\r?\n/)) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);

    if (activeFence) {
      const closingFence = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);

      if (
        closingFence &&
        closingFence[1][0] === activeFence.marker &&
        closingFence[1].length >= activeFence.length
      ) {
        activeFence = null;
      }

      continue;
    }

    if (fenceMatch) {
      activeFence = {
        marker: fenceMatch[1][0],
        length: fenceMatch[1].length,
      };

      continue;
    }

    /*
     * Supports normal Markdown images with optional titles:
     * ![Description](/images/writing/articles/example.webp "Caption")
     */
    const imagePattern =
      /!\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;

    let match: RegExpExecArray | null;

    while ((match = imagePattern.exec(line)) !== null) {
      const source = match[1].startsWith("<")
        ? match[1].slice(1, -1)
        : match[1];

      imageSources.push(source);
    }
  }

  return [...new Set(imageSources)];
}

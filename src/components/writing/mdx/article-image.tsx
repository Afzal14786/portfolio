"use client";

import { useState } from "react";
import type { ComponentProps } from "react";

type ArticleImageProps = Pick<ComponentProps<"img">, "src" | "alt" | "title">;

export function ArticleImage({ src, alt = "", title }: ArticleImageProps) {
  const [hasError, setHasError] = useState(false);

  const imageUnavailable = !src || hasError;

  return (
    <figure className="writing-article-figure">
      {imageUnavailable ? (
        <div
          className="writing-article-image-fallback"
          role="img"
          aria-label={alt || "Article image unavailable"}
        >
          <span>IMAGE UNAVAILABLE</span>
          {alt && <p>{alt}</p>}
        </div>
      ) : (
        // Native img preserves the original dimensions of technical diagrams.
        // Images are lazy-loaded because article illustrations are usually below the fold.
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      )}

      {title && <figcaption>{title}</figcaption>}
    </figure>
  );
}

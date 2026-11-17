"use client";

import Image from "next/image";
import { useState } from "react";

interface ArticleCoverProps {
  src?: string;
  title: string;
}

export function ArticleCover({ src, title }: ArticleCoverProps) {
  const [hasError, setHasError] = useState(false);

  // Articles without a cover should not render an empty image container.
  if (!src) {
    return null;
  }

  return (
    <figure className="writing-article-cover">
      {hasError ? (
        <div
          className="writing-article-image-fallback"
          role="img"
          aria-label={`Cover image unavailable for ${title}`}
        >
          <span>IMAGE UNAVAILABLE</span>
          <p>{title}</p>
        </div>
      ) : (
        <Image
          src={src}
          alt={`Cover image for ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          onError={() => setHasError(true)}
        />
      )}
    </figure>
  );
}

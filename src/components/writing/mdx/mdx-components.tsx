import { ArticleImage } from "./article-image";
import { Callout } from "./callout";

/*
 * Central registry for reusable components available inside writing articles.
 * This keeps MDX rendering consistent across all published articles.
 */
export const mdxComponents = {
  img: ArticleImage,
  Callout,
};

import type { HTMLAttributes } from "react";

/**
 * Shared responsive page container.
 * Keeping horizontal gutters and maximum width in one place prevents
 * individual sections from drifting across breakpoints.
 */
export function SiteContainer({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`site-container ${className}`.trim()} {...props} />;
}

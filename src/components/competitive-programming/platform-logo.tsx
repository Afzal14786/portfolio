import { siCodechef, siCodeforces, siLeetcode } from "simple-icons";

import type { SimpleIcon } from "simple-icons";

import type { CompetitivePlatformId } from "@/data/competitive-programming";

interface PlatformLogoProps {
  platform: CompetitivePlatformId;
  size?: "small" | "default";
}

const platformIcons: Record<
  Exclude<CompetitivePlatformId, "atcoder">,
  SimpleIcon
> = {
  leetcode: siLeetcode,
  codeforces: siCodeforces,
  codechef: siCodechef,
};

const platformColors: Record<
  Exclude<CompetitivePlatformId, "atcoder">,
  string
> = {
  leetcode: `#${siLeetcode.hex}`,
  codeforces: `#${siCodeforces.hex}`,
  codechef: `#${siCodechef.hex}`,
};

export function PlatformLogo({
  platform,
  size = "default",
}: PlatformLogoProps) {
  /*
   * AtCoder is not currently included in Simple Icons.
   * Use its official local logo instead of substituting a generic icon.
   */
  if (platform === "atcoder") {
    return (
      <span
        className={`cp-platform-logo cp-platform-logo--atcoder${
          size === "small" ? " cp-platform-logo--small" : ""
        }`}
        aria-hidden="true"
      >
        AtCoder
      </span>
    );
  }

  const icon = platformIcons[platform];

  return (
    <svg
      className={`cp-platform-logo cp-platform-logo--${platform} cp-platform-logo--${size}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ color: platformColors[platform] }}
    >
      <path d={icon.path} />
    </svg>
  );
}

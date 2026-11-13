/*
 * Public competitive programming profiles.
 *
 * These definitions contain stable profile identifiers and URLs only.
 * Ratings, ranks, solved counts, and contest history come from providers.
 */

export type CompetitivePlatformId =
  | "leetcode"
  | "codeforces"
  | "atcoder"
  | "codechef";

export interface CompetitivePlatform {
  id: CompetitivePlatformId;
  name: string;
  username: string;
  profileUrl: string;
}

export const competitivePlatforms: CompetitivePlatform[] = [
  {
    id: "leetcode",
    name: "LeetCode",
    username: "0x4f5a4c",
    profileUrl: "https://leetcode.com/u/0x4f5a4c/",
  },
  {
    id: "codeforces",
    name: "Codeforces",
    username: "mdafzal14777",
    profileUrl: "https://codeforces.com/profile/mdafzal14777",
  },
  {
    id: "atcoder",
    name: "AtCoder",
    username: "iamafzal",
    profileUrl: "https://atcoder.jp/users/iamafzal",
  },
  {
    id: "codechef",
    name: "CodeChef",
    username: "iamafzal",
    profileUrl: "https://www.codechef.com/users/iamafzal",
  },
];

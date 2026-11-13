import "server-only";

import {
  competitivePlatforms,
  type CompetitivePlatform,
  type CompetitivePlatformId,
} from "@/data/competitive-programming";

import {
  createUnavailableSnapshot,
  type DataSource,
  type PlatformSnapshot,
} from "./contracts";

import { getAtCoderSnapshot } from "./providers/atcoder";
import { getCodeChefSnapshot } from "./providers/codechef";
import { getCodeforcesSnapshot } from "./providers/codeforces";
import { getLeetCodeSnapshot } from "./providers/leetcode";

type PlatformProvider = (
  platform: CompetitivePlatform,
) => Promise<PlatformSnapshot>;

const providers: Record<CompetitivePlatformId, PlatformProvider> = {
  leetcode: getLeetCodeSnapshot,
  codeforces: getCodeforcesSnapshot,
  atcoder: getAtCoderSnapshot,
  codechef: getCodeChefSnapshot,
};

const dataSources: Record<CompetitivePlatformId, DataSource> = {
  leetcode: "undocumented-platform-api",
  codeforces: "official-api",
  atcoder: "undocumented-platform-api",
  codechef: "public-profile-html",
};

export async function getCompetitiveProfiles(): Promise<PlatformSnapshot[]> {
  /*
   * Each platform is isolated.
   * One provider failure must not prevent the other profiles from loading.
   */
  return Promise.all(
    competitivePlatforms.map(async (platform) => {
      try {
        return await providers[platform.id](platform);
      } catch (error) {
        // Keep provider details in server logs, not in the public API response.
        console.error(
          `[Competitive Programming] ${platform.name} provider failed:`,
          error,
        );

        return createUnavailableSnapshot(platform, dataSources[platform.id]);
      }
    }),
  );
}

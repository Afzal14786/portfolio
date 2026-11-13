import type {
  CompetitivePlatform,
  CompetitivePlatformId,
} from "@/data/competitive-programming";

export type DataSource =
  | "official-api"
  | "undocumented-platform-api"
  | "public-profile-html";

export interface RatingHistoryPoint {
  contestName: string;
  date: string;
  rating: number;
  ratingChange: number | null;
  rank: number | null;
}

export interface PlatformMetrics {
  currentRating: number | null;
  peakRating: number | null;

  rankLabel: string | null;
  globalRank: number | null;
  countryRank: number | null;

  solvedProblems: number | null;
  contestsParticipated: number | null;
}

export interface PlatformSnapshot {
  platform: CompetitivePlatformId;
  username: string;
  profileUrl: string;

  source: DataSource;
  status: "available" | "unavailable";

  metrics: PlatformMetrics;
  ratingHistory: RatingHistoryPoint[];

  fetchedAt: string;
  message: string | null;
}

export function createPlatformSnapshot(
  platform: CompetitivePlatform,
  source: DataSource,
  metrics: Partial<PlatformMetrics>,
  ratingHistory: RatingHistoryPoint[],
): PlatformSnapshot {
  return {
    platform: platform.id,
    username: platform.username,
    profileUrl: platform.profileUrl,

    source,
    status: "available",

    metrics: {
      currentRating: null,
      peakRating: null,
      rankLabel: null,
      globalRank: null,
      countryRank: null,
      solvedProblems: null,
      contestsParticipated: null,
      ...metrics,
    },

    ratingHistory,
    fetchedAt: new Date().toISOString(),
    message: null,
  };
}

export function createUnavailableSnapshot(
  platform: CompetitivePlatform,
  source: DataSource,
): PlatformSnapshot {
  return {
    platform: platform.id,
    username: platform.username,
    profileUrl: platform.profileUrl,

    source,
    status: "unavailable",

    metrics: {
      currentRating: null,
      peakRating: null,
      rankLabel: null,
      globalRank: null,
      countryRank: null,
      solvedProblems: null,
      contestsParticipated: null,
    },

    ratingHistory: [],
    fetchedAt: new Date().toISOString(),

    message:
      "Statistics are temporarily unavailable. Visit the platform profile directly.",
  };
}

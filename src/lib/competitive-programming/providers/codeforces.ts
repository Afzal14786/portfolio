import type { CompetitivePlatform } from "@/data/competitive-programming";

import {
  asNumber,
  asRecord,
  asString,
  delay,
  fetchJson,
  maximumOrNull,
  toIsoDate,
} from "../http";

import { createPlatformSnapshot, type RatingHistoryPoint } from "../contracts";

interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
}

interface CodeforcesRatingChange {
  contestName: string;
  rank: number;
  oldRating: number;
  newRating: number;
  ratingUpdateTimeSeconds: number;
}

interface CodeforcesResponse<T> {
  status: "OK" | "FAILED";
  comment?: string;
  result: T;
}

function getApiResult<T>(payload: unknown): T {
  const response = asRecord(payload);

  if (!response || response.status !== "OK") {
    throw new Error(
      asString(response?.comment) ?? "Codeforces API returned a failure.",
    );
  }

  return response.result as T;
}

export async function getCodeforcesSnapshot(platform: CompetitivePlatform) {
  const userInfoUrl = new URL("https://codeforces.com/api/user.info");
  userInfoUrl.searchParams.set("handles", platform.username);

  const userPayload = await fetchJson<CodeforcesResponse<CodeforcesUser[]>>(
    userInfoUrl.toString(),
    { revalidateSeconds: 1800 },
  );

  const users = getApiResult<CodeforcesUser[]>(userPayload);
  const user = users[0];

  if (!user || user.handle.toLowerCase() !== platform.username.toLowerCase()) {
    throw new Error("Codeforces profile was not found.");
  }

  /*
   * Codeforces documents a limit of one API request per two seconds.
   * Wait before requesting contest history after user.info.
   */
  await delay(2100);

  const historyUrl = new URL("https://codeforces.com/api/user.rating");
  historyUrl.searchParams.set("handle", platform.username);

  const historyPayload = await fetchJson<
    CodeforcesResponse<CodeforcesRatingChange[]>
  >(historyUrl.toString(), { revalidateSeconds: 1800 });

  const rawHistory = getApiResult<CodeforcesRatingChange[]>(historyPayload);

  const ratingHistory: RatingHistoryPoint[] = rawHistory
    .map((contest) => {
      const rating = asNumber(contest.newRating);
      const date = toIsoDate(contest.ratingUpdateTimeSeconds);

      if (rating === null || date === null) {
        return null;
      }

      const oldRating = asNumber(contest.oldRating);

      return {
        contestName: contest.contestName,
        date,
        rating,
        ratingChange: oldRating === null ? null : rating - oldRating,
        rank: asNumber(contest.rank),
      };
    })
    .filter((point): point is RatingHistoryPoint => point !== null)
    .sort((first, second) => first.date.localeCompare(second.date));

  const historyRatings = ratingHistory.map((point) => point.rating);

  return createPlatformSnapshot(
    platform,
    "official-api",
    {
      currentRating:
        asNumber(user.rating) ?? ratingHistory.at(-1)?.rating ?? null,

      peakRating: asNumber(user.maxRating) ?? maximumOrNull(historyRatings),

      rankLabel: asString(user.rank),
      contestsParticipated: ratingHistory.length,

      // Solved-problem totals are intentionally not fetched here.
      // user.status needs another rate-limited API request.
      solvedProblems: null,
    },
    ratingHistory,
  );
}

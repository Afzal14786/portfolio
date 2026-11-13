import type { CompetitivePlatform } from "@/data/competitive-programming";

import {
  asNumber,
  asRecord,
  asString,
  fetchJson,
  maximumOrNull,
  toIsoDate,
} from "../http";

import { createPlatformSnapshot, type RatingHistoryPoint } from "../contracts";

export async function getAtCoderSnapshot(platform: CompetitivePlatform) {
  /*
   * AtCoder's public history endpoint returns contest participation records.
   * We request the algorithm contest history to match its normal rating.
   */
  const url = new URL(
    `https://atcoder.jp/users/${encodeURIComponent(platform.username)}/history/json`,
  );

  url.searchParams.set("contestType", "algorithm");

  const payload = await fetchJson<unknown>(url.toString(), {
    revalidateSeconds: 1800,
    headers: {
      Referer: "https://atcoder.jp/",
    },
  });

  if (!Array.isArray(payload)) {
    throw new Error("AtCoder returned an unexpected history response.");
  }

  const ratingHistory: RatingHistoryPoint[] = payload
    .map((value) => {
      const entry = asRecord(value);

      if (!entry || entry.IsRated !== true) {
        return null;
      }

      const rating = asNumber(entry.NewRating);
      const date = toIsoDate(entry.EndTime);

      if (rating === null || date === null) {
        return null;
      }

      const oldRating = asNumber(entry.OldRating);

      return {
        contestName:
          asString(entry.ContestName) ??
          asString(entry.ContestScreenName) ??
          "AtCoder contest",

        date,
        rating,

        ratingChange: oldRating === null ? null : rating - oldRating,

        rank: asNumber(entry.Place),
      };
    })
    .filter((point): point is RatingHistoryPoint => point !== null)
    .sort((first, second) => first.date.localeCompare(second.date));

  const historyRatings = ratingHistory.map((point) => point.rating);

  return createPlatformSnapshot(
    platform,
    "undocumented-platform-api",
    {
      currentRating: ratingHistory.at(-1)?.rating ?? null,
      peakRating: maximumOrNull(historyRatings),
      contestsParticipated: ratingHistory.length,

      // The history endpoint does not provide a problem-solved total.
      solvedProblems: null,
    },
    ratingHistory,
  );
}

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

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const PROFILE_QUERY = `
  query CompetitiveProgrammingProfile($username: String!) {
    matchedUser(username: $username) {
      username

      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }

    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage

      badge {
        name
      }
    }

    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking

      contest {
        title
        startTime
      }
    }
  }
`;

interface LeetCodeResponse {
  data?: Record<string, unknown>;
  errors?: Array<{ message?: string }>;
}

function getSolvedCount(matchedUser: Record<string, unknown>): number | null {
  const submitStats = asRecord(matchedUser.submitStats);
  const submissions = submitStats?.acSubmissionNum;

  if (!Array.isArray(submissions)) {
    return null;
  }

  const entries = submissions
    .map(asRecord)
    .filter((entry): entry is Record<string, unknown> => entry !== null);

  const allProblems = entries.find((entry) => entry.difficulty === "All");

  if (allProblems) {
    return asNumber(allProblems.count);
  }

  const difficultyCounts = entries
    .filter((entry) =>
      ["Easy", "Medium", "Hard"].includes(String(entry.difficulty)),
    )
    .map((entry) => asNumber(entry.count))
    .filter((count): count is number => count !== null);

  return difficultyCounts.length > 0
    ? difficultyCounts.reduce((total, count) => total + count, 0)
    : null;
}

export async function getLeetCodeSnapshot(platform: CompetitivePlatform) {
  /*
   * LeetCode's public GraphQL endpoint supports GET requests.
   * A server-side request avoids the browser CORS restriction.
   * We do not use LEETCODE_SESSION or any private account cookies.
   */
  const params = new URLSearchParams({
    query: PROFILE_QUERY,
    variables: JSON.stringify({
      username: platform.username,
    }),
  });

  const url = `${LEETCODE_GRAPHQL_URL}?${params.toString()}`;

  const payload = await fetchJson<LeetCodeResponse>(url, {
    revalidateSeconds: 1800,
    headers: {
      Referer: "https://leetcode.com/",
      Origin: "https://leetcode.com",
    },
  });

  const data = asRecord(payload.data);
  const matchedUser = asRecord(data?.matchedUser);

  if (!matchedUser) {
    const firstError = payload.errors?.[0]?.message;

    throw new Error(firstError ?? "LeetCode profile was not found.");
  }

  const contestRanking = asRecord(data?.userContestRanking);
  const contestHistoryRaw = data?.userContestRankingHistory;

  const rawEntries = Array.isArray(contestHistoryRaw) ? contestHistoryRaw : [];

  /*
   * Ignore placeholder entries that do not represent a valid ranked
   * participation. LeetCode can include attended records with rank 0.
   */
  const ratingHistory: RatingHistoryPoint[] = rawEntries
    .map((value): RatingHistoryPoint | null => {
      const entry = asRecord(value);
      const contest = asRecord(entry?.contest);

      const rank = asNumber(entry?.ranking);

      if (entry?.attended !== true || rank === null || rank <= 0) {
        return null;
      }

      const rating = asNumber(entry.rating);
      const date = toIsoDate(contest?.startTime);

      if (rating === null || date === null) {
        return null;
      }

      return {
        contestName: asString(contest?.title) ?? "LeetCode contest",
        date,
        rating,
        ratingChange: null,
        rank,
      };
    })
    .filter((point): point is RatingHistoryPoint => point !== null)
    .sort((first, second) => first.date.localeCompare(second.date));

  // Calculate contest-to-contest rating differences after chronological sorting.
  for (let index = 1; index < ratingHistory.length; index += 1) {
    ratingHistory[index].ratingChange =
      ratingHistory[index].rating - ratingHistory[index - 1].rating;
  }

  const currentRating = asNumber(contestRanking?.rating);

  const historyRatings = ratingHistory.map((point) => point.rating);

  const badge = asRecord(contestRanking?.badge);

  return createPlatformSnapshot(
    platform,
    "undocumented-platform-api",
    {
      currentRating: currentRating ?? ratingHistory.at(-1)?.rating ?? null,

      peakRating: maximumOrNull([
        ...historyRatings,
        ...(currentRating === null ? [] : [currentRating]),
      ]),

      rankLabel: asString(badge?.name),
      globalRank: asNumber(contestRanking?.globalRanking),

      contestsParticipated:
        asNumber(contestRanking?.attendedContestsCount) ?? ratingHistory.length,

      solvedProblems: getSolvedCount(matchedUser),
    },
    ratingHistory,
  );
}

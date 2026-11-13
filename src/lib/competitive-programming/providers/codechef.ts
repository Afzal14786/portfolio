import { load } from "cheerio";

import type { CompetitivePlatform } from "@/data/competitive-programming";

import {
  asNumber,
  asRecord,
  asString,
  fetchText,
  maximumOrNull,
  toIsoDate,
} from "../http";

import { createPlatformSnapshot, type RatingHistoryPoint } from "../contracts";

function extractAssignedArray(html: string, variableName: string): unknown[] {
  /*
   * CodeChef embeds its rating history in a JavaScript variable.
   * Scan for the matching array while respecting quoted strings, rather
   * than stopping at the first closing bracket found by a simple regex.
   */
  const assignment = new RegExp(
    `\\b(?:var|let|const)\\s+${variableName}\\s*=\\s*\\[`,
  );

  const match = assignment.exec(html);

  if (!match) {
    return [];
  }

  const start = html.indexOf("[", match.index);

  let depth = 0;
  let quote: "'" | '"' | null = null;
  let escaped = false;

  for (let index = start; index < html.length; index += 1) {
    const character = html[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === "[") {
      depth += 1;
    } else if (character === "]") {
      depth -= 1;

      if (depth === 0) {
        const arraySource = html.slice(start, index + 1);

        try {
          const parsed: unknown = JSON.parse(arraySource);

          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // The provider may change the embedded JavaScript format.
          return [];
        }
      }
    }
  }

  return [];
}

function firstDefined(
  record: Record<string, unknown>,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }

  return null;
}

function parseRatingHistory(html: string): RatingHistoryPoint[] {
  const rawHistory = extractAssignedArray(html, "all_rating");

  const entries = rawHistory
    .map((value) => {
      const record = asRecord(value);

      if (!record) {
        return null;
      }

      const rating = asNumber(
        firstDefined(record, ["rating", "newRating", "new_rating", "Rating"]),
      );

      const date = toIsoDate(
        firstDefined(record, [
          "date",
          "contest_date",
          "end_date",
          "endTime",
          "EndTime",
          "timestamp",
          "time",
        ]),
      );

      if (rating === null || date === null) {
        return null;
      }

      return {
        contestName:
          asString(
            firstDefined(record, [
              "name",
              "contest_name",
              "contestName",
              "contest_code",
              "code",
            ]),
          ) ?? "CodeChef contest",

        date,
        rating,
        ratingChange: asNumber(
          firstDefined(record, ["ratingChange", "rating_change"]),
        ),

        rank: asNumber(
          firstDefined(record, ["rank", "contest_rank", "global_rank"]),
        ),
      };
    })
    .filter((point): point is RatingHistoryPoint => point !== null)
    .sort((first, second) => first.date.localeCompare(second.date));

  // Calculate rating changes when the history source does not provide them.
  for (let index = 0; index < entries.length; index += 1) {
    if (entries[index].ratingChange === null && index > 0) {
      entries[index].ratingChange =
        entries[index].rating - entries[index - 1].rating;
    }
  }

  return entries;
}

export async function getCodeChefSnapshot(platform: CompetitivePlatform) {
  const profileUrl = `https://www.codechef.com/users/${encodeURIComponent(
    platform.username,
  )}`;

  const html = await fetchText(profileUrl, {
    revalidateSeconds: 3600,
    headers: {
      Referer: "https://www.codechef.com/",
    },
  });

  const $ = load(html);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();

  if (/Just a moment|Attention Required/i.test(pageText.slice(0, 3000))) {
    throw new Error("CodeChef returned an access challenge.");
  }

  if (/user not found|profile not found/i.test(pageText)) {
    throw new Error("CodeChef profile was not found.");
  }

  const ratingHistory = parseRatingHistory(html);

  const currentRating =
    asNumber($(".rating-number").first().text()) ??
    ratingHistory.at(-1)?.rating ??
    null;

  const highestRatingMatch = pageText.match(
    /Highest\s+Rating\s*:?\s*([\d,]+)/i,
  );

  const highestRating = highestRatingMatch
    ? asNumber(highestRatingMatch[1])
    : null;

  const rankValues = $(".rating-ranks strong")
    .toArray()
    .map((element) => asNumber($(element).text()))
    .filter((value): value is number => value !== null);

  const starMatch = pageText.match(/(\d+)\s*★/);
  const solvedMatch = pageText.match(
    /Total\s+Problems\s+Solved\s*:?\s*([\d,]+)/i,
  );

  if (currentRating === null && ratingHistory.length === 0) {
    throw new Error(
      "CodeChef profile data could not be extracted from the returned page.",
    );
  }

  return createPlatformSnapshot(
    platform,
    "public-profile-html",
    {
      currentRating,

      peakRating:
        highestRating ??
        maximumOrNull(ratingHistory.map((point) => point.rating)),

      rankLabel: starMatch ? `${starMatch[1]}★` : null,

      // CodeChef's public profile presents global rank before country rank.
      globalRank: rankValues[0] ?? null,
      countryRank: rankValues[1] ?? null,

      solvedProblems: solvedMatch ? asNumber(solvedMatch[1]) : null,

      contestsParticipated:
        ratingHistory.length > 0 ? ratingHistory.length : null,
    },
    ratingHistory,
  );
}

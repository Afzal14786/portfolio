"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { RatingProgression } from "./rating-progression";
import { competitivePlatforms } from "@/data/competitive-programming";
import { PlatformLogo } from "./platform-logo";
import type { PlatformSnapshot } from "@/lib/competitive-programming/contracts";

interface CompetitiveProgrammingResponse {
  generatedAt: string;
  profiles: PlatformSnapshot[];
}

/*
 * Keep the API request outside the component.
 * This allows initial loading and manual refresh to share the same
 * response validation without sharing their loading-state behaviour.
 */
async function requestStatistics(): Promise<CompetitiveProgrammingResponse> {
  const response = await fetch("/api/competitive-programming", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Dashboard request failed with status ${response.status}.`);
  }

  const result = (await response.json()) as CompetitiveProgrammingResponse;

  if (
    typeof result.generatedAt !== "string" ||
    !Array.isArray(result.profiles)
  ) {
    throw new Error("The dashboard returned an invalid response.");
  }

  return result;
}

function formatRating(value: number | null): string {
  if (value === null) return "—";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number | null): string {
  if (value === null) return "—";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function PlatformTableSkeleton() {
  return (
    <div className="cp-statistics-skeleton" aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="cp-statistics-skeleton-row" key={index}>
          {Array.from({ length: 6 }, (_, cellIndex) => (
            <span className="cp-statistics-skeleton-cell" key={cellIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PlatformStatistics() {
  const [data, setData] = useState<CompetitiveProgrammingResponse | null>(null);

  // Initial loading is represented by the initial state.
  const [isLoading, setIsLoading] = useState(true);

  // Manual refresh has its own state because it happens from a user action.
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * Load initial statistics after mounting.
   * State updates happen only after the asynchronous request completes.
   */
  useEffect(() => {
    let isActive = true;

    async function loadInitialStatistics() {
      try {
        const result = await requestStatistics();

        if (isActive) {
          setData(result);
        }
      } catch (requestError) {
        console.error(
          "[Competitive Programming] Initial dashboard request failed:",
          requestError,
        );

        if (isActive) {
          setError("Statistics could not be loaded. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialStatistics();

    return () => {
      isActive = false;
    };
  }, []);

  /*
   * Manual refresh is triggered by a real user interaction.
   * Its loading state can therefore be updated directly in this callback.
   */
  const refreshStatistics = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const result = await requestStatistics();

      setData(result);
    } catch (requestError) {
      console.error(
        "[Competitive Programming] Dashboard refresh failed:",
        requestError,
      );

      setError("Statistics could not be refreshed. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const profileByPlatform = new Map(
    (data?.profiles ?? []).map((profile) => [profile.platform, profile]),
  );

  const isBusy = isLoading || isRefreshing;

  return (
    <section
      className="site-container cp-statistics-section"
      aria-labelledby="cp-statistics-title"
    >
      {/* Dashboard heading and refresh controls */}
      <div className="cp-statistics-heading">
        <div>
          <p className="cp-statistics-eyebrow">COMPETITIVE PROFILE OVERVIEW</p>

          <h2 id="cp-statistics-title">
            Performance <em>at a glance.</em>
          </h2>

          <p className="cp-statistics-description">
            A snapshot of my competitive programming profiles, ratings, and
            contest activity across four platforms.
          </p>
        </div>

        <button
          type="button"
          className="cp-statistics-refresh"
          onClick={() => void refreshStatistics()}
          disabled={isBusy}
          aria-label="Refresh competitive programming statistics"
        >
          <RefreshCw
            aria-hidden="true"
            size={15}
            className={isBusy ? "is-refreshing" : undefined}
          />

          {isBusy ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {/* Initial loading state */}
      {isLoading && !data && <PlatformTableSkeleton />}

      {/* Request-level error state */}
      {error && !data && (
        <div className="cp-statistics-error" role="alert">
          <p>{error}</p>

          <button type="button" onClick={() => void refreshStatistics()}>
            Try again
          </button>
        </div>
      )}

      {/* Statistics table */}
      {data && (
        <>
          <div className="cp-statistics-table-wrapper">
            <table className="cp-statistics-table">
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">Current rating</th>
                  <th scope="col">Peak rating</th>
                  <th scope="col">Rank / badge</th>
                  <th scope="col">Solved</th>
                  <th scope="col">Contests</th>
                </tr>
              </thead>

              <tbody>
                {competitivePlatforms.map((platform) => {
                  const profile = profileByPlatform.get(platform.id);

                  const isAvailable = profile?.status === "available";

                  const metrics = profile?.metrics;

                  return (
                    <tr key={platform.id}>
                      <th scope="row" className="cp-platform-cell">
                        <div className="cp-platform-identity">
                          <a
                            href={platform.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cp-platform-profile-link"
                            aria-label={`Visit ${platform.name} profile`}
                          >
                            <PlatformLogo platform={platform.id} />

                            {/* AtCoder's official wordmark already contains its name. */}
                            {platform.id !== "atcoder" && (
                              <span>{platform.name}</span>
                            )}

                            <ExternalLink aria-hidden="true" size={12} />
                          </a>

                          <span className="cp-platform-profile-username">
                            {platform.username}
                          </span>

                          <span
                            className={`cp-platform-availability ${
                              isAvailable ? "is-available" : "is-unavailable"
                            }`}
                          >
                            <span aria-hidden="true" />

                            {isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </th>

                      <td>
                        <span className="cp-statistics-primary-value">
                          {formatRating(metrics?.currentRating ?? null)}
                        </span>
                      </td>

                      <td>{formatRating(metrics?.peakRating ?? null)}</td>

                      <td>
                        <div className="cp-statistics-rank">
                          <span>{metrics?.rankLabel ?? "—"}</span>

                          {metrics?.globalRank !== null &&
                            metrics?.globalRank !== undefined && (
                              <small>
                                Global #{formatInteger(metrics.globalRank)}
                              </small>
                            )}

                          {metrics?.countryRank !== null &&
                            metrics?.countryRank !== undefined && (
                              <small>
                                Country #{formatInteger(metrics.countryRank)}
                              </small>
                            )}
                        </div>
                      </td>

                      <td>{formatInteger(metrics?.solvedProblems ?? null)}</td>

                      <td>
                        {formatInteger(metrics?.contestsParticipated ?? null)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Dashboard freshness and provider information */}
          <div className="cp-statistics-footer">
            <p>
              {error
                ? "Refresh failed. Showing the previously loaded snapshot."
                : "Statistics are retrieved independently from each platform."}
            </p>

            <span>Dashboard checked: {formatTimestamp(data.generatedAt)}</span>
          </div>

          {/* Rating graph uses the same API response as the table. */}
          <RatingProgression profiles={data.profiles} />
        </>
      )}

      <p className="cp-statistics-note">
        Some platforms do not expose every statistic publicly. Unavailable
        values are intentionally left blank rather than estimated. Provider
        responses are cached to respect upstream service limits.
      </p>
    </section>
  );
}

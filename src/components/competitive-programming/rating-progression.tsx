"use client";

import { useState } from "react";

import {
  competitivePlatforms,
  type CompetitivePlatformId,
} from "@/data/competitive-programming";

import type {
  PlatformSnapshot,
  RatingHistoryPoint,
} from "@/lib/competitive-programming/contracts";

import { PlatformLogo } from "./platform-logo";

type RatingPlatformFilter = CompetitivePlatformId | "all";

interface RatingProgressionProps {
  profiles: PlatformSnapshot[];
}

interface RatingSeries {
  platform: (typeof competitivePlatforms)[number];
  profile: PlatformSnapshot;
  points: RatingHistoryPoint[];
  color: string;
}

interface ContestSelection {
  platformId: CompetitivePlatformId;
  pointIndex: number;
}

interface ChartPoint {
  source: RatingHistoryPoint;
  platformId: CompetitivePlatformId;
  platformName: string;
  color: string;
  pointIndex: number;
  x: number;
  y: number;
  isPeak: boolean;
}

interface ChartSeries {
  platformId: CompetitivePlatformId;
  platformName: string;
  color: string;
  points: ChartPoint[];
  linePath: string;
}

const CHART_WIDTH = 760;
const CHART_HEIGHT = 310;

const PLOT_LEFT = 76;
const PLOT_RIGHT = 738;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 238;

/*
 * Platform colors are kept in one place so the chart lines, markers,
 * legend, and platform summaries always use the same color.
 *
 * AtCoder uses a light neutral color because its wordmark is displayed
 * in white on the dark portfolio background.
 */
const PLATFORM_COLORS: Record<CompetitivePlatformId, string> = {
  leetcode: "#FFA116",
  codeforces: "#1F8ACB",
  atcoder: "#E5E7EB",
  codechef: "#B87945",
};

function formatRating(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedChange(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  const sign = value > 0 ? "+" : "";

  return `${sign}${formatRating(value)}`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/*
 * Normalize the history before plotting it.
 * Invalid dates and non-finite ratings are ignored, and contests are
 * always arranged chronologically.
 */
function normalizeHistory(history: RatingHistoryPoint[]): RatingHistoryPoint[] {
  return history
    .filter(
      (point) =>
        Number.isFinite(point.rating) &&
        !Number.isNaN(new Date(point.date).getTime()),
    )
    .slice()
    .sort(
      (first, second) =>
        new Date(first.date).getTime() - new Date(second.date).getTime(),
    );
}

function createRatingSeries(
  profiles: PlatformSnapshot[],
  selectedPlatform: RatingPlatformFilter,
): RatingSeries[] {
  return competitivePlatforms.flatMap((platform) => {
    if (selectedPlatform !== "all" && selectedPlatform !== platform.id) {
      return [];
    }

    const profile = profiles.find((item) => item.platform === platform.id);

    if (!profile || profile.status !== "available") {
      return [];
    }

    const points = normalizeHistory(profile.ratingHistory);

    if (points.length === 0) {
      return [];
    }

    return [
      {
        platform,
        profile,
        points,
        color: PLATFORM_COLORS[platform.id],
      },
    ];
  });
}

/*
 * Find the most recent contest across the currently visible platforms.
 * This becomes the initially selected point when the graph first appears
 * or when the platform selection changes.
 */
function getLatestContestSelection(
  series: RatingSeries[],
): ContestSelection | null {
  let latestSelection: ContestSelection | null = null;
  let latestTimestamp = Number.NEGATIVE_INFINITY;

  for (const item of series) {
    for (let pointIndex = 0; pointIndex < item.points.length; pointIndex += 1) {
      const timestamp = new Date(item.points[pointIndex].date).getTime();

      if (timestamp > latestTimestamp) {
        latestTimestamp = timestamp;

        latestSelection = {
          platformId: item.platform.id,
          pointIndex,
        };
      }
    }
  }

  return latestSelection;
}

function getNetChange(history: RatingHistoryPoint[]): number | null {
  if (history.length < 2) {
    return null;
  }

  return history[history.length - 1].rating - history[0].rating;
}

function RatingChart({
  series,
  selectedContest,
  onSelectPoint,
}: {
  series: RatingSeries[];
  selectedContest: ContestSelection | null;
  onSelectPoint: (selection: ContestSelection) => void;
}) {
  const allPoints = series.flatMap((item) => item.points);

  if (allPoints.length === 0) {
    return null;
  }

  const allRatings = allPoints.map((point) => point.rating);

  const minimumRating = Math.min(...allRatings);
  const maximumRating = Math.max(...allRatings);

  /*
   * All visible platforms share one vertical scale.
   * This keeps their actual rating values comparable on the chart.
   */
  const ratingPadding = Math.max((maximumRating - minimumRating) * 0.12, 25);

  const yMinimum = Math.max(
    0,
    Math.floor((minimumRating - ratingPadding) / 100) * 100,
  );

  const yMaximum = Math.max(
    yMinimum + 100,
    Math.ceil((maximumRating + ratingPadding) / 100) * 100,
  );

  const ratingRange = yMaximum - yMinimum;

  const timestamps = allPoints.map((point) => new Date(point.date).getTime());

  const firstTimestamp = Math.min(...timestamps);
  const lastTimestamp = Math.max(...timestamps);
  const timestampRange = lastTimestamp - firstTimestamp;

  function getX(timestamp: number): number {
    if (timestampRange === 0) {
      return (PLOT_LEFT + PLOT_RIGHT) / 2;
    }

    return (
      PLOT_LEFT +
      ((timestamp - firstTimestamp) / timestampRange) * (PLOT_RIGHT - PLOT_LEFT)
    );
  }

  function getY(rating: number): number {
    return (
      PLOT_BOTTOM -
      ((rating - yMinimum) / ratingRange) * (PLOT_BOTTOM - PLOT_TOP)
    );
  }

  const plottedSeries: ChartSeries[] = series.map((item) => {
    const peakIndex = item.points.reduce(
      (bestIndex, point, index, points) =>
        point.rating > points[bestIndex].rating ? index : bestIndex,
      0,
    );

    const points: ChartPoint[] = item.points.map((point, pointIndex) => ({
      source: point,
      platformId: item.platform.id,
      platformName: item.platform.name,
      color: item.color,
      pointIndex,
      x: getX(new Date(point.date).getTime()),
      y: getY(point.rating),
      isPeak: pointIndex === peakIndex,
    }));

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return {
      platformId: item.platform.id,
      platformName: item.platform.name,
      color: item.color,
      points,
      linePath,
    };
  });

  const selectedPoint =
    selectedContest === null
      ? null
      : (plottedSeries.find(
          (item) => item.platformId === selectedContest.platformId,
        )?.points[selectedContest.pointIndex] ?? null);

  const yTicks = Array.from(
    { length: 5 },
    (_, index) => yMinimum + (ratingRange / 4) * index,
  );

  const xTickTimestamps = [
    ...new Set([
      firstTimestamp,
      firstTimestamp + timestampRange / 2,
      lastTimestamp,
    ]),
  ];

  return (
    <svg
      className="cp-rating-chart"
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      role="group"
      aria-label="Combined contest rating progression. Focus or hover over a point to inspect a contest."
    >
      {/* Horizontal rating guides */}
      {yTicks.map((tick, index) => {
        const y = getY(tick);

        return (
          <g key={index}>
            <line
              x1={PLOT_LEFT}
              y1={y}
              x2={PLOT_RIGHT}
              y2={y}
              className="cp-rating-grid-line"
            />

            <text
              x={PLOT_LEFT - 12}
              y={y + 4}
              textAnchor="end"
              className="cp-rating-axis-label"
            >
              {Math.round(tick).toLocaleString("en-IN")}
            </text>
          </g>
        );
      })}

      {/* Draw each platform's rating progression independently. */}
      {plottedSeries.map((item, seriesIndex) => (
        <g key={item.platformId}>
          {item.points.length > 1 && (
            <path
              d={item.linePath}
              pathLength={1}
              className="cp-rating-line"
              style={{
                stroke: item.color,
                animationDelay: `${seriesIndex * 140}ms`,
              }}
            />
          )}
        </g>
      ))}

      {/* Guide for the currently selected contest */}
      {selectedPoint && (
        <line
          x1={selectedPoint.x}
          y1={PLOT_TOP}
          x2={selectedPoint.x}
          y2={PLOT_BOTTOM}
          className="cp-rating-selected-guide"
        />
      )}

      {/* Contest markers for every visible platform */}
      {plottedSeries.map((item, seriesIndex) =>
        item.points.map((point, pointIndex) => {
          const isSelected =
            selectedContest?.platformId === point.platformId &&
            selectedContest.pointIndex === point.pointIndex;

          const changeText =
            point.source.ratingChange === null
              ? "No previous rating"
              : `Rating change ${formatSignedChange(
                  point.source.ratingChange,
                )}`;

          /*
           * Stagger marker appearance, but cap the delay so profiles
           * with many contests do not take too long to finish animating.
           */
          const animationDelay = Math.min(
            seriesIndex * 140 + pointIndex * 18,
            750,
          );

          return (
            <circle
              key={`${point.platformId}-${point.source.date}-${pointIndex}`}
              cx={point.x}
              cy={point.y}
              r={isSelected ? 6 : point.isPeak ? 4.8 : 3.2}
              className={[
                "cp-rating-point",
                isSelected && "is-selected",
                point.isPeak && "is-peak",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                fill: point.color,
                animationDelay: `${animationDelay}ms`,
              }}
              tabIndex={0}
              role="button"
              aria-label={`${point.platformName}, ${
                point.source.contestName
              }, ${formatDate(point.source.date)}, rating ${formatRating(
                point.source.rating,
              )}, ${
                point.isPeak ? "highest recorded rating, " : ""
              }${changeText}`}
              onMouseEnter={() =>
                onSelectPoint({
                  platformId: point.platformId,
                  pointIndex: point.pointIndex,
                })
              }
              onFocus={() =>
                onSelectPoint({
                  platformId: point.platformId,
                  pointIndex: point.pointIndex,
                })
              }
              onClick={() =>
                onSelectPoint({
                  platformId: point.platformId,
                  pointIndex: point.pointIndex,
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();

                  onSelectPoint({
                    platformId: point.platformId,
                    pointIndex: point.pointIndex,
                  });
                }
              }}
            >
              <title>
                {point.platformName} — {point.source.contestName}:{" "}
                {formatRating(point.source.rating)}
                {point.isPeak ? " — Highest recorded rating" : ""}
              </title>
            </circle>
          );
        }),
      )}

      {/* Date labels based on the full history across visible platforms */}
      {xTickTimestamps.map((timestamp) => (
        <text
          key={timestamp}
          x={getX(timestamp)}
          y={PLOT_BOTTOM + 27}
          textAnchor={
            timestamp === firstTimestamp
              ? "start"
              : timestamp === lastTimestamp
                ? "end"
                : "middle"
          }
          className="cp-rating-axis-label"
        >
          {new Intl.DateTimeFormat("en-IN", {
            month: "short",
            year: "2-digit",
          }).format(new Date(timestamp))}
        </text>
      ))}
    </svg>
  );
}

export function RatingProgression({ profiles }: RatingProgressionProps) {
  // All platforms are visible when the chart is first rendered.
  const [selectedPlatform, setSelectedPlatform] =
    useState<RatingPlatformFilter>("all");

  const [selectedContest, setSelectedContest] =
    useState<ContestSelection | null>(null);

  const series = createRatingSeries(profiles, selectedPlatform);

  const selectedProfile =
    selectedPlatform === "all"
      ? null
      : (profiles.find((profile) => profile.platform === selectedPlatform) ??
        null);

  /*
   * If no point has been selected yet, use the latest available contest.
   * This also provides a useful initial contest detail below the graph.
   */
  const savedSelectionIsValid =
    selectedContest !== null &&
    series.some(
      (item) =>
        item.platform.id === selectedContest.platformId &&
        selectedContest.pointIndex >= 0 &&
        selectedContest.pointIndex < item.points.length,
    );

  const activeContest = savedSelectionIsValid
    ? selectedContest
    : getLatestContestSelection(series);

  const activeSeries =
    activeContest === null
      ? null
      : (series.find((item) => item.platform.id === activeContest.platformId) ??
        null);

  const activePoint =
    activeSeries && activeContest
      ? (activeSeries.points[activeContest.pointIndex] ?? null)
      : null;

  const singlePlatformHistory = series[0]?.points ?? [];

  const singlePlatformNetChange = getNetChange(singlePlatformHistory);

  const hasChartData = series.length > 0;

  return (
    <section className="cp-rating-section" aria-labelledby="cp-rating-title">
      <div className="cp-rating-heading">
        <div>
          <p className="cp-statistics-eyebrow">CONTEST PERFORMANCE</p>

          <h3 id="cp-rating-title">
            Rating <em>progression.</em>
          </h3>

          <p>
            Track how my contest ratings have changed over time across
            competitive programming platforms.
          </p>
        </div>
      </div>

      {/*
       * An individual platform can be unavailable without preventing
       * the combined chart from displaying the other available histories.
       */}
      {!hasChartData && (
        <div className="cp-rating-empty" role="status">
          {selectedPlatform !== "all" &&
          selectedProfile?.status === "unavailable"
            ? "Rating history is currently unavailable for this platform."
            : "No contest rating history is currently available."}
        </div>
      )}

      {hasChartData && (
        <>
          {/* Rating summary */}
          {selectedPlatform === "all" ? (
            <div className="cp-rating-summary cp-rating-summary--all">
              {competitivePlatforms.map((platform) => {
                const profile = profiles.find(
                  (item) => item.platform === platform.id,
                );

                if (!profile || profile.status !== "available") {
                  return null;
                }

                const platformSeries = series.find(
                  (item) => item.platform.id === platform.id,
                );

                return (
                  <div
                    key={platform.id}
                    className="cp-rating-summary-item cp-rating-summary-platform"
                  >
                    <span className="cp-rating-summary-platform-label">
                      <PlatformLogo platform={platform.id} size="small" />

                      {platform.id !== "atcoder" && (
                        <span>{platform.name}</span>
                      )}
                    </span>

                    <strong>
                      {formatRating(profile.metrics.currentRating)}
                    </strong>

                    <small>
                      Peak {formatRating(profile.metrics.peakRating)}
                      {" · "}
                      {formatInteger(platformSeries?.points.length ?? 0)}{" "}
                      contests
                    </small>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cp-rating-summary">
              <div className="cp-rating-summary-item cp-rating-summary-current">
                <span>Current rating</span>
                <strong>
                  {formatRating(selectedProfile?.metrics.currentRating ?? null)}
                </strong>
              </div>

              <div className="cp-rating-summary-item">
                <span>Peak rating (all time)</span>
                <strong>
                  {formatRating(selectedProfile?.metrics.peakRating ?? null)}
                </strong>
              </div>

              <div className="cp-rating-summary-item">
                <span>Recorded contests</span>
                <strong>{formatInteger(singlePlatformHistory.length)}</strong>
              </div>

              <div className="cp-rating-summary-item">
                <span>Net rating change</span>
                <strong
                  className={
                    singlePlatformNetChange === null
                      ? undefined
                      : singlePlatformNetChange > 0
                        ? "is-positive"
                        : singlePlatformNetChange < 0
                          ? "is-negative"
                          : undefined
                  }
                >
                  {formatSignedChange(singlePlatformNetChange)}
                </strong>
              </div>
            </div>
          )}

          {/* The platform selector replaces the former time-range selector. */}
          <div className="cp-rating-chart-toolbar">
            <span>RATING HISTORY</span>

            <div
              className="cp-rating-platform-selector"
              role="group"
              aria-label="Choose platforms to display"
            >
              <button
                type="button"
                className={selectedPlatform === "all" ? "is-active" : undefined}
                aria-pressed={selectedPlatform === "all"}
                onClick={() => {
                  setSelectedPlatform("all");
                  setSelectedContest(null);
                }}
              >
                All platforms
              </button>

              {competitivePlatforms.map((platform) => {
                const profile = profiles.find(
                  (item) => item.platform === platform.id,
                );

                const isAvailable = profile?.status === "available";
                const isSelected = selectedPlatform === platform.id;

                return (
                  <button
                    key={platform.id}
                    type="button"
                    className={isSelected ? "is-active" : undefined}
                    disabled={!isAvailable}
                    aria-pressed={isSelected}
                    aria-label={`Show ${platform.name} rating history`}
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setSelectedContest(null);
                    }}
                  >
                    <PlatformLogo platform={platform.id} size="small" />

                    {platform.id !== "atcoder" && <span>{platform.name}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating graph */}
          <div className="cp-rating-chart-wrapper">
            <RatingChart
              key={selectedPlatform}
              series={series}
              selectedContest={activeContest}
              onSelectPoint={setSelectedContest}
            />
          </div>

          {/* Color legend for the currently visible platform histories */}
          <div className="cp-rating-chart-legend" aria-label="Chart legend">
            {series.map((item) => (
              <span key={item.platform.id} className="cp-rating-legend-item">
                <span
                  className="cp-rating-legend-swatch"
                  style={{ backgroundColor: item.color }}
                />

                {item.platform.name}
              </span>
            ))}
          </div>

          {/* Details for the selected contest */}
          {activePoint && activeSeries && (
            <div className="cp-rating-contest-detail" aria-live="polite">
              <div>
                <span>PLATFORM</span>
                <strong>{activeSeries.platform.name}</strong>
              </div>

              <div>
                <span>SELECTED CONTEST</span>
                <strong>{activePoint.contestName}</strong>
                <small>{formatDate(activePoint.date)}</small>
              </div>

              <div>
                <span>RATING</span>
                <strong>{formatRating(activePoint.rating)}</strong>
              </div>

              <div>
                <span>CHANGE</span>
                <strong
                  className={
                    activePoint.ratingChange === null
                      ? undefined
                      : activePoint.ratingChange > 0
                        ? "is-positive"
                        : activePoint.ratingChange < 0
                          ? "is-negative"
                          : undefined
                  }
                >
                  {formatSignedChange(activePoint.ratingChange)}
                </strong>
              </div>

              <div>
                <span>CONTEST RANK</span>
                <strong>
                  {activePoint.rank === null
                    ? "—"
                    : formatInteger(activePoint.rank)}
                </strong>
              </div>
            </div>
          )}
        </>
      )}

      <p className="cp-rating-note">
        Each point represents a recorded rated contest. All visible platforms
        share the same rating axis, but rating systems are not directly
        equivalent. Gaps represent periods without recorded contests; no ratings
        are estimated or interpolated.
      </p>
    </section>
  );
}

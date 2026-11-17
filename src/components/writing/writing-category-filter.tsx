"use client";

import { useState } from "react";

import type { WritingArticle, WritingTopic } from "@/data/writing";
import { WritingCard } from "./writing-card";

interface WritingCategoryFilterProps {
  articles: WritingArticle[];
  topics: readonly WritingTopic[];
}

type ActiveTopic = WritingTopic | "all";

export function WritingCategoryFilter({
  articles,
  topics,
}: WritingCategoryFilterProps) {
  const [activeTopic, setActiveTopic] = useState<ActiveTopic>("all");

  // Display only categories that currently have published articles.
  const availableTopics = topics.filter((topic) =>
    articles.some((article) => article.category === topic),
  );

  const visibleArticles =
    activeTopic === "all"
      ? articles
      : articles.filter((article) => article.category === activeTopic);

  const resultAnnouncement = `${visibleArticles.length} ${
    visibleArticles.length === 1 ? "article" : "articles"
  } ${activeTopic === "all" ? "available" : `in ${activeTopic}`}.`;

  return (
    <>
      <div className="writing-topics writing-archive-filters">
        <span className="writing-topics-label">FILTER BY TOPIC</span>

        <div
          className="writing-topic-list"
          role="group"
          aria-label="Filter published articles by topic"
        >
          <button
            type="button"
            className={`writing-topic-filter ${
              activeTopic === "all" ? "is-active" : ""
            }`}
            aria-pressed={activeTopic === "all"}
            onClick={() => setActiveTopic("all")}
          >
            All articles
            <span className="writing-topic-count">{articles.length}</span>
          </button>

          {availableTopics.map((topic) => {
            const count = articles.filter(
              (article) => article.category === topic,
            ).length;

            const isActive = activeTopic === topic;

            return (
              <button
                key={topic}
                type="button"
                className={`writing-topic-filter ${
                  isActive ? "is-active" : ""
                }`}
                aria-pressed={isActive}
                onClick={() => setActiveTopic(topic)}
              >
                {topic}
                <span className="writing-topic-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Announce the result count instead of the entire article grid. */}
      <p className="writing-filter-status" role="status" aria-atomic="true">
        {resultAnnouncement}
      </p>

      {visibleArticles.length > 0 ? (
        <div className="writing-grid">
          {visibleArticles.map((article, index) => (
            <WritingCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      ) : (
        <div className="writing-empty-state">
          <span className="writing-empty-index">01 / THE BEGINNING</span>

          <h3>No articles published yet.</h3>

          <p>
            This space is ready for technical explanations, implementation
            breakdowns, engineering notes, and ideas worth sharing. Published
            articles will appear here.
          </p>
        </div>
      )}
    </>
  );
}

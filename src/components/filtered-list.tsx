/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState, useId } from "react";
import { ChangelogEntry } from "@/types/entry";
import { ChangelogDescription } from "./changelog-description";
import { GitHubUsername } from "./github-username";
import {
  RiCheckboxCircleFill,
  RiAddCircleFill,
  RiRocketFill,
  RiExternalLinkLine,
  RiArrowDownSFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}

const Select = ({ value, onChange, options, label }: SelectProps) => {
  const id = useId();

  return (
    <div className="relative inline-block w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full appearance-none rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      >
        <RiArrowDownSFill className="h-4 w-4" />
      </div>
    </div>
  );
};

const StatusIcon = ({ state, label }: { state: string; label: string }) => {
  const icons = {
    merged: RiCheckboxCircleFill,
    opened: RiAddCircleFill,
    released: RiRocketFill,
  };

  const Icon = icons[state as keyof typeof icons];
  const colors = {
    merged: "text-purple-500",
    opened: "text-green-500",
    released: "text-blue-500",
  };

  return Icon ? (
    <Icon
      className={`w-4 h-4 ${colors[state as keyof typeof colors]}`}
      aria-label={label}
    />
  ) : null;
};

export function FilteredList({ entries }: { entries: ChangelogEntry[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const itemsPerPage = 10;
  const repositories = Array.from(
    new Set<string>(entries.map((entry) => entry.metadata.sourceRepo)),
  );

  const stateOptions = [
    { value: "all", label: "All States" },
    { value: "opened", label: "Opened" },
    { value: "merged", label: "Merged" },
    { value: "released", label: "Released" },
  ];

  const repoOptions = [
    { value: "all", label: "All Repositories" },
    ...repositories.map((repo) => ({ value: repo, label: repo })),
  ];

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const stateMatch =
      stateFilter === "all" || entry.metadata.state === stateFilter;
    const sourceMatch =
      sourceFilter === "all" || entry.metadata.sourceRepo === sourceFilter;
    return stateMatch && sourceMatch;
  });

  // Paginate entries
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div>
      <div
        className="flex flex-wrap gap-4 mb-4"
        role="search"
        aria-label="Filter changelog entries"
      >
        <div className="min-w-[200px]">
          <Select
            value={stateFilter}
            onChange={setStateFilter}
            options={stateOptions}
            label="Filter by state"
          />
        </div>
        <div className="min-w-[250px]">
          <Select
            value={sourceFilter}
            onChange={setSourceFilter}
            options={repoOptions}
            label="Filter by repository"
          />
        </div>
      </div>

      <div role="feed" aria-label="Changelog entries" className="space-y-6">
        {paginatedEntries.map((entry) => (
          <article
            key={entry.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-100 dark:border-gray-700"
            aria-labelledby={`entry-${entry.id}-title`}
          >
            <h2
              id={`entry-${entry.id}-title`}
              className="text-lg font-medium leading-tight"
            >
              <a
                href={entry.metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={`${entry.title} (opens in new tab)`}
              >
                {entry.title}
              </a>
            </h2>

            <div className="mt-2">
              <ChangelogDescription
                description={entry.description}
                repoFullName={entry.metadata.sourceRepo}
              />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-3 items-center">
              <time dateTime={entry.date}>
                {new Date(entry.date).toLocaleDateString()}
              </time>

              <a
                href={`https://github.com/${entry.metadata.sourceRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={`${entry.metadata.sourceRepo} on GitHub (opens in new tab)`}
              >
                {entry.metadata.sourceRepo}
                <RiExternalLinkLine
                  className="w-4 h-4 ml-1"
                  aria-hidden="true"
                />
              </a>

              <span className="inline-flex items-center gap-1">
                <StatusIcon
                  state={entry.metadata.state}
                  label={`Status: ${entry.metadata.state}`}
                />
                <span className="capitalize">{entry.metadata.state}</span>
              </span>

              <span>
                By <GitHubUsername username={entry.metadata.author} />
              </span>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous page"
            >
              <RiArrowLeftSLine className="h-5 w-5 mr-1" aria-hidden="true" />
              Previous
            </button>

            <div
              className="px-4 py-2 text-sm text-black dark:text-white"
              aria-live="polite"
              aria-atomic="true"
            >
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next page"
            >
              Next
              <RiArrowRightSLine className="h-5 w-5 ml-1" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
